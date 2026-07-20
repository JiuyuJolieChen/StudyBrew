import { Fragment } from 'react'
import { HoursJson } from '@/types'
import { DAYS, DAY_LABELS } from '@/lib/constants'
import styles from './CafeCard.module.css'
import uiStyles from '@/components/ui/ui.module.css'

interface HoursTableProps {
  hours: HoursJson
}

export default function HoursTable({ hours }: HoursTableProps) {
  if (!hours) {
    return <span className={styles['hours-unknown']}>Hours unknown</span>
  }

  return (
    <div className={styles['hours-table']}>
      {DAYS.map((day) => {
        const entry = hours[day]
        return (
          <Fragment key={day}>
            <span className={styles['hours-day']}>
              {DAY_LABELS[day]}
            </span>
            <span className={styles['hours-time']}>
              {entry
                ? <>{entry.open} <span className={uiStyles.dash} aria-hidden="true" /> {entry.close}</>
                : 'Closed'}
            </span>
          </Fragment>
        )
      })}
    </div>
  )
}
