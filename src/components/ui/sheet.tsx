import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetTitle = SheetPrimitive.Title
const SheetDescription = SheetPrimitive.Description

function SheetContent({
  className,
  children,
  closeLabel,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { closeLabel: string }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="bg-night-2/80 fixed inset-0 z-50 backdrop-blur-sm" />
      {/* `start-0` already resolves to the right edge in RTL, so the panel opens
          from the same side as the reading direction without an rtl: override.
          Its visible edge is therefore always the inline end. */}
      <SheetPrimitive.Content
        className={cn(
          'bg-night-3 border-rule fixed inset-y-0 start-0 z-50 flex w-72 max-w-[85vw] flex-col gap-2 border-e p-7 shadow-2xl',
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          aria-label={closeLabel}
          className="text-moon-2 hover:text-moon absolute top-5 end-5 transition-colors"
        >
          <X className="size-5" />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription }
