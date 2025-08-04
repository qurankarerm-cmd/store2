import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock featured products (will be replaced with API call)
  const mockProducts = [
    {
      id: 1,
      name: "ميدالية مفاتيح مخصصة",
      description: "ميدالية مفاتيح مصنوعة من الطين البوليمر مع إمكانية النقش حسب الطلب",
      price: "ابتداءً من 75 جنيه",
      category: "ميداليات مفاتيح",
      image: "/images/keychain-sample.jpg"
    },
    {
      id: 2,
      name: "مجموعة الورود الملونة",
      description: "مجموعة من الورود المصنوعة يدوياً بألوان مختلفة",
      price: "ابتداءً من 120 جنيه",
      category: "ديكورات",
      image: "/images/flowers-sample.jpg"
    },
    {
      id: 3,
      name: "حامل أقلام مخصص",
      description: "حامل أقلام فريد مصنوع من الطين البوليمر بتصميم مخصص",
      price: "ابتداءً من 95 جنيه",
      category: "أدوات مكتبية",
      image: "/images/pen-holder-sample.jpg"
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const whatsappNumber = "201234567890"
  const getWhatsAppUrl = (productName) => {
    const message = `السلام عليكم! أريد الاستفسار عن منتج: ${productName} 🌸`
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  return (
    <>
      <Head>
        <title>أعمالي بالطين - متجر المصنوعات اليدوية من الطين البوليمر</title>
        <meta name="description" content="متجر متخصص في صناعة المنتجات اليدوية الفريدة من الطين البوليمر. ميداليات مفاتيح، هدايا مخصصة، ومنتجات حسب الطلب." />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-clay-50 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="hero-title text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              أهلاً بكم في{' '}
              <span className="gradient-text">أعمالي بالطين</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              متجر متخصص في صناعة المنتجات اليدوية الفريدة من الطين البوليمر
              <br />
              منتجات مخصصة • جودة عالية • أسعار مناسبة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products" className="btn-primary">
                تصفح المنتجات
              </Link>
              <a 
                href={getWhatsAppUrl("الاستفسار العام")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                تواصل معنا عبر واتساب
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-slow"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-clay-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 left-1/4 w-16 h-16 bg-primary-300 rounded-full opacity-15 animate-bounce-slow"></div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              لماذا تختار منتجاتنا؟
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto">
              نحن متخصصون في صناعة المنتجات اليدوية من الطين البوليمر بأعلى جودة وأفضل الأسعار. 
              كل منتج مصنوع بحب وعناية فائقة ليكون فريداً ومميزاً.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">صناعة يدوية 100%</h3>
              <p className="text-gray-600">كل منتج مصنوع يدوياً بعناية فائقة ودقة في التفاصيل</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-clay-50 to-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-clay-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">تخصيص حسب الطلب</h3>
              <p className="text-gray-600">إمكانية تخصيص المنتجات حسب رغبتك وذوقك الشخصي</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">جودة مضمونة</h3>
              <p className="text-gray-600">نستخدم أفضل المواد لضمان متانة وجمال المنتج</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              منتجات مميزة
            </h2>
            <p className="text-lg text-gray-600">
              اكتشف مجموعة مختارة من أفضل منتجاتنا اليدوية
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="h-64 bg-gray-200 loading-pulse"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded loading-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded loading-pulse mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded loading-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden product-card">
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">صورة المنتج</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-clay-600">{product.price}</span>
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
                        </svg>
                        اطلب الآن
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary">
              عرض جميع المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-clay-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            هل تريد منتجاً مخصصاً؟
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            نحن نقوم بصناعة منتجات مخصصة حسب طلبك وذوقك الشخصي. 
            تواصل معنا الآن لمناقشة فكرتك!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-order" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
              معرفة المزيد عن الطلبات المخصصة
            </Link>
            <a
              href={getWhatsAppUrl("طلب مخصص")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
              </svg>
              تواصل معنا فوراً
            </a>
          </div>
        </div>
      </section>
    </>
  )
}