import styles from './Switch.module.css'

interface Props {
  toggled: boolean;
  onClick: () => void;
  title: string;
}

export default function Switch({ toggled, onClick, title } : Props) {
  return (
    <button title={title} className={styles.switch} data-toggled={toggled} onClick={onClick}></button>
  )
}
