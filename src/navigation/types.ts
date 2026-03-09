export type RootStackParamList = {
  AppearanceScreen: undefined;
  NotificationPreferencesScreen: undefined;
  PrivacyControlsScreen: undefined;
  DataSharingScreen: undefined;
  HelpSupportScreen: undefined;
  CommunityScreen: undefined;
  EmailScreen: undefined;
  ChatScreen: undefined;
  AppFeatures: undefined;
  OperateScreen: undefined;
  ProductIntro: undefined;
  UserGuide: undefined;
  Logout: undefined;
  FAQsScreen: undefined;
  ContactSupportScreen: undefined;
  // History feature
  History: undefined;
  SessionHistory: undefined;
  SessionDetail: { sessionId: string };
  // Summary feature
  WeeklySummary: undefined;
  SummaryDetail: { sessionId: string };
  // Insights feature
  Insights: undefined;
  Recommendations: { category: string };
};
