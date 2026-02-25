import { useState } from "react";
import ProgressBar from "./components/ProgressBar.tsx";
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

const TOTAL_SECTIONS = 4;

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseId, setResponseId] = useState("");

  // Part I
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [frequency, setFrequency] = useState("");
  const [profileErrors, setProfileErrors] = useState({
    year: false,
    department: false,
    frequency: false,
  });

  // Part II & III
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [likertErrors, setLikertErrors] = useState({ part2: false, part3: false });

  // Part IV
  const [feedback, setFeedback] = useState({
    biggestChallenge: "",
    desiredFeatures: "",
    otherComments: "",
  });

  function goToSection(idx: number) {
    setCurrentSection(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleProfileChange(field: string, value: string) {
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
    setLikertErrors((prev) => ({ ...prev, part2: !valid }));
    if (valid) goToSection(2);
  }

  function handleNextFromPart3() {
    const valid = validateLikert("p3", part3Statements.length);
    setLikertErrors((prev) => ({ ...prev, part3: !valid }));
    if (valid) goToSection(3);
  }

  function handleRatingChange(key: string, value: number) {
    setRatings((prev) => ({ ...prev, [key]: value }));
  }

  function handleFeedbackChange(field: string, value: string) {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setSubmitting(true);
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
      alert(
        `Could not save your response. Please check your internet connection and try again.\n\nError: ${message}`
      );
    }
  }

  if (submitted) {
    return (
      <>
        <ProgressBar
          currentSection={currentSection}
          totalSections={TOTAL_SECTIONS}
          submitted={submitted}
        />
        <Header />
        <StepNav currentSection={currentSection} submitted={submitted} />
        <main>
          <SuccessScreen responseId={responseId} />
        </main>
      </>
    );
  }

  return (
    <>
      <ProgressBar
        currentSection={currentSection}
        totalSections={TOTAL_SECTIONS}
        submitted={submitted}
      />
      <Header />
      <StepNav currentSection={currentSection} submitted={submitted} />
      <main>
        <SurveySection active={currentSection === 0}>
          <ProfileForm
            year={year}
            department={department}
            frequency={frequency}
            errors={profileErrors}
            onChange={handleProfileChange}
            onNext={handleNextFromProfile}
          />
        </SurveySection>

        <SurveySection active={currentSection === 1}>
          <LikertSection
            part="II"
            title="Part II"
            subtitle="Current Queuing Experience — Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)."
            statements={part2Statements}
            prefix="p2"
            ratings={ratings}
            error={likertErrors.part2}
            onChange={handleRatingChange}
            onBack={() => goToSection(0)}
            onNext={handleNextFromPart2}
          />
        </SurveySection>

        <SurveySection active={currentSection === 2}>
          <LikertSection
            part="III"
            title="Part III"
            subtitle="Receptiveness to a Virtual Queuing System — The proposed Q-Less system allows students to join a queue remotely, monitor their position in real time, and receive notifications. Rate each statement from 1–5."
            statements={part3Statements}
            prefix="p3"
            ratings={ratings}
            error={likertErrors.part3}
            onChange={handleRatingChange}
            onBack={() => goToSection(1)}
            onNext={handleNextFromPart3}
          />
        </SurveySection>

        <SurveySection active={currentSection === 3}>
          <FeedbackForm
            feedback={feedback}
            submitting={submitting}
            onChange={handleFeedbackChange}
            onBack={() => goToSection(2)}
            onSubmit={handleSubmit}
          />
        </SurveySection>
      </main>
    </>
  );
}
