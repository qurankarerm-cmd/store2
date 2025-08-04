import Head from 'next/head';
import Layout from '../components/Layout';
import { withAuth } from '../contexts/AuthContext';
import {
  Activity,
  Package,
  MessageSquare,
  Star,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';

function ActivityPage() {
  // Mock activity data (replace with real API call)
  const activities = [
    {
      id: 1,
      type: 'product_created',
      title: 'تم إنشاء منتج جديد',
      description: 'ميدالية مفاتيح قلب مخصصة',
      user: 'مدير النظام',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: Package,
      color: 'bg-green-500',
    },
    {
      id: 2,
      type: 'review_submitted',
      title: 'تقييم جديد',
      description: 'فاطمة أحمد قدمت تقييم 5 نجوم',
      user: 'فاطمة أحمد',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      id: 3,
      type: 'product_featured',
      title: 'تم تمييز منتج',
      description: 'مجموعة ورود ملونة للديكور تم تمييزها كمنتج مميز',
      user: 'مدير النظام',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      id: 4,
      type: 'review_approved',
      title: 'تم اعتماد تقييم',
      description: 'تقييم محمد سامي تم اعتماده ونشره',
      user: 'مدير النظام',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      id: 5,
      type: 'product_updated',
      title: 'تم تحديث منتج',
      description: 'حامل أقلام مكتبي فريد - تم تحديث السعر والوصف',
      user: 'مدير النظام',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      id: 6,
      type: 'review_submitted',
      title: 'تقييم جديد',
      description: 'نورا المصري قدمت تقييم 5 نجوم',
      user: 'نورا المصري',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      id: 7,
      type: 'user_login',
      title: 'تسجيل دخول',
      description: 'مدير النظام سجل دخول للوحة التحكم',
      user: 'مدير النظام',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: User,
      color: 'bg-gray-500',
    },
    {
      id: 8,
      type: 'product_created',
      title: 'تم إنشاء منتج جديد',
      description: 'علبة مجوهرات صغيرة مزينة',
      user: 'مدير النظام',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      icon: Package,
      color: 'bg-green-500',
    },
  ];

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `منذ ${diffMinutes} دقيقة`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`;
    } else if (diffDays === 1) {
      return 'منذ يوم واحد';
    } else if (diffDays <= 7) {
      return `منذ ${diffDays} أيام`;
    } else {
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'product_created':
        return 'إنشاء منتج';
      case 'product_updated':
        return 'تحديث منتج';
      case 'product_featured':
        return 'تمييز منتج';
      case 'review_submitted':
        return 'تقييم جديد';
      case 'review_approved':
        return 'اعتماد تقييم';
      case 'user_login':
        return 'تسجيل دخول';
      default:
        return 'نشاط';
    }
  };

  const groupActivitiesByDate = (activities) => {
    const groups = {};
    
    activities.forEach(activity => {
      const date = activity.timestamp.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return Object.entries(groups).map(([date, activities]) => ({
      date: new Date(date),
      activities
    })).sort((a, b) => b.date - a.date);
  };

  const groupedActivities = groupActivitiesByDate(activities);

  const getDateLabel = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (activityDate.getTime() === today.getTime()) {
      return 'اليوم';
    } else if (activityDate.getTime() === yesterday.getTime()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <>
      <Head>
        <title>سجل الأنشطة - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                سجل الأنشطة
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                تتبع جميع الأنشطة والتغييرات في النظام
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {activities.length}
                    </div>
                    <div className="text-sm text-gray-600">إجمالي الأنشطة</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {activities.filter(a => {
                        const today = new Date();
                        const activityDate = new Date(a.timestamp);
                        return activityDate.toDateString() === today.toDateString();
                      }).length}
                    </div>
                    <div className="text-sm text-gray-600">أنشطة اليوم</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {activities.filter(a => {
                        const now = new Date();
                        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
                        return a.timestamp > hourAgo;
                      }).length}
                    </div>
                    <div className="text-sm text-gray-600">آخر ساعة</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  الأنشطة الأخيرة
                </h3>
                
                <div className="flow-root">
                  {groupedActivities.map(({ date, activities }) => (
                    <div key={date.toISOString()} className="mb-8 last:mb-0">
                      <div className="relative">
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 pb-2 mb-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {getDateLabel(date)}
                          </h4>
                        </div>
                        
                        <ul className="-mb-8">
                          {activities.map((activity, activityIdx) => (
                            <li key={activity.id}>
                              <div className="relative pb-8">
                                {activityIdx !== activities.length - 1 ? (
                                  <span
                                    className="absolute top-4 right-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <div className="relative flex space-x-3 space-x-reverse">
                                  <div>
                                    <span
                                      className={`h-8 w-8 rounded-full ${activity.color} flex items-center justify-center ring-8 ring-white`}
                                    >
                                      <activity.icon className="w-4 h-4 text-white" />
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 space-x-reverse">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        <span className="font-medium text-gray-900">
                                          {activity.title}
                                        </span>{' '}
                                        {activity.description}
                                      </p>
                                      <div className="mt-1 flex items-center space-x-2 space-x-reverse">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          {getActivityTypeLabel(activity.type)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          بواسطة {activity.user}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-left text-sm whitespace-nowrap text-gray-500">
                                      <time dateTime={activity.timestamp.toISOString()}>
                                        {formatRelativeTime(activity.timestamp)}
                                      </time>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 text-center">
                  <button className="admin-button-secondary">
                    تحميل المزيد من الأنشطة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(ActivityPage);