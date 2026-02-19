/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

type AdminMenuKey = 'Dashboard' | 'All Tickets' | 'Quotes' | 'Customers' | 'Analytics' | 'Settings';

type StatCard = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

const adminUser = { name: "Admin User", email: "admin@company.com" } as const;

/** Sidebar icon set (outline style) */
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
  Tickets: (
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
  Quotes: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3h10l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17 3v4h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h8M8 15h8M8 19h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  /* FIXED: Customers icon (clean + centered) */
  Users: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 21a9 9 0 0 1 18 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  Analytics: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 19V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 19h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 17V11M12 17V7M16 17v-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  /* FIXED: Settings icon (balanced cog) */
  Settings: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.4 15a7.7 7.7 0 0 0 .1-1 7.7 7.7 0 0 0-.1-1l2-1.2-2-3.4-2.2.8c-.5-.4-1.1-.8-1.8-1l-.3-2.3h-4l-.3 2.3c-.7.2-1.3.6-1.8 1l-2.2-.8-2 3.4 2 1.2a7.7 7.7 0 0 0-.1 1c0 .3 0 .7.1 1l-2 1.2 2 3.4 2.2-.8c.5.4 1.1.8 1.8 1l.3 2.3h4l.3-2.3c.7-.2 1.3-.6 1.8-1l2.2.8 2-3.4-2-1.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const navItems: Array<{ key: AdminMenuKey; label: string; icon: React.ReactNode }> =
  [
    { key: "Dashboard", label: "Dashboard", icon: Icon.Home },
    { key: "All Tickets", label: "All Tickets", icon: Icon.Tickets },
    { key: "Quotes", label: "Quotes", icon: Icon.Quotes },
    { key: "Customers", label: "Customers", icon: Icon.Users },
    { key: "Analytics", label: "Analytics", icon: Icon.Analytics },
    { key: "Settings", label: "Settings", icon: Icon.Settings },
  ];

const statColorByIndex = ["blue", "red", "orange", "green"] as const;

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState<AdminMenuKey>('Dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate('/login');
  };

  const stats: StatCard[] = useMemo(
    () => [
      {
        label: 'Total Tickets',
        value: 0,
        icon: (
          <svg viewBox="0 0 24 24" className="statSvg" aria-hidden="true">
            <path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2a2 2 0 0 1-2 2h-1v2h1a2 2 0 0 1 2 2v2a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-2a2 2 0 0 1 2-2h1v-2H6a2 2 0 0 1-2-2V7z" />
          </svg>
        ),
      },
      {
        label: 'Urgent Tickets',
        value: 0,
        icon: (
          <svg viewBox="0 0 24 24" className="statSvg" aria-hidden="true">
            <path d="M12 2 1 21h22L12 2zm0 6c.55 0 1 .45 1 1v5a1 1 0 1 1-2 0V9c0-.55.45-1 1-1zm0 11a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 19z" />
          </svg>
        ),
      },
      {
        label: 'Unassigned',
        value: 0,
        icon: (
          <svg viewBox="0 0 24 24" className="statSvg" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2zm1 5v6l5 3-.9 1.5L11 13V7h2z" />
          </svg>
        ),
      },
      {
        label: 'Pending Quotes',
        value: 0,
        icon: (
          <svg viewBox="0 0 24 24" className="statSvg" aria-hidden="true">
            <path d="M12 1a1 1 0 0 1 1 1v1.06A8 8 0 0 1 20.94 11H22a1 1 0 1 1 0 2h-1.06A8 8 0 0 1 13 20.94V22a1 1 0 1 1-2 0v-1.06A8 8 0 0 1 3.06 13H2a1 1 0 1 1 0-2h1.06A8 8 0 0 1 11 3.06V2a1 1 0 0 1 1-1z" />
          </svg>
        ),
      },
    ],
    []
  );

  const toggleSidebar = () => {
    setIsCollapsed((v) => {
      const next = !v;
      if (next) setProfileOpen(false);
      return next;
    });
  };

  return (
    <div className={`adminPage ${isCollapsed ? 'adminCollapsed' : ''}`}>
      {/* Sidebar */}
      <aside className="adminSidebar">
        <div className="adminBrandHeader">
          <div className="brandBlock">
            <div className="brandTitle">{isCollapsed ? "SQ" : "SmartQuote Admin"}</div>
            {!isCollapsed && <div className="brandSub">Support Team Portal</div>}
          </div>

          <button
            className="collapseBtn"
            onClick={toggleSidebar}
            type="button"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {isCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>

        <nav className="adminNav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`adminNavItem ${activeMenu === item.key ? "active" : ""}`}
              onClick={() => setActiveMenu(item.key)}
              type="button"
              title={isCollapsed ? item.label : undefined}
            >
              <span className="adminNavIcon">{item.icon}</span>
              {!isCollapsed && <span className="adminNavLabel">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer + dropdown */}
        <div className="adminSidebarFooter" ref={profileRef}>
          <div className="footerDivider" />

          <button
            className="profileTrigger"
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            aria-label="Open profile menu"
          >
            <div className="userAvatar">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-5 0-9 2.5-9 5.5V21h18v-1.5C21 16.5 17 14 12 14z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="userMeta">
                <div className="userName">{adminUser.name}</div>
                <div className="userEmail">{adminUser.email}</div>
              </div>
            )}
          </button>

          {profileOpen && !isCollapsed && (
            <div className="profileDropdown" role="menu">
              <button
                className="dropdownItem"
                type="button"
                onClick={() => alert("User info (placeholder)")}
                role="menuitem"
              >
                View User Information
              </button>
              <button
                className="dropdownItem logout"
                type="button"
                onClick={handleLogout}
                role="menuitem"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="adminMain">
        <header className="topBar">
          <div>
            <h1 className="pageTitle">Admin Dashboard</h1>
            <p className="pageSubtitle">Manage tickets, quotes, and customer requests</p>
            <p className="pageSubtitle">Manage tickets, quotes, and customer requests</p>
          </div>
        </header>

        <section className="statsGrid">
          {stats.map((s, idx) => (
            <div key={s.label} className="statCard">
              <div className={`statIcon ${statColorByIndex[idx] ?? "blue"}`}>{s.icon}</div>
              <div className="statValue">{s.value}</div>
              <div className="statLabel">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="actionsRow">
          <div className="searchWrap">
            <input
              className="searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tickets..."
              aria-label="Search tickets"
            />
          </div>
        </section>

        <section className="filtersRow">
          <span className="filterGlyph" aria-hidden="true">
            ⚲
          </span>

          <div className="selectWrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Status filter"
            >
              <option>All Status</option>
              <option>New</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="selectWrap">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Priority filter"
            >
              <option>All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </section>

        <section className="tableShell">
          <div className="emptyState">No tickets found.</div>
        </section>

        <button
          className="helpFab"
          type="button"
          onClick={() => alert('Help (placeholder)')}
          aria-label="Help"
          title="Help"
        >
          ?
        </button>
      </main>
    </div>
  );
};

export default AdminPage;




