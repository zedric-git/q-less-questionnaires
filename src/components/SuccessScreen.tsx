interface SuccessScreenProps {
  responseId: string;
}

export default function SuccessScreen({ responseId }: SuccessScreenProps) {
  return (
    <div className="section-done">
      <div className="success-icon">&check;</div>
      <h2>Thank You!</h2>
      <p style={{ marginBottom: "1.2rem" }}>
        Your responses have been saved to the cloud. Your participation is
        valuable in improving university services.
      </p>
      <div className="response-id-badge">
        RESPONSE ID: <span className="response-id">{responseId}</span>
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.4rem" }}>
        You may note your Response ID for your records.
      </p>
      <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        &mdash; End of Survey &mdash; Q-Less Capstone Project, CTT R6 &middot;
        Team Eureka
      </p>
    </div>
  );
}
