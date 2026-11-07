import type { MediaType, WorkRelationType } from "./enums"

export interface WorkRelation {
  id: string
  fromId: string
  fromType: MediaType
  toId: string
  toType: MediaType
  relationType: WorkRelationType
}
