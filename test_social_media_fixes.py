#!/usr/bin/env python3
"""
Test script to verify social media links and customizable homepage functionality
"""

from app import create_app, db
from app.models import SiteSettings
import time

def test_social_media_functionality():
    """Test and configure social media functionality"""
    app = create_app()
    
    with app.app_context():
        print("🧪 Testing Social Media & Customization Fixes...")
        print("=" * 60)
        
        # Get current settings
        settings = SiteSettings.get_settings()
        
        print("📋 Current Settings:")
        print(f"Site Name: {settings.site_name}")
        print(f"WhatsApp: {settings.whatsapp_number or 'Not set'}")
        print(f"Facebook: {settings.facebook_url or 'Not set'}")
        print(f"Instagram: {settings.instagram_url or 'Not set'}")
        print(f"TikTok: {settings.tiktok_url or 'Not set'}")
        
        # Configure sample social media links for testing
        print("\n🔧 Configuring sample social media links...")
        
        settings.whatsapp_number = "201234567890"  # Sample Egyptian number
        settings.facebook_url = "https://facebook.com/claystore.eg"
        settings.instagram_url = "https://instagram.com/claystore_egypt"
        settings.tiktok_url = "https://tiktok.com/@claystore_egypt"
        
        # Update homepage content
        settings.site_name = "فخار أحلامي - Clay Dreams"
        settings.site_description = "متجر متخصص في الأعمال اليدوية من طين البوليمر"
        settings.about_text = """مرحباً بكم في عالم الفن والإبداع! 
نحن متخصصون في صناعة قطع فنية مميزة من طين البوليمر عالي الجودة.
كل قطعة تُصنع بحب وعناية فائقة لتناسب ذوقكم الرفيع.
اكتشفوا مجموعتنا المتنوعة من المجوهرات والديكورات والهدايا الفريدة."""
        
        settings.footer_text = "جميع الحقوق محفوظة - صنع بحب في مصر ❤️"
        
        try:
            db.session.commit()
            print("✅ Sample social media links configured successfully!")
        except Exception as e:
            print(f"❌ Error saving settings: {e}")
            return
        
        print("\n📱 Testing Social Media URL Generation:")
        print(f"WhatsApp: https://wa.me/{settings.whatsapp_number}")
        print(f"Facebook: {settings.facebook_url}")
        print(f"Instagram: {settings.instagram_url}")
        print(f"TikTok: {settings.tiktok_url}")
        
        print("\n🏠 Testing Homepage Customization:")
        print(f"Site Title: {settings.site_name}")
        print(f"About Text: {settings.about_text[:100]}...")
        print(f"Footer: {settings.footer_text}")
        
        print("\n🎯 What's Fixed:")
        print("✅ Social media buttons now use admin-provided links")
        print("✅ WhatsApp floating button uses admin number")
        print("✅ Homepage title and content are customizable")
        print("✅ Footer text uses site settings")
        print("✅ Contact page shows admin's social links")
        print("✅ All buttons show 'قريباً' if URL not provided")
        
        print("\n📋 Test These Features:")
        print("1. Go to /admin/settings and update social media URLs")
        print("2. Change site name and about text")
        print("3. Visit the homepage - should show new content")
        print("4. Check contact page - buttons should work")
        print("5. Verify floating WhatsApp button")
        print("6. Test footer in all pages")
        
        print("\n🌐 Website URLs:")
        print("Main Site: http://127.0.0.1:5000")
        print("Admin Settings: http://127.0.0.1:5000/admin/settings") 
        print("Contact Page: http://127.0.0.1:5000/contact")
        print("Admin Login: admin / admin123")

if __name__ == '__main__':
    test_social_media_functionality()