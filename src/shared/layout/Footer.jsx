import { Facebook, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { templateConfig as site } from "../../config/template.config";
import logo from "../../assets/logo.png";

export function Footer() {
  return <footer><div className="container footer-inner">
    <div className="footer-brand"><img className="footer-logo" src={logo} alt="A.M Gonçalves Advogados" /><div><h3>{site.brand.name}</h3><strong>{site.brand.descriptor} · {site.brand.oab}</strong></div></div>
    <div className="footer-contacts"><a href="#contato"><MessageCircle />{site.contact.phoneLabel}</a><a href={`mailto:${site.contact.email}`}><Mail />{site.contact.email}</a><span><MapPin />{site.office.district}</span></div>
    <div className="footer-socials" aria-label="Redes sociais"><span>Siga o escritório</span><a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="A.M. Gonçalves Advogados no Instagram"><Instagram /> Instagram</a><a href={site.contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="A.M. Gonçalves Advogados no Facebook"><Facebook /> Facebook</a></div>
    <p>Este conteúdo possui caráter exclusivamente informativo e não representa promessa de resultado. Cada caso depende de análise individual, conforme a legislação aplicável e as normas éticas da OAB.</p>
    <a className="developed-by" href="https://somos4juris.com.br/" target="_blank" rel="noopener noreferrer">Desenvolvido por 4Juris</a>
  </div></footer>;
}

