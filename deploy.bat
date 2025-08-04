@echo off
REM Deployment script for Clay Store on Windows
REM This script helps deploy the application to production

echo 🎯 Starting Clay Store Deployment...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/Update dependencies
echo 📚 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo ⚙️  Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your actual configuration!
    echo 📝 Don't forget to update:
    echo    - SECRET_KEY: Generate a strong secret key
    echo    - WHATSAPP_NUMBER: Your actual WhatsApp number
)

REM Create uploads directory if it doesn't exist
echo 📁 Creating uploads directory...
if not exist "app\static\uploads" mkdir app\static\uploads

REM Initialize database
echo 🗄️  Setting up database...
python -c "from app import create_app, db; from app.models import Admin; app = create_app(); app.app_context().push(); db.create_all(); admin = Admin.query.filter_by(username='admin').first(); print('Admin already exists' if admin else 'Creating admin...'); admin = admin or Admin(username='admin'); admin.set_password('admin123') if not Admin.query.filter_by(username='admin').first() else None; db.session.add(admin) if not Admin.query.filter_by(username='admin').first() else None; db.session.commit(); print('✅ Database setup complete')"

REM Run basic tests
echo 🧪 Running basic tests...
python -c "try: from app import create_app; app = create_app(); print('✅ Application imports successfully'); except Exception as e: print(f'❌ Import error: {e}'); exit(1)"

echo 🎉 Deployment completed successfully!
echo.
echo 🚀 To start the application:
echo    Development: python run.py
echo    Production:  gunicorn --config gunicorn_config.py wsgi:app
echo.
echo 🌐 Default URLs:
echo    Website: http://localhost:5000
echo    Admin:   http://localhost:5000/admin/login
echo.
echo 🔑 Default admin credentials:
echo    Username: admin
echo    Password: admin123
echo    ⚠️  CHANGE THESE IN PRODUCTION!
echo.
echo 📋 Next steps:
echo    1. Edit .env file with your configuration
echo    2. Update WHATSAPP_NUMBER in .env
echo    3. Change default admin password
echo    4. Start adding your products!

pause