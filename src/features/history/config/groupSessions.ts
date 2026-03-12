import { recentSessions } from "./historyData";

type Session = (typeof recentSessions)[number];

export function groupSessionsByDay(sessions: Session[]) {
  const grouped = sessions.reduce<Record<string, Session[]>>((acc, session) => {
    const key = session.dateLabel ?? session.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(session);
    return acc;
  }, {});

  return Object.entries(grouped).map(([title, data]) => ({ title, data }));
}
