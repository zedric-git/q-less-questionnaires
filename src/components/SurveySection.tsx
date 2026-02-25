import type { ReactNode } from "react";

interface SurveySectionProps {
  active: boolean;
  children: ReactNode;
  // Fix #11: direction controls slide-in animation
  direction?: "forward" | "back";
}

export default function SurveySection({ active, children, direction = "forward" }: SurveySectionProps) {
  if (!active) return null;
  return (
    <div className={`section${direction === "back" ? " back" : ""}`}>
      {children}
    </div>
  );
}
