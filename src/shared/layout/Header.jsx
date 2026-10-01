import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { templateConfig as site } from "../../config/template.config";
import logo from "../../assets/logo.png";

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header"><div className="container header-inner">
    <a className="brand" href="#inicio" aria-label={`${site.brand.name} — página inicial`}><img className="brand-logo" src={logo} alt="A.M Gonçalves Advogados" /></a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
    <nav className={open ? "nav open" : "nav"} aria-label="Navegação principal"><a href="#situacoes" onClick={close}>Situações</a><a href="#atuacao" onClick={close}>Atuação</a><a href="#processo" onClick={close}>Como funciona</a><a href="#profissional" onClick={close}>Profissional</a><a href="#equipe" onClick={close}>Equipe</a><a href="#faq" onClick={close}>Dúvidas</a><a className="header-cta" href="#contato" onClick={close}><MessageCircle /> Analisar meu caso</a></nav>
  </div></header>;
}

