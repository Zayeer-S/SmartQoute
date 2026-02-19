import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from './CustomerLayout';
import { DASHBOARD_STATS } from '../../features/customerDashboard/customerDashboard.constants';
import { CLIENT_ROUTES } from '../../constants/client.routes';
import type { TicketDetailResponse } from '../../../shared/contracts/ticket-contracts';
import './CustomerPage.css';

// Placeholder until tickets hook is wired
const TICKETS: TicketDetailResponse[] = [];

const CustomerPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  return (
    <CustomerLayout>
      <header className="topBar" data-testid="dashboard-header">
        <div>
          <h1 className="pageTitle">Dashboard</h1>
          <p className="pageSubtitle">Manage your support tickets and view quotes</p>
        </div>
      </header>

      <section className="statsGrid" aria-label="Ticket statistics" data-testid="stats-grid">
        {DASHBOARD_STATS.map((s) => (
          <div
            key={s.label}
            className="statCard"
            data-testid={`stat-card-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className={`statIcon ${s.tone}`} aria-hidden="true">
              {s.icon}
            </div>
            <div className="statValue" aria-label={`${s.label}: ${s.value}`}>
              {s.value}
            </div>
            <div className="statLabel">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="actionsRow" aria-label="Ticket actions" data-testid="actions-row">
        <div className="searchWrap" role="search">
          <span className="searchIcon" aria-hidden="true" />
          <input
            id="ticket-search"
            className="searchInput"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Search tickets..."
            aria-label="Search tickets"
            data-testid="ticket-search-input"
          />
        </div>

        <button
          className="primaryBtn"
          type="button"
          onClick={() => void navigate(CLIENT_ROUTES.CUSTOMER_CREATE)}
          data-testid="new-ticket-btn"
        >
          <span className="btnPlus" aria-hidden="true">
            ＋
          </span>
          New Ticket
        </button>
      </section>

      <section className="tableShell" aria-label="Tickets list" data-testid="tickets-list">
        {TICKETS.length === 0 ? (
          <div className="emptyState" role="status" data-testid="tickets-empty-state">
            No tickets found.
          </div>
        ) : (
          <div style={{ width: '100%' }}>{/* future list */}</div>
        )}
      </section>
    </CustomerLayout>
  );
};

export default CustomerPage;
