from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

class CampaignDataCreate(BaseModel):
    name: str
    phone_number: str
    kalaga_maavatam: str
    thogudhi: str
    porupu: str

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('phone_number')
    def phone_must_be_valid(cls, v):
        digits = ''.join(filter(str.isdigit, v))
        if len(digits) < 10:
            raise ValueError('Phone number must have at least 10 digits')
        return v.strip()

class CampaignDataResponse(BaseModel):
    id: int
    name: str
    phone_number: str
    kalaga_maavatam: str
    thogudhi: str
    porupu: str
    created_at: datetime

    class Config:
        from_attributes = True

class CampaignPostResponse(BaseModel):
    id: int
    content: str
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class SuccessResponse(BaseModel):
    message: str
    id: Optional[int] = None
