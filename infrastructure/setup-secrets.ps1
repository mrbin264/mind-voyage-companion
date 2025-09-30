# Azure Key Vault Secrets Configuration Script
# This PowerShell script configures required secrets in Azure Key Vault

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production")]
    [string]$Environment,
    
    [Parameter(Mandatory=$true)]
    [string]$KeyVaultName,
    
    [Parameter(Mandatory=$false)]
    [string]$MongoDbUri,
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateSecrets
)

# Ensure Azure CLI is installed and user is logged in
Write-Host "🔍 Checking Azure CLI authentication..." -ForegroundColor Blue
$currentUser = az account show --query user.name -o tsv
if (-not $currentUser) {
    Write-Host "❌ Please log in to Azure CLI first: az login" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in as: $currentUser" -ForegroundColor Green

# Verify Key Vault exists and we have access
Write-Host "🔍 Verifying Key Vault access..." -ForegroundColor Blue
$kvExists = az keyvault show --name $KeyVaultName --query name -o tsv 2>$null
if (-not $kvExists) {
    Write-Host "❌ Key Vault '$KeyVaultName' not found or access denied" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Key Vault access confirmed" -ForegroundColor Green

# Function to generate secure secrets
function Generate-SecureSecret {
    param([int]$Length = 48)
    $bytes = New-Object byte[] $Length
    [System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    return [Convert]::ToBase64String($bytes)
}

# Function to set Key Vault secret
function Set-KeyVaultSecret {
    param(
        [string]$SecretName,
        [string]$SecretValue,
        [string]$Description = ""
    )
    
    Write-Host "🔒 Setting secret: $SecretName" -ForegroundColor Yellow
    
    $result = az keyvault secret set `
        --vault-name $KeyVaultName `
        --name $SecretName `
        --value $SecretValue `
        --description $Description `
        --query name -o tsv
    
    if ($result -eq $SecretName) {
        Write-Host "✅ Secret '$SecretName' configured successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to configure secret '$SecretName'" -ForegroundColor Red
        return $false
    }
    return $true
}

Write-Host "`n🚀 Configuring Azure Key Vault secrets for $Environment environment..." -ForegroundColor Cyan
Write-Host "📝 Key Vault: $KeyVaultName" -ForegroundColor Cyan

# Generate or prompt for secrets
$secrets = @{}

if ($GenerateSecrets) {
    Write-Host "`n🎲 Generating secure secrets..." -ForegroundColor Blue
    $secrets["NEXTAUTH-SECRET"] = Generate-SecureSecret -Length 48
    $secrets["JWT-SECRET"] = Generate-SecureSecret -Length 48
    Write-Host "✅ Secrets generated successfully" -ForegroundColor Green
} else {
    Write-Host "`n📝 Please provide the following secrets:" -ForegroundColor Blue
    
    # NextAuth Secret
    $nextAuthSecret = Read-Host "NextAuth Secret (min 32 chars, press Enter to generate)"
    if ([string]::IsNullOrWhiteSpace($nextAuthSecret)) {
        $secrets["NEXTAUTH-SECRET"] = Generate-SecureSecret -Length 48
        Write-Host "✅ Generated NextAuth Secret" -ForegroundColor Green
    } else {
        $secrets["NEXTAUTH-SECRET"] = $nextAuthSecret
    }
    
    # JWT Secret
    $jwtSecret = Read-Host "JWT Secret (min 32 chars, press Enter to generate)"
    if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
        $secrets["JWT-SECRET"] = Generate-SecureSecret -Length 48
        Write-Host "✅ Generated JWT Secret" -ForegroundColor Green
    } else {
        $secrets["JWT-SECRET"] = $jwtSecret
    }
}

# MongoDB URI
if ($MongoDbUri) {
    $secrets["MONGODB-URI"] = $MongoDbUri
} else {
    $mongoUri = Read-Host "MongoDB Atlas URI (required)"
    if ([string]::IsNullOrWhiteSpace($mongoUri)) {
        Write-Host "❌ MongoDB URI is required" -ForegroundColor Red
        exit 1
    }
    $secrets["MONGODB-URI"] = $mongoUri
}

# Optional: Google OAuth credentials
$useGoogleOAuth = Read-Host "Configure Google OAuth? (y/N)"
if ($useGoogleOAuth -eq 'y' -or $useGoogleOAuth -eq 'Y') {
    $googleClientId = Read-Host "Google OAuth Client ID"
    $googleClientSecret = Read-Host "Google OAuth Client Secret"
    
    if (![string]::IsNullOrWhiteSpace($googleClientId)) {
        $secrets["OAUTH-GOOGLE-CLIENT-ID"] = $googleClientId
    }
    if (![string]::IsNullOrWhiteSpace($googleClientSecret)) {
        $secrets["OAUTH-GOOGLE-CLIENT-SECRET"] = $googleClientSecret
    }
}

# Configure secrets in Key Vault
Write-Host "`n🔐 Configuring secrets in Azure Key Vault..." -ForegroundColor Blue

$allSuccess = $true

# Set each secret with environment prefix for organization
foreach ($secretName in $secrets.Keys) {
    $envSecretName = "$($Environment.ToUpper())-$secretName"
    $success = Set-KeyVaultSecret -SecretName $envSecretName -SecretValue $secrets[$secretName] -Description "Mind Voyage Companion $Environment environment secret"
    if (-not $success) {
        $allSuccess = $false
    }
}

# Output summary
Write-Host "`n📋 Configuration Summary:" -ForegroundColor Cyan
Write-Host "════════════════════════" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor White
Write-Host "Key Vault: $KeyVaultName" -ForegroundColor White
Write-Host "Secrets configured: $($secrets.Count)" -ForegroundColor White

if ($allSuccess) {
    Write-Host "`n✅ All secrets configured successfully!" -ForegroundColor Green
    Write-Host "`n📌 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Update Azure DevOps variable groups with Key Vault references" -ForegroundColor White
    Write-Host "2. Configure App Service to reference these Key Vault secrets" -ForegroundColor White
    Write-Host "3. Test the deployment pipeline" -ForegroundColor White
} else {
    Write-Host "`n❌ Some secrets failed to configure. Please check the errors above." -ForegroundColor Red
    exit 1
}

# Security reminder
Write-Host "`n🔒 Security Reminders:" -ForegroundColor Yellow
Write-Host "- Never commit secrets to source control" -ForegroundColor White
Write-Host "- Use different secrets for each environment" -ForegroundColor White
Write-Host "- Rotate secrets regularly" -ForegroundColor White
Write-Host "- Monitor Key Vault access logs" -ForegroundColor White