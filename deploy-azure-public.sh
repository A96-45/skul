#!/bin/bash

# Skola PWA Deployment to Azure Container Instances (Public Access)
# This script deploys your PWA to Azure so anyone can access it from anywhere

set -e

echo "🚀 Deploying Skola PWA to Azure Container Instances..."
echo "================================================"

# Configuration
RESOURCE_GROUP="skola-pwa-rg"
LOCATION="australiaeast"  # Changed from eastus due to restrictions
ACI_NAME="skola-pwa"
DNS_NAME="skola-pwa-$(date +%s)"  # Unique DNS name
IMAGE_NAME="skola-pwa:latest"
REGISTRY_NAME="skolapwaregistry"
REGISTRY_LOGIN_SERVER="${REGISTRY_NAME}.azurecr.io"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
print_status "Checking prerequisites..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Installing..."
    curl -sL https://aka.ms/InstallAzureCLIDebian | sudo bash
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is required but not installed."
    exit 1
fi

# Check if user is logged in to Azure
if ! az account show &> /dev/null; then
    print_error "Please login to Azure first:"
    echo "az login"
    exit 1
fi

print_success "Prerequisites check complete!"

# Register required resource providers
print_status "Registering Azure resource providers..."
az provider register --namespace Microsoft.ContainerRegistry --wait
az provider register --namespace Microsoft.ContainerInstance --wait
az provider register --namespace Microsoft.DBforPostgreSQL --wait

print_success "Resource providers registered!"

# Create resource group
print_status "Creating resource group: $RESOURCE_GROUP in $LOCATION..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none
print_success "Resource group created!"

# Create Azure Container Registry
print_status "Creating Azure Container Registry..."
az acr create --resource-group $RESOURCE_GROUP --name $REGISTRY_NAME --sku Basic --admin-enabled true --output none
print_success "Container Registry created!"

# Login to Azure Container Registry (using token to avoid Docker dependency)
print_status "Getting Azure Container Registry credentials..."
ACR_USERNAME=$(az acr credential show --resource-group $RESOURCE_GROUP --name $REGISTRY_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --resource-group $RESOURCE_GROUP --name $REGISTRY_NAME --query passwords[0].value -o tsv)

print_status "Logging into Azure Container Registry..."
echo $ACR_PASSWORD | sudo docker login $REGISTRY_LOGIN_SERVER -u $ACR_USERNAME --password-stdin

# Build and push Docker images
print_status "Building PWA Docker image..."
# Copy Dockerfile to dist directory for proper build context
cp Dockerfile.pwa dist/
cd dist
sudo docker build -f Dockerfile.pwa -t $IMAGE_NAME .
cd ..

print_status "Tagging image for Azure Container Registry..."
sudo docker tag $IMAGE_NAME $REGISTRY_LOGIN_SERVER/$IMAGE_NAME

print_status "Pushing image to Azure Container Registry..."
sudo docker push $REGISTRY_LOGIN_SERVER/$IMAGE_NAME

print_success "Docker images pushed to Azure!"

# Registry credentials already obtained above

# Create Azure Database for PostgreSQL
print_status "Creating Azure Database for PostgreSQL..."
DB_SERVER_NAME="skola-db-$(date +%s)"
DB_ADMIN_USER="skolaadmin"
DB_ADMIN_PASSWORD="$(openssl rand -base64 16)"

az postgres flexible-server create \
    --name $DB_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --admin-user $DB_ADMIN_USER \
    --admin-password $DB_ADMIN_PASSWORD \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --storage-size 32 \
    --version 16 \
    --public-access Enabled \
    --output none

print_success "PostgreSQL database created!"

# Get database connection string
DB_HOST=$(az postgres flexible-server show --resource-group $RESOURCE_GROUP --name $DB_SERVER_NAME --query fullyQualifiedDomainName -o tsv)

