import axios, { AxiosError } from 'axios';
import { redirect } from 'next/navigation';

const AUTH_CHECK_ENDPOINT = '/api/auth/authcheck';
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 1 second

interface AuthResponse {
  username: string;
}

/**
 * Checks if the user is authenticated by making an API call
 * @returns The username if authenticated, null otherwise
 * @throws {Error} If there's an unexpected error during authentication
 */
export default async function checkAuth(): Promise<string | null> {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<AuthResponse>(AUTH_CHECK_ENDPOINT);
      if (response.status === 200 && response.data) {
        const username = decodeURIComponent(String(response.data.username || ''));
        
        if (!username) {
          console.error('Invalid username in response:', response.data);
          handleAuthFailure();
          return null;
        }
        return response.data.username;
      }
      
      // If we get here, something's wrong with the response
      console.error('Invalid auth response:', response);
      handleAuthFailure();
      return null;

    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          // Unauthorized - redirect to sign in
          handleAuthFailure();
          return null;
        }
        
        if (retries < MAX_RETRIES - 1 && isRetryableError(error)) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          retries++;
          continue;
        }
      }

      // Log unexpected errors
      console.error('Auth check failed:', error);
      handleAuthFailure();
      return null;
    }
  }

  handleAuthFailure();
  return null;
}

/**
 * Determines if an HTTP error should be retried based on its type and status code
 *
 * Retry scenarios:
 * - Network errors (no response)
 * - Server errors (5xx status codes)
 * - Rate limiting (429 Too Many Requests)
 * - Timeout errors
 *
 * @param error - The Axios error to evaluate
 * @returns boolean - True if the error is retryable, false otherwise
 * @throws Error if the error parameter is null or undefined
 */
function isRetryableError(error: AxiosError): boolean {
  // Validate input
  if (!error) {
    throw new Error('Error parameter is required');
  }

  // HTTP status code constants
  const HTTP_STATUS = {
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  };

  // Check for timeout errors
  if (error.code === 'ECONNABORTED') {
    return true;
  }

  // No response indicates a network error
  if (!error.response) {
    return true;
  }

  const { status } = error.response;

  return (
    status >= HTTP_STATUS.INTERNAL_SERVER_ERROR || // Server errors (5xx)
    status === HTTP_STATUS.TOO_MANY_REQUESTS      // Rate limiting
  );
}

/**
 * Handles authentication failure by redirecting to sign-in
 */
function handleAuthFailure(): void {
  redirect('/sign-in');
}
