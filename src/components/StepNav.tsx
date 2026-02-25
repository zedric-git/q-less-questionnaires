const steps = [
  { num: "I", label: "Profile" },
  { num: "II", label: "Queue Experience" },
  { num: "III", label: "Receptiveness" },
  { num: "IV", label: "Feedback" },
];

interface StepNavProps {
  currentSection: number;
  submitted: boolean;
}

export default function StepNav({ currentSection, submitted }: StepNavProps) {
  return (
    <nav className="step-nav">
      <div className="step-nav-inner">
        {steps.map((step, i) => {
          let cls = "step-dot";
          if (submitted || i < currentSection) cls += " completed";
          else if (i === currentSection) cls += " active";
          return (
            <div key={i} className={cls}>
              <span className="num">{step.num}</span>
              <span className="label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
