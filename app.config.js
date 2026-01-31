export default ({ config }) => ({
  ...config,
  extra: {
    API_BASE_URL: process.env.API_BASE_URL,
    WS_BASE_URL: process.env.WS_BASE_URL,
  },
});
