import React from 'react';
import { TICKET_SEVERITIES, TICKET_PRIORITIES } from '../../../shared/constants/lookup-values';

/**
 * SLA Policies page stub.
 */

interface SlaPolicyRow {
  id: string;
  severity: string;
  priority: string;
  responseTimeHours: string;
  resolutionTimeHours: string;
}

const STUB_POLICIES: SlaPolicyRow[] = [
  {
    id: 'sla-1',
    severity: TICKET_SEVERITIES.CRITICAL,
    priority: TICKET_PRIORITIES.P1,
    responseTimeHours: '1',
    resolutionTimeHours: '4',
  },
  {
    id: 'sla-2',
    severity: TICKET_SEVERITIES.HIGH,
    priority: TICKET_PRIORITIES.P2,
    responseTimeHours: '4',
    resolutionTimeHours: '8',
  },
  {
    id: 'sla-3',
    severity: TICKET_SEVERITIES.MEDIUM,
    priority: TICKET_PRIORITIES.P3,
    responseTimeHours: '8',
    resolutionTimeHours: '24',
  },
  {
    id: 'sla-4',
    severity: TICKET_SEVERITIES.LOW,
    priority: TICKET_PRIORITIES.P4,
    responseTimeHours: '24',
    resolutionTimeHours: '72',
  },
];

const AdminSLAPoliciesPage: React.FC = () => {
  return (
    <div data-testid="admin-sla-policies-page">
      <div>
        <h1>SLA Policies</h1>
        <button type="button" disabled data-testid="add-sla-policy-btn">
          Add Policy
        </button>
      </div>

      <p>
        Define response and resolution time targets by severity and priority. SLA enforcement and
        breach alerting will be available in a future release.
      </p>

      <table aria-label="SLA policies" data-testid="sla-policies-table">
        <thead>
          <tr>
            <th scope="col">Severity</th>
            <th scope="col">Priority</th>
            <th scope="col">Response Target (hrs)</th>
            <th scope="col">Resolution Target (hrs)</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {STUB_POLICIES.map((policy) => (
            <tr key={policy.id} data-testid={`sla-row-${policy.id}`}>
              <td data-testid={`sla-severity-${policy.id}`}>{policy.severity}</td>
              <td data-testid={`sla-priority-${policy.id}`}>{policy.priority}</td>
              <td data-testid={`sla-response-${policy.id}`}>{policy.responseTimeHours}</td>
              <td data-testid={`sla-resolution-${policy.id}`}>{policy.resolutionTimeHours}</td>
              <td>
                <button type="button" disabled data-testid={`sla-edit-${policy.id}`}>
                  Edit
                </button>
                <button type="button" disabled data-testid={`sla-delete-${policy.id}`}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSLAPoliciesPage;
