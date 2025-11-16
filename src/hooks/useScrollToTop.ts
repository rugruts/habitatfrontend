import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls to top of the page whenever the route changes
 * Takes into account the fixed header height to avoid content being hidden
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when path changes
    // The mobile-main-content class on <main> handles the header offset automatically
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
};
