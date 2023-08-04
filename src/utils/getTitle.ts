import getMetadata from "./getMetadata"

export default async function getTitle() {

  try {
    const res = await getMetadata()
    if(!res) {
      return false
    }
  
    return res.site_title
  } catch(e) {
    console.error(e)
    return false
  }
  
}