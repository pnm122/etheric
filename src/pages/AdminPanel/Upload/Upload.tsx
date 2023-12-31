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
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { HiX } from 'react-icons/hi'

export default function Upload() {
  const [files, setFiles] = useState<File[]>([])
  const [audioCoverFile, setAudioCoverFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [audioCoverFileError, setAudioCoverFileError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<FileType>('image')

  const navigate = useNavigate()
  const { setNotification } = useContext(NotificationContext)

  const updateType = (t : FileType) => {
    setFiles([])
    setType(t)
  }

  const addFile = (e : React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if(!e.target.files) return

    const f = e.target.files[0]
    const t = getFileType(f)

    if(type != t) {
      setFileError(`File must be of type ${type}`)
      return
    }

    if(type == 'audio') {
      setFiles(oldFiles => [...oldFiles, f])
      setFileError(null)
      return
    }

    setFiles([f])
    setFileError(null)
  }

  const removeFile = (e : React.MouseEvent<HTMLButtonElement>, i : number) => {
    e.preventDefault()

    if(i < 0 || i > files.length - 1) {
      console.error('URGENT: Remove index out of bounds?')
      return
    }
    
    const n = files[i].name

    setFiles(oldFiles => {
      return oldFiles.filter(f => f.name != n)
    })
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

    if(files.length == 0) {
      setFileError('Please upload a file.')
      return
    }

    if(files.length > 0 && type == 'audio' && !audioCoverFile) {
      setAudioCoverFileError('Please upload a cover image with an audio file.')
      return
    }

    uploadItem({
      files,
      audioCoverFile,
      type,
      title,
      description
    }).then(results => {
      // Make sure all results are true (everything uploaded correctly)
      let ok = true
      for(let res of results) {
        if(!res) {
          ok = false
          return
        }
      }

      if(ok) {
        navigate('/admin')
        setNotification(`${title} uploaded successfully.`, false)
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
            <TypeSelector onChange={t => updateType(t)} />
          </div>
          <hr></hr>
          { files.length > 0 && (
            <ul id={styles['file-list']}>
              { files.map((f, i) => {
                return (
                  <li key={f.toString()}>
                    <span 
                      data-index={i + 1} 
                      className={type == 'audio' ? styles['audio-file'] : undefined}>
                      {f.name}
                    </span>
                    <button type='button' onClick={(e) => removeFile(e, i)}>
                      <HiX className='hover-target' />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          <div>
            { (type == 'audio' || files.length == 0) && <>
              <div className={styles.uploadContainer}>
                <label 
                  htmlFor="file-upload"
                  className={`filled-button hover-target ${styles.fileUploadButton}`}
                  aria-errormessage={fileError ?? undefined}>
                  Choose a File <IoMdAdd className="hover-target" />
                </label>
                {/* <span className={styles.fileName}>{file && file.name}</span> */}
              </div>
              <input 
                id="file-upload"
                className={styles.fileUpload}
                type="file"
                onChange={addFile}
                aria-errormessage={fileError ?? undefined}
              />
              { fileError && <span className="error">{fileError}</span> }
            </>}
          </div>
          {/* If the user uploads an audio file, they need to upload a cover image as well. */}
          { type == 'audio' ? (
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

interface TypeSelectorProps {
  onChange: (type: FileType) => void
}

const TypeSelector = ({ onChange } : TypeSelectorProps) => {
  const [type, setType] = useState<FileType>('image')
  const [expanded, setExpanded] = useState(false)

  const updateType = (t: FileType) => {
    if(t == type) return

    setExpanded(false)
    setType(t)
    onChange(t)
  }

  return (
    <div id={styles['type-selector']}>
      <label>File Type</label>
      <button 
        type='button'
        onClick={() => setExpanded(!expanded)}
        className='filled-button'>
        {type}
        { expanded ? <FaAngleDown className='hover-target' /> : <FaAngleUp className='hover-target' /> }
      </button>
      <div id={styles['selector-dropdown']} aria-expanded={expanded}>
        <ul>
          <li aria-selected={type == 'image'}>
            <button 
              type='button' 
              onClick={() => updateType('image')}>
              image
            </button>
          </li>
          <li aria-selected={type == 'video'}>
            <button 
              type='button' 
              onClick={() => updateType('video')}>
              video
            </button>
          </li>
          <li aria-selected={type == 'audio'}>
            <button 
              type='button' 
              onClick={() => updateType('audio')}>
              audio
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}