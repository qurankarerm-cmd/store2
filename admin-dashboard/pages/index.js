import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Layout from '../components/Layout';
import { withAuth } from '../contexts/AuthContext';
import { productsAPI, reviewsAPI } from '../utils/api';
import {
  Package,
  MessageSquare,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Star,
  ShoppingBag,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

function Dashboard() {
  const [dateRange, setDateRange] = useState('7d');

  // Fetch dashboard stats
  const { data: productStats, isLoading: productStatsLoading } = useQuery(
    'productStats',
    productsAPI.getStats
  );

  const { data: reviewStats, isLoading: reviewStatsLoading } = useQuery(
    'reviewStats',
    reviewsAPI.getStats
  );

  const { data: pendingReviews } = useQuery(
    'pendingReviews',
    () => reviewsAPI.getPending({ limit: 5 })
  );

  const stats = [
    {
      name: 'إجمالي المنتجات',
      value: productStats?.overview?.totalProducts || 0,
      change: '+12%',
      changeType: 'increase',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      name: 'المنتجات النشطة',
      value: productStats?.overview?.activeProducts || 0,
      change: '+8%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      name: 'إجمالي التقييمات',
      value: reviewStats?.overview?.totalReviews || 0,
      change: '+23%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-yellow-500',
    },
    {
      name: 'التقييمات المعلقة',
      value: reviewStats?.overview?.pendingReviews || 0,
      change: '-2%',
      changeType: 'decrease',
      icon: Clock,
      color: 'bg-red-500',
    },
  ];

  const quickActions = [
    {
      name: 'إضافة منتج جديد',
      description: 'أضف منتج جديد إلى المتجر',
      href: '/products/create',
      icon: Package,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'مراجعة التقييمات',
      description: 'راجع التقييمات المعلقة',
      href: '/reviews?status=pending',
      icon: MessageSquare,
      color: 'bg-yellow-500 hover:bg-yellow-600',
    },
    {
      name: 'عرض الإحصائيات',
      description: 'اطلع على إحصائيات مفصلة',
      href: '/analytics',
      icon: BarChart3,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'إدارة الإعدادات',
      description: 'تحديث إعدادات النظام',
      href: '/settings',
      icon: Users,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <>
      <Head>
        <title>لوحة التحكم - أعمالي بالطين</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="mt-2 text-sm text-gray-700">
                نظرة عامة على أداء متجر أعمالي بالطين
              </p>
            </div>

            {/* Stats overview */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((item) => (
                <div
                  key={item.name}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 ${item.color} rounded-md flex items-center justify-center`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="mr-5 w-0 flex-1">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {productStatsLoading || reviewStatsLoading ? (
                            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                          ) : (
                            item.value.toLocaleString('ar-EG')
                          )}
                        </dd>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span
                        className={`font-medium ${
                          item.changeType === 'increase'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.change}
                      </span>
                      <span className="text-gray-500"> من الشهر الماضي</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick actions */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      إجراءات سريعة
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {quickActions.map((action) => (
                        <Link
                          key={action.name}
                          href={action.href}
                          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div>
                            <span className={`rounded-lg inline-flex p-3 text-white ${action.color}`}>
                              <action.icon className="w-6 h-6" />
                            </span>
                          </div>
                          <div className="mt-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              {action.name}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                              {action.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="mt-8 bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      النشاط الأخير
                    </h3>
                    <div className="flow-root">
                      <ul className="-my-5 divide-y divide-gray-200">
                        <li className="py-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                تم إنشاء منتج جديد: ميدالية مفاتيح مخصصة
                              </p>
                              <p className="text-sm text-gray-500">منذ ساعتين</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                تقييم جديد من فاطمة أحمد
                              </p>
                              <p className="text-sm text-gray-500">منذ 4 ساعات</p>
                            </div>
                          </div>
                        </li>
                        <li className="py-4">
                          <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                تم تمييز منتج كمنتج مميز
                              </p>
                              <p className="text-sm text-gray-500">أمس</p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/activity"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        عرض جميع الأنشطة
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                {/* Top products */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      أكثر المنتجات مشاهدة
                    </h3>
                    {productStatsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {productStats?.topProducts?.slice(0, 5).map((product, index) => (
                          <div key={product._id} className="flex items-center space-x-3 space-x-reverse">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-clay-400 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <Eye className="w-4 h-4 ml-1" />
                                {product.clickCount} مشاهدة
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pending reviews */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        تقييمات في الانتظار
                      </h3>
                      {pendingReviews?.reviews?.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {pendingReviews.reviews.length}
                        </span>
                      )}
                    </div>
                    {pendingReviews?.reviews?.length > 0 ? (
                      <div className="space-y-3">
                        {pendingReviews.reviews.slice(0, 3).map((review) => (
                          <div key={review._id} className="border-r-4 border-yellow-400 bg-yellow-50 p-3 rounded">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="mr-3">
                                <p className="text-sm text-yellow-700">
                                  <span className="font-medium">{review.name}</span> - {review.product}
                                </p>
                                <div className="flex items-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">لا توجد تقييمات في الانتظار</p>
                    )}
                    <div className="mt-4">
                      <Link
                        href="/reviews?status=pending"
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        مراجعة جميع التقييمات
                      </Link>
                    </div>
                  </div>
                </div>

                {/* System status */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      حالة النظام
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">الخادم</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          متصل
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">قاعدة البيانات</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          متصل
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">آخر نسخة احتياطية</span>
                        <span className="text-sm text-gray-900">منذ ساعة</span>
                      </div>
                    </div>
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

export default withAuth(Dashboard);