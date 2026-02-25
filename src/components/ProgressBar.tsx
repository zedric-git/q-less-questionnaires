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
  const pct = submitted ? 100 : (currentSection / totalSections) * 100;
  return <div className="progress-bar" style={{ width: `${pct}%` }} />;
}
