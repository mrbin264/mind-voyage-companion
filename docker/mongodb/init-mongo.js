// MongoDB Initialization Script for Docker
// Generic setup for Next.js + MongoDB boilerplate

// Switch to application database
db = db.getSiblingDB(process.env.MONGODB_DATABASE || 'app_db')

// Create application user with read/write permissions
db.createUser({
  user: process.env.MONGODB_USERNAME || 'app_user',
  pwd: process.env.MONGODB_PASSWORD || 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGODB_DATABASE || 'app_db',
    },
    {
      role: 'dbAdmin',
      db: process.env.MONGODB_DATABASE || 'app_db',
    },
  ],
})

// Create users collection with basic validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address',
        },
        name: {
          bsonType: 'string',
          description: 'user name',
        },
        password: {
          bsonType: 'string',
          description: 'hashed password',
        },
        createdAt: {
          bsonType: 'date',
          description: 'user creation timestamp',
        },
      },
    },
  },
})

// Create NextAuth collections
db.createCollection('accounts')
db.createCollection('sessions')
db.createCollection('verificationtokens')

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// NextAuth indexes
db.accounts.createIndex({ userId: 1 })
db.accounts.createIndex({ provider: 1, providerAccountId: 1 }, { unique: true })

db.sessions.createIndex({ sessionToken: 1 }, { unique: true })
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 })

db.verificationtokens.createIndex({ identifier: 1, token: 1 }, { unique: true })
db.verificationtokens.createIndex({ expires: 1 }, { expireAfterSeconds: 0 })

print('✅ Database initialized successfully')
print('📊 Collections created: users, accounts, sessions, verificationtokens')
print('🔐 User created:', process.env.MONGODB_USERNAME || 'app_user')
print('📈 Indexes created for optimal performance')
