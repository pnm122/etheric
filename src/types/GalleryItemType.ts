export default interface GalleryItemType {
  title: string
  description: string
  type: FileType
  timestamp: {
    seconds: number,
    milliseconds: number
  }
  src: string
}