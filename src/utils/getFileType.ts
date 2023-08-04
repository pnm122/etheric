export default function getFileType(file: File) : FileType | 'unknown' {
  const validTypes = ['image', 'video', 'audio']

  for(let t of validTypes) {
    if(file.type.includes(t)) return t as FileType
  }

  return 'unknown'
}