import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CLIENT_ROUTES } from '../../constants/client.routes';
import AdminTicketDetail from '../../features/tickets/AdminTicketDetail';

const AdminTicketDetailPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();

  if (!ticketId) {
    return (
      <p role="alert" data-testid="admin-ticket-detail-page-no-id">
        No ticket ID provided.
      </p>
    );
  }

  return (
    <div data-testid="admin-ticket-detail-page">
      <nav aria-label="Breadcrumb">
        <Link to={CLIENT_ROUTES.ADMIN.TICKETS} data-testid="breadcrumb-tickets">
          Tickets
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Ticket Detail</span>
      </nav>

      <AdminTicketDetail ticketId={ticketId} />
    </div>
  );
};

export default AdminTicketDetailPage;
