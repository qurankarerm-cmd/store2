import Head from 'next/head'
import { useState } from 'react'

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null)

  const whatsappNumber = "201234567890"
  const facebookMessenger = "amali.bilteen"
  const instagramUsername = "amali_bilteen"
  const facebookPage = "amali.bilteen"
  const tiktokUsername = "amali.bilteen"

  const whatsappUrl = () => {
    const message = "السلام عليكم! أريد الاستفسار عن منتجاتكم 🌸"
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  const messengerUrl = `https://m.me/${facebookMessenger}`
  const instagramUrl = `https://instagram.com/${instagramUsername}`
  const facebookUrl = `https://facebook.com/${facebookPage}`
  const tiktokUrl = `https://tiktok.com/@${tiktokUsername}`

  const contactMethods = [
    {
      name: "واتساب",
      description: "تواصل معنا فوراً عبر واتساب",
      icon: "whatsapp",
      url: whatsappUrl(),
      color: "bg-green-500 hover:bg-green-600",
      primary: true
    },
    {
      name: "ماسنجر",
      description: "راسلنا عبر فيسبوك ماسنجر",
      icon: "messenger",
      url: messengerUrl,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      name: "إنستغرام",
      description: "تابعنا واطلع على أعمالنا الجديدة",
      icon: "instagram",
      url: instagramUrl,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    },
    {
      name: "فيسبوك",
      description: "زر صفحتنا على فيسبوك",
      icon: "facebook",
      url: facebookUrl,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      name: "تيك توك",
      description: "شاهد فيديوهاتنا على تيك توك",
      icon: "tiktok",
      url: tiktokUrl,
      color: "bg-black hover:bg-gray-800"
    }
  ]

  const faqs = [
    {
      question: "كم يستغرق تنفيذ الطلب؟",
      answer: "المنتجات الجاهزة: 1-2 يوم عمل\nالمنتجات المخصصة: 3-7 أيام عمل\nالطلبات الكبيرة: 7-14 يوم عمل\n\nسنعلمك بالوقت المحدد عند تأكيد طلبك."
    },
    {
      question: "هل يمكنني تخصيص التصميم؟",
      answer: "بالطبع! نحن متخصصون في المنتجات المخصصة. يمكنك:\n• اختيار الألوان\n• إضافة نص أو اسم\n• تغيير الشكل والحجم\n• إضافة تفاصيل خاصة\n\nتواصل معنا لمناقشة فكرتك!"
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نحن نعمل بنظام الدفع عند الاستلام أو التحويل البنكي:\n• فودافون كاش\n• إنستاباي\n• تحويل بنكي\n• دفع نقدي عند الاستلام (داخل القاهرة)\n\nلا نقبل المدفوعات الإلكترونية عبر الموقع."
    },
    {
      question: "هل توجد خدمة توصيل؟",
      answer: "نعم، نوفر خدمة التوصيل:\n• القاهرة الكبرى: 25-50 جنيه\n• المحافظات: حسب الموقع\n• التوصيل المجاني للطلبات أكثر من 300 جنيه\n\nيمكن أيضاً الاستلام من مقر العمل بالتنسيق المسبق."
    },
    {
      question: "هل المنتجات آمنة ومتينة؟",
      answer: "بالطبع! نستخدم طين البوليمر عالي الجودة:\n• مقاوم للكسر والخدش\n• آمن للاستخدام اليومي\n• ألوان ثابتة لا تبهت\n• يمكن تنظيفه بسهولة\n\nجميع منتجاتنا تأتي مع ضمان ضد عيوب الصناعة."
    },
    {
      question: "هل يمكنني إلغاء أو تعديل طلبي؟",
      answer: "يمكن إلغاء أو تعديل الطلب:\n• قبل البدء في التنفيذ: مجاناً\n• بعد البدء في التنفيذ: حسب مرحلة الإنجاز\n• المنتجات المخصصة: صعب إلغاؤها بعد البدء\n\nيرجى التواصل معنا فوراً لأي تغيير مطلوب."
    },
    {
      question: "هل تقدمون دورات تعليمية؟",
      answer: "نعم! نقدم دورات تعليمية لصناعة الطين البوليمر:\n• ورش مبتدئين (4 ساعات)\n• دورات متقدمة (يومين)\n• جلسات خاصة للمجموعات\n\nتواصل معنا لمعرفة مواعيد الدورات القادمة والأسعار."
    },
    {
      question: "هل يمكنني شراء المواد الخام؟",
      answer: "نعم، نوفر مواد الطين البوليمر:\n• طين بوليمر بألوان مختلفة\n• أدوات التشكيل\n• ألوان وبودرة تلميع\n• إكسسوارات التزيين\n\nتواصل معنا لمعرفة المتاح والأسعار."
    }
  ]

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'whatsapp':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
          </svg>
        )
      case 'messenger':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.626 0 12-4.974 12-11.111C24 4.975 18.626 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.26L19.752 8l-6.561 6.963z"/>
          </svg>
        )
      case 'instagram':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        )
      case 'facebook':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        )
      case 'tiktok':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>تواصل معنا - أعمالي بالطين</title>
        <meta name="description" content="تواصل معنا عبر واتساب، فيسبوك، إنستغرام أو تيك توك. نجيب على استفساراتك ونساعدك في اختيار المنتج المناسب." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-clay-500 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              تواصل معنا
            </h1>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              نحن هنا لمساعدتك! تواصل معنا عبر الطريقة التي تناسبك
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Contact Methods */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              طرق التواصل
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${method.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center ${
                    method.primary ? 'ring-4 ring-green-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-center mb-4">
                    {getIcon(method.icon)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.name}</h3>
                  <p className="text-sm opacity-90">{method.description}</p>
                  {method.primary && (
                    <div className="mt-3 text-xs bg-white bg-opacity-20 rounded-full px-3 py-1 inline-block">
                      الطريقة المفضلة ⭐
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Contact Info */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">معلومات التواصل</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">واتساب</div>
                      <div className="text-gray-600" dir="ltr">+20 123 456 7890</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">فيسبوك</div>
                      <div className="text-gray-600">@amali.bilteen</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">إنستغرام</div>
                      <div className="text-gray-600">@amali_bilteen</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">ساعات العمل</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">السبت - الخميس</span>
                    <span className="font-medium text-gray-900">9:00 ص - 8:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الجمعة</span>
                    <span className="font-medium text-gray-900">2:00 م - 8:00 م</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-800 text-sm">
                      💡 نجيب على رسائل واتساب خلال دقائق معدودة!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              الأسئلة الشائعة
            </h2>
            <div className="max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-6 text-right focus:outline-none"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 text-right">
                        {faq.question}
                      </h3>
                      <div className={`mr-4 transform transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="pb-6">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 bg-gradient-to-r from-primary-500 to-clay-500 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              لم تجد إجابة لسؤالك؟
            </h2>
            <p className="text-white opacity-90 mb-6">
              تواصل معنا مباشرة وسنجيب على جميع استفساراتك بسرعة
            </p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
              </svg>
              تواصل معنا الآن
            </a>
          </div>
        </div>
      </div>
    </>
  )
}