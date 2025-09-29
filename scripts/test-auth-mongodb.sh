#!/bin/bash
# Test script for authenticated journal API

echo "🧪 Testing MongoDB Authentication Setup"
echo "====================================="

# Test 1: Health Check
echo "1. Testing health endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/health)
echo "Health: $HEALTH" | jq .database.type

# Test 2: Auth Status
echo
echo "2. Testing auth session..."
AUTH_STATUS=$(curl -s http://localhost:3000/api/auth/session)
echo "Auth Status: $AUTH_STATUS" | jq .

# Test 3: Login (if needed)
echo
echo "3. Testing login..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tuan@example.com",
    "password": "TestPassword123!",
    "redirect": false
  }')
echo "Login Result: $LOGIN_RESULT"

# Test 4: Test Journal Creation (should work now)
echo
echo "4. Testing journal creation..."
JOURNAL_RESULT=$(curl -s -X POST http://localhost:3000/api/journal \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test journal entry from script",
    "mood": 4,
    "tags": ["test", "mongodb", "development"]
  }')
echo "Journal Result: $JOURNAL_RESULT" | jq .

echo
echo "🎉 Test complete!"