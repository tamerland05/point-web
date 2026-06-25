import { forwardRef, type KeyboardEvent } from "react"

import { cn } from "@/utils/cn"

import { Icon } from "../icon"

interface InputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  className?: string
  containerClassName?: string
}

type Ref = HTMLInputElement

export const Input = forwardRef<Ref, InputProps>(
  ({ className, placeholder, value, onChange, onFocus, onBlur, onKeyDown, containerClassName }, ref) => (
    <label className={cn("relative flex items-center gap-3 rounded-xl bg-[#E6E6E6] px-4 py-3.5", containerClassName)}>
      <Icon className="h-4 w-4 shrink-0 text-[#878787]" name="Group 3" />
      <input
        className={cn(
          "w-full text-base text-text leading-5 placeholder:font-normal placeholder:text-[#878787] focus:outline-none",
          className
        )}
        onBlur={onBlur}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        ref={ref}
        value={value}
      />
    </label>
  )
)

Input.displayName = "Input"
