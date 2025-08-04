import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Layout from '../../components/Layout';
import { withAuth } from '../../contexts/AuthContext';
import { productsAPI } from '../../utils/api';
import {
  Package,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  MoreHorizontal,
  Filter,
} from 'lucide-react';

function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  const { data: productsData, isLoading, refetch } = useQuery(
    ['adminProducts', { page: currentPage, search: searchTerm, category: selectedCategory }],
    () => productsAPI.getAll({ 
      page: currentPage, 
      search: searchTerm,
      category: selectedCategory === 'الكل' ? '' : selectedCategory,
      limit: 10
    })
  );

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const categories = ['الكل', 'ميداليات مفاتيح', 'ديكورات', 'أدوات مكتبية', 'أدوات مطبخ', 'إكسسوارات', 'أخرى'];

  const handleDeleteProduct = async (productId) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        await productsAPI.delete(productId);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleFeatured = async (productId) => {
    try {
      await productsAPI.toggleFeatured(productId);
      refetch();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  return (
    <>
      <Head>
        <title>إدارة المنتجات - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  إدارة المنتجات
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  إدارة وتحديث منتجات المتجر
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:mr-4">
                <Link
                  href="/products/create"
                  className="admin-button-primary"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة منتج جديد
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="البحث في المنتجات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="admin-input pr-10"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="admin-select"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="admin-button-secondary">
                      <Filter className="w-4 h-4 ml-2" />
                      تصفية
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="loading-spinner w-8 h-8 mx-auto"></div>
                  <p className="mt-2 text-gray-500">جاري تحميل المنتجات...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
                  <p className="text-gray-500 mb-4">ابدأ بإضافة منتجك الأول</p>
                  <Link href="/products/create" className="admin-button-primary">
                    إضافة منتج جديد
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <li key={product._id}>
                        <div className="px-4 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            {/* Product Image */}
                            <div className="flex-shrink-0 h-16 w-16">
                              <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            </div>
                            
                            {/* Product Info */}
                            <div className="mr-4 flex-1">
                              <div className="flex items-center">
                                <h3 className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </h3>
                                {product.featured && (
                                  <Star className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {product.category} • {product.price}
                              </p>
                              <div className="flex items-center mt-1">
                                <Eye className="w-4 h-4 text-gray-400 ml-1" />
                                <span className="text-xs text-gray-500">
                                  {product.clickCount || 0} مشاهدة
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <span className={`status-badge ${product.active ? 'status-badge-success' : 'status-badge-gray'}`}>
                              {product.active ? 'نشط' : 'غير نشط'}
                            </span>
                            
                            <div className="flex items-center space-x-1 space-x-reverse">
                              <button
                                onClick={() => toggleFeatured(product._id)}
                                className={`p-2 rounded-md ${product.featured ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`}
                                title={product.featured ? 'إلغاء التمييز' : 'تمييز المنتج'}
                              >
                                <Star className="w-4 h-4" fill={product.featured ? 'currentColor' : 'none'} />
                              </button>
                              
                              <Link
                                href={`/products/${product._id}/edit`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          السابق
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                          disabled={currentPage === pagination.pages}
                          className="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          التالي
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            عرض{' '}
                            <span className="font-medium">
                              {(currentPage - 1) * pagination.limit + 1}
                            </span>{' '}
                            إلى{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * pagination.limit, pagination.total)}
                            </span>{' '}
                            من{' '}
                            <span className="font-medium">{pagination.total}</span>{' '}
                            نتيجة
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            {[...Array(pagination.pages)].map((_, index) => (
                              <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                  currentPage === index + 1
                                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                } ${index === 0 ? 'rounded-r-md' : ''} ${index === pagination.pages - 1 ? 'rounded-l-md' : ''}`}
                              >
                                {index + 1}
                              </button>
                            ))}
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(Products, ['products:read']);