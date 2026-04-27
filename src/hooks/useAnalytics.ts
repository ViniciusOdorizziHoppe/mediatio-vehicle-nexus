import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

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

interface OverviewResponse {
  success: boolean;
  data: AnalyticsOverview;
}

export function useAnalyticsOverview() {
  return useQuery<OverviewResponse>({
    queryKey: ['analytics-overview'],
    queryFn: () => api.get('/analytics/overview'),
  });
}
