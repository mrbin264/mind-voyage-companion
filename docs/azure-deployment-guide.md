# Azure DevOps and Deployment Setup Guide

This comprehensive guide will walk you through setting up Azure DevOps, deploying infrastructure, and configuring CI/CD for the Mind Voyage Companion application.

## 📋 Prerequisites

Before starting, ensure you have:

- **Azure Subscription** with Owner or Contributor permissions
- **Azure CLI** installed and configured (`az --version`)
- **Azure DevOps Organization** (create at [dev.azure.com](https://dev.azure.com))
- **MongoDB Atlas Account** (free at [mongodb.com/atlas](https://mongodb.com/atlas))
- **Git Repository** with your code (GitHub/Azure Repos)

## 🗺️ Overview

The deployment consists of:
1. **Azure Infrastructure** - App Services, Key Vault, Application Insights
2. **MongoDB Atlas** - Cloud database clusters
3. **Azure DevOps** - CI/CD pipelines
4. **Secret Management** - Secure configuration

## 🚀 Step 1: Create Azure Resources

### 1.1 Login to Azure
```powershell
az login
az account set --subscription "Your-Subscription-Name"
```

### 1.2 Create Resource Groups
```powershell
# Staging environment
az group create --name "rg-mind-voyage-staging" --location "East US"

# Production environment  
az group create --name "rg-mind-voyage-production" --location "East US"
```

### 1.3 Deploy Infrastructure with Bicep

Navigate to your project's `infrastructure` directory and deploy:

```powershell
# Deploy staging infrastructure
az deployment group create \
  --resource-group "rg-mind-voyage-staging" \
  --template-file azure-resources.bicep \
  --parameters @parameters.staging.json

# Deploy production infrastructure
az deployment group create \
  --resource-group "rg-mind-voyage-production" \
  --template-file azure-resources.bicep \
  --parameters @parameters.production.json
```

### 1.4 Note the Output Values

After deployment, note these values (you'll need them later):
- App Service names (staging and production)
- Key Vault names (staging and production) 
- Application Insights connection strings

## 🗄️ Step 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Atlas Clusters

Follow the detailed guide in [`docs/mongodb-atlas-setup.md`](./mongodb-atlas-setup.md):

1. Create **staging cluster** (M0/M2 tier)
2. Create **production cluster** (M10+ tier) 
3. Configure network access and database users
4. Get connection strings for both environments

### 2.2 Configure Database Security

- Set up IP whitelisting for Azure App Services
- Create dedicated database users with minimal privileges
- Enable authentication and SSL/TLS

## 🔐 Step 3: Configure Secrets Management

### 3.1 Set Up Key Vault Secrets

Run the PowerShell script to configure secrets:

```powershell
# For staging
.\infrastructure\setup-secrets.ps1 -Environment staging -KeyVaultName "your-staging-kv-name" -GenerateSecrets

# For production  
.\infrastructure\setup-secrets.ps1 -Environment production -KeyVaultName "your-production-kv-name" -GenerateSecrets
```

When prompted, provide:
- MongoDB Atlas connection strings
- Google OAuth credentials (if using social login)

### 3.2 Verify Secret Configuration

```powershell
# List secrets in Key Vault
az keyvault secret list --vault-name "your-staging-kv-name" --query "[].name" -o table
```

## 🔧 Step 4: Set Up Azure DevOps

### 4.1 Create Azure DevOps Project

1. Go to [dev.azure.com](https://dev.azure.com)
2. Create new project: "Mind Voyage Companion"
3. Import your Git repository or connect to GitHub

### 4.2 Create Service Connections

Navigate to **Project Settings** → **Service Connections**:

1. **Create Azure Resource Manager Connection**:
   - Connection name: `azure-production-connection`
   - Subscription: Your Azure subscription
   - Resource Group: `rg-mind-voyage-production`
   - Service principal authentication recommended

2. **Create Staging Connection**:
   - Connection name: `azure-staging-connection`  
   - Resource Group: `rg-mind-voyage-staging`

### 4.3 Create Variable Groups

Navigate to **Pipelines** → **Library** and create variable groups:

#### Shared Variables Group: `mind-voyage-shared-variables`
```yaml
Variables:
- azureServiceConnection: 'azure-production-connection'
- nodeVersion: '20.x'
- pnpmVersion: '9.12.2'
```

#### Staging Variables Group: `mind-voyage-staging-variables`
```yaml
Variables:
- stagingAppServiceName: 'your-staging-app-service-name'
- azureServiceConnection: 'azure-staging-connection'
- keyVaultName: 'your-staging-kv-name'

# Key Vault References (Link to your staging Key Vault)
- STAGING_MONGODB_URI: $(STAGING-MONGODB-URI)
- STAGING_NEXTAUTH_SECRET: $(STAGING-NEXTAUTH-SECRET)  
- STAGING_JWT_SECRET: $(STAGING-JWT-SECRET)
```

#### Production Variables Group: `mind-voyage-production-variables`
```yaml
Variables:
- productionAppServiceName: 'your-production-app-service-name'
- azureServiceConnection: 'azure-production-connection'
- keyVaultName: 'your-production-kv-name'

# Key Vault References (Link to your production Key Vault)
- PRODUCTION_MONGODB_URI: $(PRODUCTION-MONGODB-URI)
- PRODUCTION_NEXTAUTH_SECRET: $(PRODUCTION-NEXTAUTH-SECRET)
- PRODUCTION_JWT_SECRET: $(PRODUCTION-JWT-SECRET)
```

### 4.4 Link Variable Groups to Key Vault

For each environment variable group:
1. Click "Link secrets from an Azure key vault as variables"
2. Select your Azure subscription and Key Vault
3. Authorize the connection
4. Select the secrets to link

### 4.5 Create Pipeline Environments

Navigate to **Pipelines** → **Environments**:

1. **Create Staging Environment**:
   - Name: `staging`
   - Add your staging App Service as a resource
   - No approvals needed

2. **Create Production Environment**:
   - Name: `production`  
   - Add your production App Service as a resource
   - **Enable approvals**: Require manual approval before production deployments

## 📦 Step 5: Set Up CI/CD Pipeline

### 5.1 Create the Pipeline

1. Navigate to **Pipelines** → **Pipelines** → **New Pipeline**
2. Select your repository source (Azure Repos Git, GitHub, etc.)
3. Choose "Existing Azure Pipelines YAML file"
4. Select `azure-pipelines.yml` from your repository

### 5.2 Configure Pipeline Variables

Update the pipeline file with your specific values:

```yaml
# In azure-pipelines.yml, update these variable group references:
variables:
  - group: mind-voyage-shared-variables
  - name: buildConfiguration
    value: 'production'
```

### 5.3 Test the Pipeline

1. **Save and Run** the pipeline
2. Monitor the build process
3. Verify each stage completes successfully:
   - Build and Test
   - Integration Tests
   - Deploy to Staging (on develop branch)
   - Deploy to Production (on main branch with approval)

## ✅ Step 6: Verification and Testing

### 6.1 Test Staging Deployment

1. Push changes to `develop` branch
2. Verify pipeline triggers automatically
3. Check staging application at: `https://your-staging-app.azurewebsites.net`
4. Test core functionality:
   - User registration/login
   - Habit creation and tracking
   - Journal entries
   - Database connectivity

### 6.2 Test Production Deployment

1. Create pull request from `develop` to `main`
2. Merge after review
3. Pipeline should trigger with approval gate
4. Approve production deployment
5. Verify production application works correctly

### 6.3 Monitoring and Troubleshooting

**Application Insights Dashboard**:
- Navigate to your Application Insights resource
- Monitor application performance and errors
- Set up alerts for critical issues

**App Service Logs**:
```powershell
# Stream logs from App Service
az webapp log tail --name "your-app-service-name" --resource-group "your-resource-group"
```

**Key Vault Monitoring**:
- Enable audit logging
- Monitor secret access patterns
- Set up alerts for unauthorized access

## 🔄 Step 7: Ongoing Operations

### 7.1 Secret Rotation

Regularly rotate secrets for security:

```powershell
# Generate new secrets and update Key Vault
.\infrastructure\setup-secrets.ps1 -Environment production -KeyVaultName "your-kv-name" -GenerateSecrets
```

### 7.2 Scaling Configuration

**Production Scaling**:
- Monitor Application Insights for performance bottlenecks
- Configure auto-scaling rules based on CPU/memory usage
- Consider upgrading App Service Plan SKU for higher loads

**Database Scaling**:
- Monitor MongoDB Atlas performance metrics
- Scale cluster tier based on usage patterns
- Implement read replicas if needed

### 7.3 Backup and Disaster Recovery

**Database Backups**:
- MongoDB Atlas automatic backups (enabled by default on dedicated clusters)
- Test restore procedures regularly

**Application Backups**:
- Application code is in source control
- Infrastructure is defined in Bicep templates
- Secrets are in Key Vault with backup policies

## 🚨 Troubleshooting Common Issues

### Pipeline Failures

**Build Failures**:
```powershell
# Common issues and solutions:
1. Node.js version mismatch → Update nodeVersion in variables
2. Package installation fails → Clear cache and retry
3. TypeScript errors → Fix type issues in code
4. Test failures → Review test results and fix issues
```

**Deployment Failures**:
```powershell
# Common issues and solutions:
1. App Service not found → Verify resource names in variables
2. Authentication errors → Check service connection permissions
3. Secret access denied → Verify Key Vault access policies
4. Database connection fails → Check MongoDB connection string
```

### Application Runtime Issues

**MongoDB Connection Issues**:
1. Check connection string format and credentials
2. Verify IP whitelisting in MongoDB Atlas
3. Test connection from Azure Cloud Shell

**Authentication Problems**:
1. Verify NEXTAUTH_URL matches actual domain
2. Check NEXTAUTH_SECRET is properly configured
3. Validate OAuth provider configurations

### Performance Issues

**Slow Application Response**:
1. Check Application Insights performance data
2. Review MongoDB Atlas performance advisor
3. Optimize database queries and indexes
4. Consider App Service Plan upgrade

## 📞 Support Resources

- **Azure Documentation**: [docs.microsoft.com/azure](https://docs.microsoft.com/azure)
- **Azure DevOps Documentation**: [docs.microsoft.com/azure/devops](https://docs.microsoft.com/azure/devops)
- **MongoDB Atlas Documentation**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)

---

## 🎉 Congratulations!

You've successfully set up a complete CI/CD pipeline and cloud infrastructure for the Mind Voyage Companion application. Your setup includes:

✅ **Automated CI/CD** with Azure DevOps  
✅ **Scalable Infrastructure** with Azure App Services  
✅ **Secure Secret Management** with Azure Key Vault  
✅ **Cloud Database** with MongoDB Atlas  
✅ **Monitoring & Logging** with Application Insights  
✅ **Environment Separation** (staging and production)  

Your application is now ready for production use with enterprise-grade deployment practices!