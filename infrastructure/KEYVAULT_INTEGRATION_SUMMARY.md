# Azure Key Vault Integration - Summary

## ✅ What Was Fixed

Your Azure Pipeline now properly integrates with Azure Key Vault for secure secrets management.

### Changes Made:

1. **Added AzureKeyVault@2 Task** (`azure-pipelines.yml`)
   - Fetches secrets from Key Vault before deployment
   - Secrets filter: `STAGING-MONGODB-URI,STAGING-NEXTAUTH-SECRET,STAGING-JWT-SECRET`

2. **Updated Secret References** (`azure-pipelines.yml`)
   - Changed from `$(STAGING_MONGODB_URI)` to `$(STAGING-MONGODB-URI)` (with hyphens)
   - All secret names now match Key Vault naming convention

3. **Created Setup Script** (`infrastructure/setup-keyvault-secrets.sh`)
   - Automated script to configure Key Vault and store secrets
   - Handles Service Principal access permissions
   - Securely prompts for secret values

4. **Added Documentation** (`infrastructure/KEYVAULT_SETUP_GUIDE.md`)
   - Complete setup guide with 3 different methods
   - Troubleshooting section
   - Security best practices

## 🚀 Next Steps

### Step 1: Run the Setup Script

```bash
cd infrastructure
./setup-keyvault-secrets.sh
```

**What you'll need:**

- ✅ Azure CLI installed and logged in
- ✅ Access to `rg-mind-voyage-staging` resource group
- ✅ Your MongoDB connection string
- ✅ Your NextAuth secret (or generate with `openssl rand -base64 48`)
- ✅ Your JWT secret (or generate with `openssl rand -base64 48`)

### Step 2: Grant Service Principal Access

If the script doesn't automatically grant access, run:

```bash
# Find your Service Principal Object ID
az ad sp list --display-name "azure-staging-connection" --query "[].{Name:appDisplayName, ObjectId:id}" -o table

# Grant access
az keyvault set-policy \
  --name mv-staging-ja7cvi \
  --object-id <YOUR_SP_OBJECT_ID> \
  --secret-permissions get list
```

### Step 3: Push Changes and Deploy

```bash
git push origin develop
```

The pipeline will automatically:

1. ✅ Fetch secrets from Key Vault
2. ✅ Configure App Service with the secrets
3. ✅ Deploy your application

## 🔍 Verify Everything Works

### Check Key Vault has secrets:

```bash
az keyvault secret list --vault-name mv-staging-ja7cvi -o table
```

Expected output:

```
Name                        Enabled
--------------------------  ---------
STAGING-JWT-SECRET         True
STAGING-MONGODB-URI        True
STAGING-NEXTAUTH-SECRET    True
```

### Check Pipeline Logs:

1. Go to Azure DevOps → Pipelines
2. Find your latest run
3. Look for "Fetch Secrets from Azure Key Vault" task
4. Should show: ✅ Successfully fetched 3 secrets

### Test Deployment:

```bash
# After deployment completes, check health endpoint
curl https://mind-voyage-companion-staging-app-ja7cvi.azurewebsites.net/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "environment": "production",
    "type": "MongoDB Production"
  }
}
```

## 📚 Key Vault Secret Names

Make sure these exact names are used in Key Vault:

| Secret Name               | Description                | Example Value                                    |
| ------------------------- | -------------------------- | ------------------------------------------------ |
| `STAGING-MONGODB-URI`     | MongoDB connection string  | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `STAGING-NEXTAUTH-SECRET` | NextAuth.js session secret | `<48-char random string>`                        |
| `STAGING-JWT-SECRET`      | JWT token signing secret   | `<48-char random string>`                        |

## 🔒 Security Benefits

✅ **No secrets in code** - All sensitive values stored in Azure Key Vault
✅ **Encrypted at rest** - Key Vault uses hardware security modules
✅ **Access control** - Only authorized Service Principals can read secrets
✅ **Audit logging** - All access to secrets is logged
✅ **Rotation support** - Easy to update secrets without code changes

## ❓ Troubleshooting

### Pipeline fails with "Secret not found"

**Cause**: Secret names don't match exactly (case-sensitive)
**Fix**: Verify secret names in Key Vault match pipeline configuration

### Pipeline fails with "Access denied"

**Cause**: Service Principal doesn't have Key Vault permissions
**Fix**: Run `az keyvault set-policy` command above

### Application returns 503 after deployment

**Cause**: MongoDB connection string might be incorrect
**Fix**: Verify `STAGING-MONGODB-URI` value in Key Vault

## 📖 Additional Resources

- [Key Vault Setup Guide](./KEYVAULT_SETUP_GUIDE.md) - Detailed instructions
- [Setup Script](./setup-keyvault-secrets.sh) - Automated configuration
- [Azure Pipeline](../azure-pipelines.yml) - CI/CD configuration

## 🎯 Production Deployment

When ready for production, repeat the same process:

1. Create production Key Vault: `mv-production-xxxxxx`
2. Store production secrets with `PRODUCTION-*` prefix
3. Update pipeline production stage with production Key Vault reference
4. Use different MongoDB cluster and stronger secrets for production

---

**Status**: ✅ Ready to deploy once secrets are stored in Key Vault

**Last Updated**: October 6, 2025
