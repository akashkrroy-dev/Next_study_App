import { useState } from "react";
import "./ComingSoon.css";

const CONTENT = {
  habits: {
    label: "Habit Tracker",
    headline: "Build streaks that actually stick",
    body: "Daily habits, weekly consistency, and a streak system tied straight into your dashboard. Coming to NexStudy soon.",
    points: ["Daily check-ins", "Streak history", "Reminders synced to your timetable"],
  },
  events: {
    label: "Events",
    headline: "Never miss what's on your calendar",
    body: "Exams, deadlines, and personal events in one timeline, layered right alongside your existing timetable.",
    points: ["Timetable-aware scheduling", "Deadline countdowns", "Shared subject events"],
  },
};

export default function ComingSoon({ feature = "habits" }) {
  const data = CONTENT[feature];
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleNotify(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="coming-soon">
      <div className="coming-soon-card">
        <span className="coming-soon-tag">{data.label} · In progress</span>

        <h1 className="coming-soon-headline">{data.headline}</h1>
        <p className="coming-soon-body">{data.body}</p>

        <ul className="coming-soon-points">
          {data.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        {submitted ? (
          <p className="coming-soon-confirm">We'll email you when it's ready.</p>
        ) : (
          <form className="coming-soon-form" onSubmit={handleNotify}>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Notify me</button>
          </form>
        )}
      </div>
    </div>
  );
}