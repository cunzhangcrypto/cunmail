export function About() {
  return (
    <div className="text-slate-200">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">CunMail 临时邮箱</h2>
            <p className="text-xs text-slate-400">by Web3村长 · 保护隐私，拒绝垃圾邮件</p>
          </div>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-cyan-400">💡</span> 这是什么？
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            CunMail 是一款免费的临时邮箱服务，不用注册、不用绑手机号，点一下就能生成一个邮箱地址，
            用来收验证码、注册陌生网站、防垃圾邮件，特别好用。
          </p>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span className="text-cyan-400">✨</span> 核心特点
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span><strong className="text-white">即开即用</strong> — 不用注册，不用填任何个人信息</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span><strong className="text-white">隐私保护</strong> — 邮箱到期自动销毁，不留痕迹</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span><strong className="text-white">多域名支持</strong> — 多个后缀随便选，不怕被拉黑</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span><strong className="text-white">Cloudflare 架构</strong> — 全球节点，速度快又稳定</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span><strong className="text-white">完全开源</strong> — 代码公开，你也可以自己搭一个</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-cyan-400">🎯</span> 适用场景
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              📱 注册陌生APP
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              🔐 收验证码
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              🚫 防垃圾邮件
            </div>
            <div className="bg-slate-900/50 rounded-lg p-2 text-center">
              🧪 测试网站功能
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-cyan-400">👨‍🌾</span> 关于村长
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            我是 Web3村长，分享 AIGC、互联网科技、跨境工具、网络媒体知识。
            这个项目是我在原版 vmail 基础上二开的，目的是让更多人能轻松搭建自己的临时邮箱。
          </p>
          <a
            href="https://www.cunzhangblog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
            🌐 去村长博客逛逛
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <span className="text-cyan-400">⚠️</span> 合理使用
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            临时邮箱是为了保护隐私，不是用来干坏事的。请不要用它发送垃圾邮件、诈骗信息或任何违法内容。
            滥用不仅违反服务条款，也会影响其他正常用户的使用体验。大家且用且珍惜。
          </p>
        </div>
      </div>
    </div>
  );
}
