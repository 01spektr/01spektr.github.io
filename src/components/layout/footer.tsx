import { Link } from "@tanstack/react-router";
import { ToolboxLogo } from "@/components/brand/logo";

export function Footer() {
  return <footer className="site-footer"><div><ToolboxLogo compact /><p>Онлайн-инструменты для работы и повседневных задач.</p></div><nav><Link to="/about">О проекте</Link><Link to="/privacy">Конфиденциальность</Link><Link to="/terms">Условия использования</Link></nav><small>© 2026 ToolBox. Все права защищены.</small></footer>;
}
