import { getAuth, signOut } from 'firebase/auth'

export default function Footer() {
  return (
    <footer data-scroll-section className='container'>
      <div>
        <span>Copyright © 2023</span>
        <span>Designed by <a href="https://pierce-martin.com/" target="_blank" rel="noopener noreferrer">Pierce Martin</a></span>
        <button onClick={() => { signOut(getAuth()) }}>Sign Out</button>
      </div>
    </footer>
  )
}
