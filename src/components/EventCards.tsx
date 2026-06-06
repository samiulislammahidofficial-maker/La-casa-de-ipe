import { useState, useEffect } from "react";
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
} from "lucide-react";
import { auth, db } from "../lib/firebaseUtils";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const EVENTS = [
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
  onViewChange?: (view: 'hub' | 'dashboard' | 'quiz' | 'ticket' | 'eventDetails', eventId?: number) => void;
}) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [loadingEvent, setLoadingEvent] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const regQuery = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid),
          );
          const regSnapshot = await getDocs(regQuery);
          const userRegs = regSnapshot.docs.map((doc) => doc.data().eventName);
          setRegistrations(userRegs);
        } catch (error) {
          console.error("Error fetching registrations:", error);
        }
      } else {
        setRegistrations([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async (eventId: number, eventTitle: string) => {
    if (navigator.vibrate) navigator.vibrate(30);

    if (!currentUser) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      if (onLoginRequest) {
        onLoginRequest();
      } else {
        window.dispatchEvent(new CustomEvent("request-login"));
      }
      return;
    }

    setLoadingEvent(eventId);
    try {
      if (registrations.includes(eventTitle)) {
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        if (onRegisterSuccess) onRegisterSuccess(eventId);
        setLoadingEvent(null);
        return;
      }
      await addDoc(collection(db, "registrations"), {
        userId: currentUser.uid,
        eventName: eventTitle,
        timestamp: new Date(),
      });
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      setRegistrations([...registrations, eventTitle]);
      if (onRegisterSuccess) onRegisterSuccess(eventId);
    } catch (error) {
      console.error("Error registering:", error);
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      alert("Failed to register. Access denied.");
    }
    setLoadingEvent(null);
  };

  return (
    <div className="w-full relative mt-16 px-4">
      <div className="flex items-center gap-4 mb-6 max-w-7xl mx-auto px-4 lg:px-8">
        <h2 className="font-display text-2xl uppercase tracking-widest text-white decoration-brand-red decoration-2 underline-offset-8 underline">
          Current Operations
        </h2>
      </div>

      {/* Grid Container */}
      <div className="w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-12 cursor-grab active:cursor-grabbing">
        <div className="flex gap-6 px-4 lg:px-8 w-max mx-auto md:mx-0">
          {EVENTS.map((event, index) => {
            const Icon = event.icon;
            const isRed = index % 2 === 0;
            const colorClass = isRed
              ? "text-brand-red"
              : "text-brand-gold-bright";
            const borderClass = isRed
              ? "border-brand-red/30 hover:border-brand-red"
              : "border-brand-gold-bright/30 hover:border-brand-gold-bright";
            const glowClass = isRed
              ? "hover:shadow-[0_0_20px_rgba(139,0,0,0.4)] hover:-translate-y-2 hover:scale-[1.02] z-0 hover:z-10"
              : "hover:shadow-[0_0_20px_rgba(233,195,73,0.3)] hover:-translate-y-2 hover:scale-[1.02] z-0 hover:z-10";

            const isRegistered = registrations.includes(event.title);

            return (
              <div
                key={event.id}
                className={`snap-center shrink-0 w-[280px] h-[340px] bg-[#1a1a1a]/95 backdrop-blur-xl border ${borderClass} p-6 flex flex-col transition-all duration-300 group ${glowClass} relative overflow-hidden rounded-lg`}
              >
                <div className="flex flex-col h-full relative z-10 w-full">
                  <div className="mb-auto">
                    <Icon
                      size={40}
                      className={`${colorClass} mb-4 transform group-hover:scale-110 transition-transform`}
                    />
                    <h3 className="font-display text-xl text-white uppercase mb-2 min-h-[56px] flex items-center leading-tight">
                      {event.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      onClick={() => onViewChange?.('eventDetails', event.id)}
                      className={`w-full py-2 border border-white/20 text-white hover:bg-white/10 font-mono text-xs uppercase tracking-widest transition-colors shadow-sm`}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRegister(event.id, event.title)}
                      disabled={isRegistered || loadingEvent === event.id}
                      className={`w-full py-2 border ${isRegistered ? "border-brand-red bg-brand-red text-white opacity-50 cursor-not-allowed" : isRed ? "border-brand-red text-brand-red hover:bg-brand-red hover:text-white" : "border-brand-gold-bright text-brand-gold-bright hover:bg-brand-gold-bright hover:text-[#111]"} font-mono text-xs uppercase tracking-widest transition-colors shadow-sm`}
                    >
                      {loadingEvent === event.id
                        ? "Assigning..."
                        : isRegistered
                          ? "Registered"
                          : "Register"}
                    </button>
                  </div>
                </div>

                {/* Minimal tech background element */}
                <div className="absolute top-4 right-4 font-mono text-[10px] text-gray-600 opacity-30 pointer-events-none">
                  #OP-{String(event.id).padStart(3, "0")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
