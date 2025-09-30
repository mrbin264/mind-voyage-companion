# Azure Deployment Parameters for Mind Voyage Companion

This directory contains the infrastructure-as-code templates and configuration files for deploying the Mind Voyage Companion application to Azure.

## Files Overview

### Infrastructure Templates
- **`azure-resources.bicep`** - Main Bicep template that creates all Azure resources
- **`parameters.staging.json`** - Parameters for staging environment deployment
- **`parameters.production.json`** - Parameters for production environment deployment

### Scripts
- **`deploy.ps1`** - PowerShell script for automated deployment
- **`setup-secrets.ps1`** - Script to configure Key Vault secrets

## Azure Resources Created

The Bicep template creates the following resources:

1. **App Service Plan** - Hosts the Next.js application
2. **App Service** - Runs the containerized Next.js app
3. **Application Insights** - Application monitoring and logging
4. **Log Analytics Workspace** - Centralized logging
5. **Key Vault** - Secure secret management

## Deployment Instructions

### Prerequisites
- Azure CLI installed and configured
- Appropriate permissions in Azure subscription
- MongoDB Atlas cluster configured (see MongoDB section)

### 1. Create Resource Group
```bash
az group create --name "rg-mind-voyage-staging" --location "East US"
az group create --name "rg-mind-voyage-production" --location "East US"
```

### 2. Deploy Infrastructure
```bash
# Staging
az deployment group create \
  --resource-group "rg-mind-voyage-staging" \
  --template-file azure-resources.bicep \
  --parameters @parameters.staging.json

# Production  
az deployment group create \
  --resource-group "rg-mind-voyage-production" \
  --template-file azure-resources.bicep \
  --parameters @parameters.production.json
```

### 3. Configure Secrets
After deployment, run the setup-secrets.ps1 script to configure required secrets in Key Vault.

## Environment Configuration

### Required Environment Variables
The application requires the following environment variables to be configured in Key Vault:

- `NEXTAUTH-SECRET` - NextAuth.js encryption secret
- `JWT-SECRET` - JWT token signing secret  
- `MONGODB-URI` - MongoDB Atlas connection string
- `OAUTH-GOOGLE-CLIENT-ID` - Google OAuth client ID (if using)
- `OAUTH-GOOGLE-CLIENT-SECRET` - Google OAuth client secret (if using)

### App Service Configuration
The following environment variables are automatically configured by the Bicep template:

- `NODE_ENV=production`
- `NEXTAUTH_URL` - Automatically set to the App Service URL
- `APPLICATIONINSIGHTS_CONNECTION_STRING` - Application Insights integration
- `NEXT_TELEMETRY_DISABLED=1` - Disable Next.js telemetry

## Monitoring and Logging

- **Application Insights** provides comprehensive application monitoring
- **Log Analytics Workspace** centralizes all logging data
- **App Service Diagnostics** captures application and HTTP logs

## Security Features

- **HTTPS Only** - All traffic forced to HTTPS
- **Managed Identity** - App Service uses managed identity for Key Vault access
- **Key Vault Integration** - Secrets managed securely in Key Vault
- **TLS 1.2 Minimum** - Enforced minimum TLS version
- **RBAC** - Role-based access control for Key Vault

## Scaling Configuration

### Staging Environment
- **SKU**: B2 (Basic)
- **Auto-scaling**: Disabled
- **Always On**: Disabled

### Production Environment  
- **SKU**: P1v3 (Premium)
- **Auto-scaling**: Available (configure as needed)
- **Always On**: Enabled

## Cost Optimization

- Basic tier used for staging to minimize costs
- Log retention set to 30 days
- Application Insights sampling can be configured
- Consider reserved instances for production for cost savings