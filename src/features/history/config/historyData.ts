export type SessionStat = {
  id: string;
  label: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
};
export type SessionListItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  dotColor: string;
  dateLabel?: string;
};
export type BlockUsed = {
  id: string;
  name: string;
  count: number;
  color: string;
};
export type SessionDetail = {
  id: string;
  date: string;
  time: string;
  duration: string;
  blocks: number;
  focusLevel: string;
  score: number;
  aiInsight: string;
  focusData: { day: string; value: number }[];
  blocksUsed: BlockUsed[];
};
export const sessionStats: SessionStat[] = [
  {
    id: "1",
    label: "Total Sessions",
    value: "24",
    icon: "layers",
    color: "#B860FF",
    bgColor: "rgba(184, 96, 255, 0.15)",
  },
  {
    id: "2",
    label: "Avg Duration",
    value: "35m",
    icon: "clock",
    color: "#FF9F43",
    bgColor: "rgba(255, 159, 67, 0.15)",
  },
  {
    id: "3",
    label: "This Week",
    value: "5",
    icon: "calendar",
    color: "#1DBE5F",
    bgColor: "rgba(29, 190, 95, 0.15)",
  },
  {
    id: "4",
    label: "Achievements",
    value: "8",
    icon: "award",
    color: "#FFD54F",
    bgColor: "rgba(255, 213, 79, 0.15)",
  },
];
export const recentSessions: SessionListItem[] = [
  {
    id: "1",
    title: "Building Session",
    date: "June 15, 2025",
    time: "10:30 AM",
    duration: "45m",
    dotColor: "#B860FF",
    dateLabel: "Today",
  },
  {
    id: "2",
    title: "Creative Play",
    date: "June 15, 2025",
    time: "2:15 PM",
    duration: "30m",
    dotColor: "#FF9F43",
    dateLabel: "Today",
  },
  {
    id: "3",
    title: "Problem Solving",
    date: "June 14, 2025",
    time: "11:00 AM",
    duration: "50m",
    dotColor: "#1DBE5F",
    dateLabel: "Yesterday",
  },
  {
    id: "4",
    title: "Free Build",
    date: "June 14, 2025",
    time: "3:45 PM",
    duration: "25m",
    dotColor: "#FFD54F",
    dateLabel: "Yesterday",
  },
  {
    id: "5",
    title: "Guided Session",
    date: "June 13, 2025",
    time: "9:00 AM",
    duration: "40m",
    dotColor: "#B860FF",
    dateLabel: "June 13",
  },
  {
    id: "6",
    title: "Pattern Building",
    date: "June 12, 2025",
    time: "1:30 PM",
    duration: "35m",
    dotColor: "#FF9F43",
    dateLabel: "June 12",
  },
];
// Map of session details keyed by session ID
export const sessionDetailsMap: Record<string, SessionDetail> = {
  "1": {
    id: "1",
    date: "June 15, 2025",
    time: "10:30 AM",
    duration: "45m",
    blocks: 12,
    focusLevel: "High",
    score: 8.5,
    aiInsight:
      "Great focus during this session! The child showed improved spatial reasoning and creative problem-solving skills. Consider introducing more complex building challenges to further develop these abilities.",
    focusData: [
      { day: "Mon", value: 65 },
      { day: "Tue", value: 80 },
      { day: "Wed", value: 55 },
      { day: "Thu", value: 90 },
      { day: "Fri", value: 75 },
      { day: "Sat", value: 85 },
      { day: "Sun", value: 70 },
    ],
    blocksUsed: [
      { id: "1", name: "Square", count: 4, color: "#B860FF" },
      { id: "2", name: "Rectangle", count: 3, color: "#FF9F43" },
      { id: "3", name: "Triangle", count: 2, color: "#1DBE5F" },
      { id: "4", name: "Circle", count: 3, color: "#FFD54F" },
    ],
  },
  "2": {
    id: "2",
    date: "June 15, 2025",
    time: "2:15 PM",
    duration: "30m",
    blocks: 8,
    focusLevel: "Medium",
    score: 7.2,
    aiInsight:
      "Creative expression was the highlight of this session. The child experimented with color combinations and asymmetric designs, showing growing artistic confidence.",
    focusData: [
      { day: "Mon", value: 50 },
      { day: "Tue", value: 60 },
      { day: "Wed", value: 70 },
      { day: "Thu", value: 55 },
      { day: "Fri", value: 80 },
      { day: "Sat", value: 65 },
      { day: "Sun", value: 75 },
    ],
    blocksUsed: [
      { id: "1", name: "Square", count: 3, color: "#B860FF" },
      { id: "2", name: "Circle", count: 2, color: "#FFD54F" },
      { id: "3", name: "Triangle", count: 3, color: "#1DBE5F" },
    ],
  },
  "3": {
    id: "3",
    date: "June 14, 2025",
    time: "11:00 AM",
    duration: "50m",
    blocks: 15,
    focusLevel: "Very High",
    score: 9.1,
    aiInsight:
      "Exceptional problem-solving session! The child tackled complex structural challenges and demonstrated persistence when designs didn't work on the first attempt. This resilience is a strong developmental indicator.",
    focusData: [
      { day: "Mon", value: 70 },
      { day: "Tue", value: 85 },
      { day: "Wed", value: 90 },
      { day: "Thu", value: 95 },
      { day: "Fri", value: 80 },
      { day: "Sat", value: 88 },
      { day: "Sun", value: 82 },
    ],
    blocksUsed: [
      { id: "1", name: "Square", count: 5, color: "#B860FF" },
      { id: "2", name: "Rectangle", count: 4, color: "#FF9F43" },
      { id: "3", name: "Triangle", count: 3, color: "#1DBE5F" },
      { id: "4", name: "Circle", count: 3, color: "#FFD54F" },
    ],
  },
  "4": {
    id: "4",
    date: "June 14, 2025",
    time: "3:45 PM",
    duration: "25m",
    blocks: 6,
    focusLevel: "Medium",
    score: 6.8,
    aiInsight:
      "A relaxed free-build session where the child explored freely without constraints. Good for creative expression, though focus was moderate. Short sessions like this still contribute to skill development.",
    focusData: [
      { day: "Mon", value: 45 },
      { day: "Tue", value: 55 },
      { day: "Wed", value: 60 },
      { day: "Thu", value: 50 },
      { day: "Fri", value: 65 },
      { day: "Sat", value: 55 },
      { day: "Sun", value: 60 },
    ],
    blocksUsed: [
      { id: "1", name: "Square", count: 2, color: "#B860FF" },
      { id: "2", name: "Rectangle", count: 2, color: "#FF9F43" },
      { id: "3", name: "Circle", count: 2, color: "#FFD54F" },
    ],
  },
  "5": {
    id: "5",
    date: "June 13, 2025",
    time: "9:00 AM",
    duration: "40m",
    blocks: 10,
    focusLevel: "High",
    score: 8.0,
    aiInsight:
      "The guided session helped the child follow step-by-step instructions effectively. Strong improvements in sequential thinking and attention to detail were observed.",
    focusData: [
      { day: "Mon", value: 60 },
      { day: "Tue", value: 75 },
      { day: "Wed", value: 80 },
      { day: "Thu", value: 70 },
      { day: "Fri", value: 85 },
      { day: "Sat", value: 78 },
      { day: "Sun", value: 72 },
    ],
    blocksUsed: [
      { id: "1", name: "Square", count: 4, color: "#B860FF" },
      { id: "2", name: "Rectangle", count: 3, color: "#FF9F43" },
      { id: "3", name: "Triangle", count: 3, color: "#1DBE5F" },
    ],
  },
  "6": {
    id: "6",
    date: "June 12, 2025",
    time: "1:30 PM",
    duration: "35m",
    blocks: 9,
    focusLevel: "High",
    score: 7.8,
    aiInsight:
      "Pattern recognition skills were on display during this session. The child successfully identified and replicated repeating patterns, an important cognitive milestone.",
    focusData: [
      { day: "Mon", value: 55 },
      { day: "Tue", value: 70 },
      { day: "Wed", value: 75 },
      { day: "Thu", value: 80 },
      { day: "Fri", value: 72 },
      { day: "Sat", value: 68 },
      { day: "Sun", value: 76 },
    ],
    blocksUsed: [
      { id: "1", name: "Square", count: 3, color: "#B860FF" },
      { id: "2", name: "Rectangle", count: 2, color: "#FF9F43" },
      { id: "3", name: "Triangle", count: 2, color: "#1DBE5F" },
      { id: "4", name: "Circle", count: 2, color: "#FFD54F" },
    ],
  },
};
// Keep backward compat — default detail for session "1"
export const sessionDetail: SessionDetail = sessionDetailsMap["1"];
