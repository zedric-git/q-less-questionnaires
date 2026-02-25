import { useState } from "react";

interface SuccessScreenProps {
  responseId: string;
}

export default function SuccessScreen({ responseId }: SuccessScreenProps) {
  // Fix #7: copy-to-clipboard with visual feedback
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(responseId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const el = document.createElement("textarea");
      el.value = responseId;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="section-done">
      <div className="success-icon">✓</div>
      <h2>Thank You!</h2>
      <p>
        Your responses have been saved to the cloud. Your participation is
        valuable in improving university services.
      </p>
      <div className="response-id-badge">
        RESPONSE ID: <span className="response-id">{responseId}</span>
      </div>
      <br />
      <button
        className={`copy-btn${copied ? " copied" : ""}`}
        onClick={handleCopy}
        aria-label="Copy response ID to clipboard"
      >
        {copied ? "✓ Copied!" : "Copy ID"}
      </button>
      <p className="success-note">
        Save your Response ID for your records.
      </p>
      <p className="success-footer">
        &mdash; End of Survey &mdash; Q-Less Capstone Project, CTT R6 &middot;
        Team Eureka
      </p>
    </div>
  );
}
