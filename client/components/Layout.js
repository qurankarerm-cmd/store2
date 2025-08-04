import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import WhatsAppFloat from './WhatsAppFloat'

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المنتجات', href: '/products' },
    { name: 'طلب خاص', href: '/custom-order' },
    { name: 'آراء العملاء', href: '/reviews' },
    { name: 'تواصل معنا', href: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-clay-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">ط</span>
                </div>
                <span className="text-xl font-bold gradient-text">أعمالي بالطين</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="mr-10 flex items-baseline space-x-4 space-x-reverse">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:bg-gray-100 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                aria-expanded="false"
              >
                <span className="sr-only">فتح القائمة الرئيسية</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:bg-gray-100 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center space-x-2 space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-clay-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">ط</span>
                </div>
                <span className="text-xl font-bold">أعمالي بالطين</span>
              </div>
              <p className="text-gray-300 text-sm">
                متجر متخصص في صناعة المنتجات اليدوية من الطين البوليمر. نقدم منتجات مخصصة وفريدة من نوعها بأعلى جودة وأفضل الأسعار.
              </p>
              <div className="flex space-x-6 space-x-reverse">
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <span className="sr-only">فيسبوك</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <span className="sr-only">إنستغرام</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.148-1.384C4.951 15.207 4.65 14.408 4.65 13.384c0-1.026.301-1.825.651-2.221.7-.893 1.851-1.384 3.148-1.384 1.297 0 2.448.49 3.148 1.384.35.396.651 1.195.651 2.221 0 1.024-.301 1.823-.651 2.22-.7.894-1.851 1.384-3.148 1.384zm7.718 0c-1.297 0-2.448-.49-3.148-1.384-.35-.397-.651-1.196-.651-2.22 0-1.026.301-1.825.651-2.221.7-.893 1.851-1.384 3.148-1.384 1.297 0 2.448.49 3.148 1.384.35.396.651 1.195.651 2.221 0 1.024-.301 1.823-.651 2.22-.7.894-1.851 1.384-3.148 1.384z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <span className="sr-only">تيك توك</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">روابط سريعة</h3>
                  <ul className="mt-4 space-y-4">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link href={item.href} className="text-base text-gray-300 hover:text-white transition-colors">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">خدماتنا</h3>
                  <ul className="mt-4 space-y-4">
                    <li><span className="text-base text-gray-300">منتجات مخصصة</span></li>
                    <li><span className="text-base text-gray-300">ميداليات مفاتيح</span></li>
                    <li><span className="text-base text-gray-300">هدايا فريدة</span></li>
                    <li><span className="text-base text-gray-300">تصاميم حسب الطلب</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2024 أعمالي بالطين. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <WhatsAppFloat />
    </div>
  )
}