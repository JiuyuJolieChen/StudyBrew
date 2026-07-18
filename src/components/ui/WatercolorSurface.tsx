import styles from './WatercolorSurface.module.css'

interface Props {
  seed?: 1 | 2 | 3
}

export default function WatercolorSurface({ seed = 1 }: Props) {
  return (
    <div className={styles.sbEdge} style={{ filter: `url(#sb-jitter-${seed})` }} aria-hidden="true">
      <div className={styles.sbBlobA} />
      <div className={styles.sbBlobB} />
      <div className={styles.sbGrain} />
    </div>
  )
}
