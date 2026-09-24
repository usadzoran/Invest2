import React, { createContext, useContext, useEffect, useState } from 'react';

export type RoutePath = '/' | '/investments' | '/how-it-works' | '/about' | '/login' | '/register';

interface RouterContextType {
  currentPath: RoutePath;
  navigate: (path: RoutePath | string) => void;
  basePrefix: string;
}

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
  basePrefix: '',
});

export const useRouter = () => useContext(RouterContext);

// Helper to determine the repository base prefix (e.g. '/Invest' on GitHub Pages)
const getBasePrefix = (): string => {
  const pathname = window.location.pathname;
  if (pathname.startsWith('/Invest')) {
    return '/Invest';
  }
  return '';
};

// Normalize path from current browser URL
const extractAppRoute = (): RoutePath => {
  const base = getBasePrefix();
  let pathname = window.location.pathname;

  // If base exists, strip it out
  if (base && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length);
  }

  // Handle SPA query redirection (e.g. ?/investments or ?investments)
  const search = window.location.search;
  if (search.startsWith('?/')) {
    pathname = search.slice(1);
  } else if (search.startsWith('?') && search.length > 1 && !search.includes('=')) {
    pathname = '/' + search.slice(1);
  }

  // Handle Hash fallback (e.g. #/investments or #investments)
  const hash = window.location.hash;
  if (hash.startsWith('#/')) {
    pathname = hash.slice(1);
  } else if (hash.startsWith('#') && hash.length > 1) {
    pathname = '/' + hash.slice(1);
  }

  // Ensure trailing slash removed unless root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  if (pathname === '' || pathname === '/') return '/';
  if (pathname === '/investments') return '/investments';
  if (pathname === '/how-it-works') return '/how-it-works';
  if (pathname === '/about') return '/about';
  if (pathname === '/login') return '/login';
  if (pathname === '/register') return '/register';

  return '/';
};

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<RoutePath>(extractAppRoute);
  const basePrefix = getBasePrefix();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(extractAppRoute());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: RoutePath | string) => {
    let cleanPath = path;
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }

    const targetUrl = (basePrefix + cleanPath) || '/';
    
    // Update browser URL
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setCurrentPath(cleanPath as RoutePath);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate, basePrefix }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link: React.FC<{
  to: RoutePath | string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, className, children, onClick }) => {
  const { navigate, basePrefix } = useRouter();

  let cleanTarget = to;
  if (!cleanTarget.startsWith('/')) {
    cleanTarget = '/' + cleanTarget;
  }
  const href = (basePrefix + cleanTarget) || '/';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
