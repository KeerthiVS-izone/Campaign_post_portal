from pydantic import BaseModel
from datetime import datetime

class PostCreate(BaseModel):
    content: str

class PostResponse(BaseModel):
    id: int
    content: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class RetweetCreate(BaseModel):
    content: str

class RetweetResponse(BaseModel):
    id: int
    content: str
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class UploadedPostResponse(BaseModel):
    id: int
    content: str
    uploaded_by_admin: str
    created_at: datetime

    class Config:
        from_attributes = True
