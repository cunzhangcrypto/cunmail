import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Modal } from "./modal";
import { useTranslation } from "react-i18next";
import Close from "./icons/Close";
import toast from "react-hot-toast";
import { useConfig } from "../hooks/useConfig";

export default function SenderModal({
  senderEmail,
  mailboxToken,
  showSenderModal,
  setShowSenderModal,
}: {
  senderEmail: string;
  mailboxToken: string;
  showSenderModal: boolean;
  setShowSenderModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const config = useConfig();
  const [isSending, setIsSending] = useState(false);

  const hasSender = Boolean(
    config.sendChannel && config.senderEmail && mailboxToken,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    const form = e.currentTarget;

    const formData = new FormData(form);
    const payload = {
      senderName: formData.get("senderName") as string,
      receiverEmail: formData.get("receiverEmail") as string,
      subject: formData.get("subject") as string,
      content: formData.get("content") as string,
      type: (formData.get("type") as string) || "text/plain",
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mailboxToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        code?: string;
        message?: string;
      };

      if (!res.ok) {
        throw new Error(
          data.code ? t(data.code) : data.message || t("Failed to send email"),
        );
      }

      form.reset();
      setShowSenderModal(false);
      toast.success(t("Message sent"), {
        style: {
          borderRadius: "8px",
          background: "#383838",
          color: "#ffffff",
        },
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("Failed to send email"),
        {
          style: {
            borderRadius: "8px",
            background: "#383838",
            color: "#ffffff",
          },
        },
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal showModal={showSenderModal} setShowModal={setShowSenderModal} theme="dark">
      <div className="w-full overflow-hidden bg-slate-900/95 backdrop-blur-xl shadow-xl p-4 md:max-w-3xl md:rounded-2xl md:border md:border-slate-700/50">
        <Close
          className="absolute top-4 right-4 h-6 w-6 text-slate-400 hover:text-white cursor-pointer"
          onClick={() => setShowSenderModal(false)}
        />

        <div className="flex flex-col items-center justify-center space-y-3 border-b border-slate-700/50 px-4 py-5 text-center md:px-16">
          <h3 className="font-display text-2xl font-bold text-white">Vmail Sender</h3>
          <p className="text-slate-400">{t("Forward only, no storage")}</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-4 space-y-4 px-4"
        >
          <div className="w-full flex flex-col gap-4 md:flex-row">
            <input
              value={config.senderEmail}
              type="email"
              name="fromEmail"
              placeholder={t("Sending email *")}
              required
              readOnly
              title={`${t("Reply-To:")} ${senderEmail}`}
              className="rounded-md border border-slate-700/50 px-3 py-2 shadow-inner w-full bg-slate-800/50 text-slate-400 cursor-not-allowed"
            />
            <input
              type="text"
              name="senderName"
              placeholder={t("Sending name")}
              className="rounded-md border border-slate-700/50 px-3 py-2 shadow-inner w-full bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="w-full flex flex-col gap-4 md:flex-row">
            <input
              type="email"
              name="receiverEmail"
              placeholder={t("Recipient email *")}
              required
              className="rounded-md border border-slate-700/50 px-3 py-2 shadow-inner w-full bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <input
              type="text"
              name="subject"
              placeholder={t("Email subject *")}
              required
              className="rounded-md border border-slate-700/50 px-3 py-2 shadow-inner w-full bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="w-full">
            <select
              name="type"
              className="rounded-md border border-slate-700/50 px-3 py-2 shadow-inner w-full bg-slate-800/50 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value="text/plain" className="bg-slate-900">Plain</option>
              <option value="text/html" className="bg-slate-900">HTML</option>
            </select>
          </div>
          <div className="w-full">
            <textarea
              name="content"
              placeholder={t("Email content *")}
              required
              className="min-h-24 p-2 border border-slate-700/50 shadow-inner rounded-md w-full bg-slate-800/50 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            ></textarea>
          </div>

          {hasSender && (
            <button
              type="submit"
              disabled={isSending}
              className="py-2.5 text-white rounded-md w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
            >
              {isSending ? t("Sending...") : t("Send")}
            </button>
          )}
          {!hasSender && (
            <p className="py-2.5 text-center text-sm text-slate-500 rounded-md w-full border border-dashed border-slate-700/50">
              {t("No sending service configured")}
            </p>
          )}
          <p className="text-sm text-slate-500 mt-4">
            🚫
            {t(
              "Please do not send illegal content such as politics, pornography, etc",
            )}
            .
          </p>
        </form>
      </div>
    </Modal>
  );
}

export function useSenderModal(senderEmail: string, mailboxToken: string) {
  const [showSenderModal, setShowSenderModal] = useState(false);

  const SenderModalCallback = useCallback(() => {
    return (
      <SenderModal
        senderEmail={senderEmail}
        mailboxToken={mailboxToken}
        showSenderModal={showSenderModal}
        setShowSenderModal={setShowSenderModal}
      />
    );
  }, [mailboxToken, senderEmail, showSenderModal]);

  return useMemo(
    () => ({ setShowSenderModal, SenderModal: SenderModalCallback }),
    [setShowSenderModal, SenderModalCallback],
  );
}
