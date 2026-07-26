export function Privacy() {
  return (
    <div className="text-slate-200">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">隐私政策</h2>
            <p className="text-xs text-slate-400">最后更新：2026-06-16</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          在 CunMail，我们非常重视用户的隐私。毕竟做临时邮箱就是为了保护隐私的，
          我们自己肯定不能乱来。这份政策简单说一下我们收集什么、存什么、怎么删。
        </p>

        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">01</span> 收集哪些信息
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              我们只收集最少的必要信息：
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>你生成的临时邮箱名称（就是 @ 前面那串）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>你收到的邮件内容（临时存储）</span>
              </li>
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              就这些。不要你手机号，不要你身份证，不要你真实姓名，连密码都是自动生成的。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">02</span> 邮件存多久
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              邮件和邮箱是绑定的，邮箱一过期，所有邮件自动删除。
              默认有效期是 24 小时，你也可以手动点"销毁邮箱"立刻删掉。
            </p>
            <p className="mt-2 text-sm text-slate-400">
              数据存在 Cloudflare D1 数据库里，删除后就找不回来了，这也是为了保护你的隐私。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">03</span> Cookie 说明
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              我们用 Cookie 存两个东西：
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>你的邮箱地址（不然刷新页面就丢了）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>邮箱的验证 Token</span>
              </li>
            </ul>
            <p className="mt-2 text-sm text-slate-400">
              都是功能性的，没有追踪，没有广告，没有第三方分析。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">04</span> 第三方服务
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              我们用 Cloudflare 提供服务器、CDN、邮件路由等基础设施。
              这些服务可能会接触到部分数据，但都受他们自己的隐私政策约束。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">05</span> 数据安全
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              我们尽力保护你的数据，但说实话，互联网上没有 100% 安全的东西。
              所以重要的东西别用临时邮箱收，比如银行密码、私钥什么的。
              临时邮箱就是用来收个验证码、注册个小号的，别用来存敏感信息。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">06</span> 信息共享
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              我们不卖用户数据，也不跟第三方共享。除非法律要求，否则谁来要都不给。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">07</span> 政策更新
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              政策可能会更新，更新了会在页面上改日期。继续用就表示你接受新政策。
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
          <p className="text-sm text-slate-300">
            有问题？去 <a href="https://www.cunzhangblog.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">村长博客</a> 留言就行。
          </p>
        </div>
      </div>
    </div>
  );
}
