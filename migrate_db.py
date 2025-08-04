#!/usr/bin/env python3
"""
Database Migration Script for Clay Store
This script will update the database schema to include all new columns and tables.
"""

import os
import sqlite3
import sys
from app import create_app, db
from app.models import Product, Review, Admin, SiteSettings, Testimonial

def backup_database():
    """Create a backup of the existing database"""
    if os.path.exists('db.sqlite3'):
        backup_name = 'db_backup.sqlite3'
        os.rename('db.sqlite3', backup_name)
        print(f"✅ Database backed up as {backup_name}")
        return True
    return False

def check_and_add_columns():
    """Check for missing columns and add them"""
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    
    try:
        # Check if Product table needs updates
        cursor.execute("PRAGMA table_info(product)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'featured' not in columns:
            print("Adding 'featured' column to Product table...")
            cursor.execute("ALTER TABLE product ADD COLUMN featured BOOLEAN DEFAULT 0")
        
        # Check if Review table needs updates
        cursor.execute("PRAGMA table_info(review)")
        columns = [row[1] for row in cursor.fetchall()]
        
        if 'rating' not in columns:
            print("Adding 'rating' column to Review table...")
            cursor.execute("ALTER TABLE review ADD COLUMN rating INTEGER DEFAULT 5")
            
        if 'product_id' not in columns:
            print("Adding 'product_id' column to Review table...")
            cursor.execute("ALTER TABLE review ADD COLUMN product_id INTEGER")
            
        if 'is_featured' not in columns:
            print("Adding 'is_featured' column to Review table...")
            cursor.execute("ALTER TABLE review ADD COLUMN is_featured BOOLEAN DEFAULT 0")
        
        # Check if SiteSettings table exists
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='site_settings'
        """)
        
        if not cursor.fetchone():
            print("Creating SiteSettings table...")
            cursor.execute("""
                CREATE TABLE site_settings (
                    id INTEGER PRIMARY KEY,
                    site_name VARCHAR(100) DEFAULT 'أعمالي بالطين',
                    site_description TEXT DEFAULT 'متجر متخصص في صناعة منتجات طين البوليمر اليدوية الفريدة',
                    logo_filename VARCHAR(200),
                    hero_image_filename VARCHAR(200),
                    background_color VARCHAR(7) DEFAULT '#6366f1',
                    secondary_color VARCHAR(7) DEFAULT '#8b5cf6',
                    accent_color VARCHAR(7) DEFAULT '#10b981',
                    theme_style VARCHAR(20) DEFAULT 'modern',
                    contact_phone VARCHAR(20),
                    contact_email VARCHAR(100),
                    whatsapp_number VARCHAR(20),
                    facebook_url VARCHAR(200),
                    instagram_url VARCHAR(200),
                    tiktok_url VARCHAR(200),
                    about_text TEXT,
                    footer_text TEXT DEFAULT 'جميع الحقوق محفوظة',
                    show_reviews BOOLEAN DEFAULT 1,
                    show_custom_orders BOOLEAN DEFAULT 1,
                    maintenance_mode BOOLEAN DEFAULT 0,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Insert default settings
            cursor.execute("""
                INSERT INTO site_settings (site_name) VALUES ('أعمالي بالطين')
            """)
        
        # Check if Testimonial table exists
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='testimonial'
        """)
        
        if not cursor.fetchone():
            print("Creating Testimonial table...")
            cursor.execute("""
                CREATE TABLE testimonial (
                    id INTEGER PRIMARY KEY,
                    customer_name VARCHAR(100) NOT NULL,
                    customer_title VARCHAR(100),
                    testimonial_text TEXT NOT NULL,
                    rating INTEGER DEFAULT 5,
                    image_filename VARCHAR(200),
                    is_featured BOOLEAN DEFAULT 0,
                    display_order INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1
                )
            """)
        
        conn.commit()
        print("✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()
    
    return True

def create_fresh_database():
    """Create a completely fresh database with all tables"""
    print("Creating fresh database with all tables...")
    
    app = create_app()
    with app.app_context():
        # Drop all tables and recreate
        db.drop_all()
        db.create_all()
        
        # Create default admin
        admin = Admin.query.filter_by(username='admin').first()
        if not admin:
            admin = Admin(username='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            
        # Create default site settings
        settings = SiteSettings.query.first()
        if not settings:
            settings = SiteSettings()
            db.session.add(settings)
        
        db.session.commit()
        print("✅ Fresh database created successfully!")
        print("🔑 Default admin: admin / admin123")

def main():
    print("🗄️  Clay Store Database Migration Tool")
    print("=" * 50)
    
    # Check if database exists
    if os.path.exists('db.sqlite3'):
        print("📋 Existing database found.")
        choice = input("Choose migration method:\n1. Try to migrate existing database (recommended)\n2. Create fresh database (will lose data)\nEnter choice (1 or 2): ")
        
        if choice == '1':
            print("\n🔄 Attempting to migrate existing database...")
            backup_database()
            success = check_and_add_columns()
            
            if not success:
                print("\n❌ Migration failed. Creating fresh database...")
                if os.path.exists('db_backup.sqlite3'):
                    os.remove('db.sqlite3')
                    os.rename('db_backup.sqlite3', 'db.sqlite3')
                create_fresh_database()
            else:
                print("\n✅ Migration completed! Your data has been preserved.")
                
        elif choice == '2':
            print("\n🆕 Creating fresh database...")
            backup_database()
            os.remove('db.sqlite3') if os.path.exists('db.sqlite3') else None
            create_fresh_database()
        else:
            print("❌ Invalid choice. Exiting.")
            return
    else:
        print("📋 No existing database found. Creating fresh database...")
        create_fresh_database()
    
    print("\n🎉 Database is ready!")
    print("🌐 You can now run: python run.py")
    print("🔑 Admin login: http://localhost:5000/admin/login")
    print("👤 Username: admin | Password: admin123")

if __name__ == '__main__':
    main()