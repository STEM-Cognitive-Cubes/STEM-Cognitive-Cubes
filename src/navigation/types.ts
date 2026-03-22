export interface WeekSummaryData {
  id: string;
  title: string;
  dateLabel: string;
  durationMinutes: string;
  blocks: number;
  focusLevel: string;
  score: string;
  aiInsight: string;
  focusData: Array<{ day: string; value: number }>;
  blocksUsed: Array<{ id: string; name: string; count: number; color: string }>;
}

export type RootStackParamList = {
  // Auth
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  Home: undefined;
  Profile: undefined;
  // Settings feature
  Settings: undefined;
  Account: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  Bot: undefined;

  AppearanceScreen: undefined;
  PrivacyControlsScreen: undefined;
  StartSession: undefined;
  LiveSession: undefined;
  NotificationPreferencesScreen: undefined;
  PrivacyControlsScreen: undefined;
  DataSharingScreen: undefined;
  HelpSupportScreen: undefined;
  CommunityScreen: undefined;
  EmailScreen: undefined;
  ChatScreen: undefined;
  UserGuideScreen: undefined;
  ProductIntro: undefined;
  AppFeatures: undefined;
  OperateScreen: undefined;
  Logout: undefined;
  FAQsScreen: undefined;
  ContactSupportScreen: undefined;
  // History feature
  History: undefined;
  SessionHistory: undefined;
  SessionDetail: { sessionId: string };
  // Summary feature
  WeeklySummary: undefined;
  SummaryDetail: { weekData: WeekSummaryData };
  // Insights feature
  Insights: undefined;
  Recommendations: { category: string };
  // Profile feature
  AddChild: undefined;
};
  
