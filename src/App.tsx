import React from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/investments':
        return <InvestmentsPage />;
      case '/how-it-works':
        return <HowItWorksPage />;
      case '/about':
        return <AboutPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <Header />
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
