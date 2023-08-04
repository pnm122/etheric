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
  const [audioCoverFile, setAudioCoverFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [audioCoverFileError, setAudioCoverFileError] = useState<string | null>(null)
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

  const handleChangeCoverFile = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const f = e.target.files[0]
      const t = getFileType(f)

      if(t != 'image') {
        setAudioCoverFileError('Cover image must be an image.')
        setAudioCoverFile(null)
        return
      }

      setAudioCoverFileError(null)
      setAudioCoverFile(f)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if(!file) {
      setFileError('Please upload a file.')
      return
    }

    if(file && file.type.includes('audio') && !audioCoverFile) {
      setAudioCoverFileError('Please upload a cover image with an audio file.')
      return
    }

    uploadItem({
      file,
      audioCoverFile,
      title,
      description
    }).then(results => {
      if(results[0] && results[1] && (results[2] != null ? results[2] : true)) {
        navigate('/admin')
        setNotification(`${file.name} uploaded successfully.`, false)
      } else {
        setNotification('An error occurred uploading the file.', true)
      }
    })
  }

  return (
    <main id={styles.outlet} data-scroll-section>
      <div className="container">
        <Link to="/admin" id={styles.back}>
          <AiFillCaretLeft className="hover-target" />
          Back to Items
        </Link>
        <form id={styles.add} onSubmit={handleSubmit}>
          <h2>Upload an Item</h2>
          <div>
            <div className={styles.uploadContainer}>
              <label 
                htmlFor="file-upload"
                className={`filled-button hover-target ${styles.fileUploadButton}`}
                aria-errormessage={fileError ?? undefined}>
                Choose a File <IoMdAdd className="hover-target" />
              </label>
              <span className={styles.fileName}>{file && file.name}</span>
            </div>
            <input 
              id="file-upload"
              className={styles.fileUpload}
              type="file"
              onChange={handleChangeFile}
              aria-errormessage={fileError ?? undefined}
            />
            { fileError && <span className="error">{fileError}</span> }
          </div>
          {/* If the user uploads an audio file, they need to upload a cover image as well. */}
          { file && file.type.includes('audio') ? (
            <div>
              <div className={styles.uploadContainer}>
                <label 
                  htmlFor="cover-upload"
                  className={`filled-button hover-target ${styles.fileUploadButton}`}
                  aria-errormessage={fileError ?? undefined}>
                  Choose a Cover Image <IoMdAdd className="hover-target" />
                </label>
                <span className={styles.fileName}>{audioCoverFile && audioCoverFile.name}</span>
              </div>
              <input 
                id="cover-upload"
                className={styles.fileUpload}
                type="file"
                onChange={handleChangeCoverFile}
                aria-errormessage={fileError ?? undefined}
              />
              { audioCoverFileError && <span className="error">{audioCoverFileError}</span> }
            </div>
          ) : ( <></> )}
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
