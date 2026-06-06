export default function BlueprintReveal() {
  return (
    <div className="absolute inset-0 z-50 schematic-overlay bg-[#111]/95 blueprint-grid rounded-[inherit] flex flex-col justify-between p-3 pointer-events-none">
      <div className="flex justify-between w-full font-mono text-[8px] md:text-[10px] text-brand-gold-bright opacity-90 tracking-widest">
        <span>[X:234 Y:892]</span>
        <span>SYS_REQ: 0x9A</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="w-20 h-20 md:w-28 md:h-28 border border-brand-gold-bright/40 rounded-full flex flex-col items-center justify-center relative">
          <div className="w-[1px] h-[120%] bg-brand-gold-bright/30 absolute"></div>
          <div className="h-[1px] w-[120%] bg-brand-gold-bright/30 absolute"></div>
          
          <div className="absolute inset-2 border border-brand-red border-dashed rounded-full animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute inset-4 border border-brand-gold-bright/20 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
          
          <span className="font-mono text-[8px] md:text-[10px] text-brand-gold-bright absolute bg-[#111] px-1 font-bold z-10 -mt-16">TGT_LOCK</span>
        </div>
      </div>
      
      <div className="flex justify-between w-full font-mono text-[8px] md:text-[10px] text-brand-gold-bright opacity-90 tracking-widest">
        <span>[INIT_SEQ]</span>
        <span>STS: VALID</span>
      </div>
    </div>
  );
}
