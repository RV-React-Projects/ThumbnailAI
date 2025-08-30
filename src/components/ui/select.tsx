import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@lib/utils"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  const handleSelect = (itemValue: string) => {
    setSelectedValue(itemValue)
    onValueChange?.(itemValue)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? React.cloneElement(child as React.ReactElement<any>, {
              isOpen,
              setIsOpen,
              selectedValue,
              onSelect: handleSelect,
            })
          : child
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps & any>(
  ({ className, children, isOpen, setIsOpen, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => setIsOpen?.(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
)
SelectTrigger.displayName = "SelectTrigger"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectContent = ({ children, isOpen, onSelect }: SelectContentProps & any) => {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ? React.cloneElement(child as React.ReactElement<any>, { onSelect })
          : child
      )}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps & any>(
  ({ className, children, value, onSelect, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={() => onSelect?.(value)}
      {...props}
    >
      {children}
    </button>
  )
)
SelectItem.displayName = "SelectItem"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectValue = ({ placeholder, selectedValue }: SelectValueProps & any) => (
  <span className={selectedValue ? "" : "text-muted-foreground"}>
    {selectedValue || placeholder}
  </span>
)

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
