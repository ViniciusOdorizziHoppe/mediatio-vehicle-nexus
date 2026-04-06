export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Gradient orbs */}
      <div
        className="bg-orb bg-orb-blue"
        style={{ width: 600, height: 600, top: '-10%', left: '-5%' }}
      />
      <div
        className="bg-orb bg-orb-purple"
        style={{ width: 500, height: 500, top: '40%', right: '-10%' }}
      />
      <div
        className="bg-orb bg-orb-cyan"
        style={{ width: 400, height: 400, bottom: '-5%', left: '30%' }}
      />
    </div>
  );
}
