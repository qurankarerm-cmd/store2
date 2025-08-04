import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('الكل')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock products data (will be replaced with API call)
  const mockProducts = [
    {
      id: 1,
      name: "ميدالية مفاتيح مخصصة",
      description: "ميدالية مفاتيح مصنوعة من الطين البوليمر مع إمكانية النقش حسب الطلب. يمكن إضافة أي اسم أو رسالة مميزة.",
      price: "ابتداءً من 75 جنيه",
      category: "ميداليات مفاتيح",
      image: "/images/keychain-1.jpg"
    },
    {
      id: 2,
      name: "مجموعة الورود الملونة",
      description: "مجموعة من الورود المصنوعة يدوياً بألوان مختلفة ومتنوعة. مثالية للديكور أو كهدية رومانسية.",
      price: "ابتداءً من 120 جنيه",
      category: "ديكورات",
      image: "/images/flowers-1.jpg"
    },
    {
      id: 3,
      name: "حامل أقلام مخصص",
      description: "حامل أقلام فريد مصنوع من الطين البوليمر بتصميم مخصص. يمكن إضافة اسم أو شعار شخصي.",
      price: "ابتداءً من 95 جنيه",
      category: "أدوات مكتبية",
      image: "/images/pen-holder-1.jpg"
    },
    {
      id: 4,
      name: "ميدالية مفاتيح قلب",
      description: "ميدالية مفاتيح على شكل قلب مع إمكانية إضافة أسماء أو تاريخ مهم. مثالية للأزواج والمحبين.",
      price: "ابتداءً من 80 جنيه",
      category: "ميداليات مفاتيح",
      image: "/images/keychain-heart.jpg"
    },
    {
      id: 5,
      name: "مجموعة أكواب القهوة المزينة",
      description: "أكواب قهوة مزينة بالطين البوليمر بتصاميم فريدة وألوان جذابة.",
      price: "ابتداءً من 150 جنيه",
      category: "أدوات مطبخ",
      image: "/images/coffee-cups.jpg"
    },
    {
      id: 6,
      name: "لوحة ديكور شخصية",
      description: "لوحة ديكور مصنوعة من الطين البوليمر مع إمكانية التخصيص بالاسم أو الرسالة المفضلة.",
      price: "ابتداءً من 200 جنيه",
      category: "ديكورات",
      image: "/images/wall-decor.jpg"
    },
    {
      id: 7,
      name: "مجموعة مغناطيس الثلاجة",
      description: "مجموعة مغناطيس ثلاجة ملونة بأشكال وتصاميم مختلفة. مثالية لتزيين المطبخ.",
      price: "ابتداءً من 60 جنيه",
      category: "أدوات مطبخ",
      image: "/images/fridge-magnets.jpg"
    },
    {
      id: 8,
      name: "علبة مجوهرات مخصصة",
      description: "علبة مجوهرات صغيرة مزينة بالطين البوليمر. يمكن تخصيصها بالاسم أو التصميم المفضل.",
      price: "ابتداءً من 180 جنيه",
      category: "إكسسوارات",
      image: "/images/jewelry-box.jpg"
    }
  ]

  const categories = ['الكل', 'ميداليات مفاتيح', 'ديكورات', 'أدوات مكتبية', 'أدوات مطبخ', 'إكسسوارات']

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)
  }, [])

  const whatsappNumber = "201234567890"
  const getWhatsAppUrl = (productName) => {
    const message = `السلام عليكم! أريد الاستفسار عن منتج: ${productName} 🌸

المنتج: ${productName}
أريد معرفة:
- السعر النهائي
- مدة التنفيذ
- إمكانية التخصيص

شكراً لكم 💜`
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'الكل' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Head>
        <title>المنتجات - أعمالي بالطين</title>
        <meta name="description" content="تصفح مجموعة منتجاتنا المتنوعة من المصنوعات اليدوية من الطين البوليمر. ميداليات مفاتيح، ديكورات، وهدايا مخصصة." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-500 to-clay-500 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              معرض منتجاتنا
            </h1>
            <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
              اكتشف مجموعتنا المتنوعة من المنتجات اليدوية المصنوعة بحب وعناية من الطين البوليمر
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filters */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="البحث في المنتجات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.844-6.314-2.246M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">لم نجد أي منتجات تطابق معايير البحث الخاصة بك.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden product-card">
                  {/* Product Image */}
                  <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative group">
                    <div className="text-gray-400 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">صورة المنتج</p>
                    </div>
                    
                    {/* Quick Order Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
                        </svg>
                        اطلب سريع
                      </a>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{product.name}</h3>
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mr-2 whitespace-nowrap">
                        {product.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-clay-600">{product.price}</span>
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488"/>
                        </svg>
                        اطلب
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              عرض {filteredProducts.length} من أصل {products.length} منتج
            </div>
          )}
        </div>
      </div>
    </>
  )
}