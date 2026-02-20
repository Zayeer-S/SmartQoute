import React, { useEffect, useState } from 'react';
import { useGetTicket } from '../../hooks/tickets/useGetTicket';
import { useListQuotes } from '../../hooks/quotes/useListQuote';
import { useResolveTicket } from '../../hooks/tickets/useResolveTicket';
import { useTicketPermissions } from '../../hooks/auth/useTicketPermissions';
import AssignTicketForm from './AssignTicketForm';
import QuotePanel from './QuotePanel';
import CommentThread from './CommentThread';

interface AdminTicketDetailProps {
  ticketId: string;
}

const AdminTicketDetail: React.FC<AdminTicketDetailProps> = ({ ticketId }) => {
  const ticket = useGetTicket();
  const quotes = useListQuotes();
  const resolve = useResolveTicket();
  const { canAssign } = useTicketPermissions();

  const [showAssignForm, setShowAssignForm] = useState(false);

  const loadTicket = (): void => {
    void ticket.execute(ticketId);
  };

  useEffect(() => {
    loadTicket();
    void quotes.execute(ticketId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleResolve = (): void => {
    void resolve.execute(ticketId).then(loadTicket);
  };

  const handleAssigned = (): void => {
    setShowAssignForm(false);
    loadTicket();
  };

  const isLoading = ticket.loading || quotes.loading;
  const error = ticket.error ?? quotes.error;

  if (isLoading) {
    return <p data-testid="admin-ticket-detail-loading">Loading ticket...</p>;
  }

  if (error) {
    return (
      <p role="alert" data-testid="admin-ticket-detail-error">
        {error}
      </p>
    );
  }

  if (!ticket.data) {
    return <p data-testid="admin-ticket-detail-not-found">Ticket not found.</p>;
  }

  const t = ticket.data;

  const formattedDeadline = new Date(t.deadline).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedCreated = new Date(t.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const latestQuote =
    quotes.data && quotes.data.quotes.length > 0
      ? quotes.data.quotes.reduce((a, b) => (a.version > b.version ? a : b))
      : null;

  const isResolved = t.ticketStatusName === 'Resolved' || t.ticketStatusName === 'Closed';

  return (
    <div data-testid="admin-ticket-detail">
      <div>
        <h1 data-testid="ticket-title">{t.title}</h1>
        <div>
          <span data-testid="ticket-status">{t.ticketStatusName}</span>
          <span data-testid="ticket-priority">{t.ticketPriorityName}</span>
        </div>
      </div>

      {/* ── Ticket details ── */}
      <section aria-labelledby="ticket-info-heading">
        <h2 id="ticket-info-heading">Details</h2>

        <p data-testid="ticket-description">{t.description}</p>

        <dl>
          <div>
            <dt>Type</dt>
            <dd data-testid="ticket-type">{t.ticketTypeName}</dd>
          </div>
          <div>
            <dt>Severity</dt>
            <dd data-testid="ticket-severity">{t.ticketSeverityName}</dd>
          </div>
          <div>
            <dt>Business Impact</dt>
            <dd data-testid="ticket-business-impact">{t.businessImpactName}</dd>
          </div>
          <div>
            <dt>Users Impacted</dt>
            <dd data-testid="ticket-users-impacted">{t.usersImpacted}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd data-testid="ticket-deadline">{formattedDeadline}</dd>
          </div>
          <div>
            <dt>Organisation</dt>
            <dd data-testid="ticket-organisation">{t.organizationName}</dd>
          </div>
          <div>
            <dt>Submitted</dt>
            <dd data-testid="ticket-created">{formattedCreated}</dd>
          </div>
          <div>
            <dt>Assigned To</dt>
            <dd data-testid="ticket-assignee">{t.assignedToUserId ?? <em>Unassigned</em>}</dd>
          </div>
        </dl>
      </section>

      {/* ── Assignment ── */}
      {canAssign && (
        <section aria-labelledby="assign-heading">
          <h2 id="assign-heading">Assignment</h2>
          {!showAssignForm ? (
            <button
              type="button"
              onClick={() => {
                setShowAssignForm(true);
              }}
              data-testid="open-assign-form-btn"
            >
              {t.assignedToUserId ? 'Reassign Ticket' : 'Assign Ticket'}
            </button>
          ) : (
            <>
              <AssignTicketForm
                ticketId={ticketId}
                currentAssigneeId={t.assignedToUserId}
                onAssigned={handleAssigned}
              />
              <button
                type="button"
                onClick={() => {
                  setShowAssignForm(false);
                }}
                data-testid="cancel-assign-btn"
              >
                Cancel
              </button>
            </>
          )}
        </section>
      )}

      {/* ── Resolve action ── */}
      {!isResolved && (
        <section aria-labelledby="resolve-heading">
          <h2 id="resolve-heading">Actions</h2>
          {resolve.error && (
            <p role="alert" data-testid="resolve-error">
              {resolve.error}
            </p>
          )}
          <button
            type="button"
            onClick={handleResolve}
            disabled={resolve.loading}
            aria-busy={resolve.loading}
            data-testid="resolve-ticket-btn"
          >
            {resolve.loading ? 'Resolving...' : 'Mark as Resolved'}
          </button>
        </section>
      )}

      {/* ── Quote ── */}
      <section aria-labelledby="quote-section-heading">
        <h2 id="quote-section-heading">Quote</h2>
        {latestQuote ? (
          <QuotePanel ticketId={ticketId} quote={latestQuote} />
        ) : (
          <p data-testid="no-quote">No quote has been generated yet.</p>
        )}
      </section>

      {/* ── Comments ── */}
      <CommentThread ticketId={ticketId} />
    </div>
  );
};

export default AdminTicketDetail;
