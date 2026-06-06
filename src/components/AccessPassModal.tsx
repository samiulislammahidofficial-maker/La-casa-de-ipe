import { Lock, Navigation } from 'lucide-react';

export default function AccessPassModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-[#111] border border-white/10 rounded-sm overflow-hidden flex flex-col glow-gold shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-[#ccab45] py-4 px-6 text-center">
          <h2 className="font-display text-2xl text-black uppercase tracking-wider">Official Access Pass</h2>
        </div>

        {/* Details */}
        <div className="p-8 relative">
          
          {/* Faint background watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
            <span className="font-display text-[150px] -rotate-45 whitespace-nowrap">CONFIDENTIAL</span>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10 mb-8">
            <div>
              <p className="font-mono text-[10px] text-gray-400 mb-1">OPERATIVE</p>
              <p className="font-display text-2xl text-white tracking-widest">DENVER</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-gray-400 mb-1">ID TAG</p>
              <p className="font-display text-2xl text-[#ccab45]">2508001</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-gray-400 mb-1">DIVISION</p>
              <p className="font-display text-2xl text-white tracking-widest">IPE</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-gray-400 mb-1">COHORT</p>
              <p className="font-display text-2xl text-white tracking-widest">25</p>
            </div>
          </div>

          <div className="text-center relative z-10 border-t border-b border-dashed border-white/20 py-6 mb-8">
            <p className="font-mono text-[10px] text-brand-gold-bright mb-1 tracking-widest">TARGET OPERATION</p>
            <p className="font-display text-4xl text-brand-red-light leading-none">OPERATION:<br/>ALGORITHM</p>
          </div>

          {/* QR placeholder */}
          <div className="flex justify-center relative z-10 mb-6">
            <div className="w-32 h-32 bg-white/5 border border-white/20 p-2 flex items-center justify-center relative">
               <div className="w-full h-full border border-white/20 grid grid-cols-4 grid-rows-4 gap-1 p-1">
                 {/* Fake data blocks */}
                 {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={`bg-white/${Math.floor(Math.random() * 80) + 10}`}></div>
                 ))}
               </div>
               
               {/* Stamp */}
               <div className="absolute -bottom-4 -right-8 -rotate-12 border-2 border-red-700 text-red-700 font-display text-xl px-2 py-1 bg-black/80 backdrop-blur-sm shadow-xl">
                 ROYAL MINT <br/> PROTOCOL
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/5 border-t border-white/10 p-3 text-center">
          <p className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">This pass is non-transferable. Property of the resistance.</p>
        </div>
        
        {/* Close button top right */}
        <button onClick={onClose} className="absolute top-4 right-4 text-black hover:text-white transition-colors">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
}
