export default function secToDateString(seconds: number) {
  const date = new Date(seconds * 1000)

  return date.toDateString()
}