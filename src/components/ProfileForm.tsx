interface ProfileFormProps {
  year: string;
  department: string;
  frequency: string;
  errors: { year: boolean; department: boolean; frequency: boolean };
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const yearOptions = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year / Beyond",
];

const freqOptions = [
  "Rarely (1\u20132 times)",
  "Occasionally (3\u20135 times)",
  "Frequently (6\u201310 times)",
  "Very Frequently (more than 10 times)",
];

export default function ProfileForm({
  year,
  department,
  frequency,
  errors,
  onChange,
  onNext,
}: ProfileFormProps) {
  return (
    <>
      <div className="section-title">Part I</div>
      <div className="section-subtitle">
        Respondent Profile &mdash; Please check or fill in the appropriate
        response.
      </div>

      <div className={`card field-group${errors.year ? " has-error" : ""}`}>
        <div className="q-num">Question 1</div>
        <label className="field-label">Year Level</label>
        <div className="radio-group">
          {yearOptions.map((opt) => (
            <label
              key={opt}
              className={`radio-option${year === opt ? " selected" : ""}`}
            >
              <input
                type="radio"
                name="year"
                value={opt}
                checked={year === opt}
                onChange={() => onChange("year", opt)}
              />
              {opt}
            </label>
          ))}
        </div>
        <div className="error-msg">Please select your year level.</div>
      </div>

      <div
        className={`card field-group${errors.department ? " has-error" : ""}`}
      >
        <div className="q-num">Question 2</div>
        <label className="field-label">College / Department</label>
        <input
          type="text"
          placeholder="e.g., College of Computer Studies"
          value={department}
          onChange={(e) => onChange("department", e.target.value)}
        />
        <div className="error-msg">
          Please enter your college or department.
        </div>
      </div>

      <div
        className={`card field-group${errors.frequency ? " has-error" : ""}`}
      >
        <div className="q-num">Question 3</div>
        <label className="field-label">
          How often do you visit university offices per semester?
        </label>
        <div className="radio-group">
          {freqOptions.map((opt) => (
            <label
              key={opt}
              className={`radio-option${frequency === opt ? " selected" : ""}`}
            >
              <input
                type="radio"
                name="freq"
                value={opt}
                checked={frequency === opt}
                onChange={() => onChange("frequency", opt)}
              />
              {opt}
            </label>
          ))}
        </div>
        <div className="error-msg">Please select how often you visit.</div>
      </div>

      <div className="btn-row">
        <span></span>
        <button className="btn btn-primary" onClick={onNext}>
          Continue &rarr;
        </button>
      </div>
    </>
  );
}
