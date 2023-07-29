import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Error.module.css'

export default function Error() {
  return (
    <div id={styles.error} className='container'>
      <h1>404</h1>
      <p>We couldn't find what you were looking for.</p>
      <Link to='/'>Go Back Home</Link>
    </div>
  )
}
