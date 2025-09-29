#!/bin/bash
# Mind Voyage Companion - MongoDB Docker Setup Script

echo "🐳 Mind Voyage Companion - MongoDB Docker Setup"
echo "=============================================="
echo

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to create data directory
create_data_dir() {
    if [ ! -d "./data/mongodb" ]; then
        mkdir -p ./data/mongodb
        echo "✅ Created MongoDB data directory"
    else
        echo "✅ MongoDB data directory exists"
    fi
}

# Function to check if .env.local exists
check_env() {
    if [ ! -f ".env.local" ]; then
        echo "⚠️  .env.local not found. Creating from template..."
        cp .env.docker .env.local
        echo "✅ Created .env.local from .env.docker template"
        echo "💡 Please review and update the credentials in .env.local"
    else
        echo "✅ .env.local exists"
    fi
}

# Main setup function
main() {
    echo "1. Checking Docker..."
    check_docker
    
    echo
    echo "2. Setting up data directory..."
    create_data_dir
    
    echo
    echo "3. Checking environment configuration..."
    check_env
    
    echo
    echo "4. Starting MongoDB with Docker Compose..."
    echo "   Command: docker compose up mongodb -d"
    
    if docker compose up mongodb -d; then
        echo "✅ MongoDB container started successfully"
        
        echo
        echo "5. Waiting for MongoDB to be ready..."
        echo "   This may take up to 60 seconds..."
        
        # Wait for MongoDB to be healthy
        timeout=60
        counter=0
        while [ $counter -lt $timeout ]; do
            if docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
                echo "✅ MongoDB is ready and accepting connections"
                break
            fi
            
            echo -n "."
            sleep 2
            counter=$((counter + 2))
        done
        
        if [ $counter -ge $timeout ]; then
            echo
            echo "⚠️  MongoDB might still be starting up. Check logs with:"
            echo "   docker compose logs mongodb"
        fi
        
        echo
        echo "🎉 MongoDB Setup Complete!"
        echo "================================"
        echo
        echo "📊 Connection Details:"
        echo "   MongoDB URL: mongodb://mindvoyage_user:mindvoyage_pass_2025@localhost:27017/mind_voyage_companion"
        echo "   Database: mind_voyage_companion"
        echo "   Port: 27017"
        echo
        echo "🔧 Useful Commands:"
        echo "   View logs:     docker compose logs mongodb"
        echo "   Stop MongoDB:  docker compose down mongodb"
        echo "   Restart:       docker compose restart mongodb"
        echo "   MongoDB shell: docker compose exec mongodb mongosh -u mindvoyage_user -p mindvoyage_pass_2025 --authenticationDatabase mind_voyage_companion"
        echo
        echo "🚀 Next Steps:"
        echo "   1. Update your .env.local file if needed"
        echo "   2. Start your Next.js app with: pnpm dev"
        echo "   3. Your app will connect to Docker MongoDB automatically"
        
    else
        echo "❌ Failed to start MongoDB container"
        echo "💡 Check the logs with: docker compose logs mongodb"
        exit 1
    fi
}

# Run main function
main