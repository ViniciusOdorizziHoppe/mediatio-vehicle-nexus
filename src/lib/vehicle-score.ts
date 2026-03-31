import { Vehicle, leads } from "./mock-data";

export interface ScoreBreakdown {
  label: string;
  met: boolean;
  points: number;
  suggestion?: string;
}

export function calculateVehicleScore(vehicle: Vehicle): { score: number; breakdown: ScoreBreakdown[] } {
  const breakdown: ScoreBreakdown[] = [];

  // Has photos: +20
  const hasPhotos = !!vehicle.photo;
  breakdown.push({ label: "Fotos cadastradas", met: hasPhotos, points: hasPhotos ? 20 : 0, suggestion: "Adicione fotos do veículo" });

  // AI-enhanced: +15
  breakdown.push({ label: "Fotos profissionais com IA", met: vehicle.morphEnhanced, points: vehicle.morphEnhanced ? 15 : 0, suggestion: "Use o MORPH para melhorar as fotos" });

  // Price < 30k: +15
  const affordable = vehicle.price < 30000;
  breakdown.push({ label: "Preço acessível (< R$ 30.000)", met: affordable, points: affordable ? 15 : 0, suggestion: "Tente reduzir o preço" });

  // Accepts trade: +10
  breakdown.push({ label: "Aceita troca", met: vehicle.acceptsTrade, points: vehicle.acceptsTrade ? 10 : 0, suggestion: "Considere aceitar troca" });

  // Documentation: +15
  const hasDoc = true; // assume ok if vehicle exists
  breakdown.push({ label: "Documentação em dia", met: hasDoc, points: hasDoc ? 15 : 0, suggestion: "Regularize a documentação" });

  // Days in pipeline
  let dayPoints = 0;
  let dayLabel = "";
  if (vehicle.daysInPipeline < 10) { dayPoints = 15; dayLabel = "Menos de 10 dias no pipeline"; }
  else if (vehicle.daysInPipeline <= 20) { dayPoints = 8; dayLabel = "10-20 dias no pipeline"; }
  else { dayPoints = 0; dayLabel = "Mais de 20 dias no pipeline"; }
  breakdown.push({ label: dayLabel, met: dayPoints > 0, points: dayPoints, suggestion: "Atualize o status ou reduza o preço" });

  // Has leads: +10
  const vehicleName = `${vehicle.brand} ${vehicle.model}`;
  const hasLeads = leads.some(l => l.vehicleInterest.includes(vehicleName));
  breakdown.push({ label: "Possui leads registrados", met: hasLeads, points: hasLeads ? 10 : 0, suggestion: "Divulgue o veículo para atrair leads" });

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
