import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { withAuth, useAuth } from '../contexts/AuthContext';
import {
  User,
  Edit,
  Save,
  Calendar,
  Mail,
  Shield,
  Clock,
  Activity,
} from 'lucide-react';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await updateProfile(profileForm);
    if (result.success) {
      setIsEditing(false);
    }
    
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setProfileForm({
      fullName: user?.fullName || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const formatDate = (date) => {
    if (!date) return 'غير محدد';
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'مدير النظام';
      case 'moderator':
        return 'مشرف';
      case 'editor':
        return 'محرر';
      default:
        return role;
    }
  };

  return (
    <>
      <Head>
        <title>الملف الشخصي - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                الملف الشخصي
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                عرض وإدارة معلومات حسابك الشخصي
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    {/* Avatar */}
                    <div className="mx-auto h-24 w-24 bg-gradient-to-r from-primary-500 to-clay-500 rounded-full flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900">{user?.fullName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{getRoleLabel(user?.role)}</p>
                    
                    {/* Status */}
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user?.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user?.active ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {user?.loginAttempts || 0}
                        </div>
                        <div className="text-xs text-gray-500">محاولات الدخول</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatDate(user?.lastLogin) !== 'غير محدد' ? 'متصل' : 'غير متصل'}
                        </div>
                        <div className="text-xs text-gray-500">الحالة</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white shadow rounded-lg mt-6">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      معلومات الحساب
                    </h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">اسم المستخدم</dt>
                        <dd className="text-sm text-gray-900">{user?.username}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">تاريخ الإنشاء</dt>
                        <dd className="text-sm text-gray-900">{formatDate(user?.createdAt)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">آخر تحديث</dt>
                        <dd className="text-sm text-gray-900">{formatDate(user?.updatedAt)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">آخر دخول</dt>
                        <dd className="text-sm text-gray-900">{formatDate(user?.lastLogin)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Information */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        المعلومات الشخصية
                      </h3>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="admin-button-secondary"
                        >
                          <Edit className="w-4 h-4 ml-2" />
                          تعديل
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                              الاسم الكامل
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              value={profileForm.fullName}
                              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                              className="admin-input mt-1"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              البريد الإلكتروني
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={profileForm.email}
                              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              className="admin-input mt-1"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 flex items-center space-x-3 space-x-reverse">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="admin-button-primary"
                          >
                            {isSubmitting ? (
                              <div className="loading-spinner w-4 h-4 ml-2"></div>
                            ) : (
                              <Save className="w-4 h-4 ml-2" />
                            )}
                            حفظ التغييرات
                          </button>
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="admin-button-secondary"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    ) : (
                      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            <Mail className="w-4 h-4 inline ml-1" />
                            البريد الإلكتروني
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            <Shield className="w-4 h-4 inline ml-1" />
                            الدور
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">{getRoleLabel(user?.role)}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                </div>

                {/* Permissions */}
                {user?.role !== 'admin' && user?.permissions && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        الصلاحيات
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {Object.entries(user.permissions).map(([resource, actions]) => (
                          <div key={resource} className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2 capitalize">
                              {resource === 'products' ? 'المنتجات' : 
                               resource === 'reviews' ? 'التقييمات' :
                               resource === 'users' ? 'المستخدمين' :
                               resource === 'analytics' ? 'الإحصائيات' : resource}
                            </h4>
                            <div className="space-y-1">
                              {Object.entries(actions).map(([action, allowed]) => (
                                <div key={action} className="flex items-center">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    allowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {action === 'create' ? 'إنشاء' :
                                     action === 'read' ? 'قراءة' :
                                     action === 'update' ? 'تحديث' :
                                     action === 'delete' ? 'حذف' :
                                     action === 'approve' ? 'اعتماد' : action}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      الأمان
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">كلمة المرور</h4>
                          <p className="text-sm text-gray-500">آخر تحديث لكلمة المرور</p>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-gray-900">{formatDate(user?.updatedAt)}</div>
                          <a href="/settings" className="text-sm text-primary-600 hover:text-primary-500">
                            تغيير كلمة المرور
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">المصادقة الثنائية</h4>
                          <p className="text-sm text-gray-500">حماية إضافية لحسابك</p>
                        </div>
                        <div>
                          <span className="status-badge-gray">غير مفعل</span>
                        </div>
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

export default withAuth(Profile);