import React from 'react';

export default function MapSkeleton() {
  return (
    <div className="animate-pulse bg-slate-800/50 rounded-lg h-[450px] flex items-center justify-center">
      <p className="text-slate-400 text-sm">Carregando mapa...</p>
    </div>
  );
}
