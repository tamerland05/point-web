import { accountAssets } from "./accountAssets"

interface AccountSearchFieldProps {
  onChange: (value: string) => void
  parityStatic?: boolean
  placeholder: string
  value: string
}

export function AccountSearchField({ onChange, parityStatic, placeholder, value }: AccountSearchFieldProps) {
  return (
    <div className="flex h-[46px] flex-1 items-center rounded-[14px] bg-black/[0.04] px-3">
      <img alt="" className="mr-2 h-5 w-5 shrink-0" src={accountAssets.search} />
      {parityStatic ? (
        <span className="pt-0.5 text-[#8d969d] text-[15px] leading-[18px]">{placeholder}</span>
      ) : (
        <input
          className="w-full bg-transparent pt-0.5 text-[#222222] text-[15px] leading-[18px] outline-none placeholder:text-[#8d969d]"
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      )}
    </div>
  )
}
