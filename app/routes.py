import os
from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from app import db, login_manager
from app.models import Product, Review, Admin, SiteSettings, Testimonial
import urllib.parse

bp = Blueprint('main', __name__)

# Make site settings available to all templates
@bp.context_processor
def inject_site_settings():
    return dict(site_settings=SiteSettings.get_settings())

@login_manager.user_loader
def load_user(user_id):
    return Admin.query.get(int(user_id))

# Helper function for WhatsApp URL
def create_whatsapp_url(product_name=None, custom_message=None):
    whatsapp_number = current_app.config['WHATSAPP_NUMBER']
    
    if custom_message:
        message = custom_message
    elif product_name:
        message = f"مرحباً، أرغب في طلب منتج {product_name}"
    else:
        message = "مرحباً! أود الاستفسار عن منتجاتكم"
    
    encoded_message = urllib.parse.quote(message)
    return f"https://wa.me/{whatsapp_number}?text={encoded_message}"

# Public Routes
@bp.route('/')
def index():
    featured_products = Product.query.filter_by(is_active=True).limit(6).all()
    return render_template('index.html', products=featured_products)

@bp.route('/products')
def products():
    category = request.args.get('category')
    if category:
        products = Product.query.filter_by(category=category, is_active=True).all()
    else:
        products = Product.query.filter_by(is_active=True).all()
    
    categories = db.session.query(Product.category).filter_by(is_active=True).distinct().all()
    categories = [cat[0] for cat in categories if cat[0]]
    
    return render_template('products.html', products=products, categories=categories, selected_category=category)

@bp.route('/custom-order')
def custom_order():
    custom_message = """مرحباً! أود عمل طلب خاص:
- نوع المنتج:
- الألوان / التصميم:
- الكمية:"""
    whatsapp_url = create_whatsapp_url(custom_message=custom_message)
    return render_template('custom_order.html', whatsapp_url=whatsapp_url)

@bp.route('/reviews')
def reviews():
    approved_reviews = Review.query.filter_by(is_approved=True).order_by(Review.created_at.desc()).all()
    review_whatsapp_url = create_whatsapp_url(custom_message="مرحباً! أود إرسال تقييم للمنتج الذي اشتريته")
    return render_template('reviews.html', reviews=approved_reviews, whatsapp_url=review_whatsapp_url)

@bp.route('/contact')
def contact():
    whatsapp_url = create_whatsapp_url()
    return render_template('contact.html', whatsapp_url=whatsapp_url)

@bp.route('/whatsapp/<int:product_id>')
def whatsapp_product(product_id):
    product = Product.query.get_or_404(product_id)
    whatsapp_url = create_whatsapp_url(product_name=product.name)
    return redirect(whatsapp_url)

# Admin Routes
@bp.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        admin = Admin.query.filter_by(username=username).first()
        
        if admin and admin.check_password(password):
            login_user(admin)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('main.admin_dashboard'))
        else:
            flash('اسم المستخدم أو كلمة المرور غير صحيحة', 'error')
    
    return render_template('admin/login.html')

@bp.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    flash('تم تسجيل الخروج بنجاح', 'success')
    return redirect(url_for('main.index'))

@bp.route('/admin')
@login_required
def admin_dashboard():
    products_count = Product.query.count()
    reviews_count = Review.query.filter_by(is_approved=True).count()
    pending_reviews = Review.query.filter_by(is_approved=False).count()
    
    recent_products = Product.query.order_by(Product.created_at.desc()).limit(5).all()
    recent_reviews = Review.query.order_by(Review.created_at.desc()).limit(5).all()
    
    return render_template('admin/dashboard.html',
                         products_count=products_count,
                         reviews_count=reviews_count,
                         pending_reviews=pending_reviews,
                         recent_products=recent_products,
                         recent_reviews=recent_reviews)

@bp.route('/admin/products')
@login_required
def admin_products():
    products = Product.query.order_by(Product.created_at.desc()).all()
    return render_template('admin/products.html', products=products)

@bp.route('/admin/products/new', methods=['GET', 'POST'])
@login_required
def admin_product_new():
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        price = float(request.form['price'])
        category = request.form['category']
        
        # Handle file upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                # Add timestamp to avoid conflicts
                import time
                filename = f"{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_filename = filename
        
        product = Product(
            name=name,
            description=description,
            price=price,
            category=category,
            image_filename=image_filename
        )
        
        db.session.add(product)
        db.session.commit()
        flash('تم إضافة المنتج بنجاح', 'success')
        return redirect(url_for('main.admin_products'))
    
    return render_template('admin/product_form.html', product=None)

@bp.route('/admin/products/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def admin_product_edit(id):
    product = Product.query.get_or_404(id)
    
    if request.method == 'POST':
        product.name = request.form['name']
        product.description = request.form['description']
        product.price = float(request.form['price'])
        product.category = request.form['category']
        
        # Handle file upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                # Delete old image if exists
                if product.image_filename:
                    old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], product.image_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                filename = secure_filename(file.filename)
                import time
                filename = f"{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                product.image_filename = filename
        
        db.session.commit()
        flash('تم تحديث المنتج بنجاح', 'success')
        return redirect(url_for('main.admin_products'))
    
    return render_template('admin/product_form.html', product=product)

