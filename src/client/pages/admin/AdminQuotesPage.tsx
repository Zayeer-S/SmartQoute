import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useListTickets } from '../../hooks/tickets/useListTicket';
import { useListQuotes } from '../../hooks/quotes/useListQuote';
import { CLIENT_ROUTES } from '../../constants/client.routes';
import { QUOTE_APPROVAL_STATUSES, TICKET_STATUSES } from '../../../shared/constants/lookup-values';
import type { QuoteApprovalStatus } from '../../../shared/constants/lookup-values';
import type { TicketDetailResponse } from '../../../shared/contracts/ticket-contracts';
import type { QuoteResponse } from '../../../shared/contracts/quote-contracts';

/**
 * Quotes are nested under tickets in the API, so we fetch all tickets then
 * lazily load each ticket's quotes. This page acts as a cross-ticket quote
 * overview for admins.
 */

type ApprovalFilter = QuoteApprovalStatus | '';

const APPROVAL_OPTIONS = Object.values(QUOTE_APPROVAL_STATUSES);

interface TicketQuoteRowProps {
  ticket: TicketDetailResponse;
}

const TicketQuoteRow: React.FC<TicketQuoteRowProps> = ({ ticket }) => {
  const { execute, data, loading, error } = useListQuotes();

  useEffect(() => {
    void execute(ticket.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.id]);

  const latestQuote: QuoteResponse | null =
    data && data.quotes.length > 0
      ? data.quotes.reduce((a, b) => (a.version > b.version ? a : b))
      : null;

  if (loading) {
    return (
      <li data-testid={`quote-row-loading-${ticket.id}`}>
        <span>Loading quote for {ticket.title}...</span>
      </li>
    );
  }

  if (error || !latestQuote) return null;

  const formattedCost = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(latestQuote.estimatedCost);

  return (
    <li data-testid={`quote-row-${ticket.id}`}>
      <div>
        <Link
          to={CLIENT_ROUTES.ADMIN.QUOTE(ticket.id, latestQuote.id)}
          data-testid={`quote-row-link-${ticket.id}`}
        >
          {ticket.title}
        </Link>
        <span data-testid={`quote-row-org-${ticket.id}`}>{ticket.organizationName}</span>
      </div>
      <div>
        <span data-testid={`quote-row-version-${ticket.id}`}>v{latestQuote.version}</span>
        <span data-testid={`quote-row-cost-${ticket.id}`}>{formattedCost}</span>
        <span data-testid={`quote-row-hours-${ticket.id}`}>
          {latestQuote.estimatedHoursMinimum}–{latestQuote.estimatedHoursMaximum} hrs
        </span>
        <span data-testid={`quote-row-status-${ticket.id}`}>{ticket.ticketStatusName}</span>
      </div>
      <div>
        <Link
          to={CLIENT_ROUTES.ADMIN.TICKET(ticket.id)}
          data-testid={`quote-row-ticket-link-${ticket.id}`}
        >
          View Ticket
        </Link>
        <Link
          to={CLIENT_ROUTES.ADMIN.QUOTE(ticket.id, latestQuote.id)}
          data-testid={`quote-row-quote-link-${ticket.id}`}
        >
          Manage Quote
        </Link>
      </div>
    </li>
  );
};

const TICKETS_WITH_ACTIVE_QUOTES = [
  TICKET_STATUSES.ASSIGNED,
  TICKET_STATUSES.IN_PROGRESS,
  TICKET_STATUSES.OPEN,
  TICKET_STATUSES.RESOLVED,
];

const AdminQuotesPage: React.FC = () => {
  const { execute, data, loading, error } = useListTickets();
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    void execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tickets = data?.tickets ?? [];

  const filteredTickets = tickets.filter((t) => {
    if (
      !TICKETS_WITH_ACTIVE_QUOTES.includes(
        t.ticketStatusName as (typeof TICKETS_WITH_ACTIVE_QUOTES)[number]
      )
    )
      return false;
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      if (!t.title.toLowerCase().includes(term) && !t.organizationName.toLowerCase().includes(term))
        return false;
    }
    return true;
  });

  if (loading) {
    return <p data-testid="admin-quotes-loading">Loading quotes...</p>;
  }

  if (error) {
    return (
      <p role="alert" data-testid="admin-quotes-error">
        {error}
      </p>
    );
  }

  return (
    <div data-testid="admin-quotes-page">
      <h1>Quote Management</h1>

      <div role="search" aria-label="Filter quotes" data-testid="quote-filters">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search by ticket title or organisation..."
          aria-label="Search quotes"
          data-testid="quote-search"
        />

        <select
          value={approvalFilter}
          onChange={(e) => {
            setApprovalFilter(e.target.value as ApprovalFilter);
          }}
          aria-label="Filter by approval status"
          data-testid="quote-approval-filter"
        >
          <option value="">All approval statuses</option>
          {APPROVAL_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {(search || approvalFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setApprovalFilter('');
            }}
            data-testid="quote-filter-clear"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredTickets.length === 0 ? (
        <p data-testid="admin-quotes-empty">No tickets with quotes found.</p>
      ) : (
        <ul role="list" data-testid="admin-quotes-list">
          {filteredTickets.map((ticket) => (
            <TicketQuoteRow key={ticket.id} ticket={ticket} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminQuotesPage;
