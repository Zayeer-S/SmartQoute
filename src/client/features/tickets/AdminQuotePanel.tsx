import React, { useState } from 'react';
import { useGenerateQuote } from '../../hooks/quotes/useGenerateQuote';
import { useCreateManualQuote } from '../../hooks/quotes/useCreateManualQuote';
import { useUpdateQuote } from '../../hooks/quotes/useUpdateQuote';
import { useSubmitForApproval } from '../../hooks/quotes/useSubmitForApproval';
import { useGetRevisionHistory } from '../../hooks/quotes/useGetRevisionHistory';
import { useQuotePermissions } from '../../hooks/auth/useQuotePermissions';
import QuotePanel from './QuotePanel';
import {
  LOOKUP_IDS,
  QUOTE_EFFORT_LEVELS,
  QUOTE_CONFIDENCE_LEVELS,
} from '../../../shared/constants/lookup-values';
import type { QuoteResponse } from '../../../shared/contracts/quote-contracts';

interface AdminQuotePanelProps {
  ticketId: string;
  /** All quotes for this ticket — the latest version is displayed, full list used for history */
  quotes: QuoteResponse[];
  /** Called after any mutation so the parent can refresh its quote list */
  onQuoteMutated: () => void;
}

const EFFORT_OPTIONS = [
  { id: LOOKUP_IDS.QUOTE_EFFORT_LEVEL.LOW, label: QUOTE_EFFORT_LEVELS.LOW },
  { id: LOOKUP_IDS.QUOTE_EFFORT_LEVEL.MEDIUM, label: QUOTE_EFFORT_LEVELS.MEDIUM },
  { id: LOOKUP_IDS.QUOTE_EFFORT_LEVEL.HIGH, label: QUOTE_EFFORT_LEVELS.HIGH },
] as const;

const CONFIDENCE_OPTIONS = [
  { id: LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.LOW, label: QUOTE_CONFIDENCE_LEVELS.LOW },
  { id: LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.MEDIUM, label: QUOTE_CONFIDENCE_LEVELS.MEDIUM },
  { id: LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.HIGH, label: QUOTE_CONFIDENCE_LEVELS.HIGH },
] as const;

interface ManualQuoteFormState {
  estimatedHoursMinimum: string;
  estimatedHoursMaximum: string;
  hourlyRate: string;
  fixedCost: string;
  quoteEffortLevelId: number;
  quoteConfidenceLevelId: number;
}

const INITIAL_MANUAL_FORM: ManualQuoteFormState = {
  estimatedHoursMinimum: '',
  estimatedHoursMaximum: '',
  hourlyRate: '',
  fixedCost: '0',
  quoteEffortLevelId: LOOKUP_IDS.QUOTE_EFFORT_LEVEL.MEDIUM,
  quoteConfidenceLevelId: LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.MEDIUM,
};

type ActivePanel = 'none' | 'manual' | 'update' | 'revisions';

