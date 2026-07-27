import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { MailList } from "../components/MailList.tsx";
import { CopyButton } from "../components/CopyButton.tsx";
import {
  getEmails,
  getMailboxMeta,
  deleteEmails,
  loginByPassword,
  refreshMailboxToken,
  verifyTurnstile,
} from "../services/api.ts";
import { useConfig } from "../hooks/useConfig.ts";
import { encrypt } from "../lib/utlis.ts";

import { usePasswordModal } from "../components/password.tsx";
import PasswordIcon from "../components/icons/Password.tsx";
import Close from "../components/icons/Close.tsx";

import type { Email } from "../database_types.ts";
import { InfoModal } from "../components/InfoModal.tsx";
import { MailDetail } from "./MailDetail.tsx";
import { CountdownTimer } from "../components/CountdownTimer.tsx";
import { useSenderModal } from "../components/sender.tsx";

const VALIDITY_OPTIONS = [
  { label: "1 hour", value: 1 * 60 * 60 * 1000 },
  { label: "6 hours", value: 6 * 60 * 60 * 1000 },
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
  { label: "7 days", value: 7 * 24 * 60 * 60 * 1000 },
];

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="glass-card-hover p-4 group">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-white text-sm mb-1 group-hover:text-cyan-400 transition-colors">
        {title}
      </div>
      <div className="text-xs text-slate-400">{desc}</div>
    </div>
  );
}

