import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import HubView from "./views/HubView";
import DashboardView from "./views/DashboardView";
import IntroSequence from "./components/IntroSequence";
import ParticleBackground from "./components/ParticleBackground";
import HeistQuizDashboard from "./components/HeistQuizDashboard";
import TicketView from "./views/TicketView";
import EventDetailsView from "./views/EventDetailsView";
import AboutUsView from "./views/AboutUsView";
import AlumniView from "./views/AlumniView";
import ComingSoonView from "./views/ComingSoonView";
import SignUpForm from "./components/SignUpForm";

import { MockStateProvider } from "./context/MockStateContext";
import UserDashboardView from "./views/UserDashboardView";

export type ViewType = "hub" | "dashboard" | "quiz" | "ticket" | "eventDetails" | "about" | "alumni" | "sponsors" | "lastYear" | "userDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("hub");
  const [currentTicketEventId, setCurrentTicketEventId] = useState<
    number | null
  >(null);
  const [currentDetailsEventId, setCurrentDetailsEventId] = useState<
    number | null
  >(null);
  const [introFinished, setIntroFinished] = useState(() => {
    return sessionStorage.getItem("introFinished") === "true";
  });
  const [showGlobalLogin, setShowGlobalLogin] = useState(false);

  useEffect(() => {
    const handleLoginRequest = () => setShowGlobalLogin(true);
    window.addEventListener("request-login", handleLoginRequest as EventListener);
    return () => window.removeEventListener("request-login", handleLoginRequest as EventListener);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("introFinished", "true");
    setIntroFinished(true);
  };

  const navigateTo = (view: ViewType, eventId?: number) => {
    if (view === "eventDetails" && eventId) {
      setCurrentDetailsEventId(eventId);
    }
    setCurrentView(view);
  };

  const handleRegisterSuccess = (eventId: number) => {
    setCurrentTicketEventId(eventId);
    setCurrentView("ticket");
  };

  if (!introFinished) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <MockStateProvider>
      <div className="min-h-screen relative font-body text-gray-200">
      <div className="fixed inset-0 scan-lines z-50 mix-blend-overlay pointer-events-none"></div>
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {currentView === "hub" && (
          <motion.div
            key="hub"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <HubView
              onViewChange={navigateTo}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </motion.div>
        )}
        {currentView === "userDashboard" && (
          <motion.div
            key="userDashboard"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <UserDashboardView onViewChange={navigateTo} />
          </motion.div>
        )}
        {currentView === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <DashboardView onViewChange={navigateTo} />
          </motion.div>
        )}
        {currentView === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <HeistQuizDashboard onViewChange={navigateTo} />
          </motion.div>
        )}
        {currentView === "ticket" && currentTicketEventId && (
          <motion.div
            key="ticket"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <TicketView
              eventId={currentTicketEventId}
              onViewChange={navigateTo}
            />
          </motion.div>
        )}
        {currentView === "eventDetails" && currentDetailsEventId && (
          <motion.div
            key="eventDetails"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <EventDetailsView 
              eventId={currentDetailsEventId} 
              onViewChange={navigateTo} 
              onRegisterSuccess={handleRegisterSuccess} 
            />
          </motion.div>
        )}
        {currentView === "about" && (
          <motion.div
            key="about"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AboutUsView onViewChange={navigateTo} />
          </motion.div>
        )}
        {currentView === "alumni" && (
          <motion.div
            key="alumni"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AlumniView onViewChange={navigateTo} />
          </motion.div>
        )}
        {currentView === "sponsors" && (
          <motion.div
            key="sponsors"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ComingSoonView title="Sponsors" onViewChange={navigateTo} />
          </motion.div>
        )}
        {currentView === "lastYear" && (
          <motion.div
            key="lastYear"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <ComingSoonView title="Last Year Event" onViewChange={navigateTo} />
          </motion.div>
        )}
      </AnimatePresence>

      {showGlobalLogin && (
        <div className="fixed inset-0 z-[9999] px-4 py-10 bg-black/80 backdrop-blur-sm overflow-y-auto flex justify-center items-start">
          <div
            className="fixed inset-0 min-h-screen"
            onClick={() => setShowGlobalLogin(false)}
          ></div>
          <div className="relative z-50 w-full max-w-md my-auto">
            <SignUpForm onComplete={() => {
              setShowGlobalLogin(false);
              navigateTo("userDashboard");
            }} />
          </div>
        </div>
      )}
    </div>
    </MockStateProvider>
  );
}
