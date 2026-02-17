import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTicketPage.css";
import "./CustomerPage.css";

type MenuKey = "Dashboard" | "My Tickets" | "Quotes" | "History" | "Profile";

type LookupOption = { id: number; label: string };

type CreateTicketPayload = {
  creator_user_id: number;
  organization_id: number;
  title: string;
  description: string;
  ticket_type_id: number;
  ticket_severity_id: number;
  business_impact_id: number;
  ticket_status_id: number;
  ticket_priority_id: number;
  deadline: string;
  users_impacted: number;
  is_deleted: boolean;

  assigned_to_user_id: number | null;
  resolved_by_user_id: number | null;
  sla_policy_id: number | null;
  sla_response_due_at: string | null;
  sla_resolution_due_at: string | null;
};

type TicketFormState = {
  ticket_type_id: number;
  title: string;
  description: string;
  ticket_severity_id: number;
  business_impact_id: number;
  ticket_priority_id: number;
  ticket_status_id: number;

  deadline_date: string; // "YYYY-MM-DD"
  users_impacted: number;

  assigned_to_user_id: number | "unassigned";
  sla_policy_id: number | "none";
};

const TICKET_TYPES: LookupOption[] = [
  { id: 1, label: "Support - Technical assistance or help" },
  { id: 2, label: "Incident - Service outage or disruption" },
  { id: 3, label: "Request - Change or access request" },
  { id: 4, label: "Billing - Invoices, charges, payments" },
];

const SEVERITIES: LookupOption[] = [
  { id: 1, label: "Low - Minor issue" },
  { id: 2, label: "Medium - Notable issue" },
  { id: 3, label: "High - Major issue" },
  { id: 4, label: "Critical - System down" },
];

const BUSINESS_IMPACTS: LookupOption[] = [
  { id: 1, label: "Low - Little to no disruption" },
  { id: 2, label: "Moderate - Some disruption" },
  { id: 3, label: "High - Significant disruption" },
  { id: 4, label: "Severe - Business halted" },
];

const PRIORITIES: LookupOption[] = [
  { id: 1, label: "Low" },
  { id: 2, label: "Medium" },
  { id: 3, label: "High" },
  { id: 4, label: "Urgent" },
];

const STATUSES: LookupOption[] = [
  { id: 1, label: "New" },
  { id: 2, label: "Open" },
  { id: 3, label: "In Progress" },
  { id: 4, label: "Resolved" },
  { id: 5, label: "Closed" },
];

const SLA_POLICIES: LookupOption[] = [
  { id: 1, label: "Standard SLA" },
  { id: 2, label: "Premium SLA" },
];

const ASSIGNEES: LookupOption[] = [
  { id: 201, label: "Support Agent 1" },
  { id: 202, label: "Support Agent 2" },
  { id: 203, label: "Support Agent 3" },
];

// Same icons as CustomerPage
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

function dateToISOEndOfDay(dateStr: string): string {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  const dt = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, 23, 59, 59, 0);
  return dt.toISOString();
}

