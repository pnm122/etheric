export default function getFileType(file: File) {
  const validTypes = ['image', 'video', 'audio']

  for(let t of validTypes) {
    if(file.type.includes(t)) return t
  }

  return 'unknown'
}