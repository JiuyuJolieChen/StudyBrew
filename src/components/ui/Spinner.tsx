'use client'

interface SpinnerProps {
  size?: number
}

export default function Spinner({ size = 20 }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        display: 'inline-block',
        flexShrink: 0,
        animation: 'spin 0.75s linear infinite',
      }}
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <path
        d="M10 2a8 8 0 0 1 8 8"
        stroke="var(--color-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
