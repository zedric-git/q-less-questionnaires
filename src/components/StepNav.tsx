const steps = [
  { num: "I", label: "Profile" },
  { num: "II", label: "Queue Experience" },
  { num: "III", label: "Receptiveness" },
  { num: "IV", label: "Feedback" },
];

interface StepNavProps {
  currentSection: number;
  submitted: boolean;
  // Fix #8: accept navigation callback so completed steps are clickable
  onGoToSection: (idx: number) => void;
}

export default function StepNav({ currentSection, submitted, onGoToSection }: StepNavProps) {
  return (
    <nav className="step-nav" aria-label="Survey progress">
      <div className="step-nav-inner">
        {steps.map((step, i) => {
          const isCompleted = !submitted && i < currentSection;
          const isActive = !submitted && i === currentSection;
          const isAllDone = submitted;

          let cls = "step-dot";
          if (isAllDone || isCompleted) cls += " completed";
          else if (isActive) cls += " active";

          // Fix #8: completed steps (not yet submitted) are interactive buttons
          if (isCompleted) {
            return (
              <button
                key={i}
                className={cls}
                onClick={() => onGoToSection(i)}
                aria-label={`Go back to ${step.label}`}
                aria-current={undefined}
              >
                <span className="num">{step.num}</span>
                <span className="label">{step.label}</span>
              </button>
            );
          }

          return (
            <div
              key={i}
              className={cls}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="num">{step.num}</span>
              <span className="label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
