from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    has_details: bool

class UserDetailCreate(BaseModel):
    name: str
    phone_number: str
    district: str
    constituency: str
    responsibility: str

class UserDetailResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone_number: str
    district: str
    constituency: str
    responsibility: str
    created_at: datetime

    class Config:
        from_attributes = True
