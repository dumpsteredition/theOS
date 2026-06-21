export function AmbientOrbs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute left-[-10rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(115,224,169,0.12),_rgba(115,224,169,0)_68%)] blur-2xl" />
      <div className="absolute bottom-[-13rem] right-[-9rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(127,174,255,0.1),_rgba(127,174,255,0)_70%)] blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,9,13,0)_0%,rgba(7,9,13,0.14)_35%,rgba(7,9,13,0.42)_100%)]" />
    </div>
  );
}
