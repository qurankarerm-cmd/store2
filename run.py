from app import create_app, db
from app.models import Product, Review, Admin

app = create_app()

with app.app_context():
    db.create_all()
    
    # Create default admin if doesn't exist
    admin = Admin.query.filter_by(username='admin').first()
    if not admin:
        admin = Admin(username='admin')
        admin.set_password('admin123')  # Change this password!
        db.session.add(admin)
        db.session.commit()
        print("Default admin created: username=admin, password=admin123")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)