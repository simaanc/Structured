// utils/cookieStorage.ts
import { Params } from "../types/types";

// Cookie name constants
const PARAMS_COOKIE_NAME = "structured_params";
const COOKIE_EXPIRY_DAYS = 90; // Cookie will persist for 90 days

/**
 * Check if code is running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Save params to browser cookies
 */
export function saveParamsToCookies(params: Params): void {
  if (!isBrowser()) return; // Skip if not in browser
  
  try {
    // Stringify the params object to JSON
    const serializedParams = JSON.stringify(params);
    
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    // Set the cookie with the serialized params
    document.cookie = `${PARAMS_COOKIE_NAME}=${encodeURIComponent(
      serializedParams
    )};expires=${expiryDate.toUTCString()};path=/;SameSite=Strict`;
    
    console.log("Params saved to cookies");
  } catch (error) {
    console.error("Failed to save params to cookies:", error);
  }
}

/**
 * Load params from browser cookies
 * @returns The stored params or null if not found
 */
export function loadParamsFromCookies(): Params | null {
  if (!isBrowser()) return null; // Skip if not in browser
  
  try {
    // Get all cookies and parse them into an object
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split("=");
      return { ...acc, [name]: value };
    }, {} as Record<string, string>);
    
    // Get our specific cookie
    const serializedParams = cookies[PARAMS_COOKIE_NAME];
    
    if (!serializedParams) {
      return null;
    }
    
    // Parse the JSON string back into an object
    const params = JSON.parse(decodeURIComponent(serializedParams)) as Params;
    
    // Validate the loaded params to ensure they match our expected structure
    if (!validateParams(params)) {
      console.warn("Loaded params are invalid, using defaults instead");
      return null;
    }
    
    console.log("Params loaded from cookies");
    return params;
  } catch (error) {
    console.error("Failed to load params from cookies:", error);
    return null;
  }
}

/**
 * Clear the params cookie
 */
export function clearParamsCookie(): void {
  if (!isBrowser()) return; // Skip if not in browser
  
  // Set cookie with past expiry date to delete it
  document.cookie = `${PARAMS_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  console.log("Params cookie cleared");
}

/**
 * Basic validation to ensure loaded params object has required properties
 */
function validateParams(params: any): params is Params {
  return (
    params &&
    typeof params === "object" &&
    typeof params.gens === "number" &&
    typeof params.startLength === "number" &&
    typeof params.thetaDeg === "number" &&
    typeof params.toggleFlags === "object"
  );
}