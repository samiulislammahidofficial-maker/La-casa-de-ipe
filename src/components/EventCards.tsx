import React, { useState, useEffect, useMemo, useRef } from "react";
import { ViewType } from "../App";
import Fuse from "fuse.js";
import {
  Target,
  Map,
  Briefcase,
  Mic,
  Anchor,
  Presentation,
  Swords,
  Gamepad2,
  Trophy,
  Crosshair,
  Crown,
  Palette,
  MonitorPlay,
  Music,
  Film,
  Keyboard,
  Camera,
  Radio,
  Laugh,
  Paintbrush,
  Hash,
  Volume2,
  Gamepad,
  Dices,
  Layers,
  Activity,
  Star,
  Eye,
  Search,
  ArrowDownAZ,
  ArrowUpZA,
  CalendarDays,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import bgImage from "../../picture/carousel-bg.png.png";
import { useMockState } from "../context/MockStateContext";

export const EVENTS = [
  {
    id: 3,
    title: "Integration Bee",
    icon: Target,
    targetDate: "2026-07-14T20:00:00",
    desc: "An engaging calculus competition centered on integration and problem-solving techniques. Participants solve calculus-based questions quickly and accurately, demonstrating analytical speed and mathematical creativity under pressure.",
    activities: [
      { label: "Registration Starts", date: "11 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "13 Jul 2026", time: "11:59 PM" },
      { label: "Round One", date: "14 Jul 2026", time: "8:00 PM" },
      { label: "Round de Finale", date: "15 Jul 2026", time: "1:30 PM" }
    ]
  },
  {
    id: 4,
    title: "Tug of War",
    icon: Anchor,
    targetDate: "2026-07-15T13:00:00",
    desc: "A classic team sport highlighting raw strength, coordinated synergy, unity, and strategy. Teams face off by pulling opposite ends of the rope, creating a high-energy spectacle of grit and determination.",
    activities: [
      { label: "Registration Starts", date: "11 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "14 Jul 2026", time: "11:59 PM" },
      { label: "Round One", date: "15 Jul 2026", time: "1:00 PM" },
      { label: "Round de Finale", date: "15 Jul 2026", time: "1:30 PM" }
    ]
  },
  {
    id: 27,
    title: "Los Artistas Al Mando",
    icon: Palette,
    targetDate: "2026-08-08T19:30:00",
    desc: "A creative art combat celebrating visual imagination and technical skill. Operatives express their vision through painting, sketching, or digital illustration, competing for design supremacy.",
    activities: [
      { label: "Submission Starts", date: "8 Aug 2026", time: "7:30 PM" },
      { label: "Submission Ends", date: "14 Aug 2026", time: "11:59 PM" },
      { label: "Result", date: "15 Aug 2026", time: "10:00 PM" }
    ]
  },
  {
    id: 6,
    title: "La Guerra De Argumentos",
    icon: Mic,
    targetDate: "2026-07-31T12:00:00",
    desc: "A verbal battlefield where ideas clash, reason prevails, and opposition is deconstructed. Teams articulate their views on controversial issues under pressure, testing their rhetoric and poise.",
    activities: [
      { label: "Registration Starts", date: "27 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "30 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "31 Jul 2026", time: "12:00 PM" }
    ]
  },
  {
    id: 7,
    title: "Chess",
    icon: Crown,
    targetDate: "2026-07-23T12:00:00",
    desc: "A strategic silent battle of logic, patience, and foresight. Competitors plan moves, anticipate enemy counter-actions, and aim for checkmate in a high-focus environment.",
    activities: [
      { label: "Registration Starts", date: "18 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "22 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "23 Jul 2026", time: "12:00 PM" }
    ]
  },
  {
    id: 8,
    title: "FIFA",
    icon: Trophy,
    targetDate: "2026-07-23T14:30:00",
    desc: "A digital football esports tournament where players showcase virtual football dominance. Competitors manage teams and perform complex maneuvers in a high-octane gaming arena.",
    activities: [
      { label: "Registration Starts", date: "18 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "22 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "23 Jul 2026", time: "2:30 PM" }
    ]
  },
  {
    id: 9,
    title: "Pes",
    icon: Gamepad2,
    targetDate: "2026-07-19T20:00:00",
    desc: "A realistic football gaming match where tactical layout, teamwork, and quick reflexes determine the champion in digital soccer simulation.",
    activities: [
      { label: "Registration Starts", date: "15 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "18 Jul 2026", time: "11:59 PM" },
      { label: "Round One", date: "19 Jul 2026", time: "8:00 PM" },
      { label: "Round Two", date: "20 Jul 2026", time: "8:30 PM" },
      { label: "Semi Finale", date: "23 Jul 2026", time: "1:30 PM" },
      { label: "Round de Finale", date: "23 Jul 2026", time: "2:30 PM" }
    ]
  },
  {
    id: 13,
    title: "Las Reinas De la Casa (Ludo, Musical Chair, Pillow Passing)",
    icon: Dices,
    targetDate: "2026-07-16T10:00:00",
    desc: "A combined multi-event match for women operatives featuring Ludo, Musical Chairs, and Pillow Passing. Tests reaction time, board strategy, and speed in a festive, high-energy environment.",
    activities: [
      { label: "Registration Starts", date: "10 Jul 2026", time: "10:30 PM" },
      { label: "Registration Ends", date: "14 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "16 Jul 2026", time: "10:00 AM" }
    ]
  },
  {
    id: 10,
    title: "Football",
    icon: Activity,
    targetDate: "2026-07-16T07:00:00",
    desc: "A high-stamina field team sport combining speed, synergy, physical agility, and sportsmanship. Teams battle on the turf to execute plays and score goals.",
    activities: [
      { label: "Registration Starts", date: "12 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "15 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "16 Jul 2026", time: "7:00 AM" }
    ]
  },
  {
    id: 11,
    title: "Uno",
    icon: Layers,
    targetDate: "2026-07-22T15:00:00",
    desc: "A fast-paced, high-voltage card game of strategy, quick hand plays, and sudden twists. Match colors, play action cards, and empty your deck before the rest.",
    activities: [
      { label: "Registration Starts", date: "15 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "18 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "22 Jul 2026", time: "3:00 PM" }
    ]
  },
  {
    id: 12,
    title: "El Codigo 29",
    icon: Hash,
    targetDate: "2026-07-22T17:00:00",
    desc: "A classic card trick and team bidding competition requiring exceptional memory, coordination, and calculated risk-taking with team partners.",
    activities: [
      { label: "Registration Starts", date: "15 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "18 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "22 Jul 2026", time: "5:00 PM" }
    ]
  },
  {
    id: 5,
    title: "The Bizz Seminar",
    icon: Presentation,
    targetDate: "2026-07-24T15:00:00",
    desc: "An educational knowledge-sharing event focused on case-solving frameworks, business presentation tools, and structural thinking. Guided by national-level champions.",
    activities: [
      { label: "Registration Starts", date: "12 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "20 Jul 2026", time: "11:59 PM" },
      { label: "Event Starts", date: "24 Jul 2026", time: "3:00 PM" }
    ]
  },
  {
    id: 2,
    title: "La Casa del Emprendedor (BIZZ)",
    icon: Briefcase,
    targetDate: "2026-07-26T12:00:00",
    desc: "A flagship case-solving tournament designed to mentor students. Teams analyze complex problems under pressure, draft pitch decks, and present to a distinguished judging panel.",
    activities: [
      { label: "Registration Starts", date: "16 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "21 Jul 2026", time: "11:59 PM" },
      { label: "Round One", date: "26 Jul 2026", time: "12:00 PM" },
      { label: "Submission", date: "30 Jul 2026", time: "11:59 PM" },
      { label: "Finalists Announcement", date: "7 Aug 2026", time: "12:00 PM" },
      { label: "Round de Finale", date: "16 Aug 2026", time: "5:30 PM" }
    ]
  },
  {
    id: 19,
    title: "Table Tennis",
    icon: Swords,
    targetDate: "2026-07-15T10:00:00",
    desc: "A rapid indoor table tennis tournament testing coordination, hand-eye speeds, and spin placement in high-velocity table tennis matches.",
    activities: [
      { label: "Registration Starts", date: "12 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "14 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "15 Jul 2026", time: "10:00 AM" }
    ]
  },
  {
    id: 999,
    title: "La Caza de Tesoro",
    icon: Map,
    targetDate: "2026-07-30T17:00:00",
    desc: "An exciting team-based treasure hunt where operatives solve riddles, decode maps, and navigate checks across campus to secure the vault assets.",
    activities: [
      { label: "Registration Starts", date: "26 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "29 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "30 Jul 2026", time: "5:00 PM" }
    ]
  },
  {
    id: 21,
    title: "Guess The Movies or song",
    icon: Film,
    targetDate: "2026-08-06T13:00:00",
    desc: "A fun pop-culture trivia contest. Contestants identify movies or song tracks from short clips, tunes, audio cues, or graphic prompts under pressure.",
    activities: [
      { label: "Registration Starts", date: "02 Aug 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "05 Aug 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "06 Aug 2026", time: "1:00 PM" }
    ]
  },
  {
    id: 20,
    title: "Theme Game",
    icon: Gamepad,
    targetDate: "2026-07-23T13:00:00",
    desc: "A themed interactive game of coordination, communication, and speed. Operative squads tackle tasks under heavy situational restrictions.",
    activities: [
      { label: "Registration Starts", date: "18 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "22 Jul 2026", time: "11:59 PM" },
      { label: "Event Starts", date: "23 Jul 2026", time: "1:00 PM" }
    ]
  },
  {
    id: 25,
    title: "Frames De Bella Ciao",
    icon: Camera,
    targetDate: "2026-08-08T19:30:00",
    desc: "A photography competition celebrating storytelling, visual framing, and heist-themed aesthetics. Capture and submit striking static imagery.",
    activities: [
      { label: "Submission Starts", date: "8 Aug 2026", time: "7:30 PM" },
      { label: "Submission Ends", date: "14 Aug 2026", time: "11:59 PM" }
    ]
  },
  {
    id: 26,
    title: "Meme Comp",
    icon: Laugh,
    targetDate: "2026-08-08T19:30:00",
    desc: "A digital humor contest where operatives create original memes on heist culture, engineering life, or student trends, competing for peak entertainment value.",
    activities: [
      { label: "Submission Starts", date: "8 Aug 2026", time: "7:30 PM" },
      { label: "Submission Ends", date: "14 Aug 2026", time: "11:59 PM" }
    ]
  },
  {
    id: 24,
    title: "La Casa del Teclado",
    icon: Keyboard,
    targetDate: "2026-07-23T22:00:00",
    desc: "A high-speed type-racing championship. Competitors race to complete texts with 100% spelling precision, testing speed and keyboard ergonomics.",
    activities: [
      { label: "Registration Starts", date: "20 Jul 2026", time: "7:30 PM" },
      { label: "Registration Ends", date: "22 Jul 2026", time: "11:59 PM" },
      { label: "Competition Starts", date: "23 Jul 2026", time: "10:00 PM" }
    ]
  },
  {
    id: 28,
    title: "La Noche Del Atraco",
    icon: Activity,
    targetDate: "2026-08-19T16:00:00",
    desc: "The spectacular heist cultural night and grand finale of the event. Features musical performances, drama, award ceremonies, and the heist victory celebration.",
    activities: [
      { label: "Programme Starts", date: "19 Aug 2026", time: "4:00 PM" },
      { label: "Break Time", date: "19 Aug 2026", time: "6:30 PM-7:00 PM" },
      { label: "Programme Ends", date: "19 Aug 2026", time: "10:00 PM" }
    ]
  }
];

export default function EventCards({
  onLoginRequest,
  onRegisterSuccess,
  onViewChange
}: {
  onLoginRequest?: () => void;
  onRegisterSuccess?: (eventId: number) => void;
  onViewChange?: (view: ViewType, eventId?: number) => void;
}) {
  const { user, pendingRequests, approvedRequests, requestRegistration } = useMockState();
  const [loadingEvent, setLoadingEvent] = useState<number | null>(null);

  // Search & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"date-asc" | "date-desc" | "alpha-asc" | "alpha-desc">("date-asc");
  const [activeIndex, setActiveIndex] = useState(0);

  // Touch handling
  const touchStartX = useRef<number | null>(null);

  const fuse = useMemo(() => new Fuse(EVENTS, {
    keys: ["title"],
    threshold: 0.3,
  }), []);

  const processedEvents = useMemo(() => {
    let results = EVENTS;
    if (searchQuery.trim()) {
      results = fuse.search(searchQuery).map(res => res.item);
    }

    results = [...results].sort((a, b) => {
      if (sortOrder === "alpha-asc") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "alpha-desc") {
        return b.title.localeCompare(a.title);
      } else {
        const dateA = a.targetDate ? new Date(a.targetDate).getTime() : Infinity;
        const dateB = b.targetDate ? new Date(b.targetDate).getTime() : Infinity;
        if (sortOrder === "date-asc") {
          return dateA - dateB;
        } else {
          if (a.targetDate === null && b.targetDate === null) return 0;
          if (a.targetDate === null) return 1;
          if (b.targetDate === null) return -1;
          return dateB - dateA;
        }
      }
    });

    return results;
  }, [searchQuery, sortOrder, fuse]);

  useEffect(() => {
    setActiveIndex(0);
  }, [processedEvents.length]);

  const handleRegister = async (eventId: number, eventTitle: string) => {
    if (navigator.vibrate) navigator.vibrate(30);

    if (!user) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      if (onLoginRequest) {
        onLoginRequest();
      } else {
        window.dispatchEvent(new CustomEvent("request-login"));
      }
      return;
    }

    if (approvedRequests.includes(eventTitle) || pendingRequests.includes(eventTitle)) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      return;
    }

    setLoadingEvent(eventId);
    // Simulate network delay
    setTimeout(() => {
      requestRegistration(eventTitle);
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      if (onRegisterSuccess) onRegisterSuccess(eventId);
      setLoadingEvent(null);
    }, 600);
  };

  const nextCard = () => {
    if (activeIndex < processedEvents.length - 1) setActiveIndex(prev => prev + 1);
  };

  const prevCard = () => {
    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      nextCard();
    } else if (diff < -50) {
      prevCard();
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full relative py-8 md:py-16 px-4 pb-20 mt-4 md:mt-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-luminosity"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-950/95 via-black/85 to-neutral-950/95 md:from-[#111] md:via-[rgba(17,17,17,0.8)] md:to-[#111] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 mb-8">
        <h2 className="font-display text-3xl uppercase tracking-widest text-white decoration-brand-red decoration-2 underline-offset-8 underline mb-8 drop-shadow-lg">
          Operations Intel
        </h2>

        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#151515]/80 p-4 border border-brand-red/20 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(139,0,0,0.1)]">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Fuzzy Search Operations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-brand-red/30 rounded-lg pl-10 pr-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-brand-red focus:shadow-[0_0_15px_rgba(139,0,0,0.3)] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setSortOrder(prev => prev === 'date-asc' ? 'date-desc' : 'date-asc')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${sortOrder.startsWith('date') ? 'bg-brand-red/20 text-brand-red border border-brand-red/50 shadow-[0_0_15px_rgba(139,0,0,0.2)]' : 'bg-black/40 text-gray-400 border border-white/10 hover:border-white/30 hover:bg-white/5'}`}
            >
              <Calendar size={16} />
              {sortOrder === 'date-desc' ? 'Newest First' : 'Chronological'}
            </button>
            <button 
              onClick={() => setSortOrder(prev => prev === 'alpha-asc' ? 'alpha-desc' : 'alpha-asc')}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${sortOrder.startsWith('alpha') ? 'bg-brand-gold-bright/20 text-brand-gold-bright border border-brand-gold-bright/50 shadow-[0_0_15px_rgba(233,195,73,0.2)]' : 'bg-black/40 text-gray-400 border border-white/10 hover:border-white/30 hover:bg-white/5'}`}
            >
              {sortOrder === 'alpha-desc' ? <ArrowUpZA size={16} /> : <ArrowDownAZ size={16} />}
              Alphabetical
            </button>
          </div>
        </div>
      </div>

      {/* 3D Carousel Container */}
      {processedEvents.length > 0 ? (
        <div className="relative w-full max-w-[340px] md:max-w-[400px] h-[550px] mx-auto flex justify-center items-center perspective-[1200px] my-12">
          
          <button 
            onClick={prevCard} 
            disabled={activeIndex === 0}
            className={`absolute -left-12 md:-left-24 z-50 p-4 rounded-full border transition-all duration-300 ${activeIndex === 0 ? 'border-white/10 text-white/20 cursor-not-allowed scale-90' : 'border-brand-red/50 text-brand-red hover:bg-brand-red/20 hover:scale-110 shadow-[0_0_20px_rgba(139,0,0,0.3)]'} bg-[#111]/80 backdrop-blur`}
          >
            <ChevronLeft size={28} />
          </button>
          
          <button 
            onClick={nextCard} 
            disabled={activeIndex === processedEvents.length - 1}
            className={`absolute -right-12 md:-right-24 z-50 p-4 rounded-full border transition-all duration-300 ${activeIndex === processedEvents.length - 1 ? 'border-white/10 text-white/20 cursor-not-allowed scale-90' : 'border-brand-red/50 text-brand-red hover:bg-brand-red/20 hover:scale-110 shadow-[0_0_20px_rgba(139,0,0,0.3)]'} bg-[#111]/80 backdrop-blur`}
          >
            <ChevronRight size={28} />
          </button>

          <div 
            className="relative w-full h-full flex justify-center items-center preserve-3d"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {processedEvents.map((event, i) => {
              const isCurrent = i === activeIndex;
              const offset = i - activeIndex;

              if (Math.abs(offset) > 4) return null;

              const isPast = offset < 0;

              let zIndex = 40 - Math.abs(offset);
              let transform = "";
              let opacity = 1;
              let filter = "blur(0px)";

              if (isPast) {
                // Swiped out left
                transform = `translateX(-150%) scale(0.7) rotateY(-30deg)`;
                opacity = 0;
                filter = "blur(20px)";
              } else if (isCurrent) {
                // Active Center
                transform = `translateX(0) scale(1) translateY(0) rotateY(0deg)`;
                opacity = 1;
                filter = "blur(0px)";
                zIndex = 50;
              } else {
                // Stacked right behind
                const xOffset = offset * 30;
                const yOffset = offset * -15;
                const scale = 1 - offset * 0.06;
                transform = `translateX(${xOffset}px) translateY(${yOffset}px) scale(${scale})`;
                opacity = Math.max(0, 1 - offset * 0.2);
                filter = `blur(${offset * 3}px)`;
              }

              const Icon = event.icon;
              const isRed = i % 2 === 0;
              const colorClass = isRed ? "text-brand-red" : "text-brand-gold-bright";
              const borderClass = isCurrent 
                ? (isRed ? "border-brand-red shadow-[0_0_50px_rgba(139,0,0,0.4)]" : "border-brand-gold-bright shadow-[0_0_50px_rgba(233,195,73,0.3)]")
                : "border-white/10";
              const isRegistered = approvedRequests.includes(event.title);
              const isPending = pendingRequests.includes(event.title);

              return (
                <div
                  key={event.id}
                  onClick={() => {
                    if (offset > 0) setActiveIndex(i);
                  }}
                  className={`absolute w-[320px] md:w-[360px] h-[480px] bg-[#151515]/95 backdrop-blur-2xl border ${borderClass} p-8 flex flex-col transition-all duration-700 cubic-bezier(0.25, 1, 0.5, 1) rounded-2xl ${isCurrent ? 'cursor-default' : 'cursor-pointer hover:-translate-y-4'}`}
                  style={{ transform, zIndex, opacity, filter }}
                >
                  <div className="flex flex-col h-full relative z-10 w-full">
                    <div className="mb-auto">
                      <div className={`p-4 rounded-xl inline-block bg-white/5 border border-white/5 mb-6 transition-all duration-500 ${isCurrent ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : ''}`}>
                        <Icon size={48} className={`${colorClass} ${isCurrent ? 'animate-pulse' : ''}`} />
                      </div>
                      <h3 className="font-display text-3xl text-white uppercase mb-3 leading-tight tracking-wide">
                        {event.title}
                      </h3>
                      {event.targetDate ? (
                        <p className="font-mono text-sm text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                          <CalendarDays size={16} className={colorClass} />
                          {new Date(event.targetDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      ) : (
                        <p className="font-mono text-sm text-gray-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                          <CalendarDays size={16} />
                          TBA
                        </p>
                      )}
                    </div>

                    <div className={`flex flex-col gap-4 mt-8 ${!isCurrent && 'opacity-0 pointer-events-none'} transition-opacity duration-500 delay-300`}>
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewChange?.('eventDetails', event.id); }}
                        className={`w-full py-4 border border-white/20 text-white hover:bg-white/10 font-mono text-sm uppercase tracking-widest transition-all rounded-lg`}
                      >
                        Access Intel
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRegister(event.id, event.title); }}
                        disabled={isRegistered || isPending || loadingEvent === event.id}
                        className={`w-full py-4 border rounded-lg ${(isRegistered || isPending) ? "border-brand-red bg-brand-red/20 text-brand-red opacity-80 cursor-not-allowed" : isRed ? "border-brand-red text-brand-red hover:bg-brand-red hover:text-white shadow-[0_0_15px_rgba(139,0,0,0)] hover:shadow-[0_0_20px_rgba(139,0,0,0.4)]" : "border-brand-gold-bright text-brand-gold-bright hover:bg-brand-gold-bright hover:text-[#111] shadow-[0_0_15px_rgba(233,195,73,0)] hover:shadow-[0_0_20px_rgba(233,195,73,0.4)]"} font-mono text-sm font-bold uppercase tracking-widest transition-all`}
                      >
                        {loadingEvent === event.id
                          ? "Connecting..."
                          : isRegistered
                            ? "Already Assigned"
                            : isPending 
                            ? "Request Sent"
                            : "Join Operation"}
                      </button>
                    </div>
                  </div>

                  {/* Aesthetic card accents */}
                  <div className="absolute top-8 right-8 font-mono text-xs text-gray-600/50 pointer-events-none rotate-90 origin-right tracking-[0.2em]">
                    OP-{String(event.id).padStart(3, "0")}
                  </div>
                  <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${isRed ? 'from-brand-red/10' : 'from-brand-gold-bright/10'} to-transparent opacity-50 rounded-b-2xl pointer-events-none transition-opacity duration-500 ${isCurrent ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-32 border border-white/5 rounded-2xl bg-black/20">
          <Search size={48} className="mx-auto text-gray-600 mb-6" />
          <p className="font-mono text-gray-500 uppercase tracking-widest text-lg">No matching operations found in database.</p>
        </div>
      )}
    </div>
  );
}
