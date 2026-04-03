export interface ScoreBreakdown {
  label: string;
  met: boolean;
  points: number;
  suggestion?: string;
}

interface ScoreVehicle {
  photo?: string;
  photos?: string[];
  morphEnhanced?: boolean;
  price?: number;
  acceptsTrade?: boolean;
  daysInPipeline?: number;
  brand?: string;
  model?: string;
  [key: string]: any;
}

export function calculateVehicleScore(vehicle: ScoreVehicle): { score: number; breakdown: ScoreBreakdown[] } {
  const breakdown: ScoreBreakdown[] = [];

  const hasPhotos = !!(vehicle.photo || (vehicle.photos && vehicle.photos.length > 0));
  breakdown.push({ label: "Fotos cadastradas", met: hasPhotos, points: hasPhotos ? 20 : 0, suggestion: "Adicione fotos do veículo" });

  const morphEnhanced = !!vehicle.morphEnhanced;
  breakdown.push({ label: "Fotos profissionais com IA", met: morphEnhanced, points: morphEnhanced ? 15 : 0, suggestion: "Use o MORPH para melhorar as fotos" });

  const affordable = (vehicle.price || 0) < 30000;
  breakdown.push({ label: "Preço acessível (< R$ 30.000)", met: affordable, points: affordable ? 15 : 0, suggestion: "Tente reduzir o preço" });

  breakdown.push({ label: "Aceita troca", met: !!vehicle.acceptsTrade, points: vehicle.acceptsTrade ? 10 : 0, suggestion: "Considere aceitar troca" });

  breakdown.push({ label: "Documentação em dia", met: true, points: 15, suggestion: "Regularize a documentação" });

  const days = vehicle.daysInPipeline || 0;
  let dayPoints = 0;
  let dayLabel = "";
  if (days < 10) { dayPoints = 15; dayLabel = "Menos de 10 dias no pipeline"; }
  else if (days <= 20) { dayPoints = 8; dayLabel = "10-20 dias no pipeline"; }
  else { dayPoints = 0; dayLabel = "Mais de 20 dias no pipeline"; }
  breakdown.push({ label: dayLabel, met: dayPoints > 0, points: dayPoints, suggestion: "Atualize o status ou reduza o preço" });

  breakdown.push({ label: "Possui leads registrados", met: false, points: 0, suggestion: "Divulgue o veículo para atrair leads" });

  const score = breakdown.reduce((sum, b) => sum + b.points, 0);
  return { score, breakdown };
}

export function getScoreLabel(score: number): string {
  if (score >= 70) return "Veículo Excelente";
  if (score >= 40) return "Bom Potencial";
  return "Precisa de Atenção";
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}
