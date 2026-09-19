import type { ErrorComponentProps } from "@tanstack/react-router";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const message = errorMessage(error);

  useEffect(() => {
    const isStaleDeployment = /dynamically imported module|Importing a module script failed|Failed to fetch/i.test(message);
    const recoveryKey = "toolboxi:error-recovery";
    if (isStaleDeployment && !sessionStorage.getItem(recoveryKey)) {
      sessionStorage.setItem(recoveryKey, "1");
      window.location.reload();
      return;
    }
    sessionStorage.removeItem(recoveryKey);
  }, [message]);

  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center " +
        "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
      }
    >
      <span className="text-red-500" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">Не удалось загрузить страницу</h1>
      <p className="max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400">
        {message}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Обновить страницу
      </button>
    </main>
  );
}
