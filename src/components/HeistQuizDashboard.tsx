import { useState } from "react";
import { ChevronLeft } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: string[];
}

const CHARACTERS = [
  {
    id: "professor",
    name: "The Professor",
    desc: "Mastermind & Strategy",
    color: "border-brand-red text-brand-red",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    desc: "Assault & Tactics",
    color: "border-brand-gold-bright text-brand-gold-bright",
  },
  {
    id: "berlin",
    name: "Berlin",
    desc: "Leadership & Charisma",
    color: "border-white text-white",
  },
  {
    id: "nairobi",
    name: "Nairobi",
    desc: "Quality Control",
    color: "border-brand-red-light text-brand-red-light",
  },
  {
    id: "denver",
    name: "Denver",
    desc: "Brawn & Loyalty",
    color: "border-blue-500 text-blue-500",
  },
  {
    id: "rio",
    name: "Rio",
    desc: "Cyber & Intel",
    color: "border-green-500 text-green-500",
  },
  {
    id: "helsinki",
    name: "Helsinki",
    desc: "Heavy Support",
    color: "border-gray-400 text-gray-400",
  },
];

const MOCK_QUESTIONS: Record<string, Question[]> = {
  professor: [
    {
      id: 1,
      text: "What is the most crucial element of the Royal Mint heist?",
      options: ["Time", "Weapons", "Money", "Hostages"],
    },
    {
      id: 2,
      text: "Where does the Professor direct the operation from?",
      options: ["A warehouse", "A camper van", "A boat", "An airplane"],
    },
  ],
  tokyo: [
    {
      id: 1,
      text: "What was Tokyo doing before joining the heist?",
      options: [
        "Running from the police",
        "Working at a bank",
        "Serving in the military",
        "Studying medicine",
      ],
    },
    {
      id: 2,
      text: "Who is Tokyo's closest partner during the preparation phase?",
      options: ["Rio", "Denver", "Nairobi", "Berlin"],
    },
  ],
  berlin: [
    {
      id: 1,
      text: "What is Berlin's relationship to the Professor?",
      options: ["Brother", "Friend", "Rival", "Strangers"],
    },
    {
      id: 2,
      text: "How many times has Berlin been married?",
      options: ["Five", "Three", "Once", "Never"],
    },
  ],
  nairobi: [
    {
      id: 1,
      text: "What is Nairobi in charge of at the Royal Mint?",
      options: ["Printing money", "Hostages", "Security", "Communications"],
    },
    {
      id: 2,
      text: "What is Nairobi's primary motivation for the heist?",
      options: [
        "To get her son back",
        "To buy an island",
        "To pay off debts",
        "Thrill of it",
      ],
    },
  ],
  denver: [
    {
      id: 1,
      text: "Who brought Denver into the heist?",
      options: ["Moscow", "The Professor", "Berlin", "Tokyo"],
    },
    {
      id: 2,
      text: "What is Denver's signature trait?",
      options: ["His laugh", "His silence", "His intelligence", "His cooking"],
    },
  ],
  rio: [
    {
      id: 1,
      text: "What is Rio's specialty?",
      options: ["Computers & Alarms", "Explosives", "Negotiation", "Driving"],
    },
    {
      id: 2,
      text: "How old is Rio at the start of the first heist?",
      options: ["20", "25", "18", "30"],
    },
  ],
  helsinki: [
    {
      id: 1,
      text: "Where did Helsinki serve in the military?",
      options: ["Serbia", "Russia", "Spain", "Germany"],
    },
    {
      id: 2,
      text: "Who is Helsinki's partner and cousin?",
      options: ["Oslo", "Bogota", "Marseille", "Palermo"],
    },
  ],
};

export default function HeistQuizDashboard({
  onViewChange,
}: {
  onViewChange?: (v: "hub" | "dashboard") => void;
}) {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  if (selectedChar) {
    const char = CHARACTERS.find((c) => c.id === selectedChar);
    const questions = MOCK_QUESTIONS[selectedChar] || [];

    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 md:px-12 text-white relative z-10">
        <button
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(30);
            setSelectedChar(null);
          }}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-mono uppercase tracking-widest text-sm">
            Return to Roster
          </span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="mb-12 border-b border-white/10 pb-6">
            <h2 className="font-display text-5xl md:text-6xl uppercase tracking-tighter mb-2">
              <span className={char?.color}>{char?.name}</span> Assessment
            </h2>
            <p className="font-mono text-gray-400 uppercase tracking-widest">
              {char?.desc} — 15 Questions
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-[#111] border border-white/5 p-6 rounded-lg"
              >
                <h3 className="font-display text-2xl mb-6">
                  <span className="text-brand-red opacity-50 mr-4 font-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {q.text}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(30);
                      }}
                      className="text-left font-mono text-sm p-4 border border-white/10 rounded hover:border-brand-gold-bright hover:bg-brand-gold-bright/10 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 border border-brand-red/30 bg-brand-red/10 rounded-lg text-center font-mono text-brand-red-light">
            [ MOCKUP ONLY: Full 15 question implementation pending DB
            integration ]
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 md:px-12 text-white relative z-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(30);
            onViewChange?.("hub");
          }}
          className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-mono uppercase tracking-widest text-sm">
            Return to Hub
          </span>
        </button>

        <div className="mb-16">
          <h1 className="font-display text-6xl uppercase tracking-tighter mb-4 border-l-4 border-brand-red pl-6">
            Select Your Operative
          </h1>
          <p className="font-mono text-gray-400 max-w-2xl px-6">
            Choose a character profile to test your aptitude. Your responses
            will determine your suitability for the next phase of the operation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CHARACTERS.map((char) => (
            <div
              key={char.id}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(40);
                setSelectedChar(char.id);
              }}
              className="bg-[#151515] border border-white/5 hover:border-brand-gold hover:-translate-y-2 transition-all duration-300 cursor-pointer p-8 rounded-lg group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div
                className={`font-mono text-xs mb-4 uppercase tracking-widest ${char.color}`}
              >
                [ {char.id} ]
              </div>
              <h3 className="font-display text-4xl uppercase tracking-wider mb-2">
                {char.name}
              </h3>
              <p className="font-mono text-sm text-gray-500 group-hover:text-gray-300 transition-colors">
                {char.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
