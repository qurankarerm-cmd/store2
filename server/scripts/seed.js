const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Product = require('../models/Product');
const Review = require('../models/Review');
const AdminUser = require('../models/AdminUser');

// Sample data
const sampleProducts = [
  {
    name: "ميدالية مفاتيح قلب مخصصة",
    description: "ميدالية مفاتيح على شكل قلب مصنوعة من الطين البوليمر عالي الجودة. يمكن إضافة أي اسم أو تاريخ مهم بألوان جميلة ومتنوعة. مثالية كهدية للأحباء أو كذكرى خاصة.",
    price: "ابتداءً من 75 جنيه",
    category: "ميداليات مفاتيح",
    featured: true,
    customizable: true,
    minOrder: 1,
    processingTime: "3-5 أيام",
    tags: ["قلب", "مخصص", "هدية", "ذكرى"],
    images: [
      {
        filename: "keychain-heart-1.jpg",
        originalName: "ميدالية-قلب-1.jpg",
        path: "/uploads/keychain-heart-1.jpg",
        size: 145000,
        mimetype: "image/jpeg"
      }
    ]
  },
  {
    name: "مجموعة ورود ملونة للديكور",
    description: "مجموعة جميلة من الورود المصنوعة يدوياً من الطين البوليمر بألوان طبيعية ونابضة بالحياة. تحتوي المجموعة على 6 ورود بأحجام مختلفة مثالية لتزيين المنزل أو المكتب أو كهدية رومانسية.",
    price: "ابتداءً من 120 جنيه",
    category: "ديكورات",
    featured: true,
    customizable: true,
    minOrder: 1,
    processingTime: "5-7 أيام",
    tags: ["ورود", "ديكور", "ألوان", "رومانسي"],
    images: [
      {
        filename: "flowers-set-1.jpg",
        originalName: "مجموعة-ورود-1.jpg",
        path: "/uploads/flowers-set-1.jpg",
        size: 167000,
        mimetype: "image/jpeg"
      }
    ]
  },
  {
    name: "حامل أقلام مكتبي فريد",
    description: "حامل أقلام أنيق ومميز مصنوع من الطين البوليمر بتصميم عصري وعملي. يتسع لجميع أنواع الأقلام والأدوات المكتبية. يمكن تخصيصه بالاسم أو الشعار المطلوب. مثالي لطلاب الجامعة أو الموظفين.",
    price: "ابتداءً من 85 جنيه",
    category: "أدوات مكتبية",
    featured: false,
    customizable: true,
    minOrder: 1,
    processingTime: "3-5 أيام",
    tags: ["مكتب", "أقلام", "تنظيم", "عملي"],
    images: [
      {
        filename: "pen-holder-1.jpg",
        originalName: "حامل-أقلام-1.jpg",
        path: "/uploads/pen-holder-1.jpg",
        size: 134000,
        mimetype: "image/jpeg"
      }
    ]
  },
  {
    name: "مجموعة مغناطيس ثلاجة ملون",
    description: "مجموعة من 8 قطع مغناطيس ثلاجة بأشكال وألوان مختلفة ومرحة. مصنوعة من الطين البوليمر القوي والآمن. تضفي لمسة جميلة على مطبخك وتساعد في تنظيم الأوراق والمذكرات على الثلاجة.",
    price: "ابتداءً من 60 جنيه",
    category: "أدوات مطبخ",
    featured: false,
    customizable: false,
    minOrder: 1,
    processingTime: "2-4 أيام",
    tags: ["مطبخ", "مغناطيس", "ثلاجة", "ملون"],
    images: [
      {
        filename: "fridge-magnets-1.jpg",
        originalName: "مغناطيس-ثلاجة-1.jpg",
        path: "/uploads/fridge-magnets-1.jpg",
        size: 156000,
        mimetype: "image/jpeg"
      }
    ]
  },
  {
    name: "علبة مجوهرات صغيرة مزينة",
    description: "علبة مجوهرات صغيرة وأنيقة مزينة بزخارف جميلة من الطين البوليمر. مثالية لحفظ الخواتم والأقراط الصغيرة. يمكن تخصيصها بالاسم أو النقش المطلوب. هدية مثالية للفتيات والسيدات.",
    price: "ابتداءً من 110 جنيه",
    category: "إكسسوارات",
    featured: true,
    customizable: true,
    minOrder: 1,
    processingTime: "4-6 أيام",
    tags: ["مجوهرات", "علبة", "هدية", "أنيق"],
    images: [
      {
        filename: "jewelry-box-1.jpg",
        originalName: "علبة-مجوهرات-1.jpg",
        path: "/uploads/jewelry-box-1.jpg",
        size: 178000,
        mimetype: "image/jpeg"
      }
    ]
  },
  {
    name: "ميدالية مفاتيح دائرية مع نص",
    description: "ميدالية مفاتيح دائرية كلاسيكية مع إمكانية إضافة أي نص أو اسم باللغة العربية أو الإنجليزية. متوفرة بألوان متعددة وخطوط جميلة. سعر مناسب وجودة عالية.",
    price: "ابتداءً من 65 جنيه",
    category: "ميداليات مفاتيح",
    featured: false,
    customizable: true,
    minOrder: 1,
    processingTime: "2-4 أيام",
    tags: ["دائرة", "نص", "اسم", "كلاسيكي"],
    images: [
      {
        filename: "keychain-round-1.jpg",
        originalName: "ميدالية-دائرية-1.jpg",
        path: "/uploads/keychain-round-1.jpg",
        size: 142000,
        mimetype: "image/jpeg"
      }
    ]
  }
];

