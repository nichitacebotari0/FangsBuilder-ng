terraform {
  backend "azurerm" {
    resource_group_name  = "CVWebsite"
    storage_account_name = "prodstacvwebsite"
    container_name       = "tfstate"
    key                  = "FangsBuilder2.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "resource_group" {
  name     = "FangsBuilder2"
  location = "West Europe"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "prodstafangsbuilder2"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document     = "index.html"
    error_404_document = "index.html"
  }
}

resource "azurerm_cdn_profile" "cdn_profile" {
  name                = "prodcdnpfangsbuilder2"
  location            = "Global" # can also use resource group location and test
  resource_group_name = azurerm_resource_group.resource_group.name
  sku                 = "Standard_Microsoft"
}

resource "azurerm_cdn_endpoint" "cdn_endpoint" {
  name                = "prodcdnefangsbuilder2"
  profile_name        = azurerm_cdn_profile.cdn_profile.name
  location            = "Global" # can also use resource group location and test
  resource_group_name = azurerm_resource_group.resource_group.name

  origin_host_header = azurerm_storage_account.storage_account.primary_web_host
  origin {
    name      = "prodstafangsbuilder2"
    host_name = azurerm_storage_account.storage_account.primary_web_host
  }

  depends_on = [
    azurerm_storage_account.storage_account
  ]
}

resource "azurerm_cdn_endpoint_custom_domain" "cdn_endpoint_custom_domain" {
  name            = "www-fangsbuilder-com"
  cdn_endpoint_id = azurerm_cdn_endpoint.cdn_endpoint.id
  host_name       = "www.fangsbuilder.com"

  cdn_managed_https {
    certificate_type = "Dedicated"            # Shared | Dedicated
    protocol_type    = "ServerNameIndication" # ServerNameIndication  | IPBased
    tls_version      = "TLS12"                # (Optional) TLS10(1.0/1.1) | TLS12(1.2)  | None
  }
}