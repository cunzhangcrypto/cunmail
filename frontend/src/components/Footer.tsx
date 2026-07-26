import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full mt-20 border-t border-slate-800/50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CunMail
              </div>
              <div className="text-xs text-slate-500">by Web3村长</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://www.cunzhangblog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors">
              🌐 村长博客
            </a>
            <a
              href="https://github.com/oiov/vmail"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors">
              ⭐ GitHub
            </a>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CunMail · Open Source
          </p>
        </div>
      </div>
    </footer>
  );
}
