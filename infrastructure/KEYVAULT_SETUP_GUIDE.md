# Azure Key Vault Setup Guide

## Quick Start

Your Azure Pipeline is already configured to use Azure Key Vault. Follow these steps to store your secrets:

### Option 1: Using the Automated Script (Recommended)

```bash
cd infrastructure
./setup-keyvault-secrets.sh
```

The script will:

1. ✅ Check if you're logged into Azure
2. ✅ Verify Key Vault exists (`mv-staging-ja7cvi`)
3. ✅ Grant access to your Azure DevOps Service Principal
4. ✅ Prompt you to enter each secret securely
5. ✅ Store all secrets with the correct naming convention

### Option 2: Manual Setup Using Azure CLI

```bash
# 1. Login to Azure
az login

# 2. Set the correct subscription
az account set --subscription "Your-Subscription-Name"

# 3. Store MongoDB URI
az keyvault secret set \
  --vault-name mv-staging-ja7cvi \
  --name STAGING-MONGODB-URI \
  --value "your-mongodb-connection-string"

# 4. Store NextAuth Secret
az keyvault secret set \
  --vault-name mv-staging-ja7cvi \
  --name STAGING-NEXTAUTH-SECRET \
  --value "your-nextauth-secret"

# 5. Store JWT Secret
az keyvault secret set \
  --vault-name mv-staging-ja7cvi \
  --name STAGING-JWT-SECRET \
  --value "your-jwt-secret"
```

### Option 3: Using Azure Portal

1. Navigate to [Azure Portal](https://portal.azure.com)
2. Go to **Key Vaults** → `mv-staging-ja7cvi`
3. Click **Secrets** in the left menu
4. Click **+ Generate/Import**
5. Create these secrets:
   - Name: `STAGING-MONGODB-URI`, Value: Your MongoDB connection string
   - Name: `STAGING-NEXTAUTH-SECRET`, Value: Your NextAuth secret
   - Name: `STAGING-JWT-SECRET`, Value: Your JWT secret

## Generate Secure Secrets

If you need to generate new secrets for NextAuth or JWT:

```bash
# Generate NextAuth Secret
openssl rand -base64 48

# Generate JWT Secret
openssl rand -base64 48
```

Or use the Node.js command:

```bash
cd ..
npm run generate:secrets
```

## Grant Access to Azure DevOps

Your pipeline needs access to read secrets from Key Vault. To grant access:

### Find your Service Principal Object ID:

```bash
# List all service principals
az ad sp list --display-name "azure-staging-connection" --query "[].{Name:appDisplayName, ObjectId:id}" -o table
```

### Grant Key Vault access:

```bash
az keyvault set-policy \
  --name mv-staging-ja7cvi \
  --object-id <YOUR_SERVICE_PRINCIPAL_OBJECT_ID> \
  --secret-permissions get list
```

## Verify Setup

Check that secrets are stored correctly:

```bash
# List all secrets
az keyvault secret list --vault-name mv-staging-ja7cvi -o table

# View a specific secret (shows value)
az keyvault secret show \
  --vault-name mv-staging-ja7cvi \
  --name STAGING-MONGODB-URI \
  --query value -o tsv
```

## Pipeline Configuration

Your `azure-pipelines.yml` is already configured:

✅ **KeyVault Name**: `mv-staging-ja7cvi` (line 47)
✅ **AzureKeyVault Task**: Fetches secrets before deployment (line 288-293)
✅ **Secret Names**:

- `STAGING-MONGODB-URI`
- `STAGING-NEXTAUTH-SECRET`
- `STAGING-JWT-SECRET`

## Troubleshooting

### Error: "The user, group or application does not have secrets get permission"

**Solution**: Grant access to your Service Principal:

```bash
az keyvault set-policy \
  --name mv-staging-ja7cvi \
  --object-id <SP_OBJECT_ID> \
  --secret-permissions get list
```

### Error: "Secret not found"

**Solution**: Verify secret names match exactly (case-sensitive):

```bash
az keyvault secret list --vault-name mv-staging-ja7cvi --query "[].name" -o tsv
```

### Error: "KeyVault not found"

**Solution**: Check if Key Vault exists:

```bash
az keyvault list --resource-group rg-mind-voyage-staging -o table
```

## Security Best Practices

✅ **Never commit secrets** to version control
✅ **Use different secrets** for each environment (staging, production)
✅ **Rotate secrets regularly** (every 90 days recommended)
✅ **Use RBAC** instead of access policies when possible
✅ **Enable soft delete** to prevent accidental deletion
✅ **Monitor access logs** in Azure Monitor

## Next Steps

After storing secrets:

1. ✅ Commit your pipeline changes
2. ✅ Push to `develop` branch
3. ✅ Azure Pipeline will automatically fetch secrets from Key Vault
4. ✅ Monitor deployment logs to verify secrets are loaded

## Useful Commands

```bash
# Update a secret
az keyvault secret set --vault-name mv-staging-ja7cvi --name STAGING-MONGODB-URI --value "new-value"

# Delete a secret (soft delete)
az keyvault secret delete --vault-name mv-staging-ja7cvi --name STAGING-MONGODB-URI

# Recover a deleted secret
az keyvault secret recover --vault-name mv-staging-ja7cvi --name STAGING-MONGODB-URI

# Purge a secret (permanent)
az keyvault secret purge --vault-name mv-staging-ja7cvi --name STAGING-MONGODB-URI
```

## Support

For more information:

- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
- [Azure Pipelines Key Vault Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-key-vault)
