import { useState, useEffect } from 'react';
import { ChevronLeft, ShieldAlert, Terminal } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import { EVENTS } from '../components/EventCards';
import { useMockState } from '../context/MockStateContext';
import TeamRegistrationForm from '../components/TeamRegistrationForm';
import HeistTerminal from '../components/HeistTerminal';

interface EventDetailsViewProps {
  eventId: number;
  onViewChange: (view: 'hub' | 'dashboard' | 'quiz' | 'ticket' | 'eventDetails' | 'userDashboard', id?: number) => void;
  onRegisterSuccess?: (eventId: number) => void;
}

export default function EventDetailsView({ eventId, onViewChange, onRegisterSuccess }: EventDetailsViewProps) {
  const { 
    user, 
    pendingRequests, 
    approvedRequests, 
    registeredTeams, 
    requestRegistration 
  } = useMockState();

  const [loadingEvent, setLoadingEvent] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);

  const evt = EVENTS.find(e => e.id === eventId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  if (!evt) return null;
  const Icon = evt.icon;

  const isPending = pendingRequests.includes(evt.title);
  const isApproved = approvedRequests.includes(evt.title);
  const isRegistered = isApproved; // Approved registrations count as complete
  const teamData = registeredTeams[evt.title];

  const handleRegister = async () => {
    if (navigator.vibrate) navigator.vibrate(30);

    if (!user) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      window.dispatchEvent(new CustomEvent("request-login"));
      return;
    }

    setLoadingEvent(true);
    try {
      requestRegistration(evt.title);
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      if (onRegisterSuccess) onRegisterSuccess(eventId);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register.");
    }
    setLoadingEvent(false);
  };

  const handleTeamSubmit = (team: any) => {
    if (navigator.vibrate) navigator.vibrate(30);
    setLoadingEvent(true);
    try {
      requestRegistration(evt.title, team);
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      if (onRegisterSuccess) onRegisterSuccess(eventId);
    } catch (error) {
      console.error("Error registering team:", error);
    }
    setLoadingEvent(false);
  };

  // RENDER DEDICATED HEIST TERMINAL FULL-WIDTH COMPONENT IF ACTIVE
  if (terminalActive && evt.id === 999 && teamData && user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 px-4 md:px-8 text-white relative z-10 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <button 
            onClick={() => {
              if (navigator.vibrate) navigator.vibrate(30);
              setTerminalActive(false);
            }}
            className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-mono text-sm uppercase tracking-widest">Exit Terminal</span>
          </button>
          
          <HeistTerminal 
            currentUser={user}
            team={teamData}
            onClose={() => setTerminalActive(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 md:px-12 text-white relative z-10 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <button 
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(30);
            onViewChange('hub');
          }}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-mono text-sm uppercase tracking-widest">Back</span>
        </button>

        {/* Dynamic event conditional display */}
        {evt.id === 999 ? (
          // TREASURE HUNT TEMPORARY LOGIC
          <div className="flex flex-col items-center gap-8">
            {!user ? (
              // Login Prompt
              <div className="bg-[#111] border border-brand-red/30 p-8 md:p-12 text-center rounded-2xl max-w-md w-full shadow-2xl">
                <ShieldAlert size={48} className="mx-auto text-brand-red mb-4 animate-pulse" />
                <h3 className="text-2xl font-display text-white uppercase mb-2">Authentication Required</h3>
                <p className="font-mono text-xs text-gray-400 uppercase tracking-widest leading-relaxed mb-6">
                  You must authenticate your operative ID to register a team for this operation.
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("request-login"))}
                  className="w-full py-3 bg-brand-red hover:bg-red-800 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded"
                >
                  Authenticate
                </button>
              </div>
            ) : !isPending && !isApproved ? (
              // Team Registration Form
              <TeamRegistrationForm 
                currentUser={user}
                onSubmit={handleTeamSubmit}
                loading={loadingEvent}
              />
            ) : isPending ? (
              // Pending Clearance
              <div className="bg-[#111] border border-brand-gold-bright/20 p-8 md:p-12 text-center rounded-2xl max-w-lg w-full shadow-2xl">
                <ShieldAlert size={48} className="mx-auto text-brand-gold-bright mb-4 animate-pulse" />
                <h3 className="text-2xl font-display text-white uppercase mb-2">Pending Clearance</h3>
                <p className="font-mono text-xs text-gray-400 uppercase tracking-widest leading-relaxed mb-6">
                  Team details transmitted. ROYAL MINT security check is currently verifying details. Check Admin Dashboard to clear registrations.
                </p>
                <div className="border border-white/5 bg-black/40 p-4 rounded text-left font-mono text-xs text-gray-400 mb-6">
                  <p className="text-brand-gold-bright font-bold mb-1">TEAM LOGS:</p>
                  <p>Name: {teamData?.teamName}</p>
                  <p>Leader: {teamData?.leaderUid}</p>
                  <p>Teammates: {teamData?.teammateUids.join(", ")}</p>
                </div>
                <button 
                  onClick={() => onViewChange("dashboard")}
                  className="w-full py-3 bg-[#222] hover:bg-brand-gold-bright hover:text-[#111] border border-brand-gold-bright/30 text-brand-gold-bright font-mono text-xs uppercase tracking-widest transition-all rounded"
                >
                  Clear from Admin Dashboard
                </button>
              </div>
            ) : (
              // Approved - Launch Terminal
              <div className="bg-[#111] border border-brand-red/30 p-8 md:p-12 text-center rounded-2xl max-w-lg w-full shadow-2xl">
                <Terminal size={48} className="mx-auto text-brand-red mb-4 animate-pulse" />
                <h3 className="text-3xl font-display text-white uppercase tracking-wider mb-2">ACCESS GRANTED</h3>
                <p className="font-mono text-xs text-brand-red-light uppercase tracking-widest mb-6">
                  Security authorization cleared. Node link active.
                </p>
                <div className="border border-white/5 bg-black/40 p-4 rounded text-left font-mono text-xs text-gray-400 mb-8">
                  <p className="text-brand-red font-bold mb-1">OPERATION SPECS:</p>
                  <p>Name: {teamData?.teamName}</p>
                  <p>Leader UID: {teamData?.leaderUid}</p>
                  <p>Authorized UIDs: {teamData?.teammateUids.join(", ")}</p>
                </div>
                <button
                  onClick={() => setTerminalActive(true)}
                  className="w-full py-4 bg-brand-red hover:bg-red-800 text-white font-display text-xl uppercase tracking-widest transition-colors rounded shadow-lg border border-red-900 shadow-brand-red/10"
                >
                  Launch Heist Terminal
                </button>
              </div>
            )}
          </div>
        ) : (
          // STANDARD SINGLE-USER REGISTRATION LOGIC
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
        )}
      </div>
    </div>
  );
}
