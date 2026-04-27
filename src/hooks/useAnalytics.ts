import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Vehicle } from '@/hooks/useVehicles';
import type { Lead } from '@/hooks/useLeads';

export interface ComissaoMediaItem {
  nome: string;
  media: number;
}

export interface TempoMedioVendaItem {
  modelo: string;
  diasMedio: number;
}

export interface TopMarcaVendida {
  marca: string;
  totalVendas: number;
}

export interface PipelineFunilItem {
  status: string;
  count: number;
}

export interface ScoreDistribuicaoItem {
  faixa: string;
  count: number;
}

export interface VendasPorMesItem {
  mes: string;
  total: number;
  valor: number;
}

export interface AnalyticsOverview {
  qtdMarcas: number;
  qtdModelos: number;
  valorTotalAnunciado: number;
  comissaoTotalPossivel: number;
  diasDesdeUltimaVenda: number;
  comissaoMediaPorMarca: ComissaoMediaItem[];
  comissaoMediaPorModelo: ComissaoMediaItem[];
  custoMedioPorVenda: number;
  tempoMedioVendaPorModelo: TempoMedioVendaItem[];
  topMarcasMaisVendidas: TopMarcaVendida[];
  pipelineFunil: PipelineFunilItem[];
  scoreMedio: { media: number; distribuicao: ScoreDistribuicaoItem[] };
  vendasPorMes: VendasPorMesItem[];
  ticketMedioVendas: number;
  leadsPorVeiculo: number;
}

