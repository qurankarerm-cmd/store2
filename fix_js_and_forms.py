#!/usr/bin/env python3
"""
Fix JavaScript and form functionality issues
"""

import os

def fix_javascript_issues():
    """Fix common JavaScript issues in templates"""
    
    # Fix the main.js file to handle form submissions properly
    js_fixes = '''
// Additional fixes for admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Fix form submission with loading states
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الحفظ...';
                submitBtn.disabled = true;
                
                // Re-enable after 5 seconds as fallback
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 5000);
            }
        });
    });
    
    // Fix delete confirmation modals
    window.confirmDelete = function(id, name) {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            const nameElement = modal.querySelector('#productName, #testimonialCustomerName, #reviewCustomerName');
            const form = modal.querySelector('#deleteForm');
            
            if (nameElement) nameElement.textContent = name;
            if (form) {
                // Get current URL and update form action
                const currentPath = window.location.pathname;
                if (currentPath.includes('/products')) {
                    form.action = `/admin/products/${id}/delete`;
                } else if (currentPath.includes('/testimonials')) {
                    form.action = `/admin/testimonials/${id}/delete`;
                } else if (currentPath.includes('/reviews')) {
                    form.action = `/admin/reviews/${id}/delete`;
                }
            }
            
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    };
    
    // Fix star rating functionality
    const starInputs = document.querySelectorAll('.star-label input[type="radio"]');
    starInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateStars(parseInt(this.value));
        });
    });
    
    // Fix color picker updates
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('change', function() {
            const span = this.parentNode.querySelector('span');
            if (span) {
                span.textContent = this.value;
            }
        });
    });
    
    // Fix theme selection
    window.selectTheme = function(theme) {
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('selected');
        });
        event.target.closest('.theme-option').classList.add('selected');
        const themeInput = document.getElementById('theme_style');
        if (themeInput) {
            themeInput.value = theme;
        }
    };
    
    console.log('✅ Admin JavaScript fixes loaded');
});

function updateStars(rating) {
    const stars = document.querySelectorAll('.star-icon');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}
'''

    # Append fixes to main.js
    try:
        with open('app/static/js/main.js', 'a', encoding='utf-8') as f:
            f.write('\\n\\n' + js_fixes)
        print("✅ JavaScript fixes applied to main.js")
    except Exception as e:
        print(f"❌ Error fixing JavaScript: {e}")

def fix_upload_permissions():
    """Fix upload directory permissions"""
    upload_dir = 'app/static/uploads'
    try:
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir, exist_ok=True)
        
        # Create a test file to verify write permissions
        test_file = os.path.join(upload_dir, 'test.txt')
        with open(test_file, 'w') as f:
            f.write('test')
        os.remove(test_file)
        
        print("✅ Upload directory permissions verified")
    except Exception as e:
        print(f"❌ Upload directory error: {e}")

def fix_config_issues():
    """Fix configuration issues"""
    config_fixes = '''
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
'''
    
    try:
        with open('config.py', 'w', encoding='utf-8') as f:
            f.write(config_fixes)
        print("✅ Configuration file updated")
    except Exception as e:
        print(f"❌ Error updating config: {e}")

if __name__ == '__main__':
    print("🔧 Fixing JavaScript and Form Issues...")
    print("=" * 50)
    
    fix_javascript_issues()
    fix_upload_permissions()
    fix_config_issues()
    
    print("\\n🎉 All fixes applied!")
    print("\\n📋 Next steps:")
    print("1. Restart the Flask application")
    print("2. Test admin functionality")
    print("3. Add products, reviews, and testimonials")