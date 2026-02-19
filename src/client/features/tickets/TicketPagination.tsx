import React from 'react';

interface TicketPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TicketPagination: React.FC<TicketPaginationProps> = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Ticket list pagination" data-testid="ticket-pagination">
      <button
        type="button"
        onClick={() => {
          onPageChange(page - 1);
        }}
        disabled={page <= 1}
        aria-label="Previous page"
        data-testid="pagination-prev"
      >
        Previous
      </button>

      <span aria-current="page" data-testid="pagination-label">
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => {
          onPageChange(page + 1);
        }}
        disabled={page >= totalPages}
        aria-label="Next page"
        data-testid="pagination-next"
      >
        Next
      </button>
    </nav>
  );
};

export default TicketPagination;
