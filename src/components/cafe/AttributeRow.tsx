import { ReactNode } from 'react'
import styles from './CafeCard.module.css'

interface AttributeRowProps {
  icon: ReactNode
  label: string
  value: string
}

export default function AttributeRow({ icon, label, value }: AttributeRowProps) {
  return (
    <div className={styles['attribute-row']}>
      <span className={styles['attribute-icon']} aria-hidden="true">
        {icon}
      </span>
      <span className={styles['attribute-label']}>{label}</span>
      <span className={styles['attribute-value']}>{value}</span>
    </div>
  )
}
