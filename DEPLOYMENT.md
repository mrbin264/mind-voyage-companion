# Deployment Guide - Azure App Service

This guide covers deploying your Next.js application to Azure App Service with MongoDB Atlas, including both staging and production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Azure Resources Setup](#azure-resources-setup)
- [MongoDB Atlas Setup](#mongodb-atlas-setup)
- [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
- [Deployment Process](#deployment-process)
- [Environment Management](#environment-management)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- **Azure Subscription** - Active Azure account
- **Azure CLI** - [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register) (Free tier available)
- **GitHub/Azure DevOps** - Repository access for CI/CD
- **Azure DevOps Project** - For pipeline execution

## Azure Resources Setup

### 1. Azure Resource Group

```bash
# Login to Azure
az login

# Create resource group for staging
az group create \
  --name rg-yourapp-staging \
  --location eastus

# Create resource group for production
az group create \
  --name rg-yourapp-production \
  --location eastus
```

### 2. Azure App Service Plan

```bash
# Staging App Service Plan (B1 tier for cost-effective staging)
az appservice plan create \
  --name plan-yourapp-staging \
  --resource-group rg-yourapp-staging \
  --sku B1 \
  --is-linux

# Production App Service Plan (P1V2 tier for production performance)
az appservice plan create \
  --name plan-yourapp-production \
  --resource-group rg-yourapp-production \
  --sku P1V2 \
  --is-linux
```

### 3. Azure Web App

```bash
# Staging Web App
az webapp create \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging \
  --plan plan-yourapp-staging \
  --runtime "NODE:20-lts"

# Production Web App
az webapp create \
  --name yourapp-production \
  --resource-group rg-yourapp-production \
  --plan plan-yourapp-production \
  --runtime "NODE:20-lts"
```

### 4. Azure Key Vault (For Secrets Management)

```bash
# Create Key Vault for staging
az keyvault create \
  --name kv-yourapp-staging \
  --resource-group rg-yourapp-staging \
  --location eastus

# Create Key Vault for production
az keyvault create \
  --name kv-yourapp-production \
  --resource-group rg-yourapp-production \
  --location eastus

# Grant App Service access to Key Vault (do this after creating the web app)
az webapp identity assign \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging

# Get the principal ID and grant access
PRINCIPAL_ID=$(az webapp identity show \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging \
  --query principalId -o tsv)

az keyvault set-policy \
  --name kv-yourapp-staging \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list
```

## MongoDB Atlas Setup

### 1. Create MongoDB Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Build a Database"
3. Choose **M0 Free Tier** for staging (or M10+ for production)
4. Select your preferred cloud provider and region (match Azure region)
5. Name your cluster: `staging-cluster` or `production-cluster`
6. Click "Create Cluster"

### 2. Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Authentication Method: **Password**
3. Create credentials:
   - Username: `yourapp_user`
   - Password: Generate secure password
4. Database User Privileges: **Read and write to any database**
5. Add User

### 3. Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Add Azure IP ranges or use **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ For production, whitelist specific Azure IPs
3. Confirm

### 4. Get Connection String

1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Driver: **Node.js**
4. Version: **5.5 or later**
5. Copy the connection string:

```
mongodb+srv://yourapp_user:<password>@cluster.mongodb.net/yourapp?retryWrites=true&w=majority
```

Replace `<password>` with your database user password.

## CI/CD Pipeline Configuration

### Azure DevOps Pipeline Setup

The project includes `azure-pipelines.yml` with the following stages:

1. **Build and Test** - Code quality checks, unit tests, build
2. **Deploy to Staging** - Automatic on `develop` branch push
3. **Deploy to Production** - Manual approval on `main` branch

### 1. Create Service Connection

1. Go to Azure DevOps → **Project Settings** → **Service Connections**
2. Click **New Service Connection** → **Azure Resource Manager**
3. Authentication: **Service Principal (automatic)**
4. Scope: **Subscription**
5. Select your subscription and resource group
6. Name: `azure-staging-connection` and `azure-production-connection`
7. Grant access permissions

### 2. Create Variable Groups

#### Staging Variables

```bash
# In Azure DevOps → Pipelines → Library → Variable Groups
Name: mind-voyage-staging-variables

Variables:
- stagingAppServiceName: yourapp-staging
- resourceGroupName: rg-yourapp-staging
- azureServiceConnection: azure-staging-connection
- keyVaultName: kv-yourapp-staging
```

#### Production Variables

```bash
Name: mind-voyage-production-variables

Variables:
- productionAppServiceName: yourapp-production
- resourceGroupName: rg-yourapp-production
- azureServiceConnection: azure-production-connection
- keyVaultName: kv-yourapp-production
```

### 3. Store Secrets in Azure Key Vault

```bash
# Staging secrets
az keyvault secret set \
  --vault-name kv-yourapp-staging \
  --name STAGING-MONGODB-URI \
  --value "mongodb+srv://..."

az keyvault secret set \
  --vault-name kv-yourapp-staging \
  --name STAGING-NEXTAUTH-SECRET \
  --value "$(openssl rand -base64 48)"

az keyvault secret set \
  --vault-name kv-yourapp-staging \
  --name STAGING-JWT-SECRET \
  --value "$(openssl rand -base64 48)"

# Production secrets (repeat with production Key Vault)
az keyvault secret set \
  --vault-name kv-yourapp-production \
  --name PRODUCTION-MONGODB-URI \
  --value "mongodb+srv://..."
```

### 4. Configure App Settings

The pipeline automatically sets these during deployment, but you can also configure manually:

```bash
az webapp config appsettings set \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging \
  --settings \
    NODE_ENV=production \
    NEXTAUTH_URL=https://yourapp-staging.azurewebsites.net \
    MONGODB_URI='@Microsoft.KeyVault(SecretUri=https://kv-yourapp-staging.vault.azure.net/secrets/STAGING-MONGODB-URI/)' \
    NEXTAUTH_SECRET='@Microsoft.KeyVault(SecretUri=https://kv-yourapp-staging.vault.azure.net/secrets/STAGING-NEXTAUTH-SECRET/)' \
    JWT_SECRET='@Microsoft.KeyVault(SecretUri=https://kv-yourapp-staging.vault.azure.net/secrets/STAGING-JWT-SECRET/)' \
    SCM_DO_BUILD_DURING_DEPLOYMENT=false \
    ENABLE_ORYX_BUILD=false \
    WEBSITE_RUN_FROM_PACKAGE=1
```

## Deployment Process

### Staging Deployment (Automatic)

1. **Commit and Push to `develop` branch**

```bash
git checkout develop
git add .
git commit -m "feat: your changes"
git push origin develop
```

2. **Azure DevOps Pipeline Triggers Automatically**
   - Runs build and tests
   - Deploys to staging environment
   - Runs health checks

3. **Verify Deployment**

```bash
curl https://yourapp-staging.azurewebsites.net/api/health
```

### Production Deployment (Manual Approval)

1. **Merge to `main` branch**

```bash
git checkout main
git merge develop
git push origin main
```

2. **Pipeline Awaits Manual Approval**
   - Go to Azure DevOps → Pipelines → Runs
   - Find the production deployment run
   - Click **Review** and **Approve**

3. **Pipeline Deploys to Production**
   - Builds production-optimized bundle
   - Deploys to production App Service
   - Runs health checks

4. **Verify Production Deployment**

```bash
curl https://yourapp-production.azurewebsites.net/api/health
```

## Environment Management

### Environment Variables by Environment

#### Staging Environment

| Variable          | Description        | Example                                     |
| ----------------- | ------------------ | ------------------------------------------- |
| `NODE_ENV`        | Node environment   | `production`                                |
| `NEXTAUTH_URL`    | App URL            | `https://yourapp-staging.azurewebsites.net` |
| `MONGODB_URI`     | MongoDB connection | From Key Vault                              |
| `NEXTAUTH_SECRET` | NextAuth secret    | From Key Vault                              |
| `JWT_SECRET`      | JWT secret         | From Key Vault                              |

#### Production Environment

| Variable                 | Description        | Example                                        |
| ------------------------ | ------------------ | ---------------------------------------------- |
| `NODE_ENV`               | Node environment   | `production`                                   |
| `NEXTAUTH_URL`           | App URL            | `https://yourapp-production.azurewebsites.net` |
| `MONGODB_URI`            | MongoDB connection | From Key Vault                                 |
| `NEXTAUTH_SECRET`        | NextAuth secret    | From Key Vault                                 |
| `JWT_SECRET`             | JWT secret         | From Key Vault                                 |
| `AZURE_AD_CLIENT_ID`     | OAuth client ID    | From Azure AD                                  |
| `AZURE_AD_CLIENT_SECRET` | OAuth secret       | From Key Vault                                 |

### Custom Domain Setup (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name yourapp-production \
  --resource-group rg-yourapp-production \
  --hostname www.yourdomain.com

# Enable HTTPS
az webapp config ssl bind \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI \
  --name yourapp-production \
  --resource-group rg-yourapp-production
```

## Troubleshooting

### Common Issues

#### 1. Deployment Fails with "Module not found"

**Solution:**

- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Check `package.json` for missing packages
- Clear build cache and redeploy

#### 2. MongoDB Connection Timeout

**Solution:**

```bash
# Check MongoDB Atlas network access
# Ensure Azure IP ranges are whitelisted

# Test connection from App Service
az webapp ssh \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging

# Inside SSH session
curl -I <mongodb-connection-string>
```

#### 3. Environment Variables Not Loading

**Solution:**

```bash
# Verify Key Vault secrets
az keyvault secret list --vault-name kv-yourapp-staging

# Check App Service settings
az webapp config appsettings list \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging
```

#### 4. Application Crashes on Startup

**Solution:**

```bash
# View logs
az webapp log tail \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging

# Or download logs
az webapp log download \
  --name yourapp-staging \
  --resource-group rg-yourapp-staging
```

### Health Check Endpoint

Monitor application health:

```bash
# Staging
curl https://yourapp-staging.azurewebsites.net/api/health

# Production
curl https://yourapp-production.azurewebsites.net/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "database": {
    "status": "connected",
    "readyState": "connected",
    "host": "cluster.mongodb.net",
    "database": "yourapp"
  },
  "environment": "production",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Monitoring and Logging

### Application Insights (Optional)

```bash
# Create Application Insights
az monitor app-insights component create \
  --app yourapp-insights \
  --location eastus \
  --resource-group rg-yourapp-production

# Get instrumentation key
INSTRUMENTATION_KEY=$(az monitor app-insights component show \
  --app yourapp-insights \
  --resource-group rg-yourapp-production \
  --query instrumentationKey -o tsv)

# Add to App Service settings
az webapp config appsettings set \
  --name yourapp-production \
  --resource-group rg-yourapp-production \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

## Rollback Strategy

### Quick Rollback

```bash
# List deployment slots
az webapp deployment list-publishing-profiles \
  --name yourapp-production \
  --resource-group rg-yourapp-production

# Swap slots (if using deployment slots)
az webapp deployment slot swap \
  --name yourapp-production \
  --resource-group rg-yourapp-production \
  --slot staging \
  --target-slot production

# Or redeploy previous version from Azure DevOps
```

---

## Summary

✅ **Staging Environment**

- Auto-deploys on `develop` branch push
- Uses MongoDB Atlas Free/M10 tier
- Accessible at `https://yourapp-staging.azurewebsites.net`

✅ **Production Environment**

- Manual approval required
- Deploys from `main` branch
- Uses MongoDB Atlas M10+ tier
- Accessible at `https://yourapp-production.azurewebsites.net`

✅ **CI/CD Pipeline**

- Automated build, test, and deploy
- Azure Key Vault for secrets
- Health checks and monitoring

**Next Steps:**

- Set up custom domain
- Configure Application Insights
- Implement deployment slots for zero-downtime deployments
- Set up alerts and monitoring dashboards

---

**For support, contact your DevOps team or refer to Azure documentation.**
