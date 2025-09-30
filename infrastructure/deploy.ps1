# Quick Deployment Script for Azure Infrastructure
# This script automates the infrastructure deployment process

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("staging", "production", "both")]
    [string]$Environment,
    
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US"
)

Write-Host "🚀 Azure Infrastructure Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check Azure CLI installation
Write-Host "`n🔍 Checking prerequisites..." -ForegroundColor Blue
if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Azure CLI not found. Please install Azure CLI first." -ForegroundColor Red
    Write-Host "   Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Login check
Write-Host "🔍 Checking Azure authentication..." -ForegroundColor Blue
$currentUser = az account show --query user.name -o tsv 2>$null
if (-not $currentUser) {
    Write-Host "🔑 Please log in to Azure..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Azure login failed" -ForegroundColor Red
        exit 1
    }
}

# Set subscription if provided
if ($SubscriptionName) {
    Write-Host "🎯 Setting Azure subscription to: $SubscriptionName" -ForegroundColor Blue
    az account set --subscription $SubscriptionName
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to set subscription" -ForegroundColor Red
        exit 1
    }
}

$currentSubscription = az account show --query name -o tsv
Write-Host "✅ Using subscription: $currentSubscription" -ForegroundColor Green

# Function to deploy environment
function Deploy-Environment {
    param(
        [string]$EnvName
    )
    
    Write-Host "`n🏗️ Deploying $EnvName environment..." -ForegroundColor Cyan
    
    $resourceGroupName = "rg-mind-voyage-$EnvName"
    $parametersFile = "infrastructure/parameters.$EnvName.json"
    $bicepFile = "infrastructure/azure-resources.bicep"
    
    # Check if files exist
    if (-not (Test-Path $parametersFile)) {
        Write-Host "❌ Parameters file not found: $parametersFile" -ForegroundColor Red
        return $false
    }
    
    if (-not (Test-Path $bicepFile)) {
        Write-Host "❌ Bicep template not found: $bicepFile" -ForegroundColor Red
        return $false
    }
    
    # Create resource group
    Write-Host "📦 Creating resource group: $resourceGroupName" -ForegroundColor Yellow
    az group create --name $resourceGroupName --location $Location --output table
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create resource group" -ForegroundColor Red
        return $false
    }
    
    # Deploy infrastructure
    Write-Host "🚀 Deploying infrastructure..." -ForegroundColor Yellow
    $deploymentName = "mind-voyage-$EnvName-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    
    az deployment group create `
        --resource-group $resourceGroupName `
        --template-file $bicepFile `
        --parameters @$parametersFile `
        --name $deploymentName `
        --output table
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Infrastructure deployment failed" -ForegroundColor Red
        return $false
    }
    
    # Get deployment outputs
    Write-Host "📋 Getting deployment outputs..." -ForegroundColor Blue
    $outputs = az deployment group show --resource-group $resourceGroupName --name $deploymentName --query properties.outputs -o json | ConvertFrom-Json
    
    Write-Host "`n✅ $EnvName deployment completed successfully!" -ForegroundColor Green
    Write-Host "📊 Deployment Summary:" -ForegroundColor Cyan
    Write-Host "   App Service: $($outputs.appServiceName.value)" -ForegroundColor White
    Write-Host "   App URL: https://$($outputs.appServiceHostName.value)" -ForegroundColor White
    Write-Host "   Key Vault: $($outputs.keyVaultName.value)" -ForegroundColor White
    Write-Host "   Application Insights: $($outputs.appInsightsInstrumentationKey.value)" -ForegroundColor White
    
    return $true
}

# Main deployment logic
$success = $true

if ($Environment -eq "both") {
    $success = (Deploy-Environment "staging") -and (Deploy-Environment "production")
} else {
    $success = Deploy-Environment $Environment
}

# Final summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
if ($success) {
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "`n📌 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure MongoDB Atlas clusters" -ForegroundColor White
    Write-Host "2. Run setup-secrets.ps1 to configure Key Vault secrets" -ForegroundColor White
    Write-Host "3. Set up Azure DevOps pipelines" -ForegroundColor White
    Write-Host "4. Configure variable groups in Azure DevOps" -ForegroundColor White
    Write-Host "`n📖 See docs/azure-deployment-guide.md for detailed instructions" -ForegroundColor Blue
} else {
    Write-Host "❌ Deployment failed. Please check the errors above." -ForegroundColor Red
    exit 1
}