interface VehicleListResponse {
  success: boolean;
  data: Vehicle[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface LeadListResponse {
  success: boolean;
  data: Lead[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function computeOverview(vehicles: Vehicle[], leads: Lead[]): AnalyticsOverview {
  const disponiveis = vehicles.filter((v) => v.pipeline.status === 'disponivel');
  const vendidos = vehicles.filter((v) => v.pipeline.status === 'vendido');

  // 1) qtdMarcas
  const qtdMarcas = new Set(disponiveis.map((v) => v.marca)).size;

  // 2) qtdModelos
  const qtdModelos = new Set(disponiveis.map((v) => v.modelo)).size;

  // 3) valorTotalAnunciado
  const valorTotalAnunciado = disponiveis.reduce((s, v) => s + (v.precos.venda || 0), 0);

  // 4) comissaoTotalPossivel
  const comissaoTotalPossivel = disponiveis.reduce((s, v) => s + (v.precos.comissaoEstimada || 0), 0);

  // 5) diasDesdeUltimaVenda
  let diasDesdeUltimaVenda = 0;
  if (vendidos.length > 0) {
    const lastSaleDate = vendidos.reduce((latest, v) => {
      const d = v.pipeline.dataVenda || v.updatedAt;
      return d > latest ? d : latest;
    }, '');
    if (lastSaleDate) {
      diasDesdeUltimaVenda = Math.floor(
        (Date.now() - new Date(lastSaleDate).getTime()) / (1000 * 60 * 60 * 24),
      );
    }
  }

  // 6) comissaoMediaPorMarca
  const comissaoByMarca = new Map<string, { sum: number; count: number }>();
  vehicles.forEach((v) => {
    const c = v.precos.comissaoEstimada || 0;
    if (c > 0) {
      const entry = comissaoByMarca.get(v.marca) || { sum: 0, count: 0 };
      entry.sum += c;
      entry.count += 1;
      comissaoByMarca.set(v.marca, entry);
    }
  });
  const comissaoMediaPorMarca: ComissaoMediaItem[] = Array.from(comissaoByMarca.entries())
    .map(([nome, { sum, count }]) => ({ nome, media: sum / count }))
    .sort((a, b) => b.media - a.media);

  // 7) comissaoMediaPorModelo (top 10)
  const comissaoByModelo = new Map<string, { sum: number; count: number }>();
  vehicles.forEach((v) => {
    const c = v.precos.comissaoEstimada || 0;
    if (c > 0) {
      const entry = comissaoByModelo.get(v.modelo) || { sum: 0, count: 0 };
      entry.sum += c;
      entry.count += 1;
      comissaoByModelo.set(v.modelo, entry);
    }
  });
  const comissaoMediaPorModelo: ComissaoMediaItem[] = Array.from(comissaoByModelo.entries())
    .map(([nome, { sum, count }]) => ({ nome, media: sum / count }))
    .sort((a, b) => b.media - a.media)
    .slice(0, 10);

  // 8) custoMedioPorVenda
  const vendidosComCompra = vendidos.filter((v) => (v.precos.compra || 0) > 0);
  const custoMedioPorVenda =
    vendidosComCompra.length > 0
      ? vendidosComCompra.reduce((s, v) => s + (v.precos.compra || 0), 0) / vendidosComCompra.length
      : 0;

  // 9) tempoMedioVendaPorModelo
  const tempoByModelo = new Map<string, { sum: number; count: number }>();
  vendidos.forEach((v) => {
    const dias = v.pipeline.diasNoPipeline;
    if (dias != null && dias > 0) {
      const entry = tempoByModelo.get(v.modelo) || { sum: 0, count: 0 };
      entry.sum += dias;
      entry.count += 1;
      tempoByModelo.set(v.modelo, entry);
    }
  });
  const tempoMedioVendaPorModelo: TempoMedioVendaItem[] = Array.from(tempoByModelo.entries())
    .map(([modelo, { sum, count }]) => ({ modelo, diasMedio: Math.round(sum / count) }))
    .sort((a, b) => a.diasMedio - b.diasMedio);

  // 10) topMarcasMaisVendidas
  const vendasByMarca = new Map<string, number>();
  vendidos.forEach((v) => {
    vendasByMarca.set(v.marca, (vendasByMarca.get(v.marca) || 0) + 1);
  });
  const topMarcasMaisVendidas: TopMarcaVendida[] = Array.from(vendasByMarca.entries())
    .map(([marca, totalVendas]) => ({ marca, totalVendas }))
    .sort((a, b) => b.totalVendas - a.totalVendas);

  // 11) pipelineFunil
  const statusCount = new Map<string, number>();
  vehicles.forEach((v) => {
    const st = v.pipeline.status;
    statusCount.set(st, (statusCount.get(st) || 0) + 1);
  });
  const statusOrder = ['disponivel', 'contato_ativo', 'proposta', 'vendido', 'arquivado'];
  const pipelineFunil: PipelineFunilItem[] = statusOrder
    .filter((st) => statusCount.has(st))
    .map((status) => ({ status, count: statusCount.get(status) || 0 }));

  // 12) scoreMedio
  const vehiclesWithScore = vehicles.filter((v) => v.score && v.score.valor > 0);
  const scoreMedia =
    vehiclesWithScore.length > 0
      ? vehiclesWithScore.reduce((s, v) => s + (v.score?.valor || 0), 0) / vehiclesWithScore.length
      : 0;
  const scoreBuckets = new Map<string, number>();
  vehiclesWithScore.forEach((v) => {
    const val = v.score?.valor || 0;
    let faixa: string;
    if (val >= 80) faixa = '80-100';
    else if (val >= 60) faixa = '60-79';
    else if (val >= 40) faixa = '40-59';
    else faixa = '0-39';
    scoreBuckets.set(faixa, (scoreBuckets.get(faixa) || 0) + 1);
  });
  const distribuicao: ScoreDistribuicaoItem[] = ['0-39', '40-59', '60-79', '80-100']
    .filter((f) => scoreBuckets.has(f))
    .map((faixa) => ({ faixa, count: scoreBuckets.get(faixa) || 0 }));

  // 13) vendasPorMes (last 12 months)
  const now = new Date();
  const vendasMap = new Map<string, { total: number; valor: number }>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${MONTH_NAMES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    vendasMap.set(key, { total: 0, valor: 0 });
  }
  vendidos.forEach((v) => {
    const dateStr = v.pipeline.dataVenda || v.updatedAt;
    const d = new Date(dateStr);
    const key = `${MONTH_NAMES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`;
    const entry = vendasMap.get(key);
    if (entry) {
      entry.total += 1;
      entry.valor += v.precos.venda || 0;
    }
  });
  const vendasPorMes: VendasPorMesItem[] = Array.from(vendasMap.entries()).map(
    ([mes, { total, valor }]) => ({ mes, total, valor }),
  );

  // 14) ticketMedioVendas
  const ticketMedioVendas =
    vendidos.length > 0
      ? vendidos.reduce((s, v) => s + (v.precos.venda || 0), 0) / vendidos.length
      : 0;

  // 15) leadsPorVeiculo
  const leadsPorVeiculo = vehicles.length > 0 ? leads.length / vehicles.length : 0;

  return {
    qtdMarcas,
    qtdModelos,
    valorTotalAnunciado,
    comissaoTotalPossivel,
    diasDesdeUltimaVenda,
    comissaoMediaPorMarca,
    comissaoMediaPorModelo,
    custoMedioPorVenda,
    tempoMedioVendaPorModelo,
    topMarcasMaisVendidas,
    pipelineFunil,
    scoreMedio: { media: scoreMedia, distribuicao: distribuicao },
    vendasPorMes,
    ticketMedioVendas,
    leadsPorVeiculo,
  };
}

export function useAnalyticsOverview() {
  const { data: vehiclesRes, isLoading: loadingVehicles } = useQuery<VehicleListResponse>({
    queryKey: ['vehicles-analytics'],
    queryFn: () => api.get('/vehicles?limit=9999'),
  });

  const { data: leadsRes, isLoading: loadingLeads } = useQuery<LeadListResponse>({
    queryKey: ['leads-analytics'],
    queryFn: () => api.get('/leads?limit=9999'),
  });

  const overview = useMemo(() => {
    const vehicles = vehiclesRes?.data || [];
    const leads = leadsRes?.data || [];
    return computeOverview(vehicles, leads);
  }, [vehiclesRes, leadsRes]);

  return {
    data: overview,
    isLoading: loadingVehicles || loadingLeads,
  };
}
