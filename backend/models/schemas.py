from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PipelineStepConfig(BaseModel):
    type: str  # 'image', 'video', 'audio'
    enabled: bool = True
    provider: str = "google"
    model: str

class PipelineConfig(BaseModel):
    steps: List[PipelineStepConfig]

class PipelineRunCreate(BaseModel):
    project_id: str
    prompt: str
    config: PipelineConfig

class PipelineRunResponse(BaseModel):
    id: str
    project_id: str
    run_id: Optional[str]
    prompt: str
    status: str
    manifest_url: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    user_id: Optional[str]
    name: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
