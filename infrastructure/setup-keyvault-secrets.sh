#!/bin/bash
# Azure Key Vault Setup Script for Mind Voyage Companion
# This script sets up Azure Key Vault and stores secrets for the staging environment

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Azure Key Vault Setup for Staging${NC}"
echo -e "${BLUE}======================================${NC}"

# Configuration
KEY_VAULT_NAME="mv-staging-ja7cvi"  # Update this to match your Key Vault from bicep output
RESOURCE_GROUP="rg-mind-voyage-staging"
LOCATION="japaneast"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first.${NC}"
    echo -e "${YELLOW}Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli${NC}"
    exit 1
fi

# Check if logged in
echo -e "\n${BLUE}🔍 Checking Azure authentication...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔑 Please log in to Azure...${NC}"
    az login
fi

CURRENT_SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${GREEN}✅ Logged in to subscription: ${CURRENT_SUBSCRIPTION}${NC}"

# Check if Key Vault exists
echo -e "\n${BLUE}🔍 Checking if Key Vault exists...${NC}"
if az keyvault show --name "$KEY_VAULT_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${GREEN}✅ Key Vault '$KEY_VAULT_NAME' already exists${NC}"
else
    echo -e "${YELLOW}⚠️  Key Vault '$KEY_VAULT_NAME' not found${NC}"
    echo -e "${BLUE}📦 Creating Key Vault...${NC}"
    az keyvault create \
      --name "$KEY_VAULT_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --enable-rbac-authorization false \
      --enabled-for-deployment true \
      --enabled-for-template-deployment true
    echo -e "${GREEN}✅ Key Vault created successfully${NC}"
fi

# Get the service principal for Azure DevOps
echo -e "\n${BLUE}🔍 Finding Azure DevOps Service Principal...${NC}"
echo -e "${YELLOW}Please enter your Azure DevOps Service Connection name (or press Enter to skip):${NC}"
read SERVICE_CONNECTION_NAME

if [ -n "$SERVICE_CONNECTION_NAME" ]; then
    SP_OBJECT_ID=$(az ad sp list --display-name "$SERVICE_CONNECTION_NAME" --query "[0].id" -o tsv)
    
    if [ -n "$SP_OBJECT_ID" ]; then
        echo -e "${GREEN}✅ Found Service Principal: $SP_OBJECT_ID${NC}"
        
        echo -e "\n${BLUE}🔐 Granting Key Vault access to Service Principal...${NC}"
        az keyvault set-policy \
          --name "$KEY_VAULT_NAME" \
          --object-id "$SP_OBJECT_ID" \
          --secret-permissions get list
        
        echo -e "${GREEN}✅ Access granted successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Service Principal not found. You'll need to grant access manually.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping Service Principal access setup.${NC}"
    echo -e "${YELLOW}You'll need to grant access manually using:${NC}"
    echo -e "az keyvault set-policy --name $KEY_VAULT_NAME --object-id <SP_OBJECT_ID> --secret-permissions get list"
fi

# Function to safely prompt for secret
prompt_for_secret() {
    local secret_name=$1
    local secret_description=$2
    
    echo -e "\n${BLUE}🔑 Setting up: ${secret_name}${NC}"
    echo -e "${YELLOW}${secret_description}${NC}"
    read -sp "Enter value (input hidden): " secret_value
    echo ""
    
    if [ -z "$secret_value" ]; then
        echo -e "${RED}❌ No value provided. Skipping...${NC}"
        return 1
    fi
    
    az keyvault secret set \
      --vault-name "$KEY_VAULT_NAME" \
      --name "$secret_name" \
      --value "$secret_value" \
      --output none
    
    echo -e "${GREEN}✅ Secret '${secret_name}' stored successfully${NC}"
}

# Store secrets
echo -e "\n${BLUE}======================================${NC}"
echo -e "${BLUE}Storing Secrets in Key Vault${NC}"
echo -e "${BLUE}======================================${NC}"

# MongoDB URI
prompt_for_secret "STAGING-MONGODB-URI" \
  "MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname)"

# NextAuth Secret
prompt_for_secret "STAGING-NEXTAUTH-SECRET" \
  "NextAuth secret (generate with: openssl rand -base64 48)"

# JWT Secret
prompt_for_secret "STAGING-JWT-SECRET" \
  "JWT secret (generate with: openssl rand -base64 48)"

# Verify secrets are stored
echo -e "\n${BLUE}🔍 Verifying stored secrets...${NC}"
SECRET_COUNT=$(az keyvault secret list --vault-name "$KEY_VAULT_NAME" --query "length([?contains(id, 'STAGING')])" -o tsv)
echo -e "${GREEN}✅ Found ${SECRET_COUNT} staging secrets in Key Vault${NC}"

echo -e "\n${BLUE}📋 List of secrets:${NC}"
az keyvault secret list --vault-name "$KEY_VAULT_NAME" --query "[?contains(id, 'STAGING')].{Name:name, Enabled:attributes.enabled}" -o table

echo -e "\n${GREEN}======================================${NC}"
echo -e "${GREEN}✅ Key Vault Setup Complete!${NC}"
echo -e "${GREEN}======================================${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. Update azure-pipelines.yml with keyVaultName: '$KEY_VAULT_NAME'"
echo -e "2. Ensure your Azure DevOps Service Connection has access to the Key Vault"
echo -e "3. Run your pipeline to test the integration"

echo -e "\n${YELLOW}💡 To view a secret value:${NC}"
echo -e "   az keyvault secret show --vault-name $KEY_VAULT_NAME --name STAGING-MONGODB-URI --query value -o tsv"

echo -e "\n${YELLOW}💡 To update a secret:${NC}"
echo -e "   az keyvault secret set --vault-name $KEY_VAULT_NAME --name STAGING-MONGODB-URI --value 'new-value'"
