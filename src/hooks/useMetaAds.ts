import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface MetaAd {
  vehicle: string;
  type: 'boosted' | 'turbinado';
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  cpc: number;
  cpm: number;
  reach: number;
  score: number;
}

export interface MetaAdsTotal {
  impressions: number;
  clicks: number;
  spend: number;
}

export interface MetaAdsData {
  ads: MetaAd[];
  total: MetaAdsTotal;
  error?: string;
}

export function useMetaAds() {
  return useQuery<MetaAdsData>({
    queryKey: ['meta-ads'],
    queryFn: async () => {
      const res = await api.get('/meta-ads/insights');
      return res.data || { ads: [], total: { impressions: 0, clicks: 0, spend: 0 } };
    },
    refetchInterval: 300000, // 5 minutos
  });
}
