// Mind Voyage Companion - MongoDB Initialization Script
// This script sets up the database and user for the application

// Switch to the application database
db = db.getSiblingDB('mind_voyage_companion');

// Create application user with read/write permissions
db.createUser({
  user: process.env.MONGODB_USERNAME || 'mindvoyage_user',
  pwd: process.env.MONGODB_PASSWORD || 'mindvoyage_pass_2025',
  roles: [
    {
      role: 'readWrite',
      db: 'mind_voyage_companion'
    },
    {
      role: 'dbAdmin',
      db: 'mind_voyage_companion'
    }
  ]
});

// Create initial collections with validation schemas
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address'
        },
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'must be a string between 1-100 characters'
        },
        password: {
          bsonType: 'string',
          description: 'hashed password'
        },
        verified: {
          bsonType: 'bool',
          description: 'email verification status'
        },
        createdAt: {
          bsonType: 'date',
          description: 'user creation timestamp'
        }
      }
    }
  }
});

db.createCollection('habits', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'title', 'frequency', 'target', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'reference to user'
        },
        title: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100,
          description: 'habit title'
        },
        description: {
          bsonType: 'string',
          maxLength: 500,
          description: 'habit description'
        },
        createdAt: {
          bsonType: 'date',
          description: 'habit creation timestamp'
        }
      }
    }
  }
});

db.createCollection('habitlogs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'habitId', 'date', 'completed'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'reference to user'
        },
        habitId: {
          bsonType: 'objectId',
          description: 'reference to habit'
        },
        date: {
          bsonType: 'string',
          pattern: '^\\d{4}-\\d{2}-\\d{2}$',
          description: 'date in YYYY-MM-DD format'
        },
        completed: {
          bsonType: 'bool',
          description: 'completion status'
        }
      }
    }
  }
});

db.createCollection('journalentries', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'date', 'content'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'reference to user'
        },
        date: {
          bsonType: 'date',
          description: 'journal entry date'
        },
        content: {
          bsonType: 'string',
          minLength: 1,
          description: 'journal entry content'
        },
        mood: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5,
          description: 'mood rating 1-5'
        }
      }
    }
  }
});

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

db.habits.createIndex({ userId: 1 });
db.habits.createIndex({ userId: 1, createdAt: -1 });
db.habits.createIndex({ 'status.active': 1, 'status.archived': 1 });

db.habitlogs.createIndex({ userId: 1, habitId: 1, date: -1 });
db.habitlogs.createIndex({ habitId: 1, date: -1 });
db.habitlogs.createIndex({ userId: 1, date: -1 });

db.journalentries.createIndex({ userId: 1, date: -1 });
db.journalentries.createIndex({ userId: 1, createdAt: -1 });

// Create accounts collection for NextAuth
db.createCollection('accounts');
db.accounts.createIndex({ userId: 1 });
db.accounts.createIndex({ provider: 1, providerAccountId: 1 }, { unique: true });

// Create sessions collection for NextAuth
db.createCollection('sessions');
db.sessions.createIndex({ sessionToken: 1 }, { unique: true });
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('✅ Mind Voyage Companion database initialized successfully');
print('📊 Collections created: users, habits, habitlogs, journalentries, accounts, sessions');
print('🔐 User created:', process.env.MONGODB_USERNAME || 'mindvoyage_user');
print('📈 Indexes created for optimal performance');