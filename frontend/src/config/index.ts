// Define the environment configuration interface
interface EnvConfig {
  VITE_APP_NAME: string;
  VITE_API_BASE_URL: string;
  VITE_DOMAIN: string;
  VITE_SOCKET_BASE_URL: string;
}

// Declare the window._env_ property for runtime configuration
declare global {
  interface Window {
    _env_: EnvConfig;
  }
}

// Get configuration either from Vite env or window._env_
const getConfig = (): EnvConfig => {
  if (import.meta.env.DEV) {
    return {
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      VITE_DOMAIN: import.meta.env.VITE_DOMAIN,
      VITE_SOCKET_BASE_URL: import.meta.env.VITE_SOCKET_BASE_URL
    };
  }
  return window._env_;
};

// Export the configuration object
export const CONFIG = {
  APP_NAME: getConfig().VITE_APP_NAME,
  API_URL: getConfig().VITE_API_BASE_URL,
  DOMAIN: getConfig().VITE_DOMAIN,
  SOCKET_URL: getConfig().VITE_SOCKET_BASE_URL
};
