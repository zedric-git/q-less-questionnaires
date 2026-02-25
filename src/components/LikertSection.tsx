interface LikertSectionProps {
  part: "II" | "III";
  title: string;
  subtitle: string;
  statements: string[];
  prefix: string;
  ratings: Record<string, number>;
  error: boolean;
  onChange: (key: string, value: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const scaleLabels = [
  { num: 1, label: "Strongly Disagree" },
  { num: 2, label: "Disagree" },
  { num: 3, label: "Neutral" },
  { num: 4, label: "Agree" },
  { num: 5, label: "Strongly Agree" },
];

export default function LikertSection({
  title,
  subtitle,
  statements,
  prefix,
  ratings,
  error,
  onChange,
  onBack,
  onNext,
}: LikertSectionProps) {
  return (
    <>
      <div className="section-title">{title}</div>
      <div className="section-subtitle">{subtitle}</div>

      <div className="scale-legend">
        <div className="scale-labels">
          {scaleLabels.map((s) => (
            <span key={s.num}>
              <span className="num-badge">{s.num}</span> {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="likert-header">
          <span></span>
          <span>
            SD
            <br />1
          </span>
          <span>
            D
            <br />2
          </span>
          <span>
            N
            <br />3
          </span>
          <span>
            A
            <br />4
          </span>
          <span>
            SA
            <br />5
          </span>
        </div>
        <div>
          {statements.map((stmt, i) => {
            const name = `${prefix}_${i}`;
            return (
              <div key={i} className="likert-row">
                <div className="likert-statement">
                  <span className="likert-num">{i + 1}.</span>
                  {stmt}
                </div>
                {[1, 2, 3, 4, 5].map((v) => (
                  <div key={v} className="likert-cell">
                    <input
                      type="radio"
                      name={name}
                      value={v}
                      checked={ratings[name] === v}
                      onChange={() => onChange(name, v)}
                      aria-label={String(v)}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {error && (
        <div className="error-msg" style={{ display: "block", marginTop: "-0.5rem", marginBottom: "1rem" }}>
          Please answer all statements before continuing.
        </div>
      )}

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onBack}>
          &larr; Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Continue &rarr;
        </button>
      </div>
    </>
  );
}
