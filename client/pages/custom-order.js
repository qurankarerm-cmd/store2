import Head from 'next/head'
import { useState } from 'react'

export default function CustomOrder() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    productType: '',
    description: '',
    colors: '',
    quantity: '',
    customText: '',
    deadline: '',
    budget: '',
    contactMethod: 'whatsapp'
  })

  const whatsappNumber = "201234567890"
  
  const steps = [
    {
      id: 1,
      title: "نوع المنتج",
      description: "حدد نوع المنتج الذي تريده"
    },
    {
      id: 2,
      title: "التفاصيل",
      description: "أضف تفاصيل التصميم والألوان"
    },
    {
      id: 3,
      title: "المعلومات الإضافية",
      description: "الكمية والميزانية والتوقيت"
    },
    {
      id: 4,
      title: "إرسال الطلب",
      description: "مراجعة وإرسال طلبك"
    }
  ]

  const productTypes = [
    { id: 'keychain', name: 'ميدالية مفاتيح', icon: '🔑', description: 'ميداليات مفاتيح مخصصة بأشكال وألوان مختلفة' },
    { id: 'decoration', name: 'قطع ديكور', icon: '🏠', description: 'قطع ديكور للمنزل أو المكتب' },
    { id: 'jewelry', name: 'إكسسوارات', icon: '💍', description: 'أساور، قلادات، وخواتم' },
    { id: 'kitchen', name: 'أدوات مطبخ', icon: '🍽️', description: 'أكواب، صحون مزينة، ومغناطيس ثلاجة' },
    { id: 'office', name: 'أدوات مكتبية', icon: '📝', description: 'حامل أقلام، مساند، وملحقات مكتب' },
    { id: 'gift', name: 'هدايا مناسبات', icon: '🎁', description: 'هدايا مخصصة للمناسبات الخاصة' },
    { id: 'other', name: 'أخرى', icon: '✨', description: 'أي فكرة أخرى تريد تنفيذها' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateWhatsAppMessage = () => {
    const selectedProduct = productTypes.find(p => p.id === formData.productType)
    
    const message = `السلام عليكم! أود عمل طلب خاص: 🌸

📋 تفاصيل الطلب:
━━━━━━━━━━━━━━━━━━━
🔹 نوع المنتج: ${selectedProduct ? selectedProduct.name : 'غير محدد'}
🔹 وصف التصميم: ${formData.description || 'سيتم مناقشته'}
🔹 الألوان المطلوبة: ${formData.colors || 'سيتم مناقشتها'}
🔹 النص المطلوب (إن وجد): ${formData.customText || 'لا يوجد'}
🔹 الكمية: ${formData.quantity || 'قطعة واحدة'}
🔹 الميزانية المتوقعة: ${formData.budget || 'مرنة'}
🔹 التوقيت المطلوب: ${formData.deadline || 'غير محدد'}

💬 ملاحظات إضافية:
${formData.description ? `التفاصيل: ${formData.description}` : 'لا توجد ملاحظات إضافية'}

أتطلع لسماع رأيكم وتكلفة هذا المنتج المخصص ❤️

شكراً لكم! 🙏`

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.productType !== ''
      case 2:
        return formData.description !== '' || formData.colors !== ''
      case 3:
        return true // This step is optional
      default:
        return true
    }
  }

  return (
    <>
      <Head>
        <title>طلب خاص - أعمالي بالطين</title>
        <meta name="description" content="اطلب منتجاً مخصصاً من الطين البوليمر حسب تصميمك ومتطلباتك الخاصة. خدمة التخصيص الكامل متاحة." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-clay-500 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              طلب منتج مخصص
            </h1>
            <p className="text-xl text-white opacity-90">
              احصل على منتج فريد مصنوع خصيصاً لك من الطين البوليمر
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                    currentStep >= step.id 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-medium mb-1 ${
                      currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-full h-0.5 mt-5 ${
                      currentStep > step.id ? 'bg-primary-500' : 'bg-gray-200'
                    }`} style={{position: 'absolute', top: '20px', left: '50%', right: '-50%', zIndex: -1}} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Step 1: Product Type */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">اختر نوع المنتج</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productTypes.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleInputChange('productType', product.id)}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        formData.productType === product.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="text-3xl mb-3">{product.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">تفاصيل التصميم</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف التصميم المطلوب *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="اوصف التصميم الذي تريده بالتفصيل..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الألوان المطلوبة
                    </label>
                    <input
                      type="text"
                      value={formData.colors}
                      onChange={(e) => handleInputChange('colors', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="مثلاً: أزرق، وردي، ذهبي..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نص أو اسم للنقش (اختياري)
                    </label>
                    <input
                      type="text"
                      value={formData.customText}
                      onChange={(e) => handleInputChange('customText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="الاسم أو النص المراد نقشه..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات إضافية</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الكمية المطلوبة
                    </label>
                    <input
                      type="text"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="مثلاً: 1، 5، 10..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الميزانية المتوقعة
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="مثلاً: 100-200 جنيه"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التوقيت المطلوب
                    </label>
                    <input
                      type="text"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      placeholder="مثلاً: خلال أسبوع، لا يوجد عجلة..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review and Send */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">مراجعة الطلب</h2>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ملخص طلبك:</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">نوع المنتج: </span>
                      <span className="text-gray-900">
                        {productTypes.find(p => p.id === formData.productType)?.name || 'غير محدد'}
                      </span>
                    </div>
                    {formData.description && (
                      <div>
                        <span className="font-medium text-gray-700">الوصف: </span>
                        <span className="text-gray-900">{formData.description}</span>
                      </div>
                    )}
                    {formData.colors && (
                      <div>
                        <span className="font-medium text-gray-700">الألوان: </span>
                        <span className="text-gray-900">{formData.colors}</span>
                      </div>
                    )}
                    {formData.customText && (
                      <div>
                        <span className="font-medium text-gray-700">النص المطلوب: </span>
                        <span className="text-gray-900">{formData.customText}</span>
                      </div>
                    )}
                    {formData.quantity && (
                      <div>
                        <span className="font-medium text-gray-700">الكمية: </span>
                        <span className="text-gray-900">{formData.quantity}</span>
                      </div>
                    )}
                    {formData.budget && (
                      <div>
                        <span className="font-medium text-gray-700">الميزانية: </span>
                        <span className="text-gray-900">{formData.budget}</span>
                      </div>
                    )}
                    {formData.deadline && (
                      <div>
                        <span className="font-medium text-gray-700">التوقيت: </span>
                        <span className="text-gray-900">{formData.deadline}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
                    </svg>
                    إرسال الطلب عبر واتساب
                  </a>
                  <p className="text-sm text-gray-600 mt-4">
                    سيتم فتح تطبيق واتساب مع رسالة تحتوي على تفاصيل طلبك
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                السابق
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isStepValid()
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-colors duration-200"
                >
                  طلب جديد
                </button>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 نصائح للحصول على أفضل نتيجة:</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>كن مفصلاً في وصف التصميم المطلوب</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>يمكنك إرسال صور مرجعية عبر واتساب لتوضيح فكرتك</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>حدد الألوان بدقة أو اذكر أنك مفتوح للاقتراحات</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>المنتجات المخصصة تحتاج وقت أطول للتنفيذ (عادة 3-7 أيام)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}