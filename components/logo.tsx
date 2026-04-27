import { PiWebhooksLogoFill } from "react-icons/pi";

export function HookLensLogo({ className = "size-8" }: { className?: string }) {
  return (
    <PiWebhooksLogoFill className={`text-primary`} />
  )
}

export function HookLensLogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HookLensLogo />
      <span className="font-mono text-lg font-bold tracking-tight">
        <span className="text-foreground">Hook</span>
        <span className="text-primary">Lens</span>
      </span>
    </div>
  )
}