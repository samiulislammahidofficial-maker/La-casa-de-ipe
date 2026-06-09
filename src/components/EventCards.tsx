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
    id: 999,
    title: "Treasure Hunt Temporary",
    icon: Map,
    targetDate: null,
    desc: "A temporary mock event to test the new mock authentication and registration approval pipeline. Target acquisition and asset extraction is pending admin clearance.",
  },
  {
    id: 1,
    title: "Treasure Hunt",
    icon: Map,
    targetDate: null,
    desc: "This is an exciting adventure where participants solve clues, decode puzzles, and navigate through various checkpoints to find the final treasure. It tests teamwork, observation skills, logical thinking, and the ability to perform under pressure. This is the most high energy, high participation event of the reception where observation and extensive movement in the campus is a must, ensuring multiple touch points for sponsor branding.",
  },
  {
    id: 2,
    title: "BizComp",
    icon: Briefcase,
    targetDate: "2026-07-26T12:00:00Z",
    desc: "It is a two round case competition designed to mentor freshers for future national-level contests. 20 teams will solve a case, submit a pitch deck and work under guidance from assigned mentors. 7 finalist teams will represent their idea in front of our respective judging panel consisting of renowned industrialists, competing for a lucrative prize pool. Use of Al is strictly prohibited. This is a competitive platform for aspiring entrepreneurs and strategic thinkers to showcase their business ideas, problem-solving skills, and presentation abilities. Participants analyze challenges, develop innovative solutions, and pitch their concepts to judges.",
  },
  {
    id: 3,
    title: "Integration Bee",
    icon: Target,
    targetDate: "2026-07-10T20:00:00Z",
    desc: "This is an engaging mathematics competition centered on integration and problem-solving techniques. Participants compete to solve calculus-based questions quickly and accurately, showcasing their analytical thinking, speed, and creativity in math.",
  },
  {
    id: 4,
    title: "Tug of War",
    icon: Anchor,
    targetDate: "2026-07-11T13:00:00Z",
    desc: "This is a classic team sport that highlights strength, coordination, unity, and strategy. Teams face off by pulling on opposite ends of a rope, creating a fun and energetic event that emphasizes teamwork and determination.",
  },
  {
    id: 5,
    title: "Case Competition Seminar",
    icon: Presentation,
    targetDate: "2026-07-24T15:00:00Z",
    desc: "A knowledge sharing session on case competition, to help participants learn problem solving frameworks, presentation skills and strategic thinking skills. The seminar teaches students to analyse real-world business problems and come up with effective solutions. This interactive segment will remove any kind of confusion and fear from the students who want to explore the world of business, leadership and entrepreneurship. Top teams in Bangladesh, who have shown extra-ordinary success in national level bizcomps will be present to mentor the students. As this requires participation of different batches and universities, it will be a great opportunity for the sponsors to promote themselves.",
  },
  {
    id: 6,
    title: "Debate Tournament",
    icon: Mic,
    targetDate: "2026-07-16T12:00:00Z",
    desc: "An argument where people give reasons, support ideas and oppose the opinions of others on a variety of subjects. The competition teaches public speaking, critical thinking, confidence and persuasive communication under pressure.",
  },
  {
    id: 7,
    title: "Chess Tournament",
    icon: Crown,
    targetDate: "2026-07-23T12:00:00Z",
    desc: "A mental sport of strategy that tests intelligence, patience and decision-making skills. Players try to checkmate by carefully planning their moves, anticipating their opponents' strategies and applying logic and concentration.",
  },
  {
    id: 8,
    title: "FIFA",
    icon: Trophy,
    targetDate: "2026-07-23T14:30:00Z",
    desc: "A football-themed esports tournament where players demonstrate their football prowess on a virtual stage through competitive gaming and strategic gameplay. The tournament offers a mixture of excitement, strategy and high-octane action in the digital football arena.",
  },
  {
    id: 9,
    title: "PES",
    icon: Gamepad2,
    targetDate: "2026-07-19T20:00:00Z",
    desc: "A fun football gaming contest where players compete with realistic gameplay, teamwork, and strategic control to outplay opponents. PES tests players' reflexes, coordination and ability to manage the game.",
  },
  {
    id: 10,
    title: "Soccer (Football)",
    icon: Activity,
    targetDate: "2026-07-25T07:00:00Z",
    desc: "A high-energy team sport that combines speed, coordination, teamwork, and competitive spirit. On the field, teams compete to score goals and demonstrate skill, stamina and sportsmanship.",
  },
  {
    id: 11,
    title: "UNO",
    icon: Layers,
    targetDate: "2026-07-24T15:00:00Z",
    desc: "A fast-paced and fun competition of card games filled with excitement, unexpected turns and strategy. Players must think fast, play their action cards wisely and be the first to get rid of all their cards.",
  },
  {
    id: 12,
    title: "Card 29",
    icon: Hash,
    targetDate: "2026-07-24T17:00:00Z",
    desc: "A popular trick taking card game that requires sharp memory, teamwork and strategic planning. The teams play against each other, making calculated moves and bids to outwit their opponents and win.",
  },
  {
    id: 13,
    title: "Ludo",
    icon: Dices,
    targetDate: "2026-08-20T22:00:00Z",
    desc: "A classic board game competition of luck, strategy and fun. Players race to advance their tokens over the board, using clever strategies to beat opponents and win.",
  },
  {
    id: 14,
    title: "Musical Chairs",
    icon: Music,
    targetDate: "2026-08-20T22:00:00Z",
    desc: "A fun and entertaining game where players compete for chairs while music is playing, then suddenly stops. The event brings excitement, laughter and quick reactions in a fun atmosphere.",
  },
  {
    id: 15,
    title: "Pillow Passing",
    icon: Star,
    targetDate: "2026-08-20T22:00:00Z",
    desc: "A fun party game where players pass a pillow around while music is playing and the suspense and fun increases when the music stops. The game encourages interaction, fun and energetic participation.",
  },
  {
    id: 17,
    title: "Mortal Kombat",
    icon: Crosshair,
    targetDate: "2026-08-06T14:30:00Z",
    desc: "A high-energy gaming tournament in which players compete against each other with strong characters, special moves and fast reflexes. The contest is a fierce virtual arena testing timing, strategy and combat skills.",
  },
  {
    id: 18,
    title: "Elonti Belonti",
    icon: Star,
    targetDate: null,
    desc: "A fun old-fashioned game that encourages players to laugh, get excited, and have some good-natured competition. This event promotes presence of mind, quick responses and active participation in an energetic atmosphere.",
  },
  {
    id: 19,
    title: "Table Tennis",
    icon: Swords,
    targetDate: "2026-08-07T22:00:00Z",
    desc: "A fast indoor game that tests your reflexes, your precision and your concentration. Players participate in exciting matches that demand speed, strategy and quick hand-eye coordination to outsmart their opponents.",
  },
  {
    id: 20,
    title: "Ospi",
    icon: Eye,
    targetDate: "2026-08-06T17:00:00Z",
    desc: "A dynamic, team-oriented and entertaining interactive game. Participants compete in exciting rounds, challenging their communication, coordination and quick thinking skills under pressure.",
  },
  {
    id: 21,
    title: "Guess the Song or Movie",
    icon: Film,
    targetDate: "2026-08-06T13:00:00Z",
    desc: "A fun contest where contestants guess movies or songs from short clips, dialogues, tunes or hints. The event is a fun and engaging way to test memory, pop culture knowledge and quick thinking.",
  },
  {
    id: 22,
    title: "Quiz: Football",
    icon: Trophy,
    targetDate: "2026-08-05T13:00:00Z",
    desc: "A knowledge based competition designed to test the understanding of football enthusiasts in players, clubs, tournaments, records and iconic football moments. Players battle it out in fun-filled rounds of trivia and challenges.",
  },
  {
    id: 23,
    title: "Quiz on Sirat",
    icon: Radio,
    targetDate: "2026-08-04T13:00:00Z",
    desc: "An informative and inspiring quiz competition on the life, teachings and history of Prophet Muhammad (PBUH) The event is geared towards learning, reflection and the enrichment of Islamic knowledge in an engaging format.",
  },
  {
    id: 24,
    title: "Type Racing",
    icon: Keyboard,
    targetDate: "2026-08-11T22:00:00Z",
    desc: "A contest where people compete to type as accurately and quickly as they can within a set amount of time. The event tests typing speed, concentration and efficiency in a competitive and exciting environment and inspires the students to enrich required skills.",
  },
  {
    id: 25,
    title: "Photography Competition",
    icon: Camera,
    targetDate: null,
    desc: "A creative event where participants make photographs of meaningful, artistic and visually striking moments. The competition celebrates creativity, storytelling, technical skills and unique perspectives.",
  },
  {
    id: 26,
    title: "Memes Competition",
    icon: Laugh,
    targetDate: null,
    desc: "A funny and creative contest where users create memes on different themes, trends or situations. The contest celebrates the ability to be original, clever and entertaining with digital creativity.",
  },
  {
    id: 27,
    title: "Art Contest",
    icon: Palette,
    targetDate: null,
    desc: "A stage for artists to show their imagination, creativity and artistic talent through drawings, paintings or other visual artworks. Lively creative atmosphere where participants express their ideas and feelings. It is a fine stage for the hidden artists within the future engineers to showcase their creativity.",
  },
  {
    id: 28,
    title: "Cultural Event (The Grand Finale)",
    icon: Activity,
    targetDate: "2026-08-26T16:00:00Z",
    desc: "A vibrant festival of talent, tradition and creativity with performances including music, dance, drama and creative art performances from the students. It also hosts the award ceremony for all competitions, ensuring that winners, faculty and participants are gathered in one place. The event is an opportunity for participants to express culture, entertainment and unity on stage. As the most photographed and shared part of the reception, Culural Night offers peak exposure for sponsors on stage, screens, and social media recaps.",
  },
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
