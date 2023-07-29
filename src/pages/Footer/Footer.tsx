import { getAuth, signOut } from 'firebase/auth'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <div data-scroll-section className='container' id={styles.footer}>
      <span>Copyright © 2023</span>
      <span>Designed by <a href="https://pierce-martin.com/" target="_blank" rel="noopener noreferrer">Pierce Martin</a></span>
      <button onClick={() => { signOut(getAuth()) }}>Sign Out</button>
    </div>
  )
}