const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState<MenuKey>("My Tickets");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Sidebar dropdown (same behavior as CustomerPage)
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const root = profileRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) setProfileOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((v) => !v);
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

  // Auth/session placeholders (used for payload requirements)
  const authContext = useMemo(
    () => ({
      userId: 123,
      organizationId: 456,
    }),
    []
  );

  const [form, setForm] = useState<TicketFormState>({
    ticket_type_id: TICKET_TYPES[0]?.id ?? 1,
    title: "",
    description: "",
    ticket_severity_id: SEVERITIES[1]?.id ?? 2,
    business_impact_id: BUSINESS_IMPACTS[1]?.id ?? 2,
    ticket_priority_id: PRIORITIES[1]?.id ?? 2,
    ticket_status_id: STATUSES[0]?.id ?? 1,
    deadline_date: "",
    users_impacted: 1,
    assigned_to_user_id: "unassigned",
    sla_policy_id: "none",
  });

  const setField = <K extends keyof TicketFormState>(
    key: K,
    value: TicketFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authContext.userId) return alert("Missing creator_user_id (not logged in).");
    if (!authContext.organizationId) return alert("Missing organization_id.");
    if (!form.title.trim()) return alert("Title is required.");
    if (!form.description.trim()) return alert("Description is required.");
    if (!form.deadline_date) return alert("Deadline is required.");
    if (!Number.isFinite(form.users_impacted) || form.users_impacted < 1) {
      return alert("Users impacted must be 1 or more.");
    }

    const payload: CreateTicketPayload = {
      creator_user_id: authContext.userId,
      organization_id: authContext.organizationId,
      title: form.title.trim(),
      description: form.description.trim(),
      ticket_type_id: form.ticket_type_id,
      ticket_severity_id: form.ticket_severity_id,
      business_impact_id: form.business_impact_id,
      ticket_status_id: form.ticket_status_id,
      ticket_priority_id: form.ticket_priority_id,
      deadline: dateToISOEndOfDay(form.deadline_date),
      users_impacted: form.users_impacted,
      is_deleted: false,
      assigned_to_user_id:
        form.assigned_to_user_id === "unassigned" ? null : form.assigned_to_user_id,
      resolved_by_user_id: null,
      sla_policy_id: form.sla_policy_id === "none" ? null : form.sla_policy_id,
      sla_response_due_at: null,
      sla_resolution_due_at: null,
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      alert("Ticket created successfully.");
      navigate("/customer");
    } catch (err) {
      console.error(err);
      alert(
        `Failed to create ticket: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const handleCancel = () => navigate("/customer");

  const descriptionCount = form.description.length;

  return (
    <div className={`customerPage ${isCollapsed ? "sidebarCollapsed" : ""}`}>
      {/* Sidebar (same as CustomerPage) */}
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
            onClick={() => {
              setActiveMenu("Dashboard");
              navigate("/customer");
            }}
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
        <header className="createTopBar">
          <div>
            <h1 className="createTitle">Create New Ticket</h1>
            <p className="createSubtitle">
              Fill in the details below. A quote will be automatically generated
              based on your inputs.
            </p>
          </div>
        </header>

        <form className="formShell" onSubmit={handleSubmit}>
          <section className="formCard">
            <div className="formHeader">
              <div>
                <div className="formHeaderTitle">Ticket Information</div>
                <div className="formHeaderSubtitle">
                  Provide as much detail as possible to help us understand your request
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">
                Ticket Type <span className="req">*</span>
              </label>
              <select
                className="control"
                value={form.ticket_type_id}
                onChange={(e) => setField("ticket_type_id", Number(e.target.value))}
              >
                {TICKET_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">
                Title <span className="req">*</span>
              </label>
              <input
                className="control"
                placeholder="Brief summary of the issue or request"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label className="label">
                Description <span className="req">*</span>
              </label>
              <textarea
                className="control textarea"
                placeholder="Provide a detailed explanation of the issue or request."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                required
              />
              <div className="helpRow">
                <span className="charCount">{descriptionCount} characters</span>
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="label">
                  Severity <span className="req">*</span>
                </label>
                <select
                  className="control"
                  value={form.ticket_severity_id}
                  onChange={(e) =>
                    setField("ticket_severity_id", Number(e.target.value))
                  }
                >
                  {SEVERITIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label">
                  Business Impact <span className="req">*</span>
                </label>
                <select
                  className="control"
                  value={form.business_impact_id}
                  onChange={(e) =>
                    setField("business_impact_id", Number(e.target.value))
                  }
                >
                  {BUSINESS_IMPACTS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="label">
                  Priority <span className="req">*</span>
                </label>
                <select
                  className="control"
                  value={form.ticket_priority_id}
                  onChange={(e) =>
                    setField("ticket_priority_id", Number(e.target.value))
                  }
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label">
                  Status <span className="req">*</span>
                </label>
                <select
                  className="control"
                  value={form.ticket_status_id}
                  onChange={(e) =>
                    setField("ticket_status_id", Number(e.target.value))
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="label">
                  Deadline <span className="req">*</span>
                </label>
                <input
                  type="date"
                  className="control"
                  value={form.deadline_date}
                  onChange={(e) => setField("deadline_date", e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label className="label">
                  Users Impacted <span className="req">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  className="control"
                  value={form.users_impacted}
                  onChange={(e) => setField("users_impacted", Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <label className="label">Assign To</label>
                <select
                  className="control"
                  value={form.assigned_to_user_id}
                  onChange={(e) => {
                    const v = e.target.value;
                    setField(
                      "assigned_to_user_id",
                      v === "unassigned" ? "unassigned" : Number(v)
                    );
                  }}
                >
                  <option value="unassigned">Unassigned</option>
                  {ASSIGNEES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label">SLA Policy</label>
                <select
                  className="control"
                  value={form.sla_policy_id}
                  onChange={(e) => {
                    const v = e.target.value;
                    setField("sla_policy_id", v === "none" ? "none" : Number(v));
                  }}
                >
                  <option value="none">None</option>
                  {SLA_POLICIES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="formActions">
            <button className="submitBtn" type="submit">
              💾 Submit Ticket
            </button>
            <button className="cancelBtn" type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateTicketPage;





