import { cn } from "@/utils/cn"
import { forwardRef } from "react"
import { Icon } from "../icon"

interface InputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  containerClassName?: string
}

type Ref = HTMLInputElement

export const Input = forwardRef<Ref, InputProps>(
  ({ className, placeholder, value, onChange, containerClassName }, ref) => (
    <div className={cn("relative flex items-center gap-3 rounded-xl bg-[#E6E6E6] px-4 py-3.5", containerClassName)}>
      <Icon name="Group 3" className="h-4 w-4 text-transparent" />
      <input
        ref={ref}
        className={cn("text-base text-text leading-5 placeholder:font-normal placeholder:text-[#878787]", className)}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  )
)

Input.displayName = "Input"
