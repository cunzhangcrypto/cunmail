import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home.tsx";
import { ConfigContext, AppConfig } from "./hooks/useConfig.ts";
import { getUnlockStatus, unlockSite } from "./services/api.ts";
import { SiteUnlock } from "./components/SiteUnlock.tsx";
import { Layout } from "./Layout.tsx";

// 创建一个新的 QueryClient 实例，用于TanStack Query的数据缓存和管理
const queryClient = new QueryClient();

function App() {
  // AppConfig 状态，可以为 AppConfig 类型或 null
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    // 组件挂载后，从后端 /config 接口获取前端配置
    axios
      .get<AppConfig>("/config")
      .then((res) => {
        setConfig(res.data);
      })
      .catch(() => {
        // 本地开发 fallback：后端没启动时用默认配置，方便预览 UI
        setConfig({
          emailDomain: ["cunmail.dev"],
          turnstileKey: "",
          turnstileEnabled: false,
          sitePasswordEnabled: false,
          apiRateLimitPerMinute: 100,
          openApiEnabled: false,
          cookiesSecret: "dev-secret",
          showAff: false,
          enabledSenders: ["cloudflare"],
          sendChannel: "cloudflare",
          senderEmail: "no-reply@cunmail.dev",
        });
      });
  }, []); // 空依赖数组确保此 effect 只运行一次

  useEffect(() => {
    if (!config) {
      return;
    }

    if (!config.sitePasswordEnabled) {
      setIsUnlocked(true);
      return;
    }

    getUnlockStatus()
      .then((status) => {
        setIsUnlocked(status.unlocked || !status.sitePasswordEnabled);
      })
      .catch(() => {
        setIsUnlocked(false);
      });
  }, [config]);

  const handleUnlock = async (password: string) => {
    setIsUnlocking(true);
    setUnlockError(null);
    try {
      await unlockSite(password);
      setIsUnlocked(true);
    } catch (err: any) {
      setUnlockError(err?.message || "Invalid password");
    } finally {
      setIsUnlocking(false);
    }
  };

  // 在配置加载完成前，显示加载中状态
  if (!config) {
    return (
      <div className="bg-[#1f2023] text-white w-screen h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <SiteUnlock
        onUnlock={handleUnlock}
        isUnlocking={isUnlocking}
        error={unlockError}
      />
    );
  }

  return (
    <ConfigContext.Provider value={config}>
      {/* 使用 QueryClientProvider 为应用提供 React Query 功能 */}
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* 使用 Layout 组件作为所有页面的布局框架 */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigContext.Provider>
  );
}

export default App;
