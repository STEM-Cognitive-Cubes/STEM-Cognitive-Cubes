export type SessionStat = {
  id: string;
  label: string;
  value: string;
  icon: string; // Feather icon name
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
  dateLabel?: string; // "Today", "Yesterday", or date string
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
export const sessionDetail: SessionDetail = {
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
};
