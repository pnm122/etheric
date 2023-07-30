import { Link } from 'react-router-dom'
import styles from '../AdminPanel.module.css'
import { AiFillCaretLeft } from 'react-icons/ai'
import { IoMdAdd } from 'react-icons/io'
import { MdFileUpload } from 'react-icons/md'
import { useState, useEffect } from 'react'

export default function Add() {
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleChangeFile = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
      const f = e.target.files[0]

      if(!f.type.includes('image') &&
         !f.type.includes('video') &&
         !f.type.includes('audio')) {
        setFileError('File must be an image, video, or audio.')
        setFile(null)
        return
      }

      setFileError(null)
      setFile(f)
      setTitle(f.name.split('.')[0])
    }
  }

  return (
    <main data-scroll-container>
      <div className="container">
        <Link to="/admin" id={styles.back}>
          <AiFillCaretLeft className="hover-target" />
          Back to Items
        </Link>
        <div id={styles.add}>
          <h2>Add an Item</h2>
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
          <button className="filled-button">Upload <MdFileUpload className="hover-target" /></button>
        </div>
      </div>
    </main>
  )
}
