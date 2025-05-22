import { memo } from "react";

import { cn } from "@/utils/cn";

interface IconButtonProps {
  icon: React.ElementType;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IconButton = memo(({ icon: Icon, label, disabled, onClick, className }: IconButtonProps) => (
  <button
    className={cn(
      "flex flex-1 flex-col items-center justify-center gap-1 px-1 pb-2 pt-3 disabled:opacity-50",
      className,
    )}
    disabled={disabled || !onClick}
    type="button"
    onClick={onClick}
  >
    <div className="bg-accent flex w-min items-center justify-center rounded-full p-3">
      <Icon className="h-6 w-6 fill-none stroke-white" />
    </div>
    {label && <div className="text-accent text-caption-2 whitespace-nowrap font-medium">{label}</div>}
  </button>
));

IconButton.displayName = "IconButton";
