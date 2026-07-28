import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sse_starlette.sse import EventSourceResponse

from core.database import get_db
from models.database import PipelineRun, Project
from models.schemas import PipelineRunCreate, PipelineRunResponse
from services.genblaze_service import genblaze_service

router = APIRouter(prefix="/pipelines", tags=["pipelines"])

@router.post("/run", response_model=PipelineRunResponse)
def create_pipeline_run(run_in: PipelineRunCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == run_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    db_run = PipelineRun(
        project_id=run_in.project_id,
        prompt=run_in.prompt,
        config=run_in.config.model_dump()
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)
    return db_run

@router.get("", response_model=List[PipelineRunResponse])
def get_pipeline_runs(db: Session = Depends(get_db)):
    return db.query(PipelineRun).order_by(PipelineRun.created_at.desc()).all()

@router.get("/{run_id}", response_model=PipelineRunResponse)
def get_pipeline_run(run_id: str, db: Session = Depends(get_db)):
    run = db.query(PipelineRun).filter(PipelineRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.get("/{run_id}/stream")
async def stream_pipeline_progress(run_id: str, db: Session = Depends(get_db)):
    run = db.query(PipelineRun).filter(PipelineRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
        
    if run.status in ["COMPLETED", "FAILED"]:
        return EventSourceResponse(iter([f"data: {{\"event\": \"run_{run.status.lower()}\", \"manifest_url\": \"{run.manifest_url}\"}}\n\n"]))

    async def sse_generator():
        try:
            config_list = run.config.get("steps", [])
            async for genblaze_event in genblaze_service.execute_pipeline(run.id, run.prompt, config_list):
                event_name = getattr(genblaze_event, "type", getattr(genblaze_event, "__class__", type(genblaze_event)).__name__)
                if hasattr(genblaze_event, "model_dump_json"):
                    data = genblaze_event.model_dump_json()
                elif hasattr(genblaze_event, "json"):
                    data = genblaze_event.json()
                else:
                    try:
                        data = json.dumps(genblaze_event.__dict__, default=str)
                    except:
                        data = json.dumps(str(genblaze_event))
                
                yield dict(event=event_name, data=data)

            # Mark COMPLETED in DB upon successful stream end
            run.status = "COMPLETED"
            db.commit()
            yield dict(event="pipeline.completed", data=json.dumps({"status": "COMPLETED", "run_id": run.id}))
        except Exception as e:
            run.status = "FAILED"
            db.commit()
            yield dict(event="error", data=json.dumps({"detail": str(e)}))

    return EventSourceResponse(sse_generator())
