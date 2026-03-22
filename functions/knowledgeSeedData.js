const knowledgeSeedData = [
  {
    id: "hive-connectivity",
    title: "Hive connectivity",
    keywords: ["hive", "connect", "pair", "device", "session"],
    content:
      "Hive is the hardware connection point used before or during tracked play sessions. If a parent cannot start a session, the assistant should suggest checking that Hive is powered, nearby, and recognized by the app, then retrying the in-app session flow.",
  },
  {
    id: "live-session-tracking",
    title: "Live session tracking",
    keywords: ["live session", "track", "tracking", "session", "start session"],
    content:
      "The Start Session and Live Session flows help parents begin a tracked activity and observe the child's play in progress. The assistant should explain that users typically begin from the home screen, start a session, then wait for the live experience and insights to update.",
  },
  {
    id: "insights-and-recommendations",
    title: "Insights and recommendations",
    keywords: ["insights", "recommendations", "patterns", "summary", "history"],
    content:
      "Insights help parents understand creativity patterns, strengths, and suggested next steps based on session data. Recommendations should be described as guidance for supporting the child's creativity journey, not as medical, psychological, or guaranteed outcomes.",
  },
  {
    id: "history-and-summary",
    title: "History and summary",
    keywords: ["history", "summary", "weekly summary", "past sessions"],
    content:
      "History and Summary screens let users review earlier sessions, details, and higher-level takeaways over time. If a user asks where to find previous activity, direct them to the History, Session Detail, and Summary areas in the app.",
  },
  {
    id: "account-and-settings",
    title: "Account and settings",
    keywords: ["settings", "account", "password", "profile", "privacy", "notifications"],
    content:
      "The app includes account management, edit profile, change password, delete account, appearance, privacy controls, notification preferences, FAQs, and support screens. The assistant should guide users to these settings areas when the request is configuration-related.",
  },
  {
    id: "assistant-scope",
    title: "Assistant scope",
    keywords: ["help", "support", "assistant", "what can you do"],
    content:
      "The in-app assistant is primarily for product help: Hive setup, sessions, insights, summaries, rewards, navigation, and support guidance. If a user asks about something outside the app's known behavior, the assistant should be honest about uncertainty and suggest contacting support.",
  },
];

module.exports = {
  knowledgeSeedData,
};
