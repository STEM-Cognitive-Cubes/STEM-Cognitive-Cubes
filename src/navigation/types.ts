export type RootStackParamList = {
  // Existing screens from your team
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  // Settings feature
  Account: undefined;
  Settings: undefined;
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
