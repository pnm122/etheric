import { Link, useNavigate } from 'react-router-dom'
import styles from '../AdminPanel.module.css'
import { AiFillCaretLeft } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import { MdFileUpload } from 'react-icons/md'
import { useState } from 'react'
import uploadItem from 'utils/uploadItem'
import getFileType from 'utils/getFileType'
import { useContext } from 'react'
import { NotificationContext } from 'context/NotificationContext'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const navigate = useNavigate()
  const { setNotification } = useContext(NotificationContext)

  const handleChangeFile = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const f = e.target.files[0]
      const t = getFileType(f)

      if(t == 'unknown') {
        setFileError('File must be an image, video, or audio.')
        setFile(null)
        return
      }

      setFileError(null)
      setFile(f)
      // Remove file extension for default title
      setTitle(f.name.split('.')[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if(!file) return

    uploadItem({
      file,
      title,
      description
    }).then(results => {
      if(results[0] && results[1]) {
        navigate('/admin')
        setNotification(`${file.name} uploaded successfully.`, false)
        console.log('first')
      } else {
        // Show some error
        setNotification('An error occurred uploading the file.', true)
      }
    })
  }

  return (
    <main data-scroll-container>
      <div className="container">
        <Link to="/admin" id={styles.back}>
          <AiFillCaretLeft className="hover-target" />
          Back to Items
        </Link>
        <form id={styles.add} onSubmit={handleSubmit}>
          <h2>Upload an Item</h2>
          <div>
            <div id={styles.uploadContainer}>
              <label 
                id={styles.fileUploadButton}
                htmlFor={styles.fileUpload}
                className="filled-button hover-target"
                aria-errormessage={fileError ?? undefined}>
                Choose a File <IoMdAdd className="hover-target" />
              </label>
              <span id={styles.fileName}>{file && file.name}</span>
            </div>
            <input 
              id={styles.fileUpload}
              type="file"
              onChange={handleChangeFile}
              aria-errormessage={fileError ?? undefined}
            />
            { fileError && <span className="error">{fileError}</span> }
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input 
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea 
              name="description"
              id={styles.description}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
          <button 
            className="filled-button"
            type="submit">
            Upload <MdFileUpload className="hover-target" />
          </button>
        </form>
      </div>
    </main>
  )
}
