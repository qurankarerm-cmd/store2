import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { withAuth, useAuth } from '../contexts/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';

function Settings() {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'ar',
    theme: user?.preferences?.theme || 'light',
    notifications: {
      email: user?.preferences?.notifications?.email || true,
      browser: user?.preferences?.notifications?.browser || true,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await updateProfile(profileForm);
    if (result.success) {
      // Profile updated successfully
    }
    
    setIsSubmitting(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('كلمة المرور الجديدة غير متطابقة');
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    
    if (result.success) {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    
    setIsSubmitting(false);
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await updateProfile({ preferences });
    if (result.success) {
      // Preferences updated
    }
    
    setIsSubmitting(false);
  };

  const tabs = [
    { id: 'profile', name: 'الملف الشخصي', icon: User },
    { id: 'password', name: 'كلمة المرور', icon: Lock },
    { id: 'preferences', name: 'التفضيلات', icon: SettingsIcon },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
  ];

  return (
    <>
      <Head>
        <title>الإعدادات - لوحة التحكم</title>
      </Head>

      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                الإعدادات
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                إدارة إعدادات حسابك وتفضيلات النظام
              </p>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
              {/* Sidebar */}
              <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full text-right ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 hover:text-primary-700 hover:bg-primary-50'
                          : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon
                        className={`flex-shrink-0 ml-3 h-6 w-6 ${
                          activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      <span className="truncate">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Main content */}
              <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        معلومات الملف الشخصي
                      </h3>
                      <form onSubmit={handleProfileSubmit}>
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
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              الدور
                            </label>
                            <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded">
                              {user?.role === 'admin' ? 'مدير النظام' : user?.role}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
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
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Password Settings */}
                {activeTab === 'password' && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        تغيير كلمة المرور
                      </h3>
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              كلمة المرور الحالية
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                id="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="admin-input"
                                required
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 left-0 pr-3 flex items-center"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                              >
                                {showPasswords.current ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              كلمة المرور الجديدة
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                id="newPassword"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="admin-input"
                                required
                                minLength={6}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 left-0 pr-3 flex items-center"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                              >
                                {showPasswords.new ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              تأكيد كلمة المرور الجديدة
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                id="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="admin-input"
                                required
                                minLength={6}
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 left-0 pr-3 flex items-center"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                              >
                                {showPasswords.confirm ? (
                                  <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Eye className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="admin-button-primary"
                          >
                            {isSubmitting ? (
                              <div className="loading-spinner w-4 h-4 ml-2"></div>
                            ) : (
                              <Lock className="w-4 h-4 ml-2" />
                            )}
                            تحديث كلمة المرور
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        تفضيلات النظام
                      </h3>
                      <form onSubmit={handlePreferencesSubmit}>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              اللغة
                            </label>
                            <select
                              value={preferences.language}
                              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                              className="admin-select mt-1"
                            >
                              <option value="ar">العربية</option>
                              <option value="en">English</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              السمة
                            </label>
                            <select
                              value={preferences.theme}
                              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                              className="admin-select mt-1"
                            >
                              <option value="light">فاتح</option>
                              <option value="dark">داكن</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-6">
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
                            حفظ التفضيلات
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeTab === 'notifications' && (
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        إعدادات الإشعارات
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
                            <p className="text-sm text-gray-500">تلقي إشعارات عبر البريد الإلكتروني</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreferences({
                              ...preferences,
                              notifications: { ...preferences.notifications, email: !preferences.notifications.email }
                            })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                              preferences.notifications.email ? 'bg-primary-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                preferences.notifications.email ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">إشعارات المتصفح</h4>
                            <p className="text-sm text-gray-500">تلقي إشعارات في المتصفح</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreferences({
                              ...preferences,
                              notifications: { ...preferences.notifications, browser: !preferences.notifications.browser }
                            })}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                              preferences.notifications.browser ? 'bg-primary-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                preferences.notifications.browser ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          onClick={handlePreferencesSubmit}
                          disabled={isSubmitting}
                          className="admin-button-primary"
                        >
                          {isSubmitting ? (
                            <div className="loading-spinner w-4 h-4 ml-2"></div>
                          ) : (
                            <Save className="w-4 h-4 ml-2" />
                          )}
                          حفظ إعدادات الإشعارات
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default withAuth(Settings);