import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const location = useLocation()
  const auth = getAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Keep the information the user entered into the register page
    if(location.state) {
      setEmail(location.state.email)
      setPassword(location.state.password)
    }
  }, [])

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, email, password)
    .then(res => {
      // navigation handled by onAuthStateChanged
    })
    .catch(e => {
      setEmailError(null)
      setPasswordError(null)

      switch(e.code) {
        case 'auth/invalid-email':
          setEmailError('Invalid email')
          break
        case 'auth/user-disabled':
          setEmailError('This user is disabled')
          break
        case 'auth/user-not-found':
          setEmailError('User not found')
          break
        case 'auth/wrong-password':
          setPasswordError('Incorrect password')
          break
        default:
          window.alert(`Unknown error code: ${e.code}`)
          break
      }
    })
  }

  return (
    <main id={styles.wrapper}>
      <form onSubmit={handleSubmit} id={styles.form}>
        <h1>Etheric</h1>
        <p>Need an account? <Link to="/register" state={{ email, password }}>Register</Link></p>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email" 
            name="email" 
            value={email} 
            aria-errormessage={emailError ?? undefined}
            onChange={e => setEmail(e.target.value)}>
          </input>
          { emailError && <span className="error">{emailError}</span> }
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            name="password" 
            value={password} 
            aria-errormessage={passwordError ?? undefined} 
            onChange={e => setPassword(e.target.value)}>
          </input>
          { passwordError && <span className="error">{passwordError}</span> }
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
