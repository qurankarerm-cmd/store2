#!/bin/bash

# Docker Setup Script for Arabic Clay Store
# This script helps you get started with Docker quickly

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Header
echo -e "${CYAN}"
echo "🌟 مرحباً بك في إعداد Docker لمتجر أعمالي بالطين! 🌟"
echo "Arabic Polymer Clay Store - Docker Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${NC}"

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_info "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        print_info "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "Docker and Docker Compose are installed!"
}

# Check if Docker daemon is running
check_docker_daemon() {
    print_status "Checking Docker daemon..."
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker daemon is running!"
}

# Display menu
show_menu() {
    echo ""
    print_info "Choose an option:"
    echo "1) 🚀 Production Setup (Build and run all services)"
    echo "2) 🔧 Development Setup (With hot reload)"
    echo "3) 🧹 Clean Up (Remove all containers and volumes)"
    echo "4) 📊 View Logs"
    echo "5) 🔍 Check Status"
    echo "6) 🛑 Stop All Services"
    echo "7) ❌ Exit"
    echo ""
}

# Production setup
production_setup() {
    print_status "Setting up production environment..."
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose up --build -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Production environment is ready!"
        echo ""
        print_info "Services are available at:"
        echo "🌐 Public Website: http://localhost:3000"
        echo "🔧 Admin Dashboard: http://localhost:3001"
        echo "🔌 API Server: http://localhost:5000"
        echo "🗄️  MongoDB: localhost:27017"
        echo ""
        print_info "Default admin credentials:"
        echo "Username: admin"
        echo "Password: admin123"
        print_warning "Please change the default password after first login!"
    else
        print_error "Some services failed to start. Check logs with option 4."
    fi
}

# Development setup
development_setup() {
    print_status "Setting up development environment..."
    
    # Build and start services with development configuration
    print_status "Building and starting development services..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        print_success "Development environment is ready!"
        echo ""
        print_info "Services are available at:"
        echo "🌐 Public Website: http://localhost:3000 (with hot reload)"
        echo "🔧 Admin Dashboard: http://localhost:3001 (with hot reload)"
        echo "🔌 API Server: http://localhost:5000 (with hot reload)"
        echo "🗄️  MongoDB: localhost:27017"
        echo ""
        print_info "Development features:"
        echo "• Hot reload for all services"
        echo "• Source code mounted as volumes"
        echo "• Development dependencies included"
    else
        print_error "Some services failed to start. Check logs with option 4."
    fi
}

# Clean up
cleanup() {
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        
        # Stop and remove production containers
        docker-compose down -v --remove-orphans 2>/dev/null || true
        
        # Stop and remove development containers
        docker-compose -f docker-compose.dev.yml down -v --remove-orphans 2>/dev/null || true
        
        # Remove images
        docker rmi $(docker images "arabic-clay*" -q) 2>/dev/null || true
        
        # Remove volumes
        docker volume rm arabic_clay_mongodb_data 2>/dev/null || true
        docker volume rm arabic_clay_uploads_data 2>/dev/null || true
        docker volume rm arabic_clay_mongodb_dev_data 2>/dev/null || true
        docker volume rm arabic_clay_uploads_dev_data 2>/dev/null || true
        
        # Remove networks
        docker network rm arabic-clay-network 2>/dev/null || true
        docker network rm arabic-clay-dev-network 2>/dev/null || true
        
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled."
    fi
}

# View logs
view_logs() {
    echo ""
    print_info "Choose logs to view:"
    echo "1) All services"
    echo "2) MongoDB"
    echo "3) Server (API)"
    echo "4) Client (Public Website)"
    echo "5) Admin Dashboard"
    echo "6) Back to main menu"
    echo ""
    
    read -p "Enter your choice [1-6]: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f ;;
        2) docker-compose logs -f mongodb ;;
        3) docker-compose logs -f server ;;
        4) docker-compose logs -f client ;;
        5) docker-compose logs -f admin ;;
        6) return ;;
        *) print_error "Invalid option!" ;;
    esac
}

# Check status
check_status() {
    print_status "Checking service status..."
    echo ""
    
    echo "📊 Production Services:"
    docker-compose ps 2>/dev/null || echo "No production services running"
    
    echo ""
    echo "🔧 Development Services:"
    docker-compose -f docker-compose.dev.yml ps 2>/dev/null || echo "No development services running"
    
    echo ""
    echo "💾 Docker Volumes:"
    docker volume ls | grep arabic_clay || echo "No volumes found"
    
    echo ""
    echo "🌐 Docker Networks:"
    docker network ls | grep arabic-clay || echo "No networks found"
}

# Stop services
stop_services() {
    print_status "Stopping all services..."
    
    # Stop production services
    docker-compose down 2>/dev/null || true
    
    # Stop development services
    docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
    
    print_success "All services stopped!"
}

# Main script
main() {
    check_docker
    check_docker_daemon
    
    while true; do
        show_menu
        read -p "Enter your choice [1-7]: " choice
        
        case $choice in
            1) production_setup ;;
            2) development_setup ;;
            3) cleanup ;;
            4) view_logs ;;
            5) check_status ;;
            6) stop_services ;;
            7) 
                print_info "Goodbye! 👋"
                exit 0 
                ;;
            *) 
                print_error "Invalid option! Please choose 1-7." 
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Handle Ctrl+C
trap 'echo -e "\n${YELLOW}⚠️  Script interrupted by user${NC}"; exit 130' INT

# Run main function
main