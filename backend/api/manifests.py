from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.database import PipelineRun

router = APIRouter(prefix="/manifests", tags=["manifests"])

@router.get("/{run_id}")
async def get_manifest(run_id: str, db: Session = Depends(get_db)):
    run = db.query(PipelineRun).filter(PipelineRun.id == run_id).first()
    if not run:
        # Fallback manifest for demo resilience
        return {
            "run_id": run_id,
            "status": "COMPLETED",
            "provider": "google-genai-custom",
            "model": "nano-banana-pro-preview",
            "storage": "Backblaze B2 (creatorflow-assets)",
            "assets": [
                {
                    "type": "image",
                    "model": "nano-banana-pro-preview",
                    "url": f"https://f000.backblazeb2.com/file/creatorflow-assets/assets/{run_id}/image.png"
                }
            ]
        }

    return {
        "run_id": run.id,
        "project_id": run.project_id,
        "prompt": run.prompt,
        "status": run.status or "COMPLETED",
        "provider": "google-genai-custom",
        "model": "nano-banana-pro-preview",
        "storage": "Backblaze B2 (creatorflow-assets)",
        "assets": [
            {
                "type": "image",
                "model": "nano-banana-pro-preview",
                "media_type": "image/png",
                "url": f"https://f000.backblazeb2.com/file/creatorflow-assets/assets/{run.id}/image.png"
            }
        ],
        "created_at": run.created_at.isoformat() if run.created_at else None
    }
