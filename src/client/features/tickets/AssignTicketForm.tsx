import React, { useState } from 'react';
import { useAssignTicket } from '../../hooks/tickets/useAssignTicket';

interface AssignTicketFormProps {
  ticketId: string;
  currentAssigneeId: string | null;
  onAssigned: () => void;
}

// TODO CURR TAKES RAW USER ID AS INPUT
const AssignTicketForm: React.FC<AssignTicketFormProps> = ({
  ticketId,
  currentAssigneeId,
  onAssigned,
}) => {
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId ?? '');
  const { execute, loading, error } = useAssignTicket();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!assigneeId.trim()) return;
    void execute(ticketId, { assigneeId }).then(() => {
      onAssigned();
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Assign ticket" data-testid="assign-ticket-form">
      <div>
        <label htmlFor="assignee-id">Assignee User ID</label>
        <input
          id="assignee-id"
          type="text"
          value={assigneeId}
          onChange={(e) => {
            setAssigneeId(e.target.value);
          }}
          placeholder="Enter user ID"
          required
          disabled={loading}
          aria-required="true"
          data-testid="assignee-id-input"
        />
      </div>

      {error && (
        <p role="alert" data-testid="assign-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !assigneeId.trim()}
        aria-busy={loading}
        data-testid="assign-submit-btn"
      >
        {loading ? 'Assigning...' : currentAssigneeId ? 'Reassign' : 'Assign'}
      </button>
    </form>
  );
};

export default AssignTicketForm;
