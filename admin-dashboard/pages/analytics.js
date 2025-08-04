import { useState } from 'react';
import Head from 'next/head';
import { useQuery } from 'react-query';
import Layout from '../components/Layout';
import { withAuth } from '../contexts/AuthContext';
import { productsAPI, reviewsAPI } from '../utils/api';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  Package,
  Star,
  Calendar,
  Download,
} from 'lucide-react';

function Analytics() {
  const [dateRange, setDateRange] = useState('30d');

  // Fetch analytics data
  const { data: productStats } = useQuery('productStats', productsAPI.getStats);
  const { data: reviewStats } = useQuery('reviewStats', reviewsAPI.getStats);

  // Mock analytics data (replace with real data)
  const mockChartData = [
    { name: 'الأسبوع 1', views: 120, orders: 15 },
    { name: 'الأسبوع 2', views: 180, orders: 22 },
    { name: 'الأسبوع 3', views: 240, orders: 28 },
    { name: 'الأسبوع 4', views: 200, orders: 25 },
  ];

  const overviewStats = [
    {
      name: 'إجمالي المشاهدات',
      value: productStats?.overview?.totalClicks || 0,
      change: '+12%',
      changeType: 'increase',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'نقرات واتساب',
      value: productStats?.overview?.totalWhatsAppClicks || 0,
      change: '+18%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'المنتجات النشطة',
      value: productStats?.overview?.activeProducts || 0,
      change: '+5%',
      changeType: 'increase',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'متوسط التقييم',
      value: reviewStats?.overview?.averageRating ? reviewStats.overview.averageRating.toFixed(1) : '0.0',
      change: '+0.2',
      changeType: 'increase',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <>
      <Head>
        <title>الإحصائيات والتحليلات - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                  الإحصائيات والتحليلات
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  نظرة شاملة على أداء المتجر والمنتجات
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:mr-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="admin-select ml-3"
                >
                  <option value="7d">آخر 7 أيام</option>
                  <option value="30d">آخر 30 يوم</option>
                  <option value="90d">آخر 3 أشهر</option>
                  <option value="1y">آخر سنة</option>
                </select>
                <button className="admin-button-secondary">
                  <Download className="w-4 h-4 ml-2" />
                  تصدير التقرير
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {overviewStats.map((item) => (
                <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 ${item.bgColor} rounded-md flex items-center justify-center`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                      </div>
                      <div className="mr-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {typeof item.value === 'number' ? item.value.toLocaleString('ar-EG') : item.value}
                        </dd>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span
                        className={`font-medium ${
                          item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {item.change}
                      </span>
                      <span className="text-gray-500"> من الفترة السابقة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Products */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    أكثر المنتجات مشاهدة
                  </h3>
                  <div className="space-y-3">
                    {productStats?.topProducts?.slice(0, 5).map((product, index) => (
                      <div key={product._id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="mr-3">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {product.clickCount} مشاهدة
                          </p>
                          <p className="text-sm text-gray-500">
                            {product.whatsappClicks} نقرة واتساب
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories Performance */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    أداء الفئات
                  </h3>
                  <div className="space-y-3">
                    {productStats?.categoryStats?.map((category, index) => (
                      <div key={category._id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{category._id}</p>
                          <p className="text-sm text-gray-500">{category.count} منتج</p>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {category.totalClicks} مشاهدة
                          </p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min(100, (category.totalClicks / Math.max(...(productStats?.categoryStats?.map(c => c.totalClicks) || [1]))) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Rating Distribution */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    توزيع التقييمات
                  </h3>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviewStats?.ratingDistribution?.find(r => r._id === rating)?.count || 0;
                      const total = reviewStats?.overview?.totalReviews || 1;
                      const percentage = (count / total) * 100;
                      
                      return (
                        <div key={rating} className="flex items-center">
                          <div className="flex items-center w-20">
                            <span className="text-sm font-medium text-gray-900 ml-2">{rating}</span>
                            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          </div>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-16 text-left">
                            <span className="text-sm text-gray-900">{count}</span>
                            <span className="text-xs text-gray-500"> ({percentage.toFixed(0)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    النشاط الأخير
                  </h3>
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {reviewStats?.recentReviews?.slice(0, 5).map((review) => (
                        <li key={review._id} className="py-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                review.approved ? 'bg-green-500' : 'bg-yellow-500'
                              }`}>
                                {review.approved ? (
                                  <Star className="w-4 h-4 text-white" />
                                ) : (
                                  <MessageSquare className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                تقييم جديد من {review.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {review.product} • {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: review.rating }, (_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(Analytics, ['analytics:read']);