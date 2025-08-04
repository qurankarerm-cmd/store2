
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///db.sqlite3'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app', 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # WhatsApp number (without country code + sign)
    WHATSAPP_NUMBER = "201XXXXXXXXX"  # Replace with actual number
    
    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
