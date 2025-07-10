export interface ButtonProps {
  title?: string
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  hidden?: boolean
  position?: "left" | "right" | "top" | "bottom"
}
