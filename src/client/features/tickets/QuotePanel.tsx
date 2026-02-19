import React from 'react';
import type { QuoteResponse } from '../../../shared/contracts/quote-contracts';
import {
  LOOKUP_IDS,
  QUOTE_EFFORT_LEVELS,
  QUOTE_CONFIDENCE_LEVELS,
} from '../../../shared/constants/lookup-values';
import QuoteActions from './QuoteActions';

interface QuotePanelProps {
  ticketId: string;
  quote: QuoteResponse;
}

const EFFORT_LEVEL_LABELS: Record<number, string> = {
  [LOOKUP_IDS.QUOTE_EFFORT_LEVEL.LOW]: QUOTE_EFFORT_LEVELS.LOW,
  [LOOKUP_IDS.QUOTE_EFFORT_LEVEL.MEDIUM]: QUOTE_EFFORT_LEVELS.MEDIUM,
  [LOOKUP_IDS.QUOTE_EFFORT_LEVEL.HIGH]: QUOTE_EFFORT_LEVELS.HIGH,
};

const CONFIDENCE_LEVEL_LABELS: Record<number, string> = {
  [LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.LOW]: QUOTE_CONFIDENCE_LEVELS.LOW,
  [LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.MEDIUM]: QUOTE_CONFIDENCE_LEVELS.MEDIUM,
  [LOOKUP_IDS.QUOTE_CONFIDENCE_LEVEL.HIGH]: QUOTE_CONFIDENCE_LEVELS.HIGH,
};

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);

const QuotePanel: React.FC<QuotePanelProps> = ({ ticketId, quote }) => {
  const effortLabel = EFFORT_LEVEL_LABELS[quote.quoteEffortLevelId] ?? 'Unknown';
  const confidenceLabel =
    quote.quoteConfidenceLevelId !== null
      ? (CONFIDENCE_LEVEL_LABELS[quote.quoteConfidenceLevelId] ?? 'Unknown')
      : null;

  return (
    <section aria-labelledby="quote-heading" data-testid="quote-panel">
      <h2 id="quote-heading">Quote</h2>

      <dl>
        <div>
          <dt>Estimated Hours</dt>
          <dd data-testid="quote-hours">
            {quote.estimatedHoursMinimum}–{quote.estimatedHoursMaximum} hrs
          </dd>
        </div>

        <div>
          <dt>Estimated Resolution Time</dt>
          <dd data-testid="quote-resolution-time">{quote.estimatedResolutionTime} hrs</dd>
        </div>

        <div>
          <dt>Estimated Cost</dt>
          <dd data-testid="quote-estimated-cost">{formatCurrency(quote.estimatedCost)}</dd>
        </div>

        {quote.fixedCost > 0 && (
          <div>
            <dt>Fixed Cost</dt>
            <dd data-testid="quote-fixed-cost">{formatCurrency(quote.fixedCost)}</dd>
          </div>
        )}

        <div>
          <dt>Effort Level</dt>
          <dd data-testid="quote-effort-level">{effortLabel}</dd>
        </div>

        {confidenceLabel && (
          <div>
            <dt>Confidence</dt>
            <dd data-testid="quote-confidence-level">{confidenceLabel}</dd>
          </div>
        )}

        <div>
          <dt>Version</dt>
          <dd data-testid="quote-version">v{quote.version}</dd>
        </div>
      </dl>

      {/*
        TODO 
        Approval status gating is a stub pending the richer list endpoint.
        QuoteActions receives no approvalStatus so actions remain enabled.
        Once the endpoint returns QuoteWithApprovalResponse[], pass
        approvalStatus={quote.approvalStatusName} here.
      */}
      <QuoteActions ticketId={ticketId} quoteId={quote.id} />
    </section>
  );
};

export default QuotePanel;
