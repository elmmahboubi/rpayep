import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Get initial data from server
const initialData = (window as any).__INITIAL_DATA__ || {};

// Client-side visitor notification (moved from App.tsx)
function notifyVisitorOnClient() {
  // Only run on client side and check if we're in a browser environment
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    try {
      // Only notify about visitor once per session
      const hasNotified = sessionStorage.getItem('visitorNotified');
      if (!hasNotified) {
        // Dynamic import to avoid SSR issues
        import('./utils/visitor').then(({ notifyVisitor }) => {
          notifyVisitor();
          sessionStorage.setItem('visitorNotified', 'true');
        }).catch(error => {
          console.warn('Failed to load visitor notification:', error);
        });
      }
    } catch (error) {
      // Silently handle any storage errors
      console.warn('Session storage not available:', error);
    }
  }
}

// Hydration state management
function setHydrationComplete() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('hydration-loading');
    document.documentElement.classList.add('hydration-complete');
  }
}

function setHydrationError() {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('hydration-loading');
    document.documentElement.classList.add('hydration-error');
  }
}

// Create the router with future flags
const router = createBrowserRouter(
  [
    {
      path: "*",
      Component: () => <App initialData={initialData} />,
    },
  ],
  {
    // Opt-in to future flags to remove warnings
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

async function initializeApp() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    setHydrationError();
    return;
  }

  try {
    // Use RouterProvider for hydration
    hydrateRoot(
      rootElement,
      <React.StrictMode>
        <ErrorBoundary>
          <RouterProvider router={router} fallbackElement={null} />
        </ErrorBoundary>
      </React.StrictMode>
    );

    setHydrationComplete();
    notifyVisitorOnClient();
    console.log('✅ SSR Hydration successful');
    
  } catch (error) {
    console.error('❌ Hydration failed:', error);
    
    // FOUC Prevention: Still show content even if hydration fails
    setHydrationError();
    
    // Fallback: Try to render normally if hydration fails
    try {
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(rootElement);
      
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <RouterProvider router={router} fallbackElement={null} />
          </ErrorBoundary>
        </React.StrictMode>
      );
      
      notifyVisitorOnClient();
      console.log('⚠️ Fallback render successful');
      
    } catch (fallbackError) {
      console.error('❌ Fallback render also failed:', fallbackError);
      
      // Last resort: Show error message
      rootElement.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb;">
          <div style="text-align: center; padding: 2rem;">
            <h1 style="font-size: 1.5rem; font-weight: bold; color: #374151; margin-bottom: 1rem;">
              Something went wrong
            </h1>
            <p style="color: #6b7280; margin-bottom: 2rem;">
              Please refresh the page to try again.
            </p>
            <button 
              onclick="window.location.reload()" 
              style="background-color: #0046be; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer; font-weight: 500;"
            >
              Refresh Page
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}