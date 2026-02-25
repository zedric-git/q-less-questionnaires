import { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import StepNav from "./components/StepNav.tsx";
import SurveySection from "./components/SurveySection.tsx";
import ProfileForm from "./components/ProfileForm.tsx";
import LikertSection from "./components/LikertSection.tsx";
import FeedbackForm from "./components/FeedbackForm.tsx";
import SuccessScreen from "./components/SuccessScreen.tsx";
import { part2Statements, part3Statements } from "./data/statements.ts";
import {
  submitSurveyResponse,
  generateResponseId,
} from "./services/firebase.ts";

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  // Fix #11: track direction for correct slide animation
  const [navDirection, setNavDirection] = useState<"forward" | "back">("forward");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseId, setResponseId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Part I
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [frequency, setFrequency] = useState("");
  const [profileErrors, setProfileErrors] = useState({
    year: false,
    department: false,
    frequency: false,
  });

  // Part II & III — Fix #3: use a counter so repeated failed attempts re-trigger scroll
  const [likertErrors, setLikertErrors] = useState({ part2: 0, part3: 0 });

  // Part II & III ratings
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // Part IV
  const [feedback, setFeedback] = useState({
    biggestChallenge: "",
    desiredFeatures: "",
    otherComments: "",
  });

  // Fix #13: warn before unload when form has unsaved data
  useEffect(() => {
    const isDirty = Boolean(
      year || department || frequency ||
      Object.keys(ratings).length ||
      feedback.biggestChallenge || feedback.desiredFeatures || feedback.otherComments
    );
    if (!isDirty || submitted) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [year, department, frequency, ratings, feedback, submitted]);

  function goToSection(idx: number) {
    setNavDirection(idx > currentSection ? "forward" : "back");
    setCurrentSection(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleProfileChange(field: "year" | "department" | "frequency", value: string) {
    if (field === "year") setYear(value);
    else if (field === "department") setDepartment(value);
    else if (field === "frequency") setFrequency(value);
  }

  function validatePart1(): boolean {
    const errs = {
      year: !year,
      department: !department.trim(),
      frequency: !frequency,
    };
    setProfileErrors(errs);
    return !errs.year && !errs.department && !errs.frequency;
  }

  function validateLikert(prefix: string, count: number): boolean {
    for (let i = 0; i < count; i++) {
      if (!ratings[`${prefix}_${i}`]) return false;
    }
    return true;
  }

  function handleNextFromProfile() {
    if (validatePart1()) goToSection(1);
  }

  function handleNextFromPart2() {
    const valid = validateLikert("p2", part2Statements.length);
    if (valid) {
      setLikertErrors((prev) => ({ ...prev, part2: 0 }));
      goToSection(2);
    } else {
      setLikertErrors((prev) => ({ ...prev, part2: prev.part2 + 1 }));
    }
  }

  function handleNextFromPart3() {
    const valid = validateLikert("p3", part3Statements.length);
    if (valid) {
      setLikertErrors((prev) => ({ ...prev, part3: 0 }));
      goToSection(3);
    } else {
      setLikertErrors((prev) => ({ ...prev, part3: prev.part3 + 1 }));
    }
  }

  function handleRatingChange(key: string, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  function handleFeedbackChange(field: "biggestChallenge" | "desiredFeatures" | "otherComments", value: string) {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    const rid = generateResponseId();

    const payload = {
      responseId: rid,
      profile: {
        yearLevel: year,
        department: department.trim(),
        visitFrequency: frequency,
      },
      queuingExperience: Object.fromEntries(
        part2Statements.map((stmt, i) => [
          `q${i + 1}`,
          { statement: stmt, rating: ratings[`p2_${i}`] },
        ])
      ),
      receptiveness: Object.fromEntries(
        part3Statements.map((stmt, i) => [
          `q${i + 1}`,
          { statement: stmt, rating: ratings[`p3_${i}`] },
        ])
      ),
      openFeedback: {
        biggestChallenge: feedback.biggestChallenge.trim() || null,
        desiredFeatures: feedback.desiredFeatures.trim() || null,
        otherComments: feedback.otherComments.trim() || null,
      },
    };

    try {
      await submitSurveyResponse(payload);
      setResponseId(rid);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitting(false);
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setSubmitError(
        `Could not save your response. Please check your internet connection and try again. (${message})`
      );
    }
  }

  return (
    <>
      <Header />
      {/* Fix #5: removed redundant ProgressBar — StepNav is the sole progress indicator */}
      <StepNav
        currentSection={currentSection}
        submitted={submitted}
        onGoToSection={goToSection}
      />
      <main>
        {submitted ? (
          <SuccessScreen responseId={responseId} />
        ) : (
          <>
            <SurveySection active={currentSection === 0} direction={navDirection}>
              <ProfileForm
                year={year}
                department={department}
                frequency={frequency}
                errors={profileErrors}
                onChange={handleProfileChange}
                onNext={handleNextFromProfile}
              />
            </SurveySection>

            <SurveySection active={currentSection === 1} direction={navDirection}>
              <LikertSection
                title="Part II"
                subtitle="Current Queuing Experience — Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)."
                statements={part2Statements}
                prefix="p2"
                ratings={ratings}
                errorCount={likertErrors.part2}
                onChange={handleRatingChange}
                onBack={() => goToSection(0)}
                onNext={handleNextFromPart2}
              />
            </SurveySection>

            <SurveySection active={currentSection === 2} direction={navDirection}>
              <LikertSection
                title="Part III"
                subtitle="Receptiveness to a Virtual Queuing System — The proposed Q-Less system allows students to join a queue remotely, monitor their position in real time, and receive notifications. Rate each statement from 1–5."
                statements={part3Statements}
                prefix="p3"
                ratings={ratings}
                errorCount={likertErrors.part3}
                onChange={handleRatingChange}
                onBack={() => goToSection(1)}
                onNext={handleNextFromPart3}
              />
            </SurveySection>

            <SurveySection active={currentSection === 3} direction={navDirection}>
              <FeedbackForm
                feedback={feedback}
                submitting={submitting}
                submitError={submitError}
                onChange={handleFeedbackChange}
                onBack={() => goToSection(2)}
                onSubmit={handleSubmit}
              />
            </SurveySection>
          </>
        )}
      </main>
    </>
  );
}
