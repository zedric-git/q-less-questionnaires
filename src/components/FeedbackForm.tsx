interface FeedbackFormProps {
  feedback: {
    biggestChallenge: string;
    desiredFeatures: string;
    otherComments: string;
  };
  submitting: boolean;
  onChange: (field: string, value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function FeedbackForm({
  feedback,
  submitting,
  onChange,
  onBack,
  onSubmit,
}: FeedbackFormProps) {
  return (
    <>
      <div className="section-title">Part IV</div>
      <div className="section-subtitle">
        Additional Feedback (Optional) &mdash; These responses will greatly help
        the researchers understand your experience.
      </div>

      <div className="card field-group">
        <div className="q-num">Question 1 &middot; Optional</div>
        <label className="field-label">
          What is the biggest challenge you face when queuing at university
          offices?
        </label>
        <textarea
          rows={3}
          placeholder="Share your experience..."
          value={feedback.biggestChallenge}
          onChange={(e) => onChange("biggestChallenge", e.target.value)}
        />
      </div>

      <div className="card field-group">
        <div className="q-num">Question 2 &middot; Optional</div>
        <label className="field-label">
          What features would you most want in a virtual queuing system?
        </label>
        <textarea
          rows={3}
          placeholder="e.g., SMS alerts, estimated wait time, mobile app, priority queuing..."
          value={feedback.desiredFeatures}
          onChange={(e) => onChange("desiredFeatures", e.target.value)}
        />
      </div>

      <div className="card field-group">
        <div className="q-num">Question 3 &middot; Optional</div>
        <label className="field-label">
          Do you have any other comments or suggestions regarding the queuing
          process at CIT-U?
        </label>
        <textarea
          rows={3}
          placeholder="Any additional thoughts..."
          value={feedback.otherComments}
          onChange={(e) => onChange("otherComments", e.target.value)}
        />
      </div>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack} disabled={submitting}>
          &larr; Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? "Saving\u2026" : "Submit Survey \u2713"}
        </button>
      </div>
    </>
  );
}
