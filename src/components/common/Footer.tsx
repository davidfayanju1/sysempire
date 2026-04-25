import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  YoutubeLogo,
  LinkedinLogo,
} from "phosphor-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    shop: [
      { label: "New Arrivals", href: "/collection/new" },
      { label: "Best Sellers", href: "/collection/best-sellers" },
      { label: "Limited Edition", href: "/collection/limited" },
      { label: "Sale", href: "/collection/sale" },
      { label: "Accessories", href: "/collection/accessories" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
    support: [
      { label: "Size Guide", href: "/size-guide" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  };

  const socialLinks = [
    {
      icon: InstagramLogo,
      href: "https://instagram.com",
      label: "Instagram",
    },
    { icon: FacebookLogo, href: "https://facebook.com", label: "Facebook" },
    { icon: TwitterLogo, href: "https://twitter.com", label: "Twitter" },
    {
      icon: YoutubeLogo,
      href: "https://youtube.com",
      label: "YouTube",
    },
    {
      icon: LinkedinLogo,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-8">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4 ml-[-2rem]">
              <img
                src="/images/logo_light.png"
                alt="Logo"
                className="w-36 h-36 object-contain"
              />
            </Link>
            <p className="text-white/40 text-sm mb-4 leading-relaxed max-w-xs">
              Where timeless elegance meets contemporary edge. Crafting luxury
              fashion for the modern visionary.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 border border-white/20 hover:bg-white hover:border-white flex items-center justify-center transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Mail className="w-4 h-4 text-white/60" />
              <a
                href="mailto:hello@velvetnoir.com"
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                hello@velvetnoir.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Phone className="w-4 h-4 text-white/60" />
              <a
                href="tel:+442012345678"
                className="text-sm text-white/40 hover:text-white transition-colors"
              >
                +44 (0) 20 1234 5678
              </a>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin className="w-4 h-4 text-white/60" />
              <span className="text-sm text-white/40">
                123 Fashion Avenue, London, UK
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-white/30 tracking-[0.1em] uppercase">
            © 2024. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-[10px] text-white/30 hover:text-white tracking-[0.1em] uppercase transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[10px] text-white/30 hover:text-white tracking-[0.1em] uppercase transition-colors"
            >
              Terms of Use
            </Link>
            <Link
              to="/cookies"
              className="text-[10px] text-white/30 hover:text-white tracking-[0.1em] uppercase transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-white/20 tracking-[0.15em] uppercase">
              Made with
            </span>
            <Heart className="w-3 h-3 text-white/60" />
            <span className="text-[9px] text-white/20 tracking-[0.15em] uppercase">
              in London
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
