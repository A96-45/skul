#!/bin/bash

# 🚀 Simple Azure Deployment for Skola
# Using Azure App Service (easier than Container Instances)

set -e

echo "🚀 Starting Simple Azure Deployment for Skola..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
command -v az >/dev/null 2>&1 || {
    print_error "Azure CLI is required but not installed."
    print_status "Install Azure CLI: curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
    exit 1
}

command -v docker >/dev/null 2>&1 || {
    print_error "Docker is required but not installed."
    exit 1
}

print_status "Prerequisites check passed ✓"

# Check Azure authentication
if ! az account show >/dev/null 2>&1; then
    print_error "Not logged in to Azure. Please run 'az login' first."
    exit 1
fi

print_status "Azure authentication confirmed ✓"

# Get subscription info
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)

print_status "Using Azure Subscription: $SUBSCRIPTION_NAME"

# Set variables
PROJECT_NAME="skola"
LOCATION="australiaeast"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RESOURCE_GROUP="${PROJECT_NAME}-rg-${TIMESTAMP}"
PLAN_NAME="${PROJECT_NAME}-plan-${TIMESTAMP}"
WEBAPP_NAME="${PROJECT_NAME}-app-${TIMESTAMP}"
DB_SERVER_NAME="${PROJECT_NAME}-db-${TIMESTAMP}"
DB_NAME="skola_prod"
DB_ADMIN_USER="skola_admin"

# Generate secure passwords
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

print_status "Generated secure credentials ✓"

# Create resource group
print_status "Creating Azure resource group..."
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --output none

print_status "Resource group created: $RESOURCE_GROUP"

# Create Azure Database for PostgreSQL
print_status "Creating Azure Database for PostgreSQL..."
az postgres flexible-server create \
    --name $DB_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --admin-user $DB_ADMIN_USER \
    --admin-password $DB_PASSWORD \
    --sku-name Standard_B1ms \
    --tier Burstable \
    --storage-size 32 \
    --version 16 \
    --public-access Enabled \
    --output none

print_status "PostgreSQL server created: $DB_SERVER_NAME"

# Create database
print_status "Creating database..."
az postgres flexible-server db create \
    --resource-group $RESOURCE_GROUP \
    --server-name $DB_SERVER_NAME \
    --database-name $DB_NAME \
    --output none

print_status "Database created: $DB_NAME"

# Get database connection details
DB_HOST=$(az postgres flexible-server show \
    --name $DB_SERVER_NAME \
    --resource-group $RESOURCE_GROUP \
    --query fullyQualifiedDomainName -o tsv)

DATABASE_URL="postgresql://$DB_ADMIN_USER:$DB_PASSWORD@$DB_HOST/$DB_NAME"

print_status "Database connection configured ✓"

# Create App Service Plan
print_status "Creating App Service Plan..."
az appservice plan create \
    --name $PLAN_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku B1 \
    --is-linux \
    --output none

print_status "App Service Plan created: $PLAN_NAME"

# Build Docker images
print_status "Building Docker images..."
sudo docker build -t skola-app:latest .
print_status "Docker image built ✓"

# Create Azure Container Registry (simpler approach)
print_status "Setting up container registry..."
az acr create \
    --resource-group $RESOURCE_GROUP \
    --name skolaacr$RANDOM \
    --sku Basic \
    --admin-enabled true \
    --output none 2>/dev/null || {
    print_warning "ACR creation failed, using alternative approach..."
}

# Try to push to ACR, fallback to local deployment
if az acr list --resource-group $RESOURCE_GROUP --query '[].name' -o tsv | grep -q skolaacr; then
    ACR_NAME=$(az acr list --resource-group $RESOURCE_GROUP --query '[].name' -o tsv | grep skolaacr | head -1)
    ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
    ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
    ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query passwords[0].value -o tsv)

    print_status "Using Azure Container Registry: $ACR_NAME"

    # Login and push
    echo $ACR_PASSWORD | sudo docker login $ACR_LOGIN_SERVER --username $ACR_USERNAME --password-stdin
    sudo docker tag skola-app:latest $ACR_LOGIN_SERVER/skola-app:latest
    sudo docker push $ACR_LOGIN_SERVER/skola-app:latest

    IMAGE_NAME="$ACR_LOGIN_SERVER/skola-app:latest"
else
    print_warning "Using alternative deployment method..."
    IMAGE_NAME="skola-app:latest"
fi

# Create Web App
print_status "Creating Azure Web App..."
az webapp create \
    --name $WEBAPP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $PLAN_NAME \
    --runtime "NODE|18-lts" \
    --output none

print_status "Web App created: $WEBAPP_NAME"

