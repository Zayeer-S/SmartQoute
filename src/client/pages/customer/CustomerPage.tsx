import React, { useEffect, useState } from "react";
import "./CustomerPage.css";

type DashboardStats = {
  totalTickets: number;
  activeTickets: number;
  totalQuoted: number;
  pendingQuotes: number;
};

type CustomerIdentity = {
  name: string;
  email: string;
};

const formatGBP = (value: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    value
  );

const CustomerPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<
    "Dashboard" | "My Tickets" | "Quotes" | "History" | "Profile"
  >("Dashboard");

  // Placeholder user until DB/auth is wired
  const [customer, setCustomer] = useState<CustomerIdentity>({
    name: "Guest",
    email: "guest@giacom",
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalTickets: 0,
    activeTickets: 0,
    totalQuoted: 0,
    pendingQuotes: 0,
  });

  const [search, setSearch] = useState("");

  // Stats: placeholder fetch — stays 0 until your API/DB is connected.
  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const res = await fetch("/api/customer/dashboard/stats");
        if (!res.ok) throw new Error("Stats endpoint not ready");
        const data = (await res.json()) as Partial<DashboardStats>;

        if (!cancelled) {
          setStats({
            totalTickets: Number(data.totalTickets ?? 0),
            activeTickets: Number(data.activeTickets ?? 0),
            totalQuoted: Number(data.totalQuoted ?? 0),
            pendingQuotes: Number(data.pendingQuotes ?? 0),
          });
        }
      } catch {
        if (!cancelled) {
          setStats({
            totalTickets: 0,
            activeTickets: 0,
            totalQuoted: 0,
            pendingQuotes: 0,
          });
        }
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // Customer identity: placeholder fetch — stays Guest until DB/auth is connected.
  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      try {
        /**
         * Later you can wire this to your auth/session endpoint, e.g.
         * GET /api/customer/me  -> { name, email }
         */
        const res = await fetch("/api/customer/me");
        if (!res.ok) throw new Error("Customer endpoint not ready");
        const data = (await res.json()) as Partial<CustomerIdentity>;

        if (!cancelled) {
          setCustomer({
            name: String(data.name ?? "Guest"),
            email: String(data.email ?? "guest@giacom"),
          });
        }
      } catch {
        if (!cancelled) {
          setCustomer({ name: "Guest", email: "guest@giacom" });
        }
      }
    }

    loadCustomer();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNewTicket = () => {
    // Replace with navigation/modal logic later (e.g. react-router navigate("/tickets/new"))
    alert("New Ticket clicked (wire this to your ticket creation flow).");
  };

  return (
    <div className="customerPage">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandTitle">GIACOM</div>
          <div className="brandSub">Customer Portal</div>
        </div>

        <nav className="menu">
          {(
            ["Dashboard", "My Tickets", "Quotes", "History", "Profile"] as const
          ).map((item) => (
            <button
              key={item}
              className={`menuItem ${activeMenu === item ? "active" : ""}`}
              onClick={() => setActiveMenu(item)}
              type="button"
            >
              <span className="menuIcon" aria-hidden="true">
                {item === "Dashboard" && "🏠"}
                {item === "My Tickets" && "🎫"}
                {item === "Quotes" && "£"}
                {item === "History" && "🧾"}
                {item === "Profile" && "👤"}
              </span>
              <span className="menuLabel">{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebarFooter">
          <div className="userAvatar" aria-hidden="true">
            👤
          </div>
          <div className="userMeta">
            <div className="userName">{customer.name}</div>
            <div className="userEmail">{customer.email}</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topBar">
          <div>
            <h1 className="pageTitle">Dashboard</h1>
            <p className="pageSubtitle">
              Manage your support tickets and view quotes
            </p>
          </div>
        </header>

        {/* Stat cards */}
        <section className="statsGrid">
          <div className="statCard">
            <div className="statIcon blue" aria-hidden="true">
              🎫
            </div>
            <div className="statValue">{stats.totalTickets}</div>
            <div className="statLabel">Total Tickets</div>
          </div>

          <div className="statCard">
            <div className="statIcon amber" aria-hidden="true">
              🕒
            </div>
            <div className="statValue">{stats.activeTickets}</div>
            <div className="statLabel">Active Tickets</div>
          </div>

          <div className="statCard">
            <div className="statIcon green" aria-hidden="true">
              💷
            </div>
            <div className="statValue">{formatGBP(stats.totalQuoted)}</div>
            <div className="statLabel">Total Quoted</div>
          </div>

          <div className="statCard">
            <div className="statIcon orange" aria-hidden="true">
              🧾
            </div>
            <div className="statValue">{stats.pendingQuotes}</div>
            <div className="statLabel">Pending Quotes</div>
          </div>
        </section>

        {/* Search + New Ticket */}
        <section className="actionsRow">
          <div className="searchWrap">
            <span className="searchIcon" aria-hidden="true">
              🔎
            </span>
            <input
              className="searchInput"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="primaryBtn" onClick={handleNewTicket} type="button">
            <span className="btnPlus" aria-hidden="true">
              +
            </span>
            New Ticket
          </button>
        </section>

        {/* No tickets shown until DB is wired (removed as requested) */}
      </main>
    </div>
  );
};

export default CustomerPage;
