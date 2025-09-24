import 'framer-motion'

declare module 'framer-motion' {
  interface MotionProps {
    className?: string
    [key: string]: unknown
  }
}
