import React from 'react';
import { TICKET_STATUSES, TICKET_TYPES } from '../../../shared/constants/lookup-values';
import type { StatusFilter, TypeFilter } from '../../pages/customer/useTicketFilters';

const STATUS_OPTIONS = Object.values(TICKET_STATUSES);
const TYPE_OPTIONS = Object.values(TICKET_TYPES);

interface TicketFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  typeFilter: TypeFilter;
  onTypeChange: (value: TypeFilter) => void;
  onClear: () => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onClear,
}) => {
  const hasActiveFilters = search !== '' || statusFilter !== '' || typeFilter !== '';

  return (
    <div role="search" aria-label="Filter tickets" data-testid="ticket-filters">
      <input
        type="search"
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
        placeholder="Search tickets..."
        aria-label="Search tickets"
        data-testid="filter-search"
      />

      <select
        value={statusFilter}
        onChange={(e) => {
          onStatusChange(e.target.value as StatusFilter);
        }}
        aria-label="Filter by status"
        data-testid="filter-status"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        value={typeFilter}
        onChange={(e) => {
          onTypeChange(e.target.value as TypeFilter);
        }}
        aria-label="Filter by type"
        data-testid="filter-type"
      >
        <option value="">All types</option>
        {TYPE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button type="button" onClick={onClear} data-testid="filter-clear">
          Clear filters
        </button>
      )}
    </div>
  );
};

export default TicketFilters;
