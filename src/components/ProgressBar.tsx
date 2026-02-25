interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
  submitted: boolean;
}

export default function ProgressBar({
  currentSection,
  totalSections,
  submitted,
}: ProgressBarProps) {
  const filled = submitted ? totalSections : currentSection + 1;
  return (
    <div className="progress-segmented">
      {Array.from({ length: totalSections }, (_, i) => (
        <div key={i} className={`progress-seg${i < filled ? " filled" : ""}`} />
      ))}
    </div>
  );
}
