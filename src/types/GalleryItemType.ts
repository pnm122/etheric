type GalleryItemType = GalleryItemFromDBType & { slug: string }

export type GalleryItemWithURLType = GalleryItemType & { url: string }

export interface GalleryItemFromDBType {
  title: string
  description: string
  type: FileType
  timestamp: {
    seconds: number,
    milliseconds: number
  }
  src: string
  coverSrc?: string
}

export default GalleryItemType