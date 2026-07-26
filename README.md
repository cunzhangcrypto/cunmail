<div align="center">
  <h1>🚀 CunMail - 村长的临时邮箱系统</h1>
  <p>
    <a href="https://www.cunzhangblog.com" target="_blank">村长博客</a> ·
    <a href="#-部署教程">部署教程</a> ·
    <a href="#-功能特性">功能特性</a> ·
    <a href="#-常见问题">常见问题</a>
  </p>
  <p>基于 Cloudflare 全家桶搭建的开源临时邮箱系统，手把手教你拥有自己的邮箱</p>
</div>

> 👨‍🌾 大家好，我是 web3 村长！这个项目是我基于 vmail 二开的临时邮箱系统，主打一个简单实用，跟着教程走，小白也能搭出自己的邮箱网站。
>
> 更多技术教程和干货，欢迎来我的博客逛逛：[cunzhangblog.com](https://www.cunzhangblog.com)

---

## ✨ 功能特性

- 🎯 **隐私友好** - 不用注册，用完即焚，保护你的真实邮箱
- ⏰ **自定义有效期** - 支持 1小时/6小时/24小时/7天，想用多久选多久
- 🔔 **桌面通知** - 新邮件来了第一时间提醒，不用一直刷页面
- 📝 **邮箱备注** - 给每个邮箱加个备注，再也不忘记是注册啥用的
- ✈️ **支持收发邮件** - 不仅能收，还能匿名发邮件
- 🔐 **密码找回** - 保存邮箱密码，随时找回历史邮箱
- 🌐 **多域名支持** - 一个系统，多个域名后缀随便选
- 🔌 **开放 API** - 提供 RESTful API，想怎么玩就怎么玩
- 🚀 **零成本部署** - 纯 Cloudflare 方案，不用买服务器，域名就行

---

## 🎯 部署前准备

在开始之前，你需要准备这些东西：

| 材料 | 说明 | 是否必需 |
|------|------|--------|
| Cloudflare 账号 | 免费注册就行 | ✅ |
| 一个域名 | 托管在 Cloudflare 上 | ✅ |
| Node.js 环境 | 本地装一下，版本 >= 22 | ⚠️ 本地部署才需要 |
| 双手和脑子 | 跟着教程一步步来 | ✅ |

> 💡 **新手建议**：如果你是纯小白，推荐直接看下面的「GitHub Action 自动部署」，不用装本地环境，点几下就好。

---

## 🚀 部署教程

### 方式一：GitHub Action 自动部署（推荐新手）

这个方法最简单，不用在你电脑上装乱七八糟的东西，有手就行。

#### 第一步：Fork 项目

1.  点右上角的 **Fork** 按钮，把项目复制到你自己的 GitHub 账号下
2.  等 Fork 完成后，进入你自己的项目仓库

#### 第二步：准备 Cloudflare 信息

你需要从 Cloudflare 拿到这几样东西：

1.  **Cloudflare API Token**
    - 去 Cloudflare 头像 → My Profile → API Tokens → Create Token
    - 选「Edit Cloudflare Workers」模板就行
    - 权限选 Workers Routes、D1、Account Settings、User Details
    - 建好后把 token 复制下来，只显示一次！

2.  **Account ID**
    - 打开 Cloudflare 首页，右边就能看到 Account ID

3.  **D1 数据库**
    - 去 Workers & Pages → D1 → Create database
    - 名字随便起，比如 `cunmail`
    - 建好后复制 Database ID

4.  **域名**
    - 确保你的域名已经托管在 Cloudflare 上了

#### 第三步：配置 GitHub Secrets

在你 Fork 的项目里：

1.  点 **Settings** → 左边 **Secrets and variables** → **Actions**
2.  点 **New repository secret**，一个个添加下面这些：

| Secret 名称 | 填什么 |
|-------------|--------|
| `CF_API_TOKEN` | 你刚才复制的 Cloudflare API Token |
| `CF_ACCOUNT_ID` | 你的 Cloudflare Account ID |
| `D1_DATABASE_NAME` | D1 数据库名字，比如 `cunmail` |
| `D1_DATABASE_ID` | D1 数据库 ID |
| `EMAIL_DOMAIN` | 你的邮箱域名，比如 `example.com` |
| `COOKIES_SECRET` | 随便写一串随机字符，越乱越安全 |

其他可选的后面再配，先把这几个必填的加上。

#### 第四步：触发部署

1.  点顶部的 **Actions** 标签
2.  左边选 **Deploy to Cloudflare**
3.  点右边的 **Run workflow** → 选 main 分支 → 点 Run workflow
4.  等几分钟，绿灯亮了就说明部署成功了！

#### 第五步：配置邮件路由

这步很重要，不然收不到邮件！

1.  打开 Cloudflare → 选你的域名 → **Email** → **Email Routing**
2.  如果第一次用，先点「Get started」开通 Email Routing
3.  然后去 **Routes** 选项卡
4.  点 **Create rule**
    - **Action** 选 `Send to a Worker`
    - **Worker** 选你刚部署的那个 worker（名字叫 cunmail）
5.  保存，搞定！

现在试试发一封邮件到 `随便什么@你的域名.com`，等个十几秒看看能不能收到。

---

### 方式二：本地手动部署（适合想折腾的）

如果你想在本地改代码再部署，用这个方法。

```bash
# 1. 克隆项目
git clone https://github.com/你的用户名/cunmail.git
cd cunmail

# 2. 装依赖
pnpm install
# 没有 pnpm？先装：npm install -g pnpm

# 3. 配置环境变量
cp .env.example .env
# 然后编辑 .env 文件，填你的配置

# 4. 构建
pnpm run build

# 5. 登录 Cloudflare
pnpm exec wrangler login

# 6. 部署
pnpm run deploy

# 7. 初始化数据库（第一次部署要跑）
pnpm exec wrangler d1 migrations apply cunmail --remote
```

部署完了别忘了配置邮件路由，参考上面方式一的第五步。

---

## ⚙️ 环境变量说明

### 必填项（必须配置，不配置用不了）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `D1_DATABASE_NAME` | D1 数据库名称 | `cunmail` |
| `D1_DATABASE_ID` | D1 数据库 ID | 一大串字符 |
| `EMAIL_DOMAIN` | 邮箱域名，多个用逗号分隔 | `example.com,mail.xxx.com` |
| `COOKIES_SECRET` | Cookie 加密密钥，随便填随机字符串 | `随便写一串 |

### 可选项（按需配置，不配置也能用）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `TURNSTILE_KEY` | Cloudflare Turnstile 人机验证站点密钥 | 空（关闭验证） |
| `TURNSTILE_SECRET` | Turnstile 密钥 | 空 |
| `PASSWORD` | 站点访问密码，设置后全站要密码才能进 | 空（公开访问） |
| `API_RATE_LIMIT_PER_MINUTE` | API 每分钟调用次数限制 | `100` |
| `SHOW_AFF` | 是否显示推广链接 | `false` |
| `ENABLE_OPENAPI` | 是否开放 API 功能 | `false` |

### 发邮件相关（想发邮件才需要配）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `SEND_CHANNEL` | 发信渠道：`cloudflare` / `resend` / `mailchannels` | `cloudflare` |
| `SENDER_EMAIL` | 发件人邮箱 | 空 |
| `MAILBOX_TOKEN_SECRET` | 邮箱令牌签名密钥（发邮件必填） | 空 |
| `RESEND_API_KEY` | Resend API Key（用 resend 才要 | 空 |
| `MAILCHANNELS_API_KEY` | MailChannels API Key | 空 |
| `SEND_RATE_LIMIT_PER_MINUTE` | 每个邮箱每分钟发信限制 | `3` |
| `SEND_IP_RATE_LIMIT_PER_MINUTE` | 每个 IP 每分钟发信限制 | `10` |

> 🔐 **重要**：发邮件相关的密钥（MAILBOX_TOKEN_SECRET、RESEND_API_KEY 这些），建议用 Wrangler Secret 配置，不要直接写在 wrangler.toml 里：
>
> ```bash
> pnpm exec wrangler secret put MAILBOX_TOKEN_SECRET
> ```

---

## 💻 本地开发调试

想在本地改代码试试？

```bash
# 1. 复制环境变量
cp .env.example .env
# 编辑 .env 填好配置

# 2. 启动开发环境
pnpm run dev
```

前端默认跑在 http://localhost:5173

---

## ❓ 常见问题

### Q: 部署完了收不到邮件？

检查这几点：
1.  Email Routing 开了吗？
2.  Catch-all 规则指向 Worker 了吗？
3.  域名的 MX 记录对吗？（Cloudflare 会自动配，一般没问题）
4.  D1 数据库初始化了吗？

### Q: 能收邮件，但是发不了？

发邮件功能需要额外配置：
1.  设置 `SEND_CHANNEL`
2.  配置 `SENDER_EMAIL` 和 `MAILBOX_TOKEN_SECRET`
3.  用 Cloudflare 发信的话，确保域名要先开通 Email Routing
4.  密钥用 wrangler secret put 配置，别直接写配置文件里

### Q: 想加多个域名怎么办？

`EMAIL_DOMAIN` 里用逗号分开就行，比如：`a.com,b.com,c.com

### Q: 密码忘了怎么办？

在邮箱有效期内可以用「查看密码」功能把密码保存下来，下次用密码登录就能找回这个邮箱。过了有效期邮箱就没了，找不回来的哈。

---

## 📚 更多教程

更多技术干货和搭建教程，欢迎来村长博客：

🌐 [cunzhangblog.com](https://www.cunzhangblog.com)

觉得有用的话，点个 Star 支持一下村长吧！🌟

---

## 📝 License

GNU General Public License v3.0

（原项目：[vmail](https://github.com/oiov/vmail)
二开作者：web3村长

