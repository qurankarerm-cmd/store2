import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock reviews data (will be replaced with API call)
  const mockReviews = [
    {
      id: 1,
      name: "فاطمة أحمد",
      rating: 5,
      comment: "منتجات رائعة وجودة عالية جداً! استلمت ميدالية المفاتيح المخصصة وكانت أجمل من المتوقع. التفاصيل دقيقة والألوان جميلة. بالتأكيد سأطلب مرة أخرى!",
      product: "ميدالية مفاتيح مخصصة",
      date: "منذ أسبوعين",
      verified: true
    },
    {
      id: 2,
      name: "محمد س.",
      rating: 5,
      comment: "خدمة ممتازة وسرعة في التنفيذ. طلبت هدية لزوجتي وكانت سعيدة جداً بها. التعامل راقي والأسعار معقولة.",
      product: "علبة مجوهرات مخصصة",
      date: "منذ شهر",
      verified: true
    },
    {
      id: 3,
      name: "نورا المصري",
      rating: 5,
      comment: "أول مرة أطلب منتج مخصص وكانت التجربة رائعة! الصاحبة متعاونة جداً وصبورة في الشرح. المنتج النهائي كان أحلى مما تخيلت.",
      product: "مجموعة ديكور للمنزل",
      date: "منذ 3 أسابيع",
      verified: true
    },
    {
      id: 4,
      name: "أحمد علي",
      rating: 5,
      comment: "جودة صناعة ممتازة! طلبت حامل أقلام لمكتبي وجاء بتصميم مميز وألوان جميلة. التسليم كان في الوقت المحدد.",
      product: "حامل أقلام مكتبي",
      date: "منذ أسبوع",
      verified: true
    },
    {
      id: 5,
      name: "هند محمود",
      rating: 5,
      comment: "منتجات فريدة ومميزة! استلمت مجموعة مغناطيس الثلاجة وكانت أجمل من الصور. كل قطعة مصنوعة بحب وعناية واضحة.",
      product: "مجموعة مغناطيس ثلاجة",
      date: "منذ 10 أيام",
      verified: true
    },
    {
      id: 6,
      name: "سارة ك.",
      rating: 5,
      comment: "تجربة رائعة من البداية للنهاية! التواصل سهل والردود سريعة. المنتج وصل في حالة ممتازة ومعبأ بعناية.",
      product: "إكسسوارات مخصصة",
      date: "منذ 5 أيام",
      verified: true
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews)
      setLoading(false)
    }, 1000)
  }, [])

  const whatsappNumber = "201234567890"
  const reviewWhatsAppUrl = () => {
    const message = `السلام عليكم! أود إرسال تقييم عن منتجكم 🌸

📝 تفاصيل التقييم:
━━━━━━━━━━━━━━━━━━━
👤 الاسم: 
⭐ التقييم: /5
🛍️ المنتج المطلوب تقييمه: 
💬 التقييم: 

شكراً لكم على الجودة الممتازة! ❤️`
    
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <>
      <Head>
        <title>آراء العملاء - أعمالي بالطين</title>
        <meta name="description" content="اقرأ تقييمات وآراء عملائنا السعداء في منتجات الطين البوليمر اليدوية. تجارب حقيقية وتقييمات صادقة." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-clay-500 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              آراء عملائنا
            </h1>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              اكتشف ما يقوله عملاؤنا السعداء عن منتجاتنا وخدماتنا
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Statistics */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">{reviews.length}+</div>
                <div className="text-gray-600">عميل سعيد</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-primary-600">{averageRating}</span>
                  <div className="flex">
                    {renderStars(Math.round(parseFloat(averageRating)))}
                  </div>
                </div>
                <div className="text-gray-600">متوسط التقييم</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
                <div className="text-gray-600">رضا العملاء</div>
              </div>
            </div>
          </div>

          {/* Add Review CTA */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 mb-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              شارك تجربتك معنا! 
            </h2>
            <p className="text-green-100 mb-6">
              هل اشتريت منتجاً من متجرنا؟ نود أن نسمع رأيك وتقييمك
            </p>
            <a
              href={reviewWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-green-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
              </svg>
              أرسل تقييمك عبر واتساب
            </a>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full loading-pulse mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded loading-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded loading-pulse w-20"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded loading-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded loading-pulse mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded loading-pulse w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  {/* Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-clay-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{review.name}</h3>
                        {review.verified && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "{review.comment}"
                  </p>

                  {/* Product & Date */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-600 font-medium">{review.product}</span>
                      <span className="text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-16 bg-blue-50 rounded-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">لماذا يثق بنا عملاؤنا؟</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">جودة عالية</h3>
                <p className="text-blue-700 text-sm">منتجات مصنوعة بعناية ودقة</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">تسليم سريع</h3>
                <p className="text-blue-700 text-sm">التزام بمواعيد التسليم المحددة</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">تواصل ممتاز</h3>
                <p className="text-blue-700 text-sm">ردود سريعة وخدمة عملاء راقية</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2">ضمان الجودة</h3>
                <p className="text-blue-700 text-sm">ضمان على جميع منتجاتنا</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}