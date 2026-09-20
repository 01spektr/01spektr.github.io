import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import "./toolboxi-integration.css";

export function TextGeneratorPage() {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
}
