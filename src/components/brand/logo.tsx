import { cn } from "@/lib/utils";

export function ToolboxMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <path
        d="M16 3.2 27.2 9.6v12.8L16 28.8 4.8 22.4V9.6L16 3.2Z"
        fill="none"
        stroke="#5b8cff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12.2 11.2h7.6c.7 0 1.2.5 1.2 1.2v2.1H18.3v6.3h-4.6v-6.3H11V12.4c0-.7.5-1.2 1.2-1.2Z"
        fill="#5b8cff"
      />
    </svg>
  );
}

export function ToolboxLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <ToolboxMark />
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-foreground">
          ToolBox
        </span>
        {compact ? null : (
          <span className="text-[11px] text-sidebar-muted">One place. Many tools.</span>
        )}
      </span>
    </span>
  );
}
