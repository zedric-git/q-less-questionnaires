import { useEffect } from "react";

interface LikertSectionProps {
  title: string;
  subtitle: string;
  statements: string[];
  prefix: string;
  ratings: Record<string, number>;
  // Fix #3: counter instead of boolean — increments on each failed attempt so
  // the scroll-to-error effect always re-fires, even on repeated clicks
  errorCount: number;
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
  errorCount,
  onChange,
  onBack,
  onNext,
}: LikertSectionProps) {
  const hasError = errorCount > 0;

  // Fix #3: scroll to the first unanswered row whenever a validation attempt fails
  useEffect(() => {
    if (errorCount === 0) return;
    const firstUnanswered = statements.findIndex((_, i) => !ratings[`${prefix}_${i}`]);
    if (firstUnanswered >= 0) {
      const el = document.querySelector(`[data-row="${prefix}_${firstUnanswered}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>

      <div className="scale-legend">
        <div className="scale-labels">
          {scaleLabels.map((s) => (
            <span key={s.num}>
              <span className="num-badge">{s.num}</span> {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Fix #10: wrap card in has-error container for consistent error display */}
      <div className={hasError ? "has-error" : ""}>
        <div className="card">
          <div className="likert-header">
            <span></span>
            <span>SD<br />1</span>
            <span>D<br />2</span>
            <span>N<br />3</span>
            <span>A<br />4</span>
            <span>SA<br />5</span>
          </div>
          <div>
            {statements.map((stmt, i) => {
              const name = `${prefix}_${i}`;
              const answered = ratings[name] !== undefined;
              const unanswered = hasError && !answered;
              const rowClass = [
                "likert-row",
                answered ? "answered" : "",
                unanswered ? "unanswered-error" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                // Fix #3: data-row used to target the first unanswered item for scroll
                <div key={stmt} className={rowClass} data-row={name}>
                  <div className="likert-statement">
                    <span className="likert-num">{i + 1}.</span>
                    {stmt}
                  </div>
                  {/* Fix #12: role="group" gives screen readers statement context for the radio set */}
                  <div
                    role="group"
                    aria-label={`${i + 1}. ${stmt}`}
                    className="likert-radio-group"
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <div key={v} className="likert-cell" data-v={v}>
                        <input
                          type="radio"
                          name={name}
                          value={v}
                          checked={ratings[name] === v}
                          onChange={() => onChange(name, v)}
                          aria-label={scaleLabels[v - 1].label}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Fix #10: use .error-msg inside .has-error — no more inline style override */}
        <div className="error-msg">
          Please answer all statements before continuing.
        </div>
      </div>

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
