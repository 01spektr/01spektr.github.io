export function ToolboxMark({ className }: { className?: string }) {
  return (
    <img src="/toolboxi_uz_icon.svg" alt="" aria-hidden="true" className={className ?? "size-8"} />
  );
}

export function ToolboxLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={compact ? "/toolboxi_uz_icon.svg" : "/toolboxi_uz_logo.svg"}
      alt="Toolboxi.uz"
      className={compact ? "size-8" : "h-8 w-auto"}
    />
  );
}
