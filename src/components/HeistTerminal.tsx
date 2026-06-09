import React, { useState, useEffect, useRef } from "react";
import { Terminal, ShieldAlert, Wifi, RefreshCw, Key, AlertTriangle, Send, Camera, ShieldCheck, Heart } from "lucide-react";
import { User, Team, useMockState } from "../context/MockStateContext";

// Clue Images and matching codes (matching Task 6)
const INTEL_CLUES = [
  { imgName: "tr1.jpg", code: "RLBT76S" },
  { imgName: "tr2.jpg", code: "RLBT76S" }, // shares same code intentionally
  { imgName: "tr3.jpg", code: "ATLCOOM" },
  { imgName: "tr4.jpg", code: "QDZY25L" },
  { imgName: "tr5.jpg", code: "VALD02N" },
];

interface HeistTerminalProps {
  currentUser: User;
  team: Team;
  onClose: () => void;
}

export default function HeistTerminal({
  currentUser,
  team,
  onClose,
}: HeistTerminalProps) {
  const { activeTerminalSession, setActiveTerminalUser } = useMockState();

  // Access States
  const isLeader = currentUser.rollNumber === team.leaderUid;
  const isTeammate = team.teammateUids.includes(currentUser.rollNumber);
  const [isTeammateAuthenticated, setIsTeammateAuthenticated] = useState(false);
  const [authLeaderUid, setAuthLeaderUid] = useState("");
  const [authPasscode, setAuthPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Concurrency bypass
  const [concurrencyBypassed, setConcurrencyBypassed] = useState(false);

  // Game/Onboarding states
  const [confirmedTeamName, setConfirmedTeamName] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [shuffledClues, setShuffledClues] = useState<typeof INTEL_CLUES>([]);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);

  // Scanner States
  const [manualCode, setManualCode] = useState("");
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const qrScannerRef = useRef<any>(null);

  // Strikes & Lock States
  const [strikes, setStrikes] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [overrideInput, setOverrideInput] = useState("");
  const [lockCountdown, setLockCountdown] = useState(0);
  const countdownIntervalRef = useRef<any>(null);

  // Terminal console logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "SYS_INIT: Initializing secure link...",
    `AUTH_TARGET: Team [${team.teamName}] verified in database.`,
  ]);

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Concurrency check active user
  const hasConcurrencyError = 
    activeTerminalSession && 
    activeTerminalSession.teamName === team.teamName && 
    activeTerminalSession.activeUserRoll !== currentUser.rollNumber &&
    !concurrencyBypassed;

  // Set active terminal session on launch
  useEffect(() => {
    const isGranted = isLeader || (isTeammate && isTeammateAuthenticated);
    if (isGranted && !hasConcurrencyError) {
      setActiveTerminalUser(team.teamName, currentUser.rollNumber);
      addLog(`LINK_ACTIVE: Secure session locked to operative [${currentUser.rollNumber}].`);
    }

    return () => {
      // Clear session when unmounting
      if (activeTerminalSession?.activeUserRoll === currentUser.rollNumber) {
        setActiveTerminalUser(team.teamName, null);
      }
    };
  }, [isTeammateAuthenticated, hasConcurrencyError]);

  // Handle countdown timer for lock state
  useEffect(() => {
    if (lockCountdown > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setLockCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            setIsLocked(false);
            setStrikes(0);
            addLog("OVERRIDE_SUCCESS: Security override timer elapsed. Terminal reset.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [lockCountdown]);

  // Teammate challenge auth
  const handleTeammateAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      authLeaderUid.trim() === team.leaderUid && 
      authPasscode.trim() === "shera_mahid_vai"
    ) {
      setIsTeammateAuthenticated(true);
      setAuthError(null);
      addLog(`AUTH_SUCCESS: Teammate [${currentUser.rollNumber}] identity verified.`);
    } else {
      setAuthError("INVALID CREDENTIALS: Identification check failed.");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  // Force override session
  const handleForceOverride = () => {
    setConcurrencyBypassed(true);
    setActiveTerminalUser(team.teamName, currentUser.rollNumber);
    addLog(`OVERRIDE: Concurrency lock cleared. Swapped session to [${currentUser.rollNumber}].`);
  };

  // City selection & shuffling
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    addLog(`SECTOR_CODE: Sector set to [${city.toUpperCase()}].`);
    
    // Seeded shuffling logic based on city
    let clueOrder = [...INTEL_CLUES];
    if (city === "Tokyo") {
      clueOrder = [INTEL_CLUES[0], INTEL_CLUES[1], INTEL_CLUES[2], INTEL_CLUES[3], INTEL_CLUES[4]];
    } else if (city === "Berlin") {
      clueOrder = [INTEL_CLUES[2], INTEL_CLUES[0], INTEL_CLUES[4], INTEL_CLUES[1], INTEL_CLUES[3]];
    } else if (city === "Rio") {
      clueOrder = [INTEL_CLUES[4], INTEL_CLUES[3], INTEL_CLUES[2], INTEL_CLUES[1], INTEL_CLUES[0]];
    } else if (city === "Denver") {
      clueOrder = [INTEL_CLUES[1], INTEL_CLUES[4], INTEL_CLUES[0], INTEL_CLUES[3], INTEL_CLUES[2]];
    }
    
    setShuffledClues(clueOrder);
    addLog(`PATH_SHUFFLE: Coordinates shuffled for sector ${city}.`);
  };

  // Handle QR scan input
  const processScannedCode = (scannedVal: string) => {
    const currentClue = shuffledClues[currentClueIndex];
    if (scannedVal.trim() === currentClue.code) {
      // Correct scan
      setScanMessage({ text: `DECODED: Code accepted. Accessing next node...`, success: true });
      addLog(`NODE_CLEARED: Correct key decrypted for node #${currentClueIndex + 1}.`);
      setStrikes(0); // Reset consecutive strikes

      if (navigator.vibrate) navigator.vibrate([100, 100, 100]);

      setTimeout(() => {
        setScanMessage(null);
        setManualCode("");
        if (currentClueIndex < shuffledClues.length - 1) {
          setCurrentClueIndex(prev => prev + 1);
        } else {
          // Completed all clues!
          addLog("OPERATION_SUCCESS: All security nodes breached. Extraction coordinates sent.");
          setCurrentClueIndex(shuffledClues.length); // Victory state indicator
        }
      }, 1500);
    } else {
      // Incorrect scan
      const nextStrikes = strikes + 1;
      setStrikes(nextStrikes);
      addLog(`NODE_FAILED: Invalid key scanned. Strike ${nextStrikes}/3 logged.`);
      setScanMessage({ text: `WARNING: Key decryption failed. Intrusion logged.`, success: false });

      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

      if (nextStrikes >= 3) {
        setIsLocked(true);
        addLog("SYSTEM_LOCKED: Security lockdown activated. Override code required.");
      }

      setTimeout(() => {
        setScanMessage(null);
      }, 2000);
    }
  };

  // Timed overrides
  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = overrideInput.trim();
    if (cmd === "amichodna") {
      setLockCountdown(600); // 10 minutes
      setOverrideInput("");
      addLog("OVERRIDE_PENDING: Bypass code 'amichodna' accepted. Visual countdown timer initiated (10:00).");
    } else if (cmd === "mahidvaishera") {
      setLockCountdown(5); // 5 seconds
      setOverrideInput("");
      addLog("OVERRIDE_PENDING: Bypass code 'mahidvaishera' accepted. visual countdown initiated (5s).");
    } else {
      addLog("OVERRIDE_FAILED: Security bypass key is incorrect.");
      setOverrideInput("");
      if (navigator.vibrate) navigator.vibrate([100, 100, 100]);
    }
  };

  // Built-in Camera setup using html5-qrcode dynamically
  const toggleCameraScanner = () => {
    if (cameraActive) {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch((err: any) => console.error(err));
      }
      setCameraActive(false);
    } else {
      setCameraActive(true);
      // Wait for element mounting, then initialize scanner
      setTimeout(() => {
        import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
          const scanner = new Html5QrcodeScanner(
            "terminal-qr-scanner",
            { fps: 10, qrbox: { width: 220, height: 220 } },
            /* verbose= */ false
          );
          
          scanner.render(
            (decodedText) => {
              addLog(`SCANNER_OK: Read QR: [${decodedText}]`);
              processScannedCode(decodedText);
              scanner.clear().catch((e) => console.error(e));
              setCameraActive(false);
            },
            (err) => {
              // Ignore standard frame-scanning failures
            }
          );
          
          qrScannerRef.current = scanner;
        }).catch(err => {
          addLog("SCANNER_ERROR: Camera framework import failed.");
          console.error(err);
        });
      }, 200);
    }
  };

  // Format visual countdown text
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Clean camera scanner on exit
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch((e: any) => console.error(e));
      }
    };
  }, []);

  // RENDER ACCESS DENIED IF NOT IN THE TEAM
  if (!isLeader && !isTeammate) {
    return (
      <div className="bg-black/95 border border-brand-red p-12 text-center rounded-2xl max-w-lg mx-auto shadow-[0_0_50px_rgba(139,0,0,0.3)]">
        <ShieldAlert size={60} className="mx-auto text-brand-red animate-pulse mb-6" />
        <h3 className="text-3xl font-display text-white uppercase mb-4 tracking-wider">Access Denied</h3>
        <p className="font-mono text-xs text-brand-red-light uppercase tracking-widest mb-8 leading-relaxed">
          SEC_LEVEL_3: Your operative ID (Roll: {currentUser.rollNumber}) is not authorized to join Team "{team.teamName}".
        </p>
        <button onClick={onClose} className="px-6 py-2 border border-white/20 text-white hover:bg-white/10 font-mono text-xs uppercase tracking-widest transition-colors rounded">
          Abort Link
        </button>
      </div>
    );
  }

  // RENDER TEAMMATE AUTHENTICATION GATE
  if (isTeammate && !isTeammateAuthenticated) {
    return (
      <div className="bg-black/95 border border-brand-red p-8 md:p-10 rounded-2xl max-w-md mx-auto shadow-[0_0_50px_rgba(139,0,0,0.3)]">
        <div className="text-center mb-6">
          <Key size={48} className="mx-auto text-brand-gold-bright animate-bounce mb-4" />
          <h3 className="text-2xl font-display text-white uppercase tracking-wider">Teammate Authentication</h3>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">Verify Team "{team.teamName}" Credentials</p>
        </div>

        <form onSubmit={handleTeammateAuth} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Team Leader's Roll Number</label>
            <input
              type="text"
              placeholder="e.g. 2024-001"
              value={authLeaderUid}
              onChange={(e) => setAuthLeaderUid(e.target.value)}
              className="bg-[#111] border border-white/10 outline-none rounded px-4 py-3 text-white font-mono text-sm focus:border-brand-red transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">Override Passcode</label>
            <input
              type="password"
              placeholder="shera_mahid_vai"
              value={authPasscode}
              onChange={(e) => setAuthPasscode(e.target.value)}
              className="bg-[#111] border border-white/10 outline-none rounded px-4 py-3 text-white font-mono text-sm focus:border-brand-red transition-all"
              required
            />
          </div>

          {authError && (
            <p className="font-mono text-xs text-brand-red font-semibold text-center mt-2">{authError}</p>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-colors rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-brand-red hover:bg-red-800 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded"
            >
              Verify Code
            </button>
          </div>
        </form>
      </div>
    );
  }

  // RENDER CONCURRENCY LOCKOUT SCREEN
  if (hasConcurrencyError) {
    return (
      <div className="bg-black/95 border border-brand-gold-bright p-8 md:p-12 text-center rounded-2xl max-w-lg mx-auto shadow-[0_0_50px_rgba(233,195,73,0.2)]">
        <AlertTriangle size={60} className="mx-auto text-brand-gold-bright animate-pulse mb-6" />
        <h3 className="text-3xl font-display text-white uppercase mb-4 tracking-wider">Concurrency Lock</h3>
        <p className="font-mono text-xs text-brand-gold-bright uppercase tracking-widest mb-4">
          CONCURRENCY ERROR: Session active on another terminal.
        </p>
        <p className="font-mono text-sm text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
          The terminal is currently being accessed by operative **{activeTerminalSession?.activeUserRoll}** from team **{team.teamName}**. 
          To prevent coordinate leakage, only one session is permitted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onClose} className="px-6 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-colors rounded">
            Exit Link
          </button>
          <button 
            onClick={handleForceOverride}
            className="px-6 py-3 bg-brand-gold-bright hover:bg-yellow-500 text-black font-mono text-xs uppercase tracking-widest transition-colors rounded font-bold"
          >
            Force Override Session
          </button>
        </div>
      </div>
    );
  }

  // RENDER SECURITY LOCKDOWN STATE
  if (isLocked) {
    return (
      <div className="bg-black border border-brand-red p-10 text-center rounded-2xl max-w-xl mx-auto shadow-[0_0_100px_rgba(139,0,0,0.5)] border-red-500 animate-pulse relative overflow-hidden">
        {/* Visual countdown active */}
        {lockCountdown > 0 ? (
          <div className="space-y-6">
            <RefreshCw size={52} className="mx-auto text-brand-red animate-spin mb-4" />
            <h3 className="text-4xl font-display text-white uppercase tracking-widest">DECRYPTION PENDING</h3>
            <p className="font-mono text-xs text-brand-red-light uppercase tracking-widest">
              Lockout override command processed. Unlocking security gates in:
            </p>
            <div className="font-mono text-5xl md:text-7xl text-brand-red font-bold tracking-wider py-4 bg-red-950/20 rounded-xl border border-brand-red/30">
              {formatCountdown(lockCountdown)}
            </div>
            <p className="font-mono text-[10px] text-gray-600">PLEASE WAIT. ACTIVE INTRUSION COUNTERMEASURES ENGAGED.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <ShieldAlert size={64} className="mx-auto text-brand-red mb-4" />
            <h3 className="text-4xl font-display text-brand-red uppercase tracking-widest glow-red-text">SYSTEM BLOCKED</h3>
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest leading-relaxed max-w-md mx-auto">
              SEC_INTRUSION: 3 incorrect coordinate scans logged consecutively. Terminal locked for security clearance.
            </p>
            
            <form onSubmit={handleOverrideSubmit} className="max-w-md mx-auto pt-6 space-y-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-xs text-gray-400 uppercase tracking-widest text-left">Input Override Command</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter bypass command..."
                    value={overrideInput}
                    onChange={(e) => setOverrideInput(e.target.value)}
                    className="flex-1 bg-[#111] border border-brand-red/30 focus:border-brand-red outline-none rounded px-4 py-3 text-white font-mono text-sm"
                    required
                  />
                  <button type="submit" className="p-3 bg-brand-red hover:bg-red-800 text-white rounded transition-colors">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // RENDER ONBOARDING FLOW: CONFIRM TEAM NAME
  if (!confirmedTeamName) {
    return (
      <div className="bg-[#151515]/90 border border-brand-red/30 p-8 rounded-2xl max-w-md mx-auto shadow-2xl backdrop-blur-2xl">
        <h3 className="text-xl font-display text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Terminal size={18} className="text-brand-red animate-pulse" />
          Terminal Handshake
        </h3>
        <p className="font-mono text-sm text-gray-300 leading-relaxed mb-6">
          System link verified. Please authorize the encryption coordinates for team **"{team.teamName}"** to download the heist map.
        </p>
        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-colors rounded">
            Abort
          </button>
          <button
            onClick={() => {
              setConfirmedTeamName(true);
              addLog(`CONFIRM: Access verified for team [${team.teamName}].`);
            }}
            className="flex-1 py-3 bg-brand-red hover:bg-red-800 text-white font-mono text-xs uppercase tracking-widest transition-colors rounded"
          >
            Confirm {team.teamName}
          </button>
        </div>
      </div>
    );
  }

  // RENDER ONBOARDING FLOW: SELECT CITY
  if (selectedCity === null) {
    return (
      <div className="bg-[#151515]/90 border border-brand-red/30 p-8 rounded-2xl max-w-lg mx-auto shadow-2xl backdrop-blur-2xl text-center">
        <h3 className="text-2xl font-display text-white uppercase tracking-wider mb-2">Operation Sector</h3>
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">Select a code city to extract coordinates</p>
        
        <div className="grid grid-cols-2 gap-4">
          {["Tokyo", "Berlin", "Rio", "Denver"].map(city => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              className="py-4 border border-white/10 hover:border-brand-gold-bright/50 bg-black/40 hover:bg-brand-gold-bright/5 text-gray-300 hover:text-brand-gold-bright font-mono text-sm uppercase tracking-widest transition-all rounded-lg"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // RENDER VICTORY SCREEN
  if (currentClueIndex >= shuffledClues.length) {
    return (
      <div className="bg-black/90 border border-brand-gold-bright p-10 text-center rounded-2xl max-w-lg mx-auto shadow-[0_0_50px_rgba(233,195,73,0.3)]">
        <ShieldCheck size={64} className="mx-auto text-brand-gold-bright mb-6 animate-bounce" />
        <h3 className="text-3xl font-display text-white uppercase tracking-wider mb-2">HEIST SUCCESSFUL</h3>
        <p className="font-mono text-xs text-brand-gold-bright uppercase tracking-widest mb-6">Operations Complete - Extraction Ready</p>
        
        <div className="font-mono text-xs text-gray-400 bg-[#111] border border-white/5 p-6 rounded-lg text-left space-y-2 mb-8 leading-relaxed">
          <p className="text-green-500 font-bold">INFO: Core vault database breached.</p>
          <p>INFO: Shuffled Sector: {selectedCity}</p>
          <p>INFO: Keys Decrypted: 5/5</p>
          <p>INFO: Operative ID: {currentUser.rollNumber}</p>
          <p>INFO: Escape coordinates unlocked. Report to safe house.</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => {
              setCurrentClueIndex(0);
              setStrikes(0);
              addLog("RESET: Resetting operations sequence.");
            }} 
            className="flex-1 py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-mono text-xs uppercase tracking-widest transition-colors rounded"
          >
            Replay Heist
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-brand-gold-bright hover:bg-yellow-500 text-black font-mono text-xs uppercase tracking-widest font-bold transition-colors rounded">
            Finish mission
          </button>
        </div>
      </div>
    );
  }

  // RENDER ACTIVE GAME SCREEN
  const currentClue = shuffledClues[currentClueIndex];

  return (
    <div className="bg-black/95 border border-brand-red/30 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 max-w-5xl w-full mx-auto relative overflow-hidden backdrop-blur-2xl">


      {/* LEFT COLUMN: Console Logs & Clue Image */}
      <div className="flex-1 flex flex-col gap-6 relative z-10 w-full lg:w-1/2">
        {/* Terminal Header */}
        <div className="flex justify-between items-center bg-[#111] px-4 py-3 border border-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-red animate-ping"></span>
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Term ID: OP-{currentUser.rollNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-gray-600 uppercase">Sector: {selectedCity}</span>
            <Wifi size={14} className="text-brand-red" />
          </div>
        </div>

        {/* Current Clue Image */}
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden aspect-video flex flex-col justify-center items-center relative group">
          <img
            src={`/picture/${currentClue.imgName}`}
            alt={`Clue #${currentClueIndex + 1}`}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            onError={(e) => {
              // Fallback placeholder in case image doesn't load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          {/* Failsafe placeholder text in case of missing file */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center pointer-events-none bg-black/40">
            <span className="font-display text-4xl text-brand-red opacity-30 select-none">NODE #{currentClueIndex + 1}</span>
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-2">{currentClue.imgName}</span>
          </div>
          <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-brand-gold-bright font-mono text-[10px] uppercase tracking-widest border border-brand-gold-bright/20">
            Node {currentClueIndex + 1} of 5
          </div>
        </div>

        {/* Console logs */}
        <div className="bg-black/80 border border-white/5 p-4 rounded-xl font-mono text-[11px] text-brand-red-light/80 h-36 overflow-y-auto space-y-1 scrollbar-thin">
          {consoleLogs.map((log, idx) => (
            <div key={idx} className="leading-normal">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Camera QR Scanner / Manual decrypter / Strikes */}
      <div className="w-full lg:w-96 flex flex-col gap-6 relative z-10 shrink-0">
        
        {/* Strikes Panel */}
        <div className="bg-[#111] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">Intrusion Strikes</span>
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`h-4 w-4 rounded-full border transition-all ${
                  strikes >= s 
                  ? 'bg-brand-red border-brand-red shadow-[0_0_10px_rgba(139,0,0,0.8)]' 
                  : 'bg-transparent border-white/20'
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* Decryption Hub */}
        <div className="bg-[#111] border border-brand-red/20 rounded-xl p-6 flex-1 flex flex-col justify-between min-h-[300px]">
          
          <div className="space-y-4">
            <h4 className="font-display text-lg text-white uppercase tracking-wider border-b border-white/5 pb-2">DECRYPTION ENGINE</h4>
            
            {/* Real Camera Scanner */}
            {cameraActive ? (
              <div className="border border-white/10 rounded-lg overflow-hidden bg-black relative">
                <div id="terminal-qr-scanner" className="w-full aspect-square"></div>
                <button
                  onClick={toggleCameraScanner}
                  className="absolute bottom-2 right-2 px-3 py-1 bg-brand-red text-white font-mono text-[10px] uppercase rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={toggleCameraScanner}
                className="w-full py-4 border border-brand-red/30 hover:border-brand-red bg-brand-red/5 hover:bg-brand-red/10 text-white rounded-lg flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest transition-all"
              >
                <Camera size={16} className="text-brand-red" />
                Initialize camera scanner
              </button>
            )}

            {/* Scan response message */}
            {scanMessage && (
              <div className={`p-3 rounded text-center border font-mono text-xs uppercase ${
                scanMessage.success 
                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                : 'bg-brand-red/10 border-brand-red/30 text-brand-red-light'
              }`}>
                {scanMessage.text}
              </div>
            )}
          </div>

          {/* Test/Manual Override Input */}
          <div className="border-t border-white/5 pt-6 mt-4">
            <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-2">
              Hacker input override (Testing Failsafe)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste decrypted code..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="flex-1 bg-black/60 border border-white/10 focus:border-brand-red outline-none rounded px-3 py-2 text-white font-mono text-xs"
              />
              <button
                onClick={() => processScannedCode(manualCode)}
                className="px-4 bg-brand-red hover:bg-red-800 text-white text-xs font-mono uppercase tracking-widest rounded transition-colors"
              >
                Inject
              </button>
            </div>
            {/* Clue tip helper */}
            <div className="mt-2 text-[9px] font-mono text-gray-600 flex justify-between">
              <span>Code Format: [A-Z0-9]{7}</span>
              <span>Target: node #{currentClueIndex + 1}</span>
            </div>
          </div>
        </div>

        {/* Abort Mission Link */}
        <button
          onClick={onClose}
          className="w-full py-3 border border-white/10 hover:border-brand-red/30 text-gray-400 hover:text-white hover:bg-brand-red/5 font-mono text-xs uppercase tracking-widest transition-all rounded-lg"
        >
          Disconnect Link
        </button>
      </div>
    </div>
  );
}
