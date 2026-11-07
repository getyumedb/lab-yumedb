import type { ExternalProviderType, MediaType } from "./enums"

export interface ExternalProvider {
  id: string
  type: ExternalProviderType
  name: string
  url: string
}

export interface ExternalEntityLink {
  id: string
  providerId: string
  externalId: string
  entityType: string
  entityId: string
  lastSyncedAt: string
}

export interface ExternalLink {
  id: string
  providerId: string
  provider: ExternalProvider
  url: string
}