const AdminQuotePanel: React.FC<AdminQuotePanelProps> = ({ ticketId, quotes, onQuoteMutated }) => {
  const { canCreate, canUpdate } = useQuotePermissions();

  const generate = useGenerateQuote();
  const createManual = useCreateManualQuote();
  const updateQuote = useUpdateQuote();
  const submitForApproval = useSubmitForApproval();
  const revisionHistory = useGetRevisionHistory();

  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [manualForm, setManualForm] = useState<ManualQuoteFormState>(INITIAL_MANUAL_FORM);
  const [updateReason, setUpdateReason] = useState('');
  const [updateForm, setUpdateForm] = useState<Partial<ManualQuoteFormState>>({});

  const latestQuote =
    quotes.length > 0 ? quotes.reduce((a, b) => (a.version > b.version ? a : b)) : null;

  const handleGenerate = (): void => {
    void generate.execute(ticketId).then(onQuoteMutated);
  };

  const handleManualFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    void createManual
      .execute(ticketId, {
        estimatedHoursMinimum: Number(manualForm.estimatedHoursMinimum),
        estimatedHoursMaximum: Number(manualForm.estimatedHoursMaximum),
        hourlyRate: Number(manualForm.hourlyRate),
        fixedCost: Number(manualForm.fixedCost),
        quoteEffortLevelId: manualForm.quoteEffortLevelId,
        quoteConfidenceLevelId: manualForm.quoteConfidenceLevelId,
      })
      .then(() => {
        setManualForm(INITIAL_MANUAL_FORM);
        setActivePanel('none');
        onQuoteMutated();
      });
  };

  const handleUpdateFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!latestQuote || !updateReason.trim()) return;
    void updateQuote
      .execute(ticketId, latestQuote.id, {
        ...(updateForm.estimatedHoursMinimum !== undefined && {
          estimatedHoursMinimum: Number(updateForm.estimatedHoursMinimum),
        }),
        ...(updateForm.estimatedHoursMaximum !== undefined && {
          estimatedHoursMaximum: Number(updateForm.estimatedHoursMaximum),
        }),
        ...(updateForm.hourlyRate !== undefined && {
          hourlyRate: Number(updateForm.hourlyRate),
        }),
        ...(updateForm.fixedCost !== undefined && {
          fixedCost: Number(updateForm.fixedCost),
        }),
        ...(updateForm.quoteEffortLevelId !== undefined && {
          quoteEffortLevelId: updateForm.quoteEffortLevelId,
        }),
        ...(updateForm.quoteConfidenceLevelId !== undefined && {
          quoteConfidenceLevelId: updateForm.quoteConfidenceLevelId,
        }),
        reason: updateReason,
      })
      .then(() => {
        setUpdateForm({});
        setUpdateReason('');
        setActivePanel('none');
        onQuoteMutated();
      });
  };

  const handleSubmitForApproval = (): void => {
    if (!latestQuote) return;
    void submitForApproval.execute(ticketId, latestQuote.id).then(onQuoteMutated);
  };

  const handleShowRevisions = (): void => {
    if (!latestQuote) return;
    setActivePanel('revisions');
    void revisionHistory.execute(ticketId, latestQuote.id);
  };

  const handleTogglePanel = (panel: ActivePanel): void => {
    setActivePanel((prev) => (prev === panel ? 'none' : panel));
  };

  return (
    <section aria-labelledby="admin-quote-heading" data-testid="admin-quote-panel">
      <h2 id="admin-quote-heading">Quote Management</h2>

      {/* ── Existing quote display ── */}
      {latestQuote ? (
        <QuotePanel ticketId={ticketId} quote={latestQuote} />
      ) : (
        <p data-testid="admin-no-quote">No quote has been generated yet.</p>
      )}

      {/* ── Primary actions ── */}
      <div data-testid="admin-quote-actions">
        {canCreate && (
          <>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generate.loading}
              aria-busy={generate.loading}
              data-testid="generate-quote-btn"
            >
              {generate.loading ? 'Generating...' : 'Auto-Generate Quote'}
            </button>

            <button
              type="button"
              onClick={() => {
                handleTogglePanel('manual');
              }}
              data-testid="toggle-manual-quote-btn"
            >
              {activePanel === 'manual' ? 'Cancel Manual Quote' : 'Create Manual Quote'}
            </button>
          </>
        )}

        {canUpdate && latestQuote && (
          <>
            <button
              type="button"
              onClick={() => {
                handleTogglePanel('update');
              }}
              data-testid="toggle-update-quote-btn"
            >
              {activePanel === 'update' ? 'Cancel Update' : 'Update Quote'}
            </button>

            <button
              type="button"
              onClick={handleSubmitForApproval}
              disabled={submitForApproval.loading}
              aria-busy={submitForApproval.loading}
              data-testid="submit-approval-btn"
            >
              {submitForApproval.loading ? 'Submitting...' : 'Submit for Approval'}
            </button>

            <button type="button" onClick={handleShowRevisions} data-testid="show-revisions-btn">
              Revision History
            </button>
          </>
        )}
      </div>

      {/* ── Error states ── */}
      {generate.error && (
        <p role="alert" data-testid="generate-error">
          {generate.error}
        </p>
      )}
      {createManual.error && (
        <p role="alert" data-testid="manual-quote-error">
          {createManual.error}
        </p>
      )}
      {updateQuote.error && (
        <p role="alert" data-testid="update-quote-error">
          {updateQuote.error}
        </p>
      )}
      {submitForApproval.error && (
        <p role="alert" data-testid="submit-approval-error">
          {submitForApproval.error}
        </p>
      )}

      {/* ── Manual quote form ── */}
      {activePanel === 'manual' && (
        <form
          onSubmit={handleManualSubmit}
          aria-label="Create manual quote"
          data-testid="manual-quote-form"
        >
          <h3>Create Manual Quote</h3>

          <div>
            <label htmlFor="mq-hours-min">Min Hours</label>
            <input
              id="mq-hours-min"
              name="estimatedHoursMinimum"
              type="number"
              min={0}
              value={manualForm.estimatedHoursMinimum}
              onChange={handleManualFormChange}
              required
              disabled={createManual.loading}
              data-testid="mq-hours-min"
            />
          </div>

          <div>
            <label htmlFor="mq-hours-max">Max Hours</label>
            <input
              id="mq-hours-max"
              name="estimatedHoursMaximum"
              type="number"
              min={0}
              value={manualForm.estimatedHoursMaximum}
              onChange={handleManualFormChange}
              required
              disabled={createManual.loading}
              data-testid="mq-hours-max"
            />
          </div>

          <div>
            <label htmlFor="mq-rate">Hourly Rate (£)</label>
            <input
              id="mq-rate"
              name="hourlyRate"
              type="number"
              min={0}
              step="0.01"
              value={manualForm.hourlyRate}
              onChange={handleManualFormChange}
              required
              disabled={createManual.loading}
              data-testid="mq-rate"
            />
          </div>

          <div>
            <label htmlFor="mq-fixed-cost">Fixed Cost (£)</label>
            <input
              id="mq-fixed-cost"
              name="fixedCost"
              type="number"
              min={0}
              step="0.01"
              value={manualForm.fixedCost}
              onChange={handleManualFormChange}
              required
              disabled={createManual.loading}
              data-testid="mq-fixed-cost"
            />
          </div>

          <div>
            <label htmlFor="mq-effort">Effort Level</label>
            <select
              id="mq-effort"
              name="quoteEffortLevelId"
              value={manualForm.quoteEffortLevelId}
              onChange={handleManualFormChange}
              disabled={createManual.loading}
              data-testid="mq-effort"
            >
              {EFFORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mq-confidence">Confidence Level</label>
            <select
              id="mq-confidence"
              name="quoteConfidenceLevelId"
              value={manualForm.quoteConfidenceLevelId}
              onChange={handleManualFormChange}
              disabled={createManual.loading}
              data-testid="mq-confidence"
            >
              {CONFIDENCE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={createManual.loading}
            aria-busy={createManual.loading}
            data-testid="manual-quote-submit-btn"
          >
            {createManual.loading ? 'Creating...' : 'Create Quote'}
          </button>
        </form>
      )}

      {/* ── Update quote form ── */}
      {activePanel === 'update' && latestQuote && (
        <form
          onSubmit={handleUpdateSubmit}
          aria-label="Update quote"
          data-testid="update-quote-form"
        >
          <h3>Update Quote (v{latestQuote.version})</h3>
          <p>Only fill in the fields you want to change.</p>

          <div>
            <label htmlFor="uq-hours-min">Min Hours</label>
            <input
              id="uq-hours-min"
              name="estimatedHoursMinimum"
              type="number"
              min={0}
              value={updateForm.estimatedHoursMinimum ?? ''}
              onChange={handleUpdateFormChange}
              disabled={updateQuote.loading}
              data-testid="uq-hours-min"
            />
          </div>

          <div>
            <label htmlFor="uq-hours-max">Max Hours</label>
            <input
              id="uq-hours-max"
              name="estimatedHoursMaximum"
              type="number"
              min={0}
              value={updateForm.estimatedHoursMaximum ?? ''}
              onChange={handleUpdateFormChange}
              disabled={updateQuote.loading}
              data-testid="uq-hours-max"
            />
          </div>

          <div>
            <label htmlFor="uq-rate">Hourly Rate (£)</label>
            <input
              id="uq-rate"
              name="hourlyRate"
              type="number"
              min={0}
              step="0.01"
              value={updateForm.hourlyRate ?? ''}
              onChange={handleUpdateFormChange}
              disabled={updateQuote.loading}
              data-testid="uq-rate"
            />
          </div>

          <div>
            <label htmlFor="uq-fixed-cost">Fixed Cost (£)</label>
            <input
              id="uq-fixed-cost"
              name="fixedCost"
              type="number"
              min={0}
              step="0.01"
              value={updateForm.fixedCost ?? ''}
              onChange={handleUpdateFormChange}
              disabled={updateQuote.loading}
              data-testid="uq-fixed-cost"
            />
          </div>

          <div>
            <label htmlFor="uq-reason">Reason for Change</label>
            <textarea
              id="uq-reason"
              value={updateReason}
              onChange={(e) => {
                setUpdateReason(e.target.value);
              }}
              placeholder="Required — describe what changed and why"
              required
              disabled={updateQuote.loading}
              rows={3}
              aria-required="true"
              data-testid="uq-reason"
            />
          </div>

          <button
            type="submit"
            disabled={updateQuote.loading || !updateReason.trim()}
            aria-busy={updateQuote.loading}
            data-testid="update-quote-submit-btn"
          >
            {updateQuote.loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {/* ── Revision history ── */}
      {activePanel === 'revisions' && (
        <section aria-labelledby="revisions-heading" data-testid="revision-history">
          <h3 id="revisions-heading">Revision History</h3>

          {revisionHistory.loading && <p data-testid="revisions-loading">Loading revisions...</p>}

          {revisionHistory.error && (
            <p role="alert" data-testid="revisions-error">
              {revisionHistory.error}
            </p>
          )}

          {!revisionHistory.loading && revisionHistory.data?.revisions.length === 0 && (
            <p data-testid="revisions-empty">No revisions recorded yet.</p>
          )}

          {revisionHistory.data && revisionHistory.data.revisions.length > 0 && (
            <ol role="list" data-testid="revisions-list">
              {revisionHistory.data.revisions.map((rev) => {
                const formattedDate = new Date(rev.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <li key={rev.id} data-testid={`revision-${String(rev.id)}`}>
                    <div>
                      <span data-testid={`revision-field-${String(rev.id)}`}>{rev.fieldName}</span>
                      <span data-testid={`revision-date-${String(rev.id)}`}>{formattedDate}</span>
                      <span data-testid={`revision-user-${String(rev.id)}`}>
                        {rev.changedByUserId}
                      </span>
                    </div>
                    <div>
                      <span data-testid={`revision-old-${String(rev.id)}`}>{rev.oldValue}</span>
                      <span aria-hidden="true"> → </span>
                      <span data-testid={`revision-new-${String(rev.id)}`}>{rev.newValue}</span>
                    </div>
                    <p data-testid={`revision-reason-${String(rev.id)}`}>{rev.reason}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      )}
    </section>
  );
};

export default AdminQuotePanel;
