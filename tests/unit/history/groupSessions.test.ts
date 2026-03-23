import { groupSessionsByDay } from "@/features/history/config/groupSessions";
import type { SessionListItem } from "@/features/history/config/historyData";

describe("groupSessionsByDay", () => {
  const createSession = (
    id: string,
    date: string,
    dateLabel?: string
  ): SessionListItem => ({
    id,
    title: `Session ${id}`,
    date,
    time: "10:00 AM",
    duration: "15m",
    dotColor: "#B860FF",
    dateLabel,
  });

  it("groups sessions by dateLabel when available", () => {
    const sessions = [
      createSession("1", "June 15, 2025", "Today"),
      createSession("2", "June 15, 2025", "Today"),
      createSession("3", "June 14, 2025", "Yesterday"),
    ];

    const result = groupSessionsByDay(sessions);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Today");
    expect(result[0].data.map((session) => session.id)).toEqual(["1", "2"]);
    expect(result[1].title).toBe("Yesterday");
    expect(result[1].data.map((session) => session.id)).toEqual(["3"]);
  });

  it("falls back to date when dateLabel is missing", () => {
    const sessions = [
      createSession("1", "June 13, 2025"),
      createSession("2", "June 13, 2025"),
      createSession("3", "June 12, 2025"),
    ];

    const result = groupSessionsByDay(sessions);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("June 13, 2025");
    expect(result[0].data.map((session) => session.id)).toEqual(["1", "2"]);
    expect(result[1].title).toBe("June 12, 2025");
    expect(result[1].data.map((session) => session.id)).toEqual(["3"]);
  });
});
