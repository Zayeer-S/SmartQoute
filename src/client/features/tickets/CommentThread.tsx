import React, { useEffect, useState } from 'react';
import { useListComments } from '../../hooks/tickets/useListComments';
import { useAddComment } from '../../hooks/tickets/useAddComment';
import { COMMENT_TYPES, LOOKUP_IDS } from '../../../shared/constants/lookup-values';
import type { CommentType } from '../../../shared/constants/lookup-values';

interface CommentThreadProps {
  ticketId: string;
}

const COMMENT_TYPE_OPTIONS: { id: number; label: CommentType }[] = [
  { id: LOOKUP_IDS.COMMENT_TYPE.EXTERNAL, label: COMMENT_TYPES.EXTERNAL },
  { id: LOOKUP_IDS.COMMENT_TYPE.INTERNAL, label: COMMENT_TYPES.INTERNAL },
];

const COMMENT_TYPE_ID_TO_NAME: Record<number, string> = {
  [LOOKUP_IDS.COMMENT_TYPE.INTERNAL]: COMMENT_TYPES.INTERNAL,
  [LOOKUP_IDS.COMMENT_TYPE.EXTERNAL]: COMMENT_TYPES.EXTERNAL,
  [LOOKUP_IDS.COMMENT_TYPE.SYSTEM]: COMMENT_TYPES.SYSTEM,
};

const CommentThread: React.FC<CommentThreadProps> = ({ ticketId }) => {
  const list = useListComments();
  const add = useAddComment();

  const [commentText, setCommentText] = useState('');
  const [commentTypeId, setCommentTypeId] = useState<number>(LOOKUP_IDS.COMMENT_TYPE.EXTERNAL);

  useEffect(() => {
    void list.execute(ticketId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!commentText.trim()) return;
    void add.execute(ticketId, { commentText, commentTypeId }).then(() => {
      setCommentText('');
      void list.execute(ticketId);
    });
  };

  const comments = list.data?.comments ?? [];

  return (
    <section aria-labelledby="comments-heading" data-testid="comment-thread">
      <h2 id="comments-heading">Comments</h2>

      {list.loading && <p data-testid="comments-loading">Loading comments...</p>}

      {list.error && (
        <p role="alert" data-testid="comments-error">
          {list.error}
        </p>
      )}

      {!list.loading && comments.length === 0 && (
        <p data-testid="comments-empty">No comments yet.</p>
      )}

      {comments.length > 0 && (
        <ol role="list" data-testid="comments-list">
          {comments.map((comment) => {
            const typeName = COMMENT_TYPE_ID_TO_NAME[comment.commentTypeId] ?? 'Unknown';
            const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <li key={comment.id} data-testid={`comment-${String(comment.id)}`}>
                <div>
                  <span data-testid={`comment-type-${String(comment.id)}`}>{typeName}</span>
                  <span data-testid={`comment-date-${String(comment.id)}`}>{formattedDate}</span>
                  <span data-testid={`comment-user-${String(comment.id)}`}>{comment.userId}</span>
                </div>
                <p data-testid={`comment-text-${String(comment.id)}`}>{comment.commentText}</p>
              </li>
            );
          })}
        </ol>
      )}

      <form onSubmit={handleSubmit} aria-label="Add comment" data-testid="add-comment-form">
        <div>
          <label htmlFor="comment-type">Comment Type</label>
          <select
            id="comment-type"
            value={commentTypeId}
            onChange={(e) => {
              setCommentTypeId(Number(e.target.value));
            }}
            disabled={add.loading}
            data-testid="comment-type-select"
          >
            {COMMENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="comment-text">Comment</label>
          <textarea
            id="comment-text"
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
            placeholder={
              commentTypeId === LOOKUP_IDS.COMMENT_TYPE.INTERNAL
                ? 'Internal note (not visible to customer)...'
                : 'Reply to customer...'
            }
            required
            disabled={add.loading}
            rows={3}
            aria-required="true"
            data-testid="comment-text-input"
          />
        </div>

        {add.error && (
          <p role="alert" data-testid="add-comment-error">
            {add.error}
          </p>
        )}

        <button
          type="submit"
          disabled={add.loading || !commentText.trim()}
          aria-busy={add.loading}
          data-testid="add-comment-btn"
        >
          {add.loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </section>
  );
};

export default CommentThread;
