import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CareerAnalysisPage } from './pages/CareerAnalysisPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { CareerAnalysisProvider } from './contexts/CareerAnalysisContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardOverview } from './components/Dashboard/DashboardOverview';
import { LearningPathsPage } from './components/Dashboard/LearningPaths/LearningPathsPage';
import { ResumeBuilderPage } from './components/Dashboard/ResumeBuilder/ResumeBuilderPage';
import { GoalsPage } from './components/Dashboard/Goals/GoalsPage';
import { CareerAnalysisDashboard } from './components/Dashboard/CareerAnalysis/CareerAnalysisDashboard';
import { AdminDashboard } from './components/Dashboard/Admin/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { ProfileSettings } from './components/Dashboard/Settings/ProfileSettings';
import { PrivacySettings } from './components/Dashboard/Settings/PrivacySettings';
import { AppearanceSettings } from './components/Dashboard/Settings/AppearanceSettings';
import { AIChatPage } from './components/Dashboard/AIChat/AIChatPage';
import { AboutPage } from './pages/AboutPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { CookiePolicy } from './pages/CookiePolicy';
import { GDPRPolicy } from './pages/GDPRPolicy';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { ContactPage } from './pages/ContactPage';
import './styles/theme.css';

const App: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <CareerAnalysisProvider>
              <div className="min-h-screen bg-white">
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/career-analysis" element={<CareerAnalysisPage />} />
                    <Route path="/signin" element={<AuthPage />} />
                    <Route path="/signup" element={<AuthPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                    <Route path="/gdpr" element={<GDPRPolicy />} />
                    <Route path="/accessibility" element={<AccessibilityPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/dashboard" element={<DashboardPage />}>
                      <Route index element={<Navigate to="overview" replace />} />
                      <Route path="overview" element={<DashboardOverview />} />
                      <Route path="career-analysis" element={<CareerAnalysisDashboard />} />
                      <Route path="learning" element={<LearningPathsPage />} />
                      <Route path="resume-builder" element={<ResumeBuilderPage />} />
                      <Route path="goals" element={<GoalsPage />} />
                      <Route path="admin" element={<AdminDashboard />} />
                      <Route path="profile" element={<ProfileSettings />} />
                      <Route path="privacy" element={<PrivacySettings />} />
                      <Route path="appearance" element={<AppearanceSettings />} />
                      <Route path="ai-chat" element={<AIChatPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                {!isDashboard && !isAuthPage && <Footer />}
              </div>
            </CareerAnalysisProvider>
          </AdminProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;