import { useState } from "react";

interface ProfileFormProps {
  year: string;
  department: string;
  frequency: string;
  errors: { year: boolean; department: boolean; frequency: boolean };
  onChange: (field: "year" | "department" | "frequency", value: string) => void;
  onNext: () => void;
}

const yearOptions = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "5th Year / Beyond",
];

// Fix #6: predefined CIT-U colleges for consistent data quality
const deptPresets = [
  "College of Computer Studies",
  "College of Engineering and Architecture",
  "College of Arts, Sciences, and Technology",
  "College of Business Administration",
  "College of Education",
  "College of Criminal Justice Education",
  "College of Nursing",
  "College of Hospitality Management",
  "Senior High School",
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
  // Fix #6: track whether user chose a preset or "other"
  const [deptSelect, setDeptSelect] = useState<string>(() =>
    deptPresets.includes(department) ? department : department ? "other" : ""
  );
  const [customDept, setCustomDept] = useState<string>(() =>
    deptPresets.includes(department) ? "" : department
  );

  function handleSelectChange(val: string) {
    setDeptSelect(val);
    if (val === "other") {
      onChange("department", customDept);
    } else {
      setCustomDept("");
      onChange("department", val);
    }
  }

  function handleCustomChange(val: string) {
    setCustomDept(val);
    onChange("department", val);
  }

  return (
    <>
      <h2 className="section-title">Part I</h2>
      <p className="section-subtitle">
        Respondent Profile &mdash; Please check or fill in the appropriate
        response.
      </p>

      {/* Fix #12: role="radiogroup" with aria-required on the group, not each input */}
      <div className={`card field-group${errors.year ? " has-error" : ""}`}>
        <div className="q-num">Question 1</div>
        <label className="field-label" id="year-label">Year Level</label>
        <div
          role="radiogroup"
          aria-labelledby="year-label"
          aria-required="true"
          className="radio-group"
        >
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

      {/* Fix #6: select dropdown with "Other" fallback text input */}
      <div className={`card field-group${errors.department ? " has-error" : ""}`}>
        <div className="q-num">Question 2</div>
        <label className="field-label" htmlFor="dept-select">
          College / Department
        </label>
        <select
          id="dept-select"
          value={deptSelect}
          onChange={(e) => handleSelectChange(e.target.value)}
          aria-required="true"
        >
          <option value="">— Select your college —</option>
          {deptPresets.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
          <option value="other">Other (please specify)</option>
        </select>
        {deptSelect === "other" && (
          <input
            type="text"
            className="dept-custom-input"
            placeholder="Enter your college or department"
            value={customDept}
            onChange={(e) => handleCustomChange(e.target.value)}
            aria-label="Other college or department"
          />
        )}
        <div className="error-msg">
          Please select your college or department.
        </div>
      </div>

      {/* Fix #12: role="radiogroup" with aria-required on the group */}
      <div className={`card field-group${errors.frequency ? " has-error" : ""}`}>
        <div className="q-num">Question 3</div>
        <label className="field-label" id="freq-label">
          How often do you visit university offices per semester?
        </label>
        <div
          role="radiogroup"
          aria-labelledby="freq-label"
          aria-required="true"
          className="radio-group"
        >
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
