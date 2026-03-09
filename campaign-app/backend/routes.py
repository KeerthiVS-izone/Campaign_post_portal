from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session
from database import get_db
from models import CampaignData, CampaignPost
from schemas import CampaignDataCreate, CampaignDataResponse, CampaignPostResponse, SuccessResponse
from excel_service import process_excel_file, get_sample_excel
from typing import List

router = APIRouter()


@router.post("/submit", response_model=SuccessResponse)
def submit_campaign_data(data: CampaignDataCreate, db: Session = Depends(get_db)):
    """Submit volunteer campaign data."""
    db_record = CampaignData(
        name=data.name,
        phone_number=data.phone_number,
        kalaga_maavatam=data.kalaga_maavatam,
        thogudhi=data.thogudhi,
        porupu=data.porupu,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return SuccessResponse(message="Data submitted successfully!", id=db_record.id)


@router.get("/posts", response_model=List[CampaignPostResponse])
def get_campaign_posts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all campaign posts."""
    posts = db.query(CampaignPost).order_by(CampaignPost.id.desc()).offset(skip).limit(limit).all()
    return posts


@router.post("/upload-posts", response_model=SuccessResponse)
async def upload_posts(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload campaign posts from Excel file."""
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Only Excel files (.xlsx, .xls) are accepted")

    content = await file.read()

    try:
        result = process_excel_file(content, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return SuccessResponse(
        message=f"Successfully uploaded {result['inserted']} posts from {result['total_rows']} rows"
    )


@router.get("/sample-excel")
def download_sample_excel():
    """Download a sample Excel file."""
    excel_bytes = get_sample_excel()
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=sample_posts.xlsx"}
    )


@router.get("/volunteers", response_model=List[CampaignDataResponse])
def get_volunteers(db: Session = Depends(get_db)):
    """Get all volunteer submissions."""
    return db.query(CampaignData).order_by(CampaignData.created_at.desc()).all()
