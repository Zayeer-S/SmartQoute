import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerPage.css";

type MenuKey = "Dashboard" | "My Tickets" | "Quotes" | "History" | "Profile";

type StatCard = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

type Ticket = {
  id: string;
  title: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
};

// Outline icons to match screenshot (keep the same CSS sizing)
const Icon = {
  Home: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Ticket: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 9h6M9 12h6M9 15h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Pound: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 4a4 4 0 0 0-4 4v2h5a1 1 0 1 1 0 2h-5v2c0 1.2-.3 2.3-1 3h8a1 1 0 1 1 0 2H7a1 1 0 0 1-.7-1.7c1.2-1.2 1.7-2.4 1.7-4.3v-1H7a1 1 0 1 1 0-2h1V8a6 6 0 0 1 6-6h2a1 1 0 1 1 0 2h-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Doc: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3h10l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17 3v5h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 12h8M8 16h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  User: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 21a8 8 0 0 1 16 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
} as const;

const CUSTOMER = { name: "Guest", email: "guest@smartquote.com" } as const;

const STATS: StatCard[] = [
  { label: "Total Tickets", value: "0", icon: "🎫" },
  { label: "Active Tickets", value: "0", icon: "🕒" },
  { label: "Total Quoted", value: "£0.00", icon: "🧾" },
  { label: "Pending Quotes", value: "0", icon: "📄" },
];

// Placeholder until DB is wired
const TICKETS: Ticket[] = [];

const CustomerPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState<MenuKey>("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const root = profileRef.current;
      if (!root) return;

      if (!root.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  }, [navigate]);

  const handleViewUserInfo = useCallback(() => {
    setProfileOpen(false);
    alert("View User Information (placeholder)");
  }, []);

  const handleNewTicket = useCallback(() => {
    navigate("/customer/create");
  }, [navigate]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((v) => !v);
  }, []);

  return (
    <div className={`customerPage ${isCollapsed ? "sidebarCollapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brandRow">
          <div className="brand">
            <div className="brandTitle">{isCollapsed ? "SQ" : "SmartQuote"}</div>
            {!isCollapsed && <div className="brandSub">Customer Portal</div>}
          </div>

          <button
            className="collapseBtn"
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {isCollapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        <nav className="menu">
          <button
            className={`menuItem ${activeMenu === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveMenu("Dashboard")}
            type="button"
            title={isCollapsed ? "Dashboard" : undefined}
          >
            <span className="menuIcon">{Icon.Home}</span>
            {!isCollapsed && <span className="menuLabel">Dashboard</span>}
          </button>

          <button
            className={`menuItem ${activeMenu === "My Tickets" ? "active" : ""}`}
            onClick={() => setActiveMenu("My Tickets")}
            type="button"
            title={isCollapsed ? "My Tickets" : undefined}
          >
            <span className="menuIcon">{Icon.Ticket}</span>
            {!isCollapsed && <span className="menuLabel">My Tickets</span>}
          </button>

          <button
            className={`menuItem ${activeMenu === "Quotes" ? "active" : ""}`}
            onClick={() => setActiveMenu("Quotes")}
            type="button"
            title={isCollapsed ? "Quotes" : undefined}
          >
            <span className="menuIcon">{Icon.Pound}</span>
            {!isCollapsed && <span className="menuLabel">Quotes</span>}
          </button>

          <button
            className={`menuItem ${activeMenu === "History" ? "active" : ""}`}
            onClick={() => setActiveMenu("History")}
            type="button"
            title={isCollapsed ? "History" : undefined}
          >
            <span className="menuIcon">{Icon.Doc}</span>
            {!isCollapsed && <span className="menuLabel">History</span>}
          </button>

          <button
            className={`menuItem ${activeMenu === "Profile" ? "active" : ""}`}
            onClick={() => setActiveMenu("Profile")}
            type="button"
            title={isCollapsed ? "Profile" : undefined}
          >
            <span className="menuIcon">{Icon.User}</span>
            {!isCollapsed && <span className="menuLabel">Profile</span>}
          </button>
        </nav>

        {/* Footer w/ dropdown */}
        <div className="sidebarFooter" ref={profileRef}>
          <button
            className="profileTrigger"
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Open profile menu"
          >
            <div className="userAvatar">{Icon.User}</div>
            {!isCollapsed && (
              <div className="userMeta">
                <div className="userName">{CUSTOMER.name}</div>
                <div className="userEmail">{CUSTOMER.email}</div>
              </div>
            )}
          </button>

          {profileOpen && !isCollapsed && (
            <div className="profileDropdown" role="menu">
              <button className="dropdownItem" type="button" onClick={handleViewUserInfo}>
                View User Information
              </button>
              <button className="dropdownItem logout" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topBar">
          <div>
            <h1 className="pageTitle">{activeMenu}</h1>
            <p className="pageSubtitle">Manage your support tickets and view quotes</p>
          </div>
        </header>

        {/* Stats */}
        <section className="statsGrid">
          {STATS.map((s) => (
            <div key={s.label} className="statCard">
              <div className="statIcon">{s.icon}</div>
              <div className="statValue">{s.value}</div>
              <div className="statLabel">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Search + New Ticket */}
        <section className="actionsRow">
          <div className="searchWrap">
            <span className="searchIcon" aria-hidden="true">
                </span>
            <input
              className="searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets..."
              aria-label="Search tickets"
            />
          </div>

          <button className="primaryBtn" type="button" onClick={handleNewTicket}>
            <span className="btnPlus">＋</span>
            New Ticket
          </button>
        </section>

        {/* Empty state like Admin */}
        <section className="tableShell">
          {TICKETS.length === 0 ? (
            <div className="emptyState">No tickets found.</div>
          ) : (
            <div style={{ width: "100%" }}>{/* future list */}</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CustomerPage;




