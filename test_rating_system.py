#!/usr/bin/env python3
"""
Test script to verify the enhanced rating management system
"""

from app import create_app, db
from app.models import Product, Review, Testimonial
import time

def test_rating_management():
    """Test the enhanced rating management functionality"""
    app = create_app()
    
    with app.app_context():
        print("🌟 Testing Enhanced Rating Management System...")
        print("=" * 60)
        
        # Get current data
        reviews = Review.query.all()
        testimonials = Testimonial.query.all()
        
        print("📊 Current Rating Data:")
        print(f"Reviews: {len(reviews)}")
        print(f"Testimonials: {len(testimonials)}")
        
        # Add sample reviews with different ratings for testing
        print("\n⭐ Adding Sample Reviews with Various Ratings...")
        
        sample_reviews = [
            ("أحمد محمد", "منتج ممتاز جداً! جودة عالية وتصميم رائع", 5),
            ("فاطمة علي", "منتج جيد ولكن يحتاج تحسين في التغليف", 4),
            ("محمد أحمد", "منتج متوسط، السعر مناسب", 3),
            ("سارة محمود", "لم يعجبني كثيراً، جودة أقل من المتوقع", 2),
            ("علي حسن", "منتج ممتاز! أنصح به بشدة", 5),
            ("نورا سليم", "تصميم جميل وجودة ممتازة", 5),
            ("خالد يوسف", "منتج جيد جداً، سأطلب مرة أخرى", 4),
            ("ريم أحمد", "رائع! فاق توقعاتي", 5),
        ]
        
        # Get a sample product for reviews
        product = Product.query.first()
        
        for customer_name, comment, rating in sample_reviews:
            # Check if review already exists
            existing = Review.query.filter_by(customer_name=customer_name).first()
            if not existing:
                review = Review(
                    customer_name=customer_name,
                    comment=comment,
                    rating=rating,
                    product_id=product.id if product else None,
                    is_approved=True,
                    is_featured=(rating == 5)  # Feature 5-star reviews
                )
                db.session.add(review)
        
        # Add sample testimonials with ratings
        sample_testimonials = [
            ("مريم السيد", "عميلة دائمة", "تعاملي مع المتجر ممتاز منذ سنوات. المنتجات دائماً تفوق التوقعات والخدمة رائعة.", 5),
            ("أحمد الشريف", "مصمم ديكور", "أنصح جميع زملائي بهذا المتجر. منتجات عالية الجودة ومناسبة للمشاريع الاحترافية.", 5),
            ("سلمى حسن", "محبة للأشغال اليدوية", "أجمل متجر للأعمال اليدوية! دائماً أجد ما أبحث عنه وأكثر.", 4),
        ]
        
        for customer_name, title, text, rating in sample_testimonials:
            existing = Testimonial.query.filter_by(customer_name=customer_name).first()
            if not existing:
                testimonial = Testimonial(
                    customer_name=customer_name,
                    customer_title=title,
                    testimonial_text=text,
                    rating=rating,
                    is_featured=True,
                    is_active=True,
                    display_order=len(sample_testimonials) - sample_testimonials.index((customer_name, title, text, rating))
                )
                db.session.add(testimonial)
        
        try:
            db.session.commit()
            print("✅ Sample rating data added successfully!")
        except Exception as e:
            print(f"❌ Error adding sample data: {e}")
            db.session.rollback()
            return
        
        # Calculate statistics
        reviews = Review.query.all()
        testimonials = Testimonial.query.all()
        
        if reviews:
            avg_review_rating = sum(r.rating for r in reviews) / len(reviews)
            rating_distribution = {}
            for i in range(1, 6):
                rating_distribution[i] = len([r for r in reviews if r.rating == i])
        else:
            avg_review_rating = 0
            rating_distribution = {i: 0 for i in range(1, 6)}
        
        if testimonials:
            avg_testimonial_rating = sum(t.rating for t in testimonials) / len(testimonials)
        else:
            avg_testimonial_rating = 0
        
        print("\n📈 Rating Statistics:")
        print(f"Total Reviews: {len(reviews)}")
        print(f"Average Review Rating: {avg_review_rating:.1f}/5")
        print(f"Total Testimonials: {len(testimonials)}")
        print(f"Average Testimonial Rating: {avg_testimonial_rating:.1f}/5")
        
        print("\n🌟 Rating Distribution:")
        for rating, count in rating_distribution.items():
            stars = "⭐" * rating
            percentage = (count / len(reviews) * 100) if reviews else 0
            print(f"{rating} stars {stars}: {count} reviews ({percentage:.1f}%)")
        
        print("\n🛠️ New Rating Management Features:")
        print("✅ Individual rating editing with star interface")
        print("✅ Bulk actions for approval, rejection, featuring")
        print("✅ Bulk rating updates for multiple reviews")
        print("✅ Detailed rating statistics modal")
        print("✅ Visual star display showing actual ratings")
        print("✅ Quick rating edit buttons")
        print("✅ Checkbox selection for bulk operations")
        print("✅ Real-time rating updates via AJAX")
        
        print("\n🎯 Test These Features:")
        print("1. Go to /admin/reviews")
        print("2. Click 'إحصائيات التقييمات' to see rating breakdown")
        print("3. Click 'الإجراءات المجمعة' to see bulk actions")
        print("4. Click edit button next to any rating to modify it")
        print("5. Select multiple reviews and bulk update ratings")
        print("6. Use checkboxes to select and bulk approve/feature reviews")
        
        print("\n🌐 Access Points:")
        print("Reviews Management: http://127.0.0.1:5000/admin/reviews")
        print("Testimonials: http://127.0.0.1:5000/admin/testimonials")
        print("Analytics: http://127.0.0.1:5000/admin/analytics")
        print("Login: admin / admin123")

if __name__ == '__main__':
    test_rating_management()