import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function waitForEnvAndRender() {

  if (import.meta.env.DEV) {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    return;
  }

  if (window._env_ && Object.keys(window._env_).length > 0) {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    // Wait a bit and try again
    setTimeout(waitForEnvAndRender, 50);
  }
}

// Kickstart the rendering
waitForEnvAndRender();