import { Link } from "@tanstack/react-router";
import { Github, Heart, Send, Twitter, Youtube } from "lucide-react";
import { ToolboxLogo } from "@/components/brand/logo";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-brand"><ToolboxLogo compact /><p>One place. Many tools.</p></div>
    <nav><Link to="/about">О проекте</Link><a href="mailto:hello@toolboxy.us"><Send className="size-3.5" />Обратная связь</a><Link to="/tools">Предложить инструмент</Link></nav>
    <div className="footer-socials" aria-label="Социальные сети"><a href="https://github.com/01spektr/01spektr.github.io" aria-label="GitHub"><Github /></a><span aria-hidden="true"><Twitter /></span><span aria-hidden="true"><Youtube /></span></div>
    <p className="footer-made">Сделано с <Heart className="size-3 fill-current" /> для полезных людей</p>
    <small>© 2026 ToolBox. Все права защищены.</small>
  </footer>;
}
