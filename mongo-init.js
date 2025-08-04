// MongoDB initialization script for Docker container
// This script runs when the MongoDB container starts for the first time

// Switch to the Arabic Clay Store database
db = db.getSiblingDB('arabic-clay-store');

// Create a user for the application
db.createUser({
  user: 'arabic_clay_user',
  pwd: 'clay_store_password_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'arabic-clay-store'
    }
  ]
});

// Create collections with validation
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price', 'category'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name is required and must be a string'
        },
        description: {
          bsonType: 'string',
          description: 'Product description is required and must be a string'
        },
        price: {
          bsonType: 'string',
          description: 'Product price is required and must be a string'
        },
        category: {
          bsonType: 'string',
          enum: ['ميداليات مفاتيح', 'ديكورات', 'أدوات مكتبية', 'أدوات مطبخ', 'إكسسوارات', 'أخرى'],
          description: 'Category must be one of the specified values'
        },
        active: {
          bsonType: 'bool',
          description: 'Active status must be a boolean'
        },
        featured: {
          bsonType: 'bool',
          description: 'Featured status must be a boolean'
        }
      }
    }
  }
});

db.createCollection('reviews', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'rating', 'comment', 'product'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Customer name is required and must be a string'
        },
        rating: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5,
          description: 'Rating must be an integer between 1 and 5'
        },
        comment: {
          bsonType: 'string',
          description: 'Comment is required and must be a string'
        },
        product: {
          bsonType: 'string',
          description: 'Product name is required and must be a string'
        },
        approved: {
          bsonType: 'bool',
          description: 'Approved status must be a boolean'
        }
      }
    }
  }
});

db.createCollection('adminusers', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'email', 'password', 'fullName', 'role'],
      properties: {
        username: {
          bsonType: 'string',
          description: 'Username is required and must be a string'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        password: {
          bsonType: 'string',
          description: 'Password is required and must be a string'
        },
        fullName: {
          bsonType: 'string',
          description: 'Full name is required and must be a string'
        },
        role: {
          bsonType: 'string',
          enum: ['admin', 'moderator', 'editor'],
          description: 'Role must be one of: admin, moderator, editor'
        },
        active: {
          bsonType: 'bool',
          description: 'Active status must be a boolean'
        }
      }
    }
  }
});

// Create indexes for better performance
db.products.createIndex({ "name": "text", "description": "text", "category": "text" });
db.products.createIndex({ "category": 1, "active": 1 });
db.products.createIndex({ "featured": 1, "active": 1 });
db.products.createIndex({ "createdAt": -1 });

db.reviews.createIndex({ "approved": 1, "createdAt": -1 });
db.reviews.createIndex({ "rating": 1, "approved": 1 });
db.reviews.createIndex({ "productId": 1, "approved": 1 });

db.adminusers.createIndex({ "username": 1 }, { unique: true });
db.adminusers.createIndex({ "email": 1 }, { unique: true });
db.adminusers.createIndex({ "active": 1 });

print('✅ MongoDB initialization completed successfully!');
print('📦 Collections created: products, reviews, adminusers');
print('🔍 Indexes created for optimal performance');
print('👤 Application user created: arabic_clay_user');
print('🚀 Database ready for Arabic Clay Store!');