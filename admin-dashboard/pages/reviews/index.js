import { useState } from 'react';
import Head from 'next/head';
import { useQuery } from 'react-query';
import Layout from '../../components/Layout';
import { withAuth } from '../../contexts/AuthContext';
import { reviewsAPI } from '../../utils/api';
import {
  MessageSquare,
  Star,
  Check,
  X,
  Clock,
  User,
  Search,
  Filter,
  ThumbsUp,
  Flag,
} from 'lucide-react';

function Reviews() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  // Fetch reviews
  const { data: reviewsData, isLoading, refetch } = useQuery(
    ['adminReviews', { page: currentPage, status: statusFilter, rating: ratingFilter }],
    () => reviewsAPI.getAll({ 
      page: currentPage, 
      status: statusFilter === 'all' ? '' : statusFilter,
      rating: ratingFilter === 'all' ? '' : ratingFilter,
      limit: 10
    })
  );

  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination || {};

  const handleApproveReview = async (reviewId) => {
    try {
      await reviewsAPI.approve(reviewId);
      refetch();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      try {
        await reviewsAPI.delete(reviewId);
        refetch();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const toggleFeatured = async (reviewId) => {
    try {
      await reviewsAPI.toggleFeatured(reviewId);
      refetch();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
      />
    ));
  };

  return (
    <>
      <Head>
        <title>إدارة التقييمات - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                إدارة التقييمات
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                مراجعة وإدارة تقييمات العملاء
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {reviews.length}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي التقييمات</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {reviews.filter(r => r.approved).length}
                    </div>
                    <div className="text-sm text-gray-600">معتمدة</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {reviews.filter(r => !r.approved).length}
                    </div>
                    <div className="text-sm text-gray-600">في الانتظار</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">متوسط التقييم</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حالة التقييم
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="all">جميع التقييمات</option>
                      <option value="approved">المعتمدة</option>
                      <option value="pending">في الانتظار</option>
                    </select>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التقييم بالنجوم
                    </label>
                    <select
                      value={ratingFilter}
                      onChange={(e) => setRatingFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="all">جميع التقييمات</option>
                      <option value="5">5 نجوم</option>
                      <option value="4">4 نجوم</option>
                      <option value="3">3 نجوم</option>
                      <option value="2">2 نجوم</option>
                      <option value="1">1 نجمة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="loading-spinner w-8 h-8 mx-auto"></div>
                  <p className="mt-2 text-gray-500">جاري تحميل التقييمات...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تقييمات</h3>
                  <p className="text-gray-500">لا توجد تقييمات تطابق معايير البحث</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <li key={review._id} className="p-6">
                      <div className="flex space-x-3 space-x-reverse">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {review.name}
                              </p>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                                <span className="mr-2 text-sm text-gray-500">
                                  {review.product}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {/* Status badges */}
                              {review.approved ? (
                                <span className="status-badge-success">معتمد</span>
                              ) : (
                                <span className="status-badge-warning">في الانتظار</span>
                              )}
                              {review.featured && (
                                <span className="status-badge-info">مميز</span>
                              )}
                              {review.verified && (
                                <span className="status-badge-success">موثق</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm text-gray-700">{review.comment}</p>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {!review.approved && (
                                <button
                                  onClick={() => handleApproveReview(review._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-3 h-3 ml-1" />
                                  اعتماد
                                </button>
                              )}
                              
                              <button
                                onClick={() => toggleFeatured(review._id)}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md ${
                                  review.featured
                                    ? 'text-yellow-800 bg-yellow-100 hover:bg-yellow-200'
                                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                }`}
                              >
                                <Star className="w-3 h-3 ml-1" fill={review.featured ? 'currentColor' : 'none'} />
                                {review.featured ? 'إلغاء التمييز' : 'تمييز'}
                              </button>
                              
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                              >
                                <X className="w-3 h-3 ml-1" />
                                حذف
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(Reviews, ['reviews:read']);