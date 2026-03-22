/**
 * Temporary mock auth hook.
 * TODO: Replace with actual global state profile/auth context.
 */
export function useAuth() {
  return {
    childId: 'child123',
    token: 'mock-token-123'
  };
}