const sampleReviews = [
  {
    name: "فاطمة أحمد محمد",
    rating: 5,
    comment: "منتجات رائعة وجودة عالية جداً! استلمت ميدالية المفاتيح المخصصة وكانت أجمل من المتوقع. التفاصيل دقيقة والألوان جميلة جداً. التعامل راقي والتسليم في الوقت المحدد. بالتأكيد سأطلب مرة أخرى وأنصح الجميع بالتجربة!",
    product: "ميدالية مفاتيح قلب مخصصة",
    approved: true,
    verified: true,
    featured: true,
    contactMethod: "whatsapp",
    customerLocation: "القاهرة"
  },
  {
    name: "محمد سامي",
    rating: 5,
    comment: "خدمة ممتازة وسرعة في التنفيذ. طلبت هدية لزوجتي عبارة عن علبة مجوهرات مخصصة وكانت سعيدة جداً بها. التصميم راقي والخامة ممتازة. التعامل مع صاحبة المحل كان رائع ومتعاون جداً. أسعار معقولة مقارنة بالجودة العالية.",
    product: "علبة مجوهرات صغيرة مزينة",
    approved: true,
    verified: true,
    featured: true,
    contactMethod: "whatsapp",
    customerLocation: "الجيزة"
  },
  {
    name: "نورا المصري",
    rating: 5,
    comment: "أول مرة أطلب منتج مخصص وكانت التجربة رائعة! الصاحبة متعاونة جداً وصبورة في الشرح وساعدتني في اختيار الألوان والتصميم. المنتج النهائي كان أحلى مما تخيلت. مجموعة الورود جميلة جداً وألوانها طبيعية. شكراً لكم!",
    product: "مجموعة ورود ملونة للديكور",
    approved: true,
    verified: true,
    featured: true,
    contactMethod: "messenger",
    customerLocation: "الإسكندرية"
  },
  {
    name: "أحمد علي حسن",
    rating: 5,
    comment: "جودة صناعة ممتازة وحرفية عالية! طلبت حامل أقلام لمكتبي وجاء بتصميم مميز وألوان جميلة تناسب ديكور المكتب. الحجم مناسب ويتسع لجميع الأقلام. التسليم كان في الوقت المحدد والتعبئة ممتازة. أنصح بشدة!",
    product: "حامل أقلام مكتبي فريد",
    approved: true,
    verified: true,
    featured: false,
    contactMethod: "whatsapp",
    customerLocation: "القاهرة"
  },
  {
    name: "هند محمود",
    rating: 5,
    comment: "منتجات فريدة ومميزة جداً! استلمت مجموعة مغناطيس الثلاجة وكانت أجمل من الصور. كل قطعة مصنوعة بحب وعناية واضحة. الألوان زاهية والأشكال جميلة. أضافت لمسة حلوة جداً على مطبخي. سعر ممتاز مقابل الجودة. شكراً لكم!",
    product: "مجموعة مغناطيس ثلاجة ملون",
    approved: true,
    verified: true,
    featured: false,
    contactMethod: "whatsapp",
    customerLocation: "المنصورة"
  },
  {
    name: "سارة كامل",
    rating: 5,
    comment: "تجربة رائعة من البداية للنهاية! التواصل سهل والردود سريعة. المنتج وصل في حالة ممتازة ومعبأ بعناية كبيرة. ميدالية المفاتيح جميلة جداً والنقش واضح وأنيق. هدية مثالية! بالتأكيد سأكرر الطلب قريباً.",
    product: "ميدالية مفاتيح دائرية مع نص",
    approved: true,
    verified: true,
    featured: false,
    contactMethod: "whatsapp",
    customerLocation: "المنوفية"
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arabic-clay-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await Review.deleteMany({});
    
    // Don't clear admin users in case they exist
    console.log('📊 Existing data cleared');

    // Create sample products
    console.log('📦 Creating sample products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Add product IDs to some reviews
    const updatedReviews = sampleReviews.map((review, index) => {
      if (index < createdProducts.length) {
        return {
          ...review,
          productId: createdProducts[index]._id
        };
      }
      return review;
    });

    // Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const createdReviews = await Review.insertMany(updatedReviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);

    // Create default admin if none exists
    const adminExists = await AdminUser.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('👤 Creating default admin user...');
      
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const defaultAdmin = new AdminUser({
        username: 'admin',
        email: 'admin@amali-bilteen.com',
        password: hashedPassword,
        fullName: 'مدير النظام',
        role: 'admin',
        active: true
      });

      await defaultAdmin.save();
      console.log('✅ Default admin user created');
      console.log('📧 Username: admin');
      console.log('🔐 Password: admin123');
      console.log('⚠️  Please change the default password after first login!');
    } else {
      console.log('👤 Admin user already exists, skipping creation');
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Reviews: ${createdReviews.length}`);
    console.log('   Admin: 1 (admin/admin123)');
    console.log('\n🚀 You can now start the application!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Clear database function
const clearDatabase = async () => {
  try {
    console.log('🧹 Clearing database...');
    
    await Product.deleteMany({});
    await Review.deleteMany({});
    await AdminUser.deleteMany({});
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'clear':
      await clearDatabase();
      break;
    case 'seed':
    default:
      await seedDatabase();
      break;
  }
  
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { seedDatabase, clearDatabase };