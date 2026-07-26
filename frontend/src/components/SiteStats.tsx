import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSiteStats, type SiteStats as SiteStatsType } from "../services/api";
import MailIcon from "./icons/MailIcon";
import UserCircleIcon from "./icons/UserCircleIcon";
import ApiIcon from "./icons/ApiIcon";
import ServerIcon from "./icons/ServerIcon";

function formatNumber(num: number): string {
  return num.toLocaleString();
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
}

function StatCard({ icon, label, value, gradient }: StatCardProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${gradient}15, transparent)` }} />
      <div className="relative flex flex-col items-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{ background: `linear-gradient(135deg, ${gradient}20, ${gradient}10)` }}>
          {icon}
        </div>
        <span className="text-xl font-bold text-white mb-0.5">
          {formatNumber(value)}
        </span>
        <span className="text-[10px] text-slate-500 text-center">{label}</span>
      </div>
    </div>
  );
}

export function SiteStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<SiteStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSiteStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch site stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="animate-pulse grid grid-cols-2 gap-3 w-full max-w-sm">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">
          <span className="gradient-text">CunMail</span>
        </h2>
        <p className="text-sm text-slate-400">{t("Please create a temporary email address first")}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        <StatCard
          icon={<UserCircleIcon className="w-5 h-5 text-cyan-400" />}
          label={t("Addresses Created")}
          value={stats.totals.totalAddressesCreated}
          gradient="#22d3ee, #3b82f6"
        />
        <StatCard
          icon={<MailIcon className="w-5 h-5 text-green-400" />}
          label={t("Emails Received")}
          value={stats.totals.totalEmailsReceived}
          gradient="#22c55e, #10b981"
        />
        <StatCard
          icon={<ApiIcon className="w-5 h-5 text-purple-400" />}
          label={t("API Keys Created")}
          value={stats.totals.totalApiKeysCreated}
          gradient="#a855f7, #8b5cf6"
        />
        <StatCard
          icon={<ServerIcon className="w-5 h-5 text-orange-400" />}
          label={t("API Calls")}
          value={stats.totals.totalApiCalls}
          gradient="#f97316, #f59e0b"
        />
      </div>
    </div>
  );
}
