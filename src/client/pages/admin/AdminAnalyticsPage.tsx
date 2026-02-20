import React, { useEffect } from 'react';
import { useListTickets } from '../../hooks/tickets/useListTicket';
import StatsOverview from '../../features/dashboard/StatsOverview';
import TicketStatusChart from '../../features/dashboard/TicketStatusChart';

// TODO STUB
const AdminAnalyticsPage: React.FC = () => {
  const { execute, data, loading, error } = useListTickets();

  useEffect(() => {
    void execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tickets = data?.tickets ?? [];

  if (loading) {
    return <p data-testid="analytics-loading">Loading analytics...</p>;
  }

  if (error) {
    return (
      <p role="alert" data-testid="analytics-error">
        {error}
      </p>
    );
  }

  return (
    <div data-testid="admin-analytics-page">
      <h1>Analytics</h1>

      {/* ── Live stats from existing components ── */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading">Overview</h2>
        <StatsOverview tickets={tickets} />
      </section>

      <section aria-labelledby="status-breakdown-heading">
        <h2 id="status-breakdown-heading">Ticket Status Breakdown</h2>
        <TicketStatusChart tickets={tickets} />
      </section>

      {/* ── Placeholder chart slots ── */}
      <section aria-labelledby="resolution-time-heading" data-testid="chart-slot-resolution-time">
        <h2 id="resolution-time-heading">Average Resolution Time</h2>
        <div
          aria-label="Average resolution time chart — coming soon"
          data-testid="chart-placeholder-resolution-time"
        >
          <p>Chart coming soon.</p>
        </div>
      </section>

      <section aria-labelledby="quote-accuracy-heading" data-testid="chart-slot-quote-accuracy">
        <h2 id="quote-accuracy-heading">Quote Accuracy</h2>
        <div
          aria-label="Quote accuracy chart — coming soon"
          data-testid="chart-placeholder-quote-accuracy"
        >
          <p>Chart coming soon.</p>
        </div>
      </section>

      <section aria-labelledby="ticket-volume-heading" data-testid="chart-slot-ticket-volume">
        <h2 id="ticket-volume-heading">Ticket Volume Over Time</h2>
        <div
          aria-label="Ticket volume chart — coming soon"
          data-testid="chart-placeholder-ticket-volume"
        >
          <p>Chart coming soon.</p>
        </div>
      </section>

      <section aria-labelledby="user-activity-heading" data-testid="chart-slot-user-activity">
        <h2 id="user-activity-heading">User Activity</h2>
        <div
          aria-label="User activity chart — coming soon"
          data-testid="chart-placeholder-user-activity"
        >
          <p>Chart coming soon.</p>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalyticsPage;
