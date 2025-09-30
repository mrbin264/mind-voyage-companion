// Mind Voyage Companion - Azure Infrastructure as Code (Bicep)
// This template creates the necessary Azure resources for the Next.js app

@description('The name of the application')
param appName string = 'mind-voyage-companion'

@description('The environment (staging, production)')
@allowed(['staging', 'production'])
param environment string = 'staging'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The Node.js runtime version')
param nodeVersion string = '20-lts'

// =============================================================================
// Variables
// =============================================================================
var uniqueSuffix = substring(uniqueString(resourceGroup().id), 0, 6)
var appServicePlanName = '${appName}-${environment}-plan-${uniqueSuffix}'
var appServiceName = '${appName}-${environment}-app-${uniqueSuffix}'
var appInsightsName = '${appName}-${environment}-insights-${uniqueSuffix}'
var logAnalyticsName = '${appName}-${environment}-logs-${uniqueSuffix}'
var keyVaultName = 'mv-${environment}-${uniqueSuffix}'

// =============================================================================
// Log Analytics Workspace
// =============================================================================
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// =============================================================================
// Application Insights
// =============================================================================
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// =============================================================================
// Key Vault for Secrets Management
// =============================================================================
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenant().tenantId
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    enableRbacAuthorization: true
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// =============================================================================
// App Service Plan
// =============================================================================
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: environment == 'production' ? 'P1v3' : 'B2'
    tier: environment == 'production' ? 'Premium' : 'Basic'
  }
  kind: 'linux'
  properties: {
    reserved: true // Required for Linux plans
  }
  tags: {
    Environment: environment
    Application: appName
  }
}

// =============================================================================
// App Service
// =============================================================================
resource appService 'Microsoft.Web/sites@2023-12-01' = {
  name: appServiceName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    siteConfig: {
      linuxFxVersion: 'NODE|${nodeVersion}'
      alwaysOn: environment == 'production'
      ftpsState: 'Disabled'
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      http20Enabled: true
      httpLoggingEnabled: true
      logsDirectorySizeLimit: 50
      detailedErrorLoggingEnabled: true
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'false'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~20'
        }
        {
          name: 'NEXT_TELEMETRY_DISABLED'
          value: '1'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'NEXTAUTH_URL'
          value: 'https://${appServiceName}.azurewebsites.net'
        }
      ]
      connectionStrings: []
    }
    httpsOnly: true
    clientAffinityEnabled: false
  }
  tags: {
    Environment: environment
    Application: appName
  }

  // Enable diagnostic logs
  resource diagnostics 'config@2023-12-01' = {
    name: 'logs'
    properties: {
      applicationLogs: {
        fileSystem: {
          level: environment == 'production' ? 'Warning' : 'Information'
        }
      }
      httpLogs: {
        fileSystem: {
          retentionInMb: 50
          enabled: true
        }
      }
      detailedErrorMessages: {
        enabled: true
      }
      failedRequestsTracing: {
        enabled: true
      }
    }
  }
}

// =============================================================================
// Key Vault Access Policy for App Service
// =============================================================================
resource keyVaultAccessPolicy 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, appService.id, 'Key Vault Secrets User')
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6') // Key Vault Secrets User
    principalId: appService.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// =============================================================================
// Outputs
// =============================================================================
@description('The name of the App Service')
output appServiceName string = appService.name

@description('The default hostname of the App Service')
output appServiceHostName string = appService.properties.defaultHostName

@description('The App Service resource ID')
output appServiceResourceId string = appService.id

@description('The Key Vault name')
output keyVaultName string = keyVault.name

@description('The Key Vault URI')
output keyVaultUri string = keyVault.properties.vaultUri

@description('The Application Insights Instrumentation Key')
output appInsightsInstrumentationKey string = applicationInsights.properties.InstrumentationKey

@description('The Application Insights Connection String')
output appInsightsConnectionString string = applicationInsights.properties.ConnectionString