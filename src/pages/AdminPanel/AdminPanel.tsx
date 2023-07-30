import styles from './AdminPanel.module.css'
import { Outlet } from 'react-router-dom'

export default function AdminPanel() {
  return (
    <>
      <div className="container" data-scroll-section>
        <div id={styles.header}>
          <h1>Etheric</h1>
        </div>
      </div>
      <Outlet />
    </>
  )
}
