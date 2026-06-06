import { useState, useEffect } from 'react';
import {
  auth,
  db,
  onAuthStateChanged,
  collection,
  query,
  where,
  getDocs,
  addDoc
} from '../lib/firebaseUtils';
import { ChevronLeft } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import { EVENTS } from '../components/EventCards';

interface EventDetailsViewProps {
  eventId: number;
  onViewChange: (view: 'hub' | 'dashboard' | 'quiz' | 'ticket' | 'eventDetails', id?: number) => void;
  onRegisterSuccess?: (eventId: number) => void;
}

export default function EventDetailsView({ eventId, onViewChange, onRegisterSuccess }: EventDetailsViewProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);

  const evt = EVENTS.find(e => e.id === eventId);

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && evt) {
        try {
          const regQuery = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid),
            where("eventName", "==", evt.title)
          );
          const regSnapshot = await getDocs(regQuery);
          if (!regSnapshot.empty) {
            setIsRegistered(true);
          }
        } catch (error) {
          console.error("Error fetching registrations:", error);
        }
      } else {
        setIsRegistered(false);
      }
    });
    return () => unsubscribe();
  }, [evt]);

  if (!evt) return null;
  const Icon = evt.icon;

  const handleRegister = async () => {
    if (navigator.vibrate) navigator.vibrate(30);

    if (!currentUser) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      window.dispatchEvent(new CustomEvent("request-login"));
      return;
    }

    setLoadingEvent(true);
    try {
      if (isRegistered) {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        if (onRegisterSuccess) onRegisterSuccess(eventId);
        setLoadingEvent(false);
        return;
      }
      await addDoc(collection(db, "registrations"), {
        userId: currentUser.uid,
        eventName: evt.title,
        timestamp: new Date(),
      });
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      setIsRegistered(true);
      if (onRegisterSuccess) onRegisterSuccess(eventId);
    } catch (error) {
      console.error("Error registering:", error);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      alert("Failed to register. Access denied.");
    }
    setLoadingEvent(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 md:px-12 text-white relative z-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <button 
          onClick={() => {
            if(navigator.vibrate) navigator.vibrate(30);
            onViewChange('hub');
          }}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-mono text-sm uppercase tracking-widest">Back</span>
        </button>

        <div className="bg-[#111] border border-brand-gold-bright/30 shadow-[0_0_50px_rgba(233,195,73,0.15)] rounded p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Icon size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-gold-bright/10 border border-brand-gold-bright/30 rounded text-brand-gold-bright">
                <Icon size={32} />
              </div>
              <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest text-white drop-shadow-md">
                {evt.title}
              </h1>
            </div>

            {evt.targetDate && (
              <div className="mb-8 mt-6 border border-brand-red/20 p-4 bg-brand-red/5 max-w-lg">
                 <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">Countdown to Operation</p>
                <CountdownTimer targetDate={evt.targetDate} variant="bomb" />
              </div>
            )}

            <div className="font-mono text-base md:text-lg leading-relaxed text-gray-300 border-l-2 border-brand-gold-bright pl-6 py-2 mb-12 max-w-2xl">
              {evt.desc}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-white/10 pt-8">
              <button
                onClick={handleRegister}
                disabled={isRegistered || loadingEvent}
                className={`w-full sm:w-auto px-12 py-4 border ${isRegistered ? "border-brand-red bg-brand-red text-white opacity-50 cursor-not-allowed" : "border-brand-gold-bright text-[#111] bg-brand-gold-bright hover:bg-yellow-500"} font-display text-xl uppercase tracking-widest transition-colors shadow-sm`}
              >
                {loadingEvent
                  ? "Assigning..."
                  : isRegistered
                    ? "Registered"
                    : "Register Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
