import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";

// Views
import HubView from "./views/HubView";
import IntroSequence from "./components/IntroSequence";
import ParticleBackground from "./components/ParticleBackground";
import HeistQuizDashboard from "./components/HeistQuizDashboard";
import TicketView from "./views/TicketView";
import EventDetailsView from "./views/EventDetailsView";
import AboutUsView from "./views/AboutUsView";
import AlumniView from "./views/AlumniView";
import ComingSoonView from "./views/ComingSoonView";
import UserDashboardView from "./views/UserDashboardView";
import LoginPage from "./views/LoginPage";
import RegistrationForm from "./views/RegistrationForm";
import PaymentScreen from "./views/PaymentScreen";
import RegistrationSuccess from "./views/RegistrationSuccess";
import AdminLogin from "./views/AdminLogin";
import AdminDashboard from "./views/AdminDashboard";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MockStateProvider } from "./context/MockStateContext";

// Vercel analytics stubs
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export type ViewType =
  | "hub"
  | "dashboard"
  | "quiz"
  | "ticket"
  | "eventDetails"
  | "about"
  | "alumni"
  | "sponsors"
  | "lastYear"
  | "userDashboard"
  | "login"
  | "register"
  | "payment"
  | "registrationSuccess"
  | "adminLogin"
  | "adminDashboard";

function AppContent() {
  const {
    firebaseUser,
    userData,
    isLoading,
    needsRegistration,
    isAdminSession,
  } = useAuth();

  const [currentView, setCurrentView] = useState<ViewType>("hub");
  const [currentTicketEventId, setCurrentTicketEventId] = useState<number | null>(null);
  const [currentDetailsEventId, setCurrentDetailsEventId] = useState<number | null>(null);
  const [introFinished, setIntroFinished] = useState(() => {
    return sessionStorage.getItem("introFinished") === "true";
  });

  // Check URL hash for admin access
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") {
        if (isAdminSession) {
          setCurrentView("adminDashboard");
        } else {
          setCurrentView("adminLogin");
        }
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [isAdminSession]);

  // Handle global login request events
  useEffect(() => {
    const handleLoginRequest = () => {
      if (!firebaseUser) {
        setCurrentView("login");
      } else if (needsRegistration) {
        setCurrentView("register");
      }
    };
    window.addEventListener("request-login", handleLoginRequest as EventListener);
    return () => window.removeEventListener("request-login", handleLoginRequest as EventListener);
  }, [firebaseUser, needsRegistration]);

  // Auto-redirect on auth state changes
  useEffect(() => {
    if (!isLoading && firebaseUser && needsRegistration && currentView === "login") {
      setCurrentView("register");
    }
  }, [firebaseUser, needsRegistration, isLoading, currentView]);

  const handleIntroComplete = () => {
    sessionStorage.setItem("introFinished", "true");
    setIntroFinished(true);
  };

  const navigateTo = (view: ViewType | string, eventId?: number) => {
    if (view === "eventDetails" && eventId) {
      setCurrentDetailsEventId(eventId);
    }

    // Route protection: admin views
    if ((view === "adminDashboard" || view === "dashboard") && !isAdminSession) {
      setCurrentView("adminLogin");
      return;
    }

    setCurrentView(view as ViewType);
  };

  const handleRegisterSuccess = (eventId: number) => {
    setCurrentTicketEventId(eventId);
    setCurrentView("ticket");
  };

  const handleLoginSuccess = () => {
    // Auth context will detect the user; if they need registration, we'll redirect
    // Otherwise, go to hub
    if (needsRegistration) {
      setCurrentView("register");
    } else {
      setCurrentView("hub");
    }
  };

  // Show intro sequence
  if (!introFinished) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  // Show global loading while auth initializes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-brand-red mx-auto mb-4" />
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            Initializing secure connection...
          </p>
        </div>
      </div>
    );
  }

  // Page transition wrapper
  const PageTransition = ({ children, viewKey }: { children: React.ReactNode; viewKey: string }) => (
    <motion.div
      key={viewKey}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen relative font-body text-gray-200">
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {/* ─── Auth Views ───────────────────────────── */}
        {currentView === "login" && (
          <PageTransition viewKey="login">
            <LoginPage onViewChange={navigateTo} onLoginSuccess={handleLoginSuccess} />
          </PageTransition>
        )}
        {currentView === "register" && (
          <PageTransition viewKey="register">
            <RegistrationForm onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "payment" && (
          <PageTransition viewKey="payment">
            <PaymentScreen onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "registrationSuccess" && (
          <PageTransition viewKey="registrationSuccess">
            <RegistrationSuccess onViewChange={navigateTo} />
          </PageTransition>
        )}

        {/* ─── Admin Views ──────────────────────────── */}
        {currentView === "adminLogin" && (
          <PageTransition viewKey="adminLogin">
            <AdminLogin onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "adminDashboard" && (
          <PageTransition viewKey="adminDashboard">
            <AdminDashboard onViewChange={navigateTo} />
          </PageTransition>
        )}

        {/* ─── Main App Views ──────────────────────── */}
        {currentView === "hub" && (
          <PageTransition viewKey="hub">
            <HubView
              onViewChange={navigateTo}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </PageTransition>
        )}
        {currentView === "userDashboard" && (
          <PageTransition viewKey="userDashboard">
            <UserDashboardView onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "dashboard" && (
          <PageTransition viewKey="dashboard">
            <AdminDashboard onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "quiz" && (
          <PageTransition viewKey="quiz">
            <HeistQuizDashboard onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "ticket" && currentTicketEventId && (
          <PageTransition viewKey="ticket">
            <TicketView
              eventId={currentTicketEventId}
              onViewChange={navigateTo}
            />
          </PageTransition>
        )}
        {currentView === "eventDetails" && currentDetailsEventId && (
          <PageTransition viewKey="eventDetails">
            <EventDetailsView
              eventId={currentDetailsEventId}
              onViewChange={navigateTo}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </PageTransition>
        )}
        {currentView === "about" && (
          <PageTransition viewKey="about">
            <AboutUsView onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "alumni" && (
          <PageTransition viewKey="alumni">
            <AlumniView onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "sponsors" && (
          <PageTransition viewKey="sponsors">
            <ComingSoonView title="Sponsors" onViewChange={navigateTo} />
          </PageTransition>
        )}
        {currentView === "lastYear" && (
          <PageTransition viewKey="lastYear">
            <ComingSoonView title="Last Year Event" onViewChange={navigateTo} />
          </PageTransition>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MockStateProvider>
        <SpeedInsights />
        <Analytics />
        <AppContent />
      </MockStateProvider>
    </AuthProvider>
  );
}
