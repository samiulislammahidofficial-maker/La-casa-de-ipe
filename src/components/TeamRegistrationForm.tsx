import React, { useState } from "react";
import { Plus, Trash2, Shield, Users } from "lucide-react";
import { User, Team } from "../context/MockStateContext";

interface TeamRegistrationFormProps {
  currentUser: User;
  onSubmit: (teamData: Team) => void;
  loading: boolean;
}

export default function TeamRegistrationForm({
  currentUser,
  onSubmit,
  loading,
}: TeamRegistrationFormProps) {
  const [teamName, setTeamName] = useState("");
  const [leaderUid, setLeaderUid] = useState(currentUser.rollNumber);
  const [teammates, setTeammates] = useState<string[]>([""]); // Starts with 1 teammate (making total members = 2)
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddTeammate = () => {
    if (teammates.length < 4) {
      setTeammates([...teammates, ""]);
      setValidationError(null);
    }
  };

  const handleRemoveTeammate = (index: number) => {
    if (teammates.length > 1) {
      const newTeammates = teammates.filter((_, i) => i !== index);
      setTeammates(newTeammates);
      setValidationError(null);
    }
  };

  const handleTeammateChange = (index: number, val: string) => {
    const newTeammates = [...teammates];
    newTeammates[index] = val.trim();
    setTeammates(newTeammates);
    setValidationError(null);
  };

  const validateForm = (): boolean => {
    if (!teamName.trim()) {
      setValidationError("Team Name is required.");
      return false;
    }
    if (!leaderUid.trim()) {
      setValidationError("Team Leader UID is required.");
      return false;
    }

    // Check all teammates have values
    const filledTeammates = teammates.filter(t => t.trim() !== "");
    if (filledTeammates.length !== teammates.length) {
      setValidationError("All teammate UID fields must be completed.");
      return false;
    }

    // Check for duplicate UIDs
    const allUids = [leaderUid, ...teammates];
    const uniqueUids = new Set(allUids);
    if (uniqueUids.size !== allUids.length) {
      setValidationError("Duplicate Operative IDs (Roll Numbers) detected in the team.");
      return false;
    }

    // Check total count (2 to 5 members)
    const totalCount = allUids.length;
    if (totalCount < 2 || totalCount > 5) {
      setValidationError("Team size must be between 2 and 5 members.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        teamName: teamName.trim(),
        leaderUid: leaderUid.trim(),
        teammateUids: teammates.map(t => t.trim()),
      });
    }
  };

  const totalMembers = 1 + teammates.length;

  return (
    <div className="bg-[#151515]/90 border border-brand-red/30 p-8 md:p-10 rounded-2xl backdrop-blur-2xl shadow-[0_0_50px_rgba(139,0,0,0.15)] max-w-2xl w-full">
      <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
        <div className="p-3 bg-brand-red/10 border border-brand-red/30 rounded text-brand-red">
          <Users size={28} />
        </div>
        <div>
          <h2 className="font-display text-2xl uppercase tracking-wider text-white">
            Team Registration
          </h2>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-0.5">
            Treasure Hunt Operation Cleared
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Name */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">
            Team Name
          </label>
          <input
            type="text"
            placeholder="Enter Team Name (e.g. The Professors)"
            value={teamName}
            onChange={(e) => {
              setTeamName(e.target.value);
              setValidationError(null);
            }}
            className="bg-black/40 border border-white/10 focus:border-brand-red focus:shadow-[0_0_15px_rgba(139,0,0,0.2)] outline-none rounded-lg px-4 py-3 text-white font-mono text-sm transition-all"
            required
          />
        </div>

        {/* Team Leader */}
        <div className="flex flex-col gap-2">
          <label className="font-mono text-xs text-gray-400 uppercase tracking-widest flex items-center justify-between">
            <span>Team Leader UID (Roll Number)</span>
            <span className="text-[10px] text-brand-gold-bright uppercase tracking-normal">Prefilled</span>
          </label>
          <input
            type="text"
            value={leaderUid}
            onChange={(e) => {
              setLeaderUid(e.target.value);
              setValidationError(null);
            }}
            className="bg-black/40 border border-white/10 opacity-70 cursor-not-allowed outline-none rounded-lg px-4 py-3 text-white font-mono text-sm"
            readOnly
          />
        </div>

        {/* Teammates section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-t border-white/5 pt-4">
            <label className="font-mono text-xs text-gray-400 uppercase tracking-widest">
              Teammate UIDs (Roll Numbers)
            </label>
            <span className="font-mono text-xs text-gray-500">
              Total Members: {totalMembers}/5
            </span>
          </div>

          <div className="space-y-3">
            {teammates.map((teammate, index) => (
              <div key={index} className="flex gap-3 items-center">
                <div className="font-mono text-xs text-gray-600 w-6">
                  #{index + 1}
                </div>
                <input
                  type="text"
                  placeholder={`Teammate Roll Number (e.g. 2024-00${index + 2})`}
                  value={teammate}
                  onChange={(e) => handleTeammateChange(index, e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 focus:border-brand-red focus:shadow-[0_0_15px_rgba(139,0,0,0.2)] outline-none rounded-lg px-4 py-3 text-white font-mono text-sm transition-all"
                  required
                />
                {teammates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTeammate(index)}
                    className="p-3 text-gray-500 hover:text-brand-red border border-white/5 hover:border-brand-red/30 rounded-lg hover:bg-brand-red/5 transition-colors"
                    title="Remove teammate"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {teammates.length < 4 && (
            <button
              type="button"
              onClick={handleAddTeammate}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-white/10 hover:border-brand-gold-bright/50 text-gray-400 hover:text-brand-gold-bright font-mono text-xs uppercase tracking-widest transition-all rounded-lg bg-black/10 mt-2"
            >
              <Plus size={14} />
              Add Teammate
            </button>
          )}
        </div>

        {/* Validation Errors */}
        {validationError && (
          <div className="border border-brand-red/30 bg-brand-red/10 p-4 rounded-lg flex items-start gap-3">
            <Shield className="text-brand-red shrink-0 mt-0.5" size={16} />
            <p className="font-mono text-xs text-brand-red-light leading-relaxed">
              {validationError}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 border border-brand-red bg-brand-red text-white hover:bg-red-800 font-display text-xl uppercase tracking-widest transition-colors shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {loading ? "Transmitting..." : "Submit Registration Request"}
        </button>
      </form>
    </div>
  );
}
