import pandas as pd
from sqlalchemy.orm import Session
from models import CampaignPost
from typing import List
import io


def process_excel_file(file_content: bytes, db: Session) -> dict:
    """
    Process uploaded Excel file and insert posts into database.
    Returns dict with count of inserted posts.
    """
    try:
        df = pd.read_excel(io.BytesIO(file_content))
    except Exception as e:
        raise ValueError(f"Failed to read Excel file: {str(e)}")

    if 'content' not in df.columns:
        raise ValueError("Excel file must have a column named 'content'")

    df = df.dropna(subset=['content'])
    posts_data = df['content'].tolist()

    if not posts_data:
        raise ValueError("No valid posts found in the Excel file")

    inserted = 0
    for content in posts_data:
        content_str = str(content).strip()
        if content_str:
            post = CampaignPost(content=content_str)
            db.add(post)
            inserted += 1

    db.commit()
    return {"inserted": inserted, "total_rows": len(df)}


def get_sample_excel() -> bytes:
    """Generate a sample Excel file for reference."""
    sample_data = {
        'content': [
            'புதுமைப் பெண் திட்டம் மூலம் மாணவிகளுக்கு கல்வி தொடர ஊக்கம் வழங்கப்படுகிறது. #StalinWave2026',
            'பெண்களுக்கு இலவச பேருந்து பயணம் சமூக முன்னேற்றத்திற்கு பெரிய உதவியாக உள்ளது. #StalinWave2026',
            'தமிழ்நாட்டில் அரசு பள்ளி மாணவர்களுக்கு இலவச காலை உணவு திட்டம் செயல்படுகிறது. #StalinWave2026',
        ]
    }
    df = pd.DataFrame(sample_data)
    output = io.BytesIO()
    df.to_excel(output, index=False)
    return output.getvalue()
