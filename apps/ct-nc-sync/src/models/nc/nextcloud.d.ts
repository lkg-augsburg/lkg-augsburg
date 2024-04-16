export interface NextcloudDirList {
  "d:multistatus": DMultistatus
}

export interface DMultistatus {
  "@xmlns:d": string
  "@xmlns:s": string
  "@xmlns:oc": string
  "@xmlns:nc": string
  "d:response": DResponse[]
}

export interface DResponse {
  "d:href": string
  "d:propstat": DPropstat
}

export interface DPropstat {
  "d:prop": DProp
  "d:status": string
}

export interface DProp {
  "d:getlastmodified": string
  "d:resourcetype": DResourcetype
  "d:quota-used-bytes"?: string
  "d:quota-available-bytes"?: string
  "d:getetag": string
  "d:getcontentlength"?: string
  "d:getcontenttype"?: string
}

export interface DResourcetype {
  // "d:collection"?: DCollection
  "d:collection"?: Record<string, never>
}

// export interface DCollection {}
