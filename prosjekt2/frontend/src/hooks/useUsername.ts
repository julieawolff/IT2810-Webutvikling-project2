/**
 * Username hook
 * Custom hook to get a user's username, which is stored in local storage
 */
export const useUsername = () => {
  const username = localStorage.getItem('username');

  return username;
};
