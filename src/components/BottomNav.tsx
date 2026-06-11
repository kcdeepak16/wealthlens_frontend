import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, Plus, Settings } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, path: "/overview" },
  { label: "Accounts", icon: Wallet, path: "/accounts" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1b1c1f] border-t border-[#3a3d44]">
      <div className="max-w-xl mx-auto flex items-end justify-around px-2 pb-safe">
        {/* Overview */}
        <Link
          to="/overview"
          className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[56px] justify-center pt-2 pb-1"
        >
          <LayoutDashboard
            size={20}
            className={pathname === "/overview" ? "text-[#e4e6ea]" : "text-[#9ca3af]"}
          />
          <span
            className={`text-[10px] font-medium tracking-wide ${
              pathname === "/overview" ? "text-[#e4e6ea]" : "text-[#9ca3af]"
            }`}
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Overview
          </span>
        </Link>

        {/* Accounts */}
        <Link
          to="/accounts"
          className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[56px] justify-center pt-2 pb-1"
        >
          <Wallet
            size={20}
            className={
              pathname.startsWith("/accounts")
                ? "text-[#e4e6ea]"
                : "text-[#9ca3af]"
            }
          />
          <span
            className={`text-[10px] font-medium tracking-wide ${
              pathname.startsWith("/accounts")
                ? "text-[#e4e6ea]"
                : "text-[#9ca3af]"
            }`}
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Accounts
          </span>
        </Link>

        {/* Add Entry — elevated center CTA */}
        <div className="flex flex-col items-center -mt-4">
          <Link
            to="/add-entry"
            className="flex flex-col items-center"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                pathname === "/add-entry"
                  ? "bg-[#e4e6ea]"
                  : "bg-[#6c63ff]"
              }`}
            >
              <Plus
                size={22}
                className={
                  pathname === "/add-entry" ? "text-[#0e0e10]" : "text-white"
                }
              />
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide mt-0.5 ${
                pathname === "/add-entry"
                  ? "text-[#e4e6ea]"
                  : "text-[#9ca3af]"
              }`}
              style={{ fontFamily: "'Work Sans', sans-serif" }}
            >
              Add Entry
            </span>
          </Link>
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[56px] justify-center pt-2 pb-1"
        >
          <Settings
            size={20}
            className={
              pathname === "/settings" ? "text-[#e4e6ea]" : "text-[#9ca3af]"
            }
          />
          <span
            className={`text-[10px] font-medium tracking-wide ${
              pathname === "/settings" ? "text-[#e4e6ea]" : "text-[#9ca3af]"
            }`}
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            Settings
          </span>
        </Link>
      </div>
    </nav>
  );
}
