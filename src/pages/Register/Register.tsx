import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const location = useLocation()

  useEffect(() => {
    // Keep the information the user entered into the register page
    if(location.state) {
      setEmail(location.state.email)
      setPassword(location.state.password)
      console.log(location.state)
    }
  }, [])

  return (
    <div>Register</div>
  )
}
