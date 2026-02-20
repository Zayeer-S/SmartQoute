import React from 'react';
import AdminTicketList from '../../features/tickets/AdminTicketList';

const AdminTicketsPage: React.FC = () => {
  return (
    <div data-testid="admin-tickets-page">
      <h1>Tickets</h1>
      <AdminTicketList />
    </div>
  );
};

export default AdminTicketsPage;
