import React, { useEffect, useState } from 'react'
import styles from './Login.module.css'
import { Link, useLocation } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const location = useLocation()

  useEffect(() => {
    // Keep the information the user entered into the register page
    if(location.state) {
      setEmail(location.state.email)
      setPassword(location.state.password)
    }
  }, [])

  const handleSubmit = (e : React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main id={styles.wrapper}>
      <form onSubmit={handleSubmit} id={styles.form}>
        <h1>Etheric</h1>
        <p>Need an account? <Link to="/register" state={{ email, password }}>Register</Link></p>
        <div>
          <label htmlFor="email">Email</label>
          <input name="email" value={email} onChange={e => setEmail(e.target.value)}></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}></input>
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
