#!/usr/bin/env python3
"""
Test script to verify admin functionality and fix issues
"""

import os
from app import create_app, db
from app.models import Product, Review, Admin, SiteSettings, Testimonial

def test_admin_functionality():
    """Test all admin functionality"""
    app = create_app()
    
    with app.app_context():
        print("🧪 Testing Admin Functionality...")
        print("=" * 50)
        
        # Test 1: Database connectivity
        try:
            products_count = Product.query.count()
            print(f"✅ Database connection: {products_count} products")
        except Exception as e:
            print(f"❌ Database error: {e}")
            return
        
        # Test 2: Admin user exists
        try:
            admin = Admin.query.filter_by(username='admin').first()
            if admin:
                print(f"✅ Admin user exists: {admin.username}")
            else:
                print("❌ No admin user found")
                return
        except Exception as e:
            print(f"❌ Admin query error: {e}")
            return
        
        # Test 3: Site settings
        try:
            settings = SiteSettings.get_settings()
            print(f"✅ Site settings: {settings.site_name}")
        except Exception as e:
            print(f"❌ Site settings error: {e}")
        
        # Test 4: Upload directory
        upload_dir = app.config.get('UPLOAD_FOLDER', 'app/static/uploads')
        if os.path.exists(upload_dir):
            print(f"✅ Upload directory exists: {upload_dir}")
        else:
            os.makedirs(upload_dir, exist_ok=True)
            print(f"✅ Created upload directory: {upload_dir}")
        
        # Test 5: WhatsApp configuration
        whatsapp_number = app.config.get('WHATSAPP_NUMBER')
        if whatsapp_number:
            print(f"✅ WhatsApp number configured: {whatsapp_number}")
        else:
            print("⚠️  WhatsApp number not configured")
        
        # Test 6: Add sample data
        print("\n📊 Adding sample data...")
        
        # Add a sample product
        if Product.query.count() == 0:
            sample_product = Product(
                name="منتج تجريبي - أقراط زهور",
                description="أقراط جميلة مصنوعة من طين البوليمر بألوان زاهية",
                price=150.00,
                category="مجوهرات",
                is_active=True,
                featured=True
            )
            db.session.add(sample_product)
            print("✅ Added sample product")
        
        # Add a sample review
        if Review.query.count() == 0:
            sample_review = Review(
                customer_name="فاطمة أحمد",
                comment="منتجات رائعة وجودة عالية! أنصح بالشراء",
                rating=5,
                is_approved=True,
                is_featured=True
            )
            db.session.add(sample_review)
            print("✅ Added sample review")
        
        # Add a sample testimonial
        if Testimonial.query.count() == 0:
            sample_testimonial = Testimonial(
                customer_name="مريم محمود",
                customer_title="عميلة مميزة",
                testimonial_text="تعاملت مع المتجر عدة مرات والمنتجات دائماً تفوق التوقعات. الجودة ممتازة والأسعار مناسبة.",
                rating=5,
                is_featured=True,
                display_order=1,
                is_active=True
            )
            db.session.add(sample_testimonial)
            print("✅ Added sample testimonial")
        
        try:
            db.session.commit()
            print("✅ Sample data saved successfully")
        except Exception as e:
            print(f"❌ Error saving sample data: {e}")
            db.session.rollback()
        
        print("\n🎉 Admin functionality test completed!")
        print("\n📋 Summary:")
        print(f"Products: {Product.query.count()}")
        print(f"Reviews: {Review.query.count()}")
        print(f"Testimonials: {Testimonial.query.count()}")
        print(f"Admins: {Admin.query.count()}")

if __name__ == '__main__':
    test_admin_functionality()