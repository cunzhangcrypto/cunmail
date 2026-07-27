import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { InfoModal } from "./InfoModal.tsx";
import { About } from "../pages/About.tsx";
import { Privacy } from "../pages/Privacy.tsx";
import { Terms } from "../pages/Terms.tsx";

const languages = [
  { code: "zh", name: "简体中文", flag: "🇨🇳" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

function CunMailLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          CunMail
        </span>
        <span className="text-[10px] text-slate-500 tracking-wider">BY WEB3村长</span>
      </div>
    </div>
  );
}

export function Header() {
  const { t, i18n } = useTranslation();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const getCurrentLang = () => {
    const lang = i18n.language;
    const exact = languages.find((l) => l.code === lang);
    if (exact) return exact;
    const baseLang = lang.split("-")[0];
    const base = languages.find((l) => l.code === baseLang);
    return base || languages[0];
  };
  const currentLang = getCurrentLang();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setShowLangDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="backdrop-blur-2xl bg-slate-950/60 border-b border-slate-800/50">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <CunMailLogo />
            </Link>

            <nav className="flex items-center gap-1 md:gap-2">
              <a
                href="https://www.cunzhangblog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                {t("Blog")}
              </a>

              <button
                onClick={() => setShowAboutModal(true)}
                className="hidden md:block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all">
                {t("About")}
              </button>

              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-all">
                  <span>{currentLang.flag}</span>
                  <span className="hidden sm:inline">{currentLang.name}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showLangDropdown && (
                  <div className="absolute right-0 mt-2 w-36 glass-card py-1 z-50 animate-slide-down">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800/50 flex items-center gap-2 transition-colors ${
                          lang.code === i18n.language ? "text-cyan-400" : "text-slate-300"
                        }`}>
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="https://github.com/cunzhangcrypto/cunmail"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span className="hidden sm:inline">Star</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <InfoModal
        showModal={showAboutModal}
        setShowModal={setShowAboutModal}
        title={t("About")}>
        <About />
      </InfoModal>
      <InfoModal
        showModal={showPrivacyModal}
        setShowModal={setShowPrivacyModal}
        title={t("Privacy")}>
        <Privacy />
      </InfoModal>
      <InfoModal
        showModal={showTermsModal}
        setShowModal={setShowTermsModal}
        title={t("Terms")}>
        <Terms />
      </InfoModal>
    </>
  );
}
