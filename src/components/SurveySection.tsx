import type { ReactNode } from "react";

interface SurveySectionProps {
  active: boolean;
  children: ReactNode;
}

export default function SurveySection({ active, children }: SurveySectionProps) {
  if (!active) return null;
  return <div className="section active">{children}</div>;
}
