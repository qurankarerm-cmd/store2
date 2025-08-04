import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { withAuth } from '../../contexts/AuthContext';
import { productsAPI, uploadAPI } from '../../utils/api';
import {
  Package,
  Upload,
  X,
  Save,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'react-toastify';

function CreateProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    customizable: true,
    minOrder: 1,
    processingTime: '3-5 أيام',
    tags: '',
    stock: 'متوفر',
    featured: false,
  });

  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    'ميداليات مفاتيح',
    'ديكورات', 
    'أدوات مكتبية',
    'أدوات مطبخ',
    'إكسسوارات',
    'أخرى'
  ];

  const stockOptions = ['متوفر', 'غير متوفر', 'حسب الطلب'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadAPI.uploadSingle(file)
      );
      
      const results = await Promise.all(uploadPromises);
      console.log('Upload results:', results);
      
      const newImages = results.map(result => {
        console.log('Processing result:', result);
        return result.data.data.file;
      });
      
      console.log('New images:', newImages);
      setImages(prev => [...prev, ...newImages]);
      toast.success(`تم رفع ${newImages.length} صورة بنجاح`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`فشل في رفع الصور: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];
    console.log('Removing image:', imageToRemove);
    
    try {
      if (imageToRemove?.filename) {
        await uploadAPI.deleteFile(imageToRemove.filename);
      }
      setImages(prev => prev.filter((_, i) => i !== index));
      toast.success('تم حذف الصورة');
    } catch (error) {
      console.error('Delete error:', error);
      // Still remove from UI even if delete fails
      setImages(prev => prev.filter((_, i) => i !== index));
      toast.warning('تم حذف الصورة من القائمة ولكن قد تحتاج لحذفها من الخادم يدوياً');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('يجب إضافة صورة واحدة على الأقل');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const productData = {
        ...formData,
        images,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        minOrder: parseInt(formData.minOrder),
      };

      await productsAPI.create(productData);
      toast.success('تم إنشاء المنتج بنجاح');
      router.push('/products');
    } catch (error) {
      console.error('Create product error:', error);
      toast.error(error.message || 'فشل في إنشاء المنتج');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>إضافة منتج جديد - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-8">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                    إضافة منتج جديد
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    أضف منتج جديد إلى متجرك
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    المعلومات الأساسية
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        اسم المنتج *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="admin-input mt-1"
                        required
                        placeholder="أدخل اسم المنتج..."
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        وصف المنتج *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="admin-textarea mt-1"
                        required
                        placeholder="أدخل وصف مفصل للمنتج..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          السعر *
                        </label>
                        <input
                          type="text"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="admin-input mt-1"
                          required
                          placeholder="مثلاً: ابتداءً من 75 جنيه"
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          الفئة *
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="admin-select mt-1"
                          required
                        >
                          <option value="">اختر الفئة</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    صور المنتج *
                  </h3>
                  
                  {/* Upload Area */}
                  <div
                    className={`file-upload-area ${dragActive ? 'file-upload-area-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        {isUploading ? 'جاري الرفع...' : 'اسحب الصور هنا أو اضغط للاختيار'}
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF حتى 10MB
                      </p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        الصور المرفوعة ({images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="image-preview">
                            <img
                              src={`http://localhost:5000${image?.path || ''}`}
                              alt={`Product ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                              onError={(e) => {
                                console.error('Image load error:', image);
                                e.target.src = '/placeholder-image.png';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="image-preview-remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    تفاصيل إضافية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        حالة المخزون
                      </label>
                      <select
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="admin-select mt-1"
                      >
                        {stockOptions.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700">
                        الحد الأدنى للطلب
                      </label>
                      <input
                        type="number"
                        id="minOrder"
                        name="minOrder"
                        value={formData.minOrder}
                        onChange={handleInputChange}
                        className="admin-input mt-1"
                        min="1"
                      />
                    </div>

                    <div>
                      <label htmlFor="processingTime" className="block text-sm font-medium text-gray-700">
                        مدة التنفيذ
                      </label>
                      <input
                        type="text"
                        id="processingTime"
                        name="processingTime"
                        value={formData.processingTime}
                        onChange={handleInputChange}
                        className="admin-input mt-1"
                        placeholder="مثلاً: 3-5 أيام"
                      />
                    </div>

                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        الكلمات المفتاحية
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="admin-input mt-1"
                        placeholder="مثلاً: هدايا، مخصص، ملون (مفصولة بفواصل)"
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <input
                        id="customizable"
                        name="customizable"
                        type="checkbox"
                        checked={formData.customizable}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="customizable" className="mr-2 block text-sm text-gray-900">
                        قابل للتخصيص
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="mr-2 block text-sm text-gray-900">
                        منتج مميز
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="admin-button-secondary"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="admin-button-primary"
                >
                  {isSubmitting ? (
                    <div className="loading-spinner w-4 h-4 ml-2"></div>
                  ) : (
                    <Save className="w-4 h-4 ml-2" />
                  )}
                  إنشاء المنتج
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(CreateProduct, ['products:create']);