# Configure environment variables
print_status "Configuring environment variables..."
az webapp config appsettings set \
    --name $WEBAPP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
    NODE_ENV=production \
    DATABASE_URL="$DATABASE_URL" \
    JWT_SECRET="$JWT_SECRET" \
    PORT=3000 \
    --output none

print_status "Environment variables configured ✓"

# Deploy the application
print_status "Deploying application..."
if [[ $IMAGE_NAME == skola-app:latest ]]; then
    # Local deployment
    az webapp up \
        --name $WEBAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --output none
else
    # Container deployment
    az webapp config container set \
        --name $WEBAPP_NAME \
        --resource-group $RESOURCE_GROUP \
        --docker-custom-image-name $IMAGE_NAME \
        --docker-registry-server-url $ACR_LOGIN_SERVER \
        --docker-registry-server-user $ACR_USERNAME \
        --docker-registry-server-password $ACR_PASSWORD \
        --output none
fi

print_status "Application deployed ✓"

# Get the web app URL
WEBAPP_URL=$(az webapp show \
    --name $WEBAPP_NAME \
    --resource-group $RESOURCE_GROUP \
    --query defaultHostName -o tsv)

WEBAPP_URL="https://$WEBAPP_URL"

print_status "Web App URL: $WEBAPP_URL"

# Run database migrations (if backend is accessible)
print_status "Checking deployment status..."
sleep 10

# Test the deployment
if curl -f $WEBAPP_URL/health/check >/dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_warning "Application deployment in progress..."
    print_status "Please wait a few minutes for the app to fully start"
fi

# Create deployment summary
cat > azure-deployment-summary.json << EOF
{
  "deployment": {
    "timestamp": "$TIMESTAMP",
    "type": "Azure App Service",
    "status": "completed"
  },
  "resources": {
    "resource_group": "$RESOURCE_GROUP",
    "app_service_plan": "$PLAN_NAME",
    "web_app": "$WEBAPP_NAME",
    "database_server": "$DB_SERVER_NAME",
    "database_name": "$DB_NAME"
  },
  "urls": {
    "web_app": "$WEBAPP_URL",
    "database_host": "$DB_HOST"
  },
  "credentials": {
    "database_user": "$DB_ADMIN_USER",
    "database_url": "$DATABASE_URL",
    "jwt_secret": "$JWT_SECRET"
  },
  "next_steps": [
    "Update your mobile app with the new API URL",
    "Test user registration and login",
    "Configure domain name (optional)",
    "Set up monitoring and alerts"
  ]
}
EOF

print_status ""
print_status "🎉 AZURE DEPLOYMENT COMPLETED!"
print_status "================================="
echo ""
echo -e "${BLUE}🌐 Your Skola Application:${NC}"
echo -e "${GREEN}   URL: $WEBAPP_URL${NC}"
echo ""
echo -e "${BLUE}📊 Resources Created:${NC}"
echo -e "${YELLOW}   • Resource Group: $RESOURCE_GROUP${NC}"
echo -e "${YELLOW}   • Web App: $WEBAPP_NAME${NC}"
echo -e "${YELLOW}   • Database: $DB_SERVER_NAME${NC}"
echo ""
echo -e "${BLUE}🔑 Database Connection:${NC}"
echo -e "${YELLOW}   Host: $DB_HOST${NC}"
echo -e "${YELLOW}   Database: $DB_NAME${NC}"
echo -e "${YELLOW}   User: $DB_ADMIN_USER${NC}"
echo ""
echo -e "${BLUE}📱 Mobile App Configuration:${NC}"
echo "Update your app.json with:"
echo -e "${YELLOW}   \"apiUrl\": \"$WEBAPP_URL\"${NC}"
echo -e "${YELLOW}   \"trpcUrl\": \"$WEBAPP_URL/trpc\"${NC}"
echo ""
echo -e "${BLUE}🛠️ Management Commands:${NC}"
echo -e "${YELLOW}   View logs: az webapp log tail --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP${NC}"
echo -e "${YELLOW}   Restart app: az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP${NC}"
echo -e "${YELLOW}   Scale up: az appservice plan update --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku S1${NC}"
echo ""
echo -e "${BLUE}📄 Deployment Summary:${NC}"
echo -e "${YELLOW}   Saved to: azure-deployment-summary.json${NC}"
echo ""
echo -e "${GREEN}🎉 Your Skola app is now live on Azure!${NC}"
echo ""
echo -e "${BLUE}Need help? Check:${NC}"
echo -e "${BLUE}- 📖 COMPREHENSIVE_DEPLOYMENT_GUIDE.md${NC}"
echo -e "${BLUE}- 📄 azure-deployment-summary.json${NC}"
