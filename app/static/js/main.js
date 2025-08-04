// Main JavaScript for Clay Store

document.addEventListener('DOMContentLoaded', function() {
    console.log('Clay Store JavaScript Loaded');
    
    // Initialize components
    initializeComponents();
    initializeAnimations();
    initializeFormValidations();
    initializeImagePreview();
});

// Initialize all components
function initializeComponents() {
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert-dismissible');
        alerts.forEach(function(alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Initialize animations
function initializeAnimations() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and feature boxes
    document.querySelectorAll('.card, .feature-box').forEach(el => {
        observer.observe(el);
    });
}

// Form validations
function initializeFormValidations() {
    // Custom form validation
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Price input validation
    const priceInputs = document.querySelectorAll('input[type="number"][name="price"]');
    priceInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value < 0) {
                this.setCustomValidity('السعر يجب أن يكون أكبر من صفر');
            } else {
                this.setCustomValidity('');
            }
        });
    });

    // Required field indicators
    document.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label && !label.innerHTML.includes('*')) {
            label.innerHTML += ' <span class="text-danger">*</span>';
        }
    });
}

// Image preview functionality
function initializeImagePreview() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            previewImage(this);
        });
    });
}

// Global functions
window.previewImage = function(input) {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" id="previewImg" style="max-height: 200px;">`;
        };
        
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-image fa-3x text-muted"></i>
                <p class="text-muted mt-2">معاينة الصورة</p>
            </div>
        `;
    }
};

// WhatsApp integration
window.openWhatsApp = function(number, message) {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${number}?text=${encodedMessage}`;
    window.open(url, '_blank');
};

// Loading states
window.showLoading = function(element) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (element) {
        element.classList.add('loading');
        const originalText = element.innerHTML;
        element.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>${originalText}`;
        element.disabled = true;
    }
};

window.hideLoading = function(element, originalText) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (element) {
        element.classList.remove('loading');
        element.innerHTML = originalText;
        element.disabled = false;
    }
};

// Confirmation dialogs
window.confirmAction = function(message, callback) {
    if (confirm(message)) {
        callback();
    }
};

// Local storage helpers
window.saveToStorage = function(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
};

window.loadFromStorage = function(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
};

// Image lazy loading
window.initLazyLoading = function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
};

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can send error reports to a logging service here
});

// Service Worker registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you add a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    setTimeout(function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
    }, 0);
});

// Arabic number formatting
window.formatArabicNumber = function(number) {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return number.toString().replace(/[0-9]/g, function(w) {
        return arabicNumbers[+w];
    });
};

// Price formatting for Egyptian Pounds
window.formatPrice = function(price) {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP',
        minimumFractionDigits: 2
    }).format(price);
};

// Copy to clipboard functionality
window.copyToClipboard = function(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            showAlert('تم النسخ بنجاح', 'success');
        }).catch(function() {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
};

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert('تم النسخ بنجاح', 'success');
    } catch (err) {
        console.error('Copy failed:', err);
        showAlert('فشل في النسخ', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show alert function
window.showAlert = function(message, type = 'info') {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertContainer);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(alertContainer)) {
            alertContainer.remove();
        }
    }, 3000);
};

// Form submission with loading state
window.submitFormWithLoading = function(form, button) {
    const originalText = button.innerHTML;
    showLoading(button);
    
    // Simulate processing time (remove in production)
    setTimeout(() => {
        hideLoading(button, originalText);
        form.submit();
    }, 1000);
};

// Scroll to top functionality
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Add scroll to top button
document.addEventListener('scroll', function() {
    const scrollButton = document.getElementById('scrollToTop');
    if (!scrollButton) {
        // Create scroll to top button if it doesn't exist
        const button = document.createElement('button');
        button.id = 'scrollToTop';
        button.className = 'btn btn-primary position-fixed';
        button.style.cssText = 'bottom: 100px; left: 30px; z-index: 999; border-radius: 50%; width: 50px; height: 50px; display: none;';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.onclick = scrollToTop;
        document.body.appendChild(button);
    }
    
    const scrollTop = document.getElementById('scrollToTop');
    if (window.pageYOffset > 300) {
        scrollTop.style.display = 'block';
    } else {
        scrollTop.style.display = 'none';
    }
});

console.log('Clay Store JavaScript fully initialized');\n\n
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
