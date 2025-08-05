from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    image_filename = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    featured = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Product {self.name}>'

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)  # 1-5 stars
    image_filename = db.Column(db.String(200))
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_approved = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    
    product = db.relationship('Product', backref=db.backref('reviews', lazy=True))
    
    def __repr__(self):
        return f'<Review by {self.customer_name}>'

class Admin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<Admin {self.username}>'

class SiteSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(100), default='أعمالي بالطين')
    site_description = db.Column(db.Text, default='متجر متخصص في صناعة منتجات طين البوليمر اليدوية الفريدة')
    logo_filename = db.Column(db.String(200))
    hero_image_filename = db.Column(db.String(200))
    background_color = db.Column(db.String(7), default='#6366f1')  # Primary color
    secondary_color = db.Column(db.String(7), default='#8b5cf6')   # Secondary color
    accent_color = db.Column(db.String(7), default='#10b981')      # Success/accent color
    theme_style = db.Column(db.String(20), default='modern')       # modern, classic, minimal
    contact_phone = db.Column(db.String(20))
    contact_email = db.Column(db.String(100))
    whatsapp_number = db.Column(db.String(20))
    facebook_url = db.Column(db.String(200))
    instagram_url = db.Column(db.String(200))
    tiktok_url = db.Column(db.String(200))
    about_text = db.Column(db.Text, default='مرحباً بكم في عالم الإبداع والفن اليدوي! نحن متخصصون في صناعة منتجات فريدة من طين البوليمر بأعلى معايير الجودة والإتقان. كل قطعة تُصنع بحب وعناية خاصة لتناسب ذوقكم المميز.')
    footer_text = db.Column(db.Text, default='جميع الحقوق محفوظة')
    
    # Homepage customization
    hero_title = db.Column(db.String(200))
    hero_subtitle = db.Column(db.Text)
    show_reviews = db.Column(db.Boolean, default=True)
    show_custom_orders = db.Column(db.Boolean, default=True)
    maintenance_mode = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @staticmethod
    def get_settings():
        settings = SiteSettings.query.first()
        if not settings:
            settings = SiteSettings()
            db.session.add(settings)
            db.session.commit()
        return settings
    
    def __repr__(self):
        return f'<SiteSettings {self.site_name}>'

class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_title = db.Column(db.String(100))  # e.g., "عميلة مميزة"
    testimonial_text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, default=5)  # 1-5 stars
    image_filename = db.Column(db.String(200))
    is_featured = db.Column(db.Boolean, default=False)
    display_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<Testimonial by {self.customer_name}>'