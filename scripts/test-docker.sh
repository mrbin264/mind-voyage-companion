#!/bin/bash

# Mind Voyage Companion - Docker Test Script
# Test script to validate Docker setup and configuration

set -e

echo "🐳 Mind Voyage Companion - Docker Test Script"
echo "=============================================="

# Check Docker availability
echo "1. Checking Docker availability..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    echo "💡 Please start Docker Desktop and try again"
    exit 1
fi

echo "✅ Docker is available and running"

# Check Docker Compose
echo "2. Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose is available"

# Validate compose file
echo "3. Validating docker-compose.yml..."
if docker-compose config > /dev/null; then
    echo "✅ docker-compose.yml is valid"
else
    echo "❌ docker-compose.yml has errors"
    exit 1
fi

# Check environment file
echo "4. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    # Check for required variables
    required_vars=("MONGODB_URI" "NEXTAUTH_SECRET" "MONGODB_USERNAME" "MONGODB_PASSWORD")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env; then
            echo "  ✅ $var is configured"
        else
            echo "  ⚠️  $var is not configured"
        fi
    done
else
    echo "⚠️  .env file not found, using docker-compose defaults"
fi

# Test MongoDB startup
echo "5. Testing MongoDB startup..."
echo "Starting MongoDB container..."
if docker-compose up mongodb -d; then
    echo "✅ MongoDB container started"
    
    # Wait for MongoDB to be ready
    echo "Waiting for MongoDB to be ready..."
    timeout=60
    counter=0
    while [ $counter -lt $timeout ]; do
        if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            echo "✅ MongoDB is ready and responding"
            break
        fi
        sleep 2
        counter=$((counter + 2))
        echo "  Waiting... ($counter/${timeout}s)"
    done
    
    if [ $counter -ge $timeout ]; then
        echo "❌ MongoDB failed to start within ${timeout}s"
        echo "📋 MongoDB logs:"
        docker-compose logs mongodb
        exit 1
    fi
    
    # Test database connection
    echo "6. Testing database initialization..."
    if docker-compose exec -T mongodb mongosh mind_voyage_companion -u mindvoyage_user -p mindvoyage_pass_2025 --eval "db.runCommand('ping')" &> /dev/null; then
        echo "✅ Database connection successful"
        echo "✅ User authentication successful"
    else
        echo "❌ Database connection or authentication failed"
        exit 1
    fi
    
    # List collections
    echo "7. Checking database collections..."
    collections=$(docker-compose exec -T mongodb mongosh mind_voyage_companion -u mindvoyage_user -p mindvoyage_pass_2025 --eval "db.listCollectionNames()" --quiet)
    echo "✅ Collections created: $collections"
    
    # Test application build (development)
    echo "8. Testing application build (development)..."
    if docker-compose build app-dev; then
        echo "✅ Development build successful"
    else
        echo "❌ Development build failed"
        exit 1
    fi
    
    # Test application build (production)
    echo "9. Testing application build (production)..."
    if docker-compose build app; then
        echo "✅ Production build successful"
    else
        echo "❌ Production build failed"
        exit 1
    fi
    
    # Cleanup
    echo "10. Cleaning up test containers..."
    docker-compose down -v
    echo "✅ Cleanup completed"
    
else
    echo "❌ Failed to start MongoDB container"
    exit 1
fi

echo ""
echo "🎉 All Docker tests passed successfully!"
echo ""
echo "📚 Next steps:"
echo "  Development: docker-compose --profile development up -d"
echo "  Production:  docker-compose --profile production up -d"
echo "  Admin UI:    docker-compose --profile tools up mongo-express -d"
echo ""
echo "🔗 Access URLs:"
echo "  Application: http://localhost:3000"
echo "  Admin UI:    http://localhost:8081"
echo "  Health:      http://localhost:3000/api/health"
echo "  DB Health:   http://localhost:3000/api/health/db"