"""Run this script to create the first admin user."""
import sys
sys.path.insert(0, ".")

from database.db import SessionLocal, Base, engine
from models.user import User
from core.security import get_password_hash
import models.user_detail
import models.post

Base.metadata.create_all(bind=engine)

db = SessionLocal()
username = input("Admin username: ")
password = input("Admin password: ")

existing = db.query(User).filter(User.username == username).first()
if existing:
    print("User already exists!")
else:
    admin = User(username=username, password_hash=get_password_hash(password), role="admin")
    db.add(admin)
    db.commit()
    print(f"Admin '{username}' created successfully!")
db.close()
