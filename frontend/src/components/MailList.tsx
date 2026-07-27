import { useTranslation } from "react-i18next";
import { formatDistanceToNow, type Locale } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import clsx from "clsx";
import type { Email } from "../database_types";

import MailIcon from "./icons/MailIcon.tsx";
import RefreshIcon from "./icons/RefreshIcon.tsx";
import Loader from "./icons/Loader.tsx";
import { TrashIcon } from "./icons/TrashIcon.tsx";
import PasswordIcon from "./icons/Password.tsx";
import { MailDetail } from "../pages/MailDetail.tsx";
import ArrowUturnLeft from "./icons/ArrowUturnLeft.tsx";
import Expand from "./icons/Expand.tsx";
import { SiteStats } from "./SiteStats.tsx";
import SendIcon from "./icons/SendIcon.tsx";

const localeMap: Record<string, Locale> = {
  zh: zhCN,
  "zh-TW": zhCN,
  en: enUS,
};

interface MailListProps {
  emails: Email[];
  isLoading: boolean;
  isFetching: boolean;
  onDelete: (ids: string[]) => void;
  isDeleting: boolean;
  onRefresh: () => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  isAddressCreated: boolean;
  onSelectEmail: (email: Email) => void;
  showViewPasswordButton: boolean;
  onShowPassword: () => void;
  selectedEmail: Email | null;
  onCloseDetail: () => void;
  onExpand: () => void;
  canSendEmails: boolean;
  onOpenSender: () => void;
}

export function MailList({
  emails,
  isLoading,
  isFetching,
  onDelete,
  isDeleting,
  onRefresh,
  selectedIds,
  setSelectedIds,
  isAddressCreated,
  onSelectEmail,
  showViewPasswordButton,
  onShowPassword,
  selectedEmail,
  onCloseDetail,
  onExpand,
  canSendEmails,
  onOpenSender,
}: MailListProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = localeMap[i18n.language] || enUS;

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (emails.length === 0) return;
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map((e) => e.id));
    }
  };

  const renderBody = () => {
    if (selectedEmail) {
      return <MailDetail email={selectedEmail} onClose={onCloseDetail} />;
    }

    if (!isAddressCreated) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <SiteStats />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center py-20">
          <Loader />
          <p className="text-slate-400 mt-6 text-sm">{t("Waiting for emails...")}</p>
        </div>
      );
    }

    if (emails.length === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">{t("Waiting for emails...")}</p>
          <p className="text-slate-500 text-xs mt-1">新邮件会自动出现在这里</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {emails.map((email: Email) => (
          <div
            key={email.id}
            className={clsx(
              "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
              (selectedEmail as Email | null)?.id === email.id
                ? "bg-cyan-500/10 border border-cyan-500/30"
                : "hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50",
            )}
            onClick={() => onSelectEmail(email)}>
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer"
              checked={selectedIds.includes(email.id)}
              onChange={(e) => {
                e.stopPropagation();
                handleSelect(email.id);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-medium text-sm text-white truncate">
                  {email.from?.name || email.messageFrom}
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  {formatDistanceToNow(new Date(email.date || email.createdAt), {
                    addSuffix: true,
                    locale: currentLocale,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium text-slate-300 truncate mb-1">
                {email.subject || "(无主题)"}
              </div>
              <div className="text-xs text-slate-500 line-clamp-1">
                {(email.text || email.html || "").replace(/<[^>]*>/g, "").substring(0, 200)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="glass-card h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <MailIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="font-semibold text-white text-sm">{t("INBOX")}</span>
          {isAddressCreated && emails.length > 0 && !selectedEmail && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/20 rounded-full">
              {emails.length}
            </span>
          )}
          {selectedEmail && (
            <button
              onClick={onCloseDetail}
              className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 ml-2 transition-colors">
              <ArrowUturnLeft />
              {t("Return to email list")}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {selectedEmail ? (
            <>
              <button
                onClick={onExpand}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-all"
                title={t("Expand")}>
                <Expand className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete([selectedEmail.id])}
                disabled={isDeleting}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:text-slate-600 disabled:hover:bg-transparent transition-all"
                title={t("Delete")}>
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {showViewPasswordButton && (
                <button
                  className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-all"
                  title={t("View password")}
                  onClick={onShowPassword}>
                  <PasswordIcon className="w-4 h-4" />
                </button>
              )}
              {canSendEmails && (
                <button
                  className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 transition-all"
                  title={t("Send email")}
                  onClick={onOpenSender}>
                  <SendIcon className="w-4 h-4" />
                </button>
              )}
              {isAddressCreated && emails.length > 0 && (
                <>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20 cursor-pointer"
                    title={t("Select all")}
                    checked={selectedIds.length === emails.length && emails.length > 0}
                    onChange={handleSelectAll}
                  />
                  <button
                    onClick={() => onDelete(selectedIds)}
                    disabled={selectedIds.length === 0 || isDeleting}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 disabled:text-slate-600 disabled:hover:bg-transparent transition-all"
                    title={t("Delete selected")}>
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50 disabled:text-slate-600 disabled:hover:bg-transparent transition-all"
                title="refresh"
                onClick={onRefresh}
                disabled={!isAddressCreated || isFetching}>
                <RefreshIcon
                  className={clsx("w-4 h-4", isFetching && "animate-spin")}
                />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">{renderBody()}</div>
    </div>
  );
}
