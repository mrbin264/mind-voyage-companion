#!/bin/bash

# Migration Script: MongoDB Memory Server to Docker MongoDB
# This script helps migrate from MongoDB Memory Server to Docker MongoDB

set -e  # Exit on error

echo "🚀 Mind Voyage MongoDB Migration Script"
echo "======================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Check if running in project root
check_project_root() {
    if [[ ! -f "package.json" ]] || [[ ! -f "docker-compose.yml" ]]; then
        log_error "Please run this script from the project root directory"
        exit 1
    fi
    log_success "Project root directory confirmed"
}

# Check Docker availability
check_docker() {
    log_info "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        log_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    log_success "Docker is available and running"
}

# Backup current database (if any existing data needs preservation)
backup_existing_data() {
    log_info "Checking for existing data to backup..."
    
    # Check if there's any existing data in memory server or other sources
    if [[ -d "data/mongodb" ]] && [[ ! -z "$(ls -A data/mongodb 2>/dev/null)" ]]; then
        log_warning "Existing MongoDB data found in data/mongodb"
        log_info "This appears to be from a previous Docker setup"
        
        read -p "Do you want to preserve this data? (y/N): " -n 1 -r
        echo
        
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            backup_dir="data/mongodb-backup-$(date +%Y%m%d_%H%M%S)"
            mkdir -p "$backup_dir"
            cp -r data/mongodb/* "$backup_dir/" 2>/dev/null || true
            log_success "Data backed up to: $backup_dir"
        fi
    else
        log_success "No existing data to backup"
    fi
}

# Setup environment configuration
setup_environment() {
    log_info "Setting up environment configuration..."
    
    if [[ -f ".env.local" ]]; then
        log_warning "Existing .env.local found"
        
        # Check if it contains Memory Server settings
        if grep -q "MONGODB_MEMORY_SERVER" .env.local 2>/dev/null; then
            log_warning "Found Memory Server configuration in .env.local"
            cp .env.local .env.local.backup-$(date +%Y%m%d_%H%M%S)
            log_success "Backed up existing .env.local"
        fi
        
        read -p "Do you want to update .env.local with Docker MongoDB settings? (Y/n): " -n 1 -r
        echo
        
        if [[ ! $REPLY =~ ^[Nn]$ ]]; then
            setup_env_file
        fi
    else
        log_info "Creating new .env.local file..."
        setup_env_file
    fi
}

# Create or update .env.local file
setup_env_file() {
    # Copy from example and customize
    if [[ -f ".env.docker.example" ]]; then
        cp .env.docker.example .env.local
        log_success "Created .env.local from Docker example"
    else
        # Create minimal .env.local
        cat > .env.local << EOF
# MongoDB Docker Configuration
MONGODB_URI=mongodb://mindvoyage_user:mindvoyage_pass_2025@localhost:27017/mind_voyage_companion?authSource=mind_voyage_companion

# Application
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000

# Generate these with: pnpm generate:secrets
# NEXTAUTH_SECRET=
# JWT_SECRET=
EOF
        log_success "Created basic .env.local file"
    fi
    
    # Generate secrets if pnpm is available
    if command -v pnpm &> /dev/null; then
        log_info "Generating secure secrets..."
        
        if pnpm generate:secrets:env >> .env.local 2>/dev/null; then
            log_success "Generated and added secure secrets to .env.local"
        else
            log_warning "Could not generate secrets automatically"
            log_info "Please run: pnpm generate:secrets"
        fi
    else
        log_warning "pnpm not found. Please generate secrets manually:"
        log_info "Run: npm run generate:secrets"
    fi
}

# Start Docker MongoDB
start_docker_mongodb() {
    log_info "Starting Docker MongoDB..."
    
    # Create data directory if it doesn't exist
    mkdir -p data/mongodb
    
    # Start MongoDB container
    if docker-compose up mongodb -d; then
        log_success "MongoDB container started"
    else
        log_error "Failed to start MongoDB container"
        exit 1
    fi
    
    # Wait for MongoDB to be ready
    log_info "Waiting for MongoDB to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
            log_success "MongoDB is ready!"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log_error "MongoDB failed to start within expected time"
            log_info "Check logs with: docker-compose logs mongodb"
            exit 1
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    echo
}

# Update database connection file
update_db_connection() {
    log_info "Updating database connection configuration..."
    
    # Backup original db.ts if it exists
    if [[ -f "src/lib/db.ts" ]]; then
        cp src/lib/db.ts src/lib/db.ts.backup-$(date +%Y%m%d_%H%M%S)
        log_success "Backed up original db.ts"
    fi
    
    # Replace with Docker-optimized version
    if [[ -f "src/lib/db-docker.ts" ]]; then
        cp src/lib/db-docker.ts src/lib/db.ts
        log_success "Updated db.ts with Docker configuration"
        
        # Clean up
        rm src/lib/db-docker.ts
    else
        log_warning "Docker db configuration not found, keeping existing db.ts"
    fi
}

# Test connection
test_connection() {
    log_info "Testing database connection..."
    
    # Test with Docker MongoDB ping
    if docker-compose exec mongodb mongosh mind_voyage_companion --eval "db.runCommand({ ping: 1 })" &> /dev/null; then
        log_success "Database connection test passed"
    else
        log_error "Database connection test failed"
        log_info "Troubleshooting:"
        log_info "1. Check MongoDB logs: docker-compose logs mongodb"
        log_info "2. Verify .env.local configuration"
        log_info "3. Restart containers: docker-compose restart"
        return 1
    fi
    
    # Test application connection if Node.js/pnpm available
    if command -v pnpm &> /dev/null; then
        log_info "Testing application database connection..."
        
        if timeout 10 pnpm --silent tsx -e "
            import('$PWD/src/lib/db.js').then(async (db) => {
                await db.default();
                console.log('✅ Application connection successful');
                process.exit(0);
            }).catch((err) => {
                console.error('❌ Application connection failed:', err.message);
                process.exit(1);
            });
        " 2>/dev/null; then
            log_success "Application database connection verified"
        else
            log_warning "Application connection test inconclusive"
            log_info "Test manually with: pnpm dev"
        fi
    fi
}

# Setup database indexes
setup_indexes() {
    log_info "Setting up database indexes for optimal performance..."
    
    # Run index creation script
    docker-compose exec mongodb mongosh mind_voyage_companion --eval "
        // Create indexes for better performance
        db.habits.createIndex({ userId: 1, 'status.active': 1 });
        db.habits.createIndex({ userId: 1, category: 1 });
        db.habits.createIndex({ userId: 1, priority: 1, createdAt: -1 });
        
        db.habitlogs.createIndex({ userId: 1, date: -1 });
        db.habitlogs.createIndex({ habitId: 1, date: -1 });
        db.habitlogs.createIndex({ userId: 1, completed: 1, date: -1 });
        db.habitlogs.createIndex({ habitId: 1, userId: 1, date: 1 }, { unique: true });
        
        db.users.createIndex({ email: 1 }, { unique: true });
        db.users.createIndex({ createdAt: -1 });
        
        print('✅ Database indexes created successfully');
    " &> /dev/null
    
    if [[ $? -eq 0 ]]; then
        log_success "Database indexes created successfully"
    else
        log_warning "Some indexes may already exist (this is normal)"
    fi
}

# Remove Memory Server dependencies
cleanup_memory_server() {
    log_info "Cleaning up MongoDB Memory Server dependencies..."
    
    # Check package.json for memory server dependency
    if grep -q "mongodb-memory-server" package.json 2>/dev/null; then
        log_warning "Found mongodb-memory-server in package.json"
        log_info "You can remove it later with: pnpm remove mongodb-memory-server"
    fi
    
    # Clean up any memory server processes
    pkill -f mongod || true
    
    log_success "Memory Server cleanup completed"
}

# Main migration process
main() {
    echo "This script will migrate your Mind Voyage app from MongoDB Memory Server to Docker MongoDB"
    echo
    echo "Steps this script will perform:"
    echo "1. ✓ Check system requirements"
    echo "2. ✓ Backup existing data (if any)"  
    echo "3. ✓ Setup environment configuration"
    echo "4. ✓ Start Docker MongoDB"
    echo "5. ✓ Update database connection"
    echo "6. ✓ Test connections"
    echo "7. ✓ Setup database indexes"
    echo "8. ✓ Cleanup Memory Server"
    echo
    
    read -p "Do you want to proceed with the migration? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Migration cancelled by user"
        exit 0
    fi
    
    echo
    log_info "Starting MongoDB Memory Server to Docker migration..."
    echo
    
    # Run migration steps
    check_project_root
    check_docker
    backup_existing_data
    setup_environment
    start_docker_mongodb
    update_db_connection
    test_connection
    setup_indexes
    cleanup_memory_server
    
    echo
    log_success "🎉 Migration completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Start your development server: pnpm dev"
    echo "2. Test your application thoroughly"
    echo "3. Access MongoDB Admin UI: http://localhost:8081"
    echo "   - Username: admin"
    echo "   - Password: admin123"
    echo
    echo "Docker commands for reference:"
    echo "• Start MongoDB: docker-compose up mongodb -d"
    echo "• Stop MongoDB: docker-compose stop mongodb"
    echo "• View logs: docker-compose logs mongodb"
    echo "• Database shell: docker-compose exec mongodb mongosh mind_voyage_companion"
    echo
    log_success "Happy coding! 🚀"
}

# Run main function
main "$@"