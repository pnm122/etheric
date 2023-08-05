import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './styles.module.css'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const location = useLocation()
  const auth = getAuth()

  useEffect(() => {
    // Keep the information the user entered into the register page
    if(location.state) {
      setEmail(location.state.email)
      setPassword(location.state.password)
    }
  }, [])

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()

    // Validate
    if(email == '') {
      setEmailError('Please enter an email')
      setPasswordError(null)
      setConfirmPasswordError(null)
      return
    }

    if(password != confirmPassword) {
      setEmailError(null)
      setPasswordError(null)
      setConfirmPasswordError('Passwords must match')
      return
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      // navigation handled by onAuthStateChanged
    })
    .catch(e => {
      setEmailError(null)
      setPasswordError(null)
      setConfirmPasswordError(null)

      // Show error to the user
      switch(e.code) {
        case 'auth/email-already-in-use':
          setEmailError('Email already in use')
          break
        case 'auth/invalid-email':
          setEmailError('Invalid email')
          break
        case 'auth/operation-not-allowed':
          window.alert('Email/password authentication not set up properly. Check Firebase.')
          break
        case 'auth/weak-password':
          setPasswordError('Password too weak')
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
        <p>Already have an account? <Link to="/login" state={{ email, password }}>Login</Link></p>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email" 
            name="email" 
            value={email} 
            aria-errormessage={emailError ?? undefined}
            onChange={e => setEmail(e.target.value)}>
          </input>
          { emailError && <span className={styles.error}>{emailError}</span> }
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
          { passwordError && <span className={styles.error}>{passwordError}</span> }
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password" 
            name="confirm-password" 
            value={confirmPassword} 
            aria-errormessage={confirmPasswordError ?? undefined} 
            onChange={e => setConfirmPassword(e.target.value)}>
          </input>
          { confirmPasswordError && <span className={styles.error}>{confirmPasswordError}</span> }
        </div>
        <button type="submit">Register</button>
      </form>
    </main>
  )
}
