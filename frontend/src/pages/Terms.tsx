export function Terms() {
  return (
    <div className="text-slate-200">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">使用条款</h2>
            <p className="text-xs text-slate-400">最后更新：2026-06-16</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          欢迎使用 CunMail！用之前先看看这些条款，都是大白话，不难懂。
          用了就表示你同意这些条款，不同意就别用。
        </p>

        <div className="space-y-4">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">01</span> 服务说明
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              CunMail 是一个免费的临时邮箱服务，用来保护你的隐私，避免真实邮箱泄露。
              服务基于 Cloudflare 网络构建，速度还可以，但不保证 100% 可用。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">02</span> 不能干啥
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-2">
              用 CunMail 干这些事是不行的：
            </p>
            <ul className="space-y-1.5 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>发送或接收垃圾邮件、诈骗邮件</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>注册违法违规网站或服务</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>进行任何违法活动</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>攻击、滥用、干扰服务正常运行</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                <span>批量创建邮箱用于恶意目的</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">03</span> 免责声明
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              服务按"现状"提供，不保证一定好用，也不保证数据不丢。
              用这个服务产生的任何问题，我们都不负责。
            </p>
            <p className="mt-2 text-sm text-slate-400">
              包括但不限于：邮件收不到、邮件丢失、服务中断、数据泄露等等。
              重要邮件别往这儿发，丢了找不回来。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">04</span> 服务变更和终止
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              我们随时可能改功能、改规则、甚至停掉服务。不用提前通知，也不用给你补偿。
              毕竟是免费的，理解一下。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">05</span> 你的责任
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              你用这个服务，就得对自己的行为负责。
              如果因为你滥用服务导致我们有损失，你得承担责任。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">06</span> 开源项目说明
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              这个项目是开源的，你可以自己搭一个用。
              但请保留版权信息和原作者声明，别直接拿去当自己的东西卖。
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-cyan-400">07</span> 条款更新
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              条款可能会改，改了直接在页面更新，不单独通知。
              继续用就表示你接受新条款。
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
          <p className="text-sm text-slate-300">
            有问题？去 <a href="https://www.cunzhangblog.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">村长博客</a> 找我。
          </p>
        </div>
      </div>
    </div>
  );
}