# Build and deploy backend
print_status "Building backend Docker image..."
cd backend
sudo docker build -t skola-backend:latest .
sudo docker tag skola-backend:latest $REGISTRY_LOGIN_SERVER/skola-backend:latest
sudo docker push $REGISTRY_LOGIN_SERVER/skola-backend:latest
cd ..

# Deploy to Azure Container Instances
print_status "Deploying to Azure Container Instances..."

# Deploy PWA container
az container create \
    --resource-group $RESOURCE_GROUP \
    --name $ACI_NAME \
    --image $REGISTRY_LOGIN_SERVER/$IMAGE_NAME \
    --cpu 1 \
    --memory 1 \
    --registry-login-server $REGISTRY_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --dns-name-label $DNS_NAME \
    --ports 80 \
    --environment-variables \
        REACT_APP_API_URL="https://skola-backend-${DNS_NAME}.${LOCATION}.azurecontainer.io" \
    --output none

# Deploy backend container
az container create \
    --resource-group $RESOURCE_GROUP \
    --name skola-backend \
    --image $REGISTRY_LOGIN_SERVER/skola-backend:latest \
    --cpu 1 \
    --memory 1 \
    --registry-login-server $REGISTRY_LOGIN_SERVER \
    --registry-username $ACR_USERNAME \
    --registry-password $ACR_PASSWORD \
    --dns-name-label skola-backend-${DNS_NAME} \
    --ports 3000 \
    --environment-variables \
        DATABASE_URL="postgresql://${DB_ADMIN_USER}:${DB_ADMIN_PASSWORD}@${DB_HOST}/postgres?sslmode=require" \
        JWT_SECRET="$(openssl rand -base64 32)" \
        NODE_ENV="production" \
    --output none

print_success "Containers deployed to Azure!"

# Get the public URLs
print_status "Getting deployment information..."
PWA_URL=$(az container show --resource-group $RESOURCE_GROUP --name $ACI_NAME --query ipAddress.fqdn -o tsv)
BACKEND_URL=$(az container show --resource-group $RESOURCE_GROUP --name skola-backend --query ipAddress.fqdn -o tsv)

# Wait for containers to be ready
print_status "Waiting for containers to start..."
sleep 30

# Test the deployment
print_status "Testing deployment..."
if curl -f -s "http://${PWA_URL}" > /dev/null; then
    print_success "PWA is accessible!"
else
    print_warning "PWA might still be starting up..."
fi

if curl -f -s "http://${BACKEND_URL}:3000/health/check" > /dev/null; then
    print_success "Backend API is accessible!"
else
    print_warning "Backend API might still be starting up..."
fi

# Print deployment summary
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "========================"
echo ""
print_success "Your Skola PWA is now publicly accessible!"
echo ""
echo "📱 Public URLs:"
echo "   🌐 PWA Frontend: http://${PWA_URL}"
echo "   🔗 Backend API:  http://${BACKEND_URL}:3000"
echo ""
echo "📊 Database Details:"
echo "   🗄️  Host: ${DB_HOST}"
echo "   👤 User: ${DB_ADMIN_USER}"
echo "   🔑 Password: ${DB_ADMIN_PASSWORD}"
echo ""
echo "🔧 Management Commands:"
echo "   View logs:    az container logs --resource-group $RESOURCE_GROUP --name $ACI_NAME"
echo "   Restart:      az container restart --resource-group $RESOURCE_GROUP --name $ACI_NAME"
echo "   Delete:       az group delete --name $RESOURCE_GROUP --yes"
echo ""
echo "📱 Mobile Access:"
echo "   • Open http://${PWA_URL} on any device"
echo "   • Install as PWA by tapping 'Add to Home Screen'"
echo "   • Works offline with service worker"
echo ""
print_warning "Important: Save these credentials securely!"
print_warning "Database password: ${DB_ADMIN_PASSWORD}"
echo ""
echo "🚀 Your PWA is ready for the world! 🌍📱"