@bp.route('/admin/products/<int:id>/delete', methods=['POST'])
@login_required
def admin_product_delete(id):
    product = Product.query.get_or_404(id)
    
    # Delete associated image
    if product.image_filename:
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], product.image_filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    
    db.session.delete(product)
    db.session.commit()
    flash('تم حذف المنتج بنجاح', 'success')
    return redirect(url_for('main.admin_products'))

@bp.route('/admin/reviews')
@login_required
def admin_reviews():
    reviews = Review.query.order_by(Review.created_at.desc()).all()
    return render_template('admin/reviews.html', reviews=reviews)

@bp.route('/admin/reviews/<int:id>/approve', methods=['POST'])
@login_required
def admin_review_approve(id):
    review = Review.query.get_or_404(id)
    review.is_approved = True
    db.session.commit()
    flash('تم الموافقة على التقييم', 'success')
    return redirect(url_for('main.admin_reviews'))

@bp.route('/admin/reviews/<int:id>/reject', methods=['POST'])
@login_required
def admin_review_reject(id):
    review = Review.query.get_or_404(id)
    review.is_approved = False
    db.session.commit()
    flash('تم رفض التقييم', 'warning')
    return redirect(url_for('main.admin_reviews'))

@bp.route('/admin/reviews/<int:id>/delete', methods=['POST'])
@login_required
def admin_review_delete(id):
    review = Review.query.get_or_404(id)
    
    # Delete associated image
    if review.image_filename:
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], review.image_filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    
    db.session.delete(review)
    db.session.commit()
    flash('تم حذف التقييم', 'success')
    return redirect(url_for('main.admin_reviews'))

# Site Settings Routes
@bp.route('/admin/settings', methods=['GET', 'POST'])
@login_required
def admin_settings():
    settings = SiteSettings.get_settings()
    
    if request.method == 'POST':
        # Basic Settings
        settings.site_name = request.form['site_name']
        settings.site_description = request.form['site_description']
        settings.about_text = request.form['about_text']
        settings.footer_text = request.form['footer_text']
        
        # Contact Information
        settings.contact_phone = request.form['contact_phone']
        settings.contact_email = request.form['contact_email']
        settings.whatsapp_number = request.form['whatsapp_number']
        
        # Social Media
        settings.facebook_url = request.form['facebook_url']
        settings.instagram_url = request.form['instagram_url']
        settings.tiktok_url = request.form['tiktok_url']
        
        # Theme Settings
        settings.background_color = request.form['background_color']
        settings.secondary_color = request.form['secondary_color']
        settings.accent_color = request.form['accent_color']
        settings.theme_style = request.form['theme_style']
        
        # Feature Toggles
        settings.show_reviews = 'show_reviews' in request.form
        settings.show_custom_orders = 'show_custom_orders' in request.form
        settings.maintenance_mode = 'maintenance_mode' in request.form
        
        # Handle Logo Upload
        if 'logo' in request.files:
            file = request.files['logo']
            if file and file.filename != '':
                # Delete old logo
                if settings.logo_filename:
                    old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], settings.logo_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                filename = secure_filename(file.filename)
                import time
                filename = f"logo_{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                settings.logo_filename = filename
        
        # Handle Hero Image Upload
        if 'hero_image' in request.files:
            file = request.files['hero_image']
            if file and file.filename != '':
                # Delete old hero image
                if settings.hero_image_filename:
                    old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], settings.hero_image_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                filename = secure_filename(file.filename)
                import time
                filename = f"hero_{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                settings.hero_image_filename = filename
        
        db.session.commit()
        flash('تم تحديث إعدادات الموقع بنجاح', 'success')
        return redirect(url_for('main.admin_settings'))
    
    return render_template('admin/settings.html', settings=settings)

# Testimonials Management
@bp.route('/admin/testimonials')
@login_required
def admin_testimonials():
    testimonials = Testimonial.query.order_by(Testimonial.display_order.asc(), Testimonial.created_at.desc()).all()
    return render_template('admin/testimonials.html', testimonials=testimonials)

@bp.route('/admin/testimonials/new', methods=['GET', 'POST'])
@login_required
def admin_testimonial_new():
    if request.method == 'POST':
        customer_name = request.form['customer_name']
        customer_title = request.form['customer_title']
        testimonial_text = request.form['testimonial_text']
        rating = int(request.form['rating'])
        display_order = int(request.form.get('display_order', 0))
        is_featured = 'is_featured' in request.form
        
        # Handle image upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                import time
                filename = f"testimonial_{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_filename = filename
        
        testimonial = Testimonial(
            customer_name=customer_name,
            customer_title=customer_title,
            testimonial_text=testimonial_text,
            rating=rating,
            image_filename=image_filename,
            is_featured=is_featured,
            display_order=display_order
        )
        
        db.session.add(testimonial)
        db.session.commit()
        flash('تم إضافة الشهادة بنجاح', 'success')
        return redirect(url_for('main.admin_testimonials'))
    
    return render_template('admin/testimonial_form.html', testimonial=None)

@bp.route('/admin/testimonials/<int:id>/edit', methods=['GET', 'POST'])
@login_required
def admin_testimonial_edit(id):
    testimonial = Testimonial.query.get_or_404(id)
    
    if request.method == 'POST':
        testimonial.customer_name = request.form['customer_name']
        testimonial.customer_title = request.form['customer_title']
        testimonial.testimonial_text = request.form['testimonial_text']
        testimonial.rating = int(request.form['rating'])
        testimonial.display_order = int(request.form.get('display_order', 0))
        testimonial.is_featured = 'is_featured' in request.form
        testimonial.is_active = 'is_active' in request.form
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                # Delete old image
                if testimonial.image_filename:
                    old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], testimonial.image_filename)
                    if os.path.exists(old_path):
                        os.remove(old_path)
                
                filename = secure_filename(file.filename)
                import time
                filename = f"testimonial_{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                testimonial.image_filename = filename
        
        db.session.commit()
        flash('تم تحديث الشهادة بنجاح', 'success')
        return redirect(url_for('main.admin_testimonials'))
    
    return render_template('admin/testimonial_form.html', testimonial=testimonial)

@bp.route('/admin/testimonials/<int:id>/delete', methods=['POST'])
@login_required
def admin_testimonial_delete(id):
    testimonial = Testimonial.query.get_or_404(id)
    
    # Delete associated image
    if testimonial.image_filename:
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], testimonial.image_filename)
        if os.path.exists(filepath):
            os.remove(filepath)
    
    db.session.delete(testimonial)
    db.session.commit()
    flash('تم حذف الشهادة بنجاح', 'success')
    return redirect(url_for('main.admin_testimonials'))

# Enhanced Review Management with Ratings
@bp.route('/admin/reviews/<int:id>/feature', methods=['POST'])
@login_required
def admin_review_feature(id):
    review = Review.query.get_or_404(id)
    review.is_featured = not review.is_featured
    db.session.commit()
    action = 'تمييز' if review.is_featured else 'إلغاء تمييز'
    flash(f'تم {action} التقييم', 'success')
    return redirect(url_for('main.admin_reviews'))

@bp.route('/admin/reviews/new', methods=['GET', 'POST'])
@login_required
def admin_review_new():
    if request.method == 'POST':
        customer_name = request.form['customer_name']
        comment = request.form['comment']
        rating = int(request.form['rating'])
        product_id = request.form.get('product_id') or None
        is_approved = 'is_approved' in request.form
        is_featured = 'is_featured' in request.form
        
        # Handle image upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                import time
                filename = f"review_{int(time.time())}_{filename}"
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_filename = filename
        
        review = Review(
            customer_name=customer_name,
            comment=comment,
            rating=rating,
            product_id=product_id if product_id else None,
            image_filename=image_filename,
            is_approved=is_approved,
            is_featured=is_featured
        )
        
        db.session.add(review)
        db.session.commit()
        flash('تم إضافة التقييم بنجاح', 'success')
        return redirect(url_for('main.admin_reviews'))
    
    products = Product.query.filter_by(is_active=True).all()
    return render_template('admin/review_form.html', review=None, products=products)

# Statistics and Analytics
@bp.route('/admin/analytics')
@login_required
def admin_analytics():
    # Product Statistics
    total_products = Product.query.count()
    active_products = Product.query.filter_by(is_active=True).count()
    featured_products = Product.query.filter_by(featured=True).count()
    
    # Review Statistics
    total_reviews = Review.query.count()
    approved_reviews = Review.query.filter_by(is_approved=True).count()
    featured_reviews = Review.query.filter_by(is_featured=True).count()
    avg_rating = db.session.query(db.func.avg(Review.rating)).filter_by(is_approved=True).scalar() or 0
    
    # Testimonial Statistics
    total_testimonials = Testimonial.query.count()
    active_testimonials = Testimonial.query.filter_by(is_active=True).count()
    featured_testimonials = Testimonial.query.filter_by(is_featured=True).count()
    
    # Category Statistics
    categories = db.session.query(Product.category, db.func.count(Product.id)).filter_by(is_active=True).group_by(Product.category).all()
    
    # Recent Activity
    recent_reviews = Review.query.order_by(Review.created_at.desc()).limit(5).all()
    recent_products = Product.query.order_by(Product.created_at.desc()).limit(5).all()
    
    stats = {
        'products': {
            'total': total_products,
            'active': active_products,
            'featured': featured_products
        },
        'reviews': {
            'total': total_reviews,
            'approved': approved_reviews,
            'featured': featured_reviews,
            'avg_rating': round(avg_rating, 1)
        },
        'testimonials': {
            'total': total_testimonials,
            'active': active_testimonials,
            'featured': featured_testimonials
        },
        'categories': categories,
        'recent_reviews': recent_reviews,
        'recent_products': recent_products
    }
    
    return render_template('admin/analytics.html', stats=stats)