export function Home() {
  const config = useConfig();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [address, setAddress] = useState<string | undefined>(() =>
    Cookies.get("userMailbox"),
  );
  const [mailboxToken, setMailboxToken] = useState<string>(
    () => Cookies.get("mailboxToken") || "",
  );
  const [expiryTimestamp, setExpiryTimestamp] = useState<number | undefined>(
    () => {
      const expiry = Cookies.get("emailExpiry");
      return expiry ? parseInt(expiry, 10) : undefined;
    },
  );
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>(
    config.emailDomain[0],
  );
  const [validityMs, setValidityMs] = useState<number>(24 * 60 * 60 * 1000);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);
  const [mailboxNote, setMailboxNote] = useState<string>("");
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteInput, setNoteInput] = useState<string>("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [hasReceivedEmail, setHasReceivedEmail] = useState(false);

  const { PasswordModal, setShowPasswordModal } = usePasswordModal();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { SenderModal, setShowSenderModal } = useSenderModal(
    address || "",
    mailboxToken,
  );
  const canSendEmails = Boolean(address && mailboxToken && config.sendChannel);

  const {
    data: emails = [],
    isLoading,
    isFetching,
    refetch,
    error: emailsError,
  } = useQuery<Email[], Error>({
    queryKey: ["emails", address],
    queryFn: () => getEmails(address!, 50),
    enabled: !!address,
    refetchInterval: false,
    retry: false,
  });

  useEffect(() => {
    if (emailsError) {
      toast.error(`${t("Failed to get emails")}: ${emailsError.message}`, {
        duration: 5000,
      });
    }
  }, [emailsError, t]);

  const mailboxMetaSignatureRef = useRef<string | null>(null);

  const { data: mailboxMeta } = useQuery({
    queryKey: ["emails-meta", address],
    queryFn: () => getMailboxMeta(address!),
    enabled: !!address,
    refetchInterval: () =>
      document.visibilityState === "visible" ? 10000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (!mailboxMeta) {
      return;
    }

    const signature = `${mailboxMeta.count}:${mailboxMeta.latestEmailCreatedAt ?? ""}`;
    if (mailboxMetaSignatureRef.current === null) {
      mailboxMetaSignatureRef.current = signature;
      return;
    }

    if (mailboxMetaSignatureRef.current !== signature) {
      mailboxMetaSignatureRef.current = signature;
      queryClient.invalidateQueries({ queryKey: ["emails", address] });
    }
  }, [address, mailboxMeta, queryClient]);

  const showPasswordToast = useCallback(
    (password: string) => {
      toast(
        (toastInstance) => (
          <div className="w-full max-w-lg glass-card p-4 text-white">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <PasswordIcon className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold">{t("View password")}</h3>
              </div>
              <button
                onClick={() => toast.dismiss(toastInstance.id)}
                className="p-1 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white transition-colors"
                aria-label="Close">
                <Close className="h-4 w-4" />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-2">
                {t("Save your password and continue using this email in 1 day")}
              </p>
              <div className="flex items-center text-sm bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                <span className="flex-1 font-mono break-all text-cyan-300">
                  {password}
                </span>
                <CopyButton text={password} className="p-1" />
              </div>
              <p className="mt-2 text-xs text-amber-400">
                {t("Remember your password, otherwise your email will expire and cannot be retrieved")}
              </p>
            </div>
          </div>
        ),
        {
          id: "password-notification",
          duration: 8000,
          position: "top-center",
          style: {
            background: "transparent",
            border: "none",
            padding: 0,
            boxShadow: "none",
          },
        },
      );
    },
    [t],
  );

  useEffect(() => {
    if (!showPromoModal) {
      localStorage.setItem("cunmail_promo_shown", "true");
    }
  }, [showPromoModal]);

  const prevEmailsLength = useRef(emails.length);
  useEffect(() => {
    if (emails.length > 0 && !hasReceivedEmail) {
      setHasReceivedEmail(true);
    }

    if (!address) {
      setHasReceivedEmail(false);
      setExpiryTimestamp(undefined);
      toast.dismiss("password-notification");
    } else {
      const expiry = Cookies.get("emailExpiry");
      if (expiry && !expiryTimestamp) {
        setExpiryTimestamp(parseInt(expiry, 10));
      }
    }

    prevEmailsLength.current = emails.length;
  }, [emails, address, hasReceivedEmail, expiryTimestamp]);

  const handleCreateAddress = async () => {
    const requireTurnstile = config.turnstileEnabled;

    if (requireTurnstile && !turnstileToken) {
      toast.error(t("No captcha response"));
      return;
    }

    try {
      const authorization = await verifyTurnstile(
        selectedDomain,
        requireTurnstile ? turnstileToken : undefined,
      );
      const mailbox = authorization.mailbox;
      const now = Date.now();
      const expires = now + validityMs;
      const cookieExpires = new Date(expires);
      Cookies.set("userMailbox", mailbox, { expires: cookieExpires });
      Cookies.set("emailExpiry", expires.toString(), { expires: cookieExpires });
      if (authorization.mailboxToken) {
        Cookies.set("mailboxToken", authorization.mailboxToken, { expires: cookieExpires });
      } else {
        Cookies.remove("mailboxToken");
      }
      setAddress(mailbox);
      setMailboxToken(authorization.mailboxToken || "");
      setExpiryTimestamp(expires);
      setHasReceivedEmail(false);
      toast.success(t("Email created successfully"));
    } catch (error) {
      toast.error(t("Failed to verify captcha"));
      console.error("Turnstile verification failed:", error);
    }
  };

  const handleStopAddress = () => {
    Cookies.remove("userMailbox");
    Cookies.remove("mailboxToken");
    Cookies.remove("emailExpiry");
    setAddress(undefined);
    setMailboxToken("");
    mailboxMetaSignatureRef.current = null;
    setHasReceivedEmail(false);
    setSelectedEmail(null);
    setExpiryTimestamp(undefined);
    queryClient.invalidateQueries({ queryKey: ["emails"] });
  };

  const handleRefresh = () => {
    refetch();
    toast.success(t("Mailbox refreshed"));
  };

  const handleResetExpiry = useCallback(async () => {
    if (mailboxToken) {
      try {
        const refreshedToken = await refreshMailboxToken(mailboxToken);
        const newExpiry = Date.now() + validityMs;
        const cookieExpires = new Date(newExpiry);
        Cookies.set("mailboxToken", refreshedToken, { expires: cookieExpires });
        setMailboxToken(refreshedToken);
      } catch {
        toast.error(t("SEND_UNAUTHORIZED"));
        return;
      }
    }

    const newExpiry = Date.now() + validityMs;
    const cookieExpires = new Date(newExpiry);

    Cookies.set("emailExpiry", newExpiry.toString(), {
      expires: cookieExpires,
    });
    Cookies.set("userMailbox", address!, { expires: cookieExpires });
    setExpiryTimestamp(newExpiry);
    toast.success(t("Validity reset successfully"));
  }, [mailboxToken, validityMs, address, t]);

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteEmails(ids),
    onSuccess: () => {
      toast.success(t("Emails deleted successfully"));
      setSelectedIds([]);
      if (selectedEmail && selectedIds.includes(selectedEmail.id)) {
        setSelectedEmail(null);
      }
      queryClient.invalidateQueries({ queryKey: ["emails", address] });
    },
    onError: () => {
      toast.error(t("Failed to delete emails"));
    },
  });

  const handleDeleteEmails = (ids: string[]) => {
    if (ids.length === 0) {
      toast.error(t("Please select emails to delete"));
      return;
    }
    deleteMutation.mutate(ids);
  };

  const handleLogin = async (password: string) => {
    setIsLoggingIn(true);
    try {
      const data = await loginByPassword(password);
      const now = Date.now();
      const expires = now + validityMs;
      const cookieExpires = new Date(expires);
      Cookies.set("userMailbox", data.address, { expires: cookieExpires });
      Cookies.set("emailExpiry", expires.toString(), { expires: cookieExpires });
      if (data.mailboxToken) {
        Cookies.set("mailboxToken", data.mailboxToken, { expires: cookieExpires });
      } else {
        Cookies.remove("mailboxToken");
      }
      setAddress(data.address);
      setMailboxToken(data.mailboxToken || "");
      setExpiryTimestamp(expires);
      setShowPasswordModal(false);
      toast.success(t("Login successful"));
    } catch (error: any) {
      toast.error(`${t("Login failed")}: ${t(error.message)}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("浏览器不支持桌面通知");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationEnabled(true);
      toast.success(t("Notification enabled"));
    } else {
      toast.error("通知权限被拒绝");
    }
  }, [t]);

  const sendNotification = useCallback((email: Email) => {
    if (!notificationEnabled || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const fromName = email.from?.name || email.messageFrom || "未知发件人";
    const subject = email.subject || "(无主题)";

    try {
      new Notification(t("New email arrived"), {
        body: `${t("From")}: ${fromName}\n${t("Subject")}: ${subject}`,
        icon: "/favicon.ico",
      });
    } catch (e) {
      console.error("Failed to send notification:", e);
    }
  }, [notificationEnabled, t]);

  const prevEmailsRef = useRef<string[]>([]);
  useEffect(() => {
    if (!notificationEnabled) {
      prevEmailsRef.current = emails.map(e => e.id);
      return;
    }

    const currentIds = emails.map(e => e.id);
    const prevIds = prevEmailsRef.current;
    
    if (prevIds.length > 0) {
      const newEmails = emails.filter(e => !prevIds.includes(e.id));
      if (newEmails.length > 0) {
        sendNotification(newEmails[0]);
      }
    }
    
    prevEmailsRef.current = currentIds;
  }, [emails, notificationEnabled, sendNotification]);

  useEffect(() => {
    if (address) {
      const savedNote = localStorage.getItem(`cunmail_note_${address}`);
      if (savedNote) {
        setMailboxNote(savedNote);
      } else {
        setMailboxNote("");
      }
    }
  }, [address]);

  const handleSaveNote = () => {
    if (address) {
      localStorage.setItem(`cunmail_note_${address}`, noteInput);
      setMailboxNote(noteInput);
      setIsEditingNote(false);
      toast.success("备注已保存");
    }
  };

  const handleStartEditNote = () => {
    setNoteInput(mailboxNote);
    setIsEditingNote(true);
  };

  const getPassword = useCallback(() => {
    if (address && config.cookiesSecret) {
      return encrypt(address, config.cookiesSecret);
    }
    return null;
  }, [address, config.cookiesSecret]);

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  const handleCloseDetail = () => {
    setSelectedEmail(null);
  };

  const handleExpandEmail = () => {
    setShowEmailModal(true);
  };

  return (
    <div className="pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
      <PasswordModal onLogin={handleLogin} isLoggingIn={isLoggingIn} />
      <SenderModal />

      {selectedEmail && (
        <InfoModal
          showModal={showEmailModal}
          setShowModal={setShowEmailModal}
          title={t("Email Detail")}>
          <MailDetail
            email={selectedEmail}
            onClose={() => setShowEmailModal(false)}
          />
        </InfoModal>
      )}

      {config.showAff && showPromoModal && (
        <InfoModal
          showModal={showPromoModal}
          setShowModal={setShowPromoModal}
          title="🎉 CunMail & 村长博客">
          <div className="space-y-4 text-gray-200">
            <div className="text-center">
              <p className="text-base font-semibold text-cyan-400 mb-1">
                跟着村长学搭建
              </p>
              <p className="text-xs text-gray-400">
                从零开始，手把手教你搭建自己的工具
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="text-cyan-400">✨</span> 你将学到
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Cloudflare Workers + D1 实战部署</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>域名配置 + Email Routing 邮件转发</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>完全免费托管，数据自己掌控</span>
                </li>
              </ul>
            </div>
            <div className="pt-2">
              <a
                href="https://www.cunzhangblog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] transition-all duration-200">
                🚀 去村长博客看看
              </a>
            </div>
          </div>
        </InfoModal>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[440px] shrink-0 space-y-4">
          <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="glow-dot" />
                <span className="text-xs text-cyan-400 font-medium">ONLINE</span>
              </div>
              <h1 className="text-2xl font-bold mb-1">
                <span className="gradient-text">CunMail</span>
              </h1>
              <p className="text-sm text-slate-400 mb-4">
                {t("Privacy friendly")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-cyan-400">24h</div>
                  <div className="text-[10px] text-slate-500">有效期</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-400">∞</div>
                  <div className="text-[10px] text-slate-500">邮箱数量</div>
                </div>
              </div>
            </div>
          </div>

          {address ? (
            <div className="glass-card p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-2 font-medium">
                  {t("Email address")}
                </div>
                <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-3">
                  <span className="truncate font-mono text-sm text-cyan-300 flex-1">
                    {address}
                  </span>
                  <CopyButton text={address} className="p-1.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">邮箱备注</span>
                  {!isEditingNote && (
                    <button
                      onClick={handleStartEditNote}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      {mailboxNote ? "编辑" : "添加备注"}
                    </button>
                  )}
                </div>
                {isEditingNote ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="比如：注册某网站用"
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveNote();
                      }}
                    />
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-medium hover:border-slate-600 transition-all">
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2.5 rounded-lg bg-slate-800/30 border border-slate-700/30">
                    {mailboxNote ? (
                    <span className="text-sm text-yellow-400/80">📝 {mailboxNote}</span>
                  ) : (
                    <span className="text-sm text-slate-500 italic">暂无备注，点击上方添加备注</span>
                  )}
                  </div>
                )}
              </div>

              {expiryTimestamp && (
                <CountdownTimer
                  expiryTimestamp={expiryTimestamp}
                  onReset={handleResetExpiry}
                />
              )}

              <button
                onClick={requestNotificationPermission}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  notificationEnabled
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400"
                }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notificationEnabled ? t("Notification enabled") : t("Enable notification")}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleStopAddress}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all">
                  {t("Stop")}
                </button>
                {canSendEmails && (
                  <button
                    onClick={() => setShowSenderModal(true)}
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                    {t("Send email")}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-400 mb-2 font-medium">
                  {t("Domain")}
                </div>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                  {config.emailDomain.map((domain) => (
                    <option key={domain} value={domain} className="bg-slate-900">
                      @{domain}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="text-xs text-slate-400 mb-2 font-medium">
                  {t("Validity period")}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {VALIDITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setValidityMs(option.value)}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        validityMs === option.value
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                          : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400"
                      }`}>
                      {t(option.label)}
                    </button>
                  ))}
                </div>
              </div>

              {config.turnstileEnabled && (
                <div>
                  <div className="text-xs text-slate-400 mb-2 font-medium">
                    {t("Validater")}
                  </div>
                  <div className="[&_iframe]:!w-full h-[65px] max-w-full bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
                    <Turnstile
                      className="w-full"
                      siteKey={config.turnstileKey}
                      onSuccess={setTurnstileToken}
                      options={{ theme: "dark", size: "flexible" }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleCreateAddress}
                disabled={config.turnstileEnabled && !turnstileToken}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300">
                {t("Create temporary email")}
              </button>

              <p
                className="text-sm text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors text-center"
                onClick={() => setShowPasswordModal(true)}>
                <PasswordIcon className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
                {t("Have a password? Login.")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <FeatureCard
              icon="🔒"
              title="隐私保护"
              desc="不用注册，用完即焚"
            />
            <FeatureCard
              icon="⚡"
              title="即时接收"
              desc="秒级送达，实时刷新"
            />
            <FeatureCard
              icon="🌐"
              title="多域名"
              desc="自定义邮箱后缀"
            />
            <FeatureCard
              icon="📨"
              title="支持发信"
              desc="匿名发送邮件"
            />
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-white">快速开始</span>
            </div>
            <ol className="space-y-2 text-xs text-slate-400">
              <li className="flex gap-2">
                <span className="text-cyan-400 font-bold">1.</span>
                <span>选择域名后缀，点击生成邮箱</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400 font-bold">2.</span>
                <span>复制邮箱地址去注册网站</span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400 font-bold">3.</span>
                <span>回到这里查看验证码邮件</span>
              </li>
            </ol>
          </div>

          <div className="glass-card p-4 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">👨‍🌾</span>
              <span className="text-sm font-medium text-white">Web3村长</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              专注分享AI工具、互联网效率工具、开源项目和数字生产力方法。
            </p>
            <div className="grid grid-cols-4 gap-2">
              <a
                href="https://www.cunzhangblog.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">博客</span>
              </a>
              <a
                href="https://space.bilibili.com/1224034462"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-pink-500/30 transition-all group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                </svg>
                <span className="text-[10px] text-slate-400 group-hover:text-pink-400 transition-colors">B站</span>
              </a>
              <a
                href="https://www.youtube.com/@cunzhanglab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-red-500/30 transition-all group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-[10px] text-slate-400 group-hover:text-red-400 transition-colors">油管</span>
              </a>
              <a
                href="https://t.me/cunzhanglab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-sky-500/30 transition-all group">
                <svg className="w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.127.087.775.163 1.394.226 1.864.468 3.877.468 3.877.057.377.088.566.089.742a1.17 1.17 0 0 1-.033.297c-.037.14-.14.26-.256.308-.199.082-.45.028-.627-.028-.206-.065-1.169-.457-1.67-.61a.355.355 0 0 0-.137-.014c-.076.009-.152.058-.243.14-.542.49-.746.74-1.01.994a.55.55 0 0 1-.184.127c-.153.064-.327.027-.434-.02-.275-.12-.434-.454-.523-.717-.1-.294-.365-1.184-.535-1.784-.057-.2-.103-.364-.104-.396-.004-.055.01-.089.037-.117.033-.033.079-.043.128-.043l.01-.002c.127-.01.249-.003.373.037.584.187 2.033.695 2.184.74.113.033.225.058.319.013a.392.392 0 0 0 .166-.13c.088-.112.08-.263.066-.357-.019-.117-.444-1.76-.64-2.46-.096-.344-.178-.627-.178-.66 0-.004-.003-.01-.003-.018-.003-.067.024-.12.092-.168.145-.102.326-.128.488-.138.226-.014.399-.01.563-.006z"/>
                </svg>
                <span className="text-[10px] text-slate-400 group-hover:text-sky-400 transition-colors">电报</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <MailList
            isAddressCreated={!!address}
            emails={emails}
            isLoading={isLoading}
            isFetching={isFetching}
            onDelete={handleDeleteEmails}
            isDeleting={deleteMutation.isPending}
            onRefresh={handleRefresh}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            onSelectEmail={handleSelectEmail}
            showViewPasswordButton={hasReceivedEmail}
            onShowPassword={() => {
              const password = getPassword();
              if (password) {
                showPasswordToast(password);
              }
            }}
            selectedEmail={selectedEmail}
            onCloseDetail={handleCloseDetail}
            onExpand={handleExpandEmail}
            canSendEmails={canSendEmails}
            onOpenSender={() => setShowSenderModal(true)}
          />
        </div>
      </div>
    </div>
  );
}
