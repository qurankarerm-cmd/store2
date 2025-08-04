#!/bin/bash

# Deployment script for Clay Store
# This script helps deploy the application to production

echo "🎯 Starting Clay Store Deployment..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install/Update dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual configuration!"
    echo "📝 Don't forget to update:"
    echo "   - SECRET_KEY: Generate a strong secret key"
    echo "   - WHATSAPP_NUMBER: Your actual WhatsApp number"
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p app/static/uploads

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 755 app/static/uploads

# Initialize database
echo "🗄️  Setting up database..."
python -c "
from app import create_app, db
from app.models import Admin
app = create_app()
with app.app_context():
    db.create_all()
    # Check if admin exists
    admin = Admin.query.filter_by(username='admin').first()
    if not admin:
        admin = Admin(username='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print('✅ Default admin created: admin/admin123')
    else:
        print('ℹ️  Admin user already exists')
"

# Run basic tests
echo "🧪 Running basic tests..."
python -c "
import sys
try:
    from app import create_app
    app = create_app()
    print('✅ Application imports successfully')
except Exception as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
"

echo "🎉 Deployment completed successfully!"
echo ""
echo "🚀 To start the application:"
echo "   Development: python run.py"
echo "   Production:  gunicorn --config gunicorn_config.py wsgi:app"
echo ""
echo "🌐 Default URLs:"
echo "   Website: http://localhost:5000"
echo "   Admin:   http://localhost:5000/admin/login"
echo ""
echo "🔑 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   ⚠️  CHANGE THESE IN PRODUCTION!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env file with your configuration"
echo "   2. Update WHATSAPP_NUMBER in .env"
echo "   3. Change default admin password"
echo "   4. Start adding your products!"