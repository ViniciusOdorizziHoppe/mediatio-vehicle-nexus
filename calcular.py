#!/usr/bin/env python3
"""
CALCULADORA DE CUSTO DE VENDA — Mediatio
Simula campanhas de teste, custos por lead, visitas e vendas.

Uso: python calcular.py
"""

def calcular_custo_venda(spread, preco_venda, tem_fotos=True, tem_video=False, cidade="Rio do Sul"):
    """Calcula o custo estimado ate a venda com campanhas de trafego pago."""
    
    # Benchmarks por faixa de preco (dados reais de mercado BR 2025-2026)
    if preco_venda <= 40000:
        cpl_base = 4.0      # Carro popular: CPL mais baixo (mais procura)
        taxa_lead_visita = 0.20
        taxa_visita_venda = 0.35
        orcamento_diario = 10
    elif preco_venda <= 80000:
        cpl_base = 6.0      # Faixa media
        taxa_lead_visita = 0.18
        taxa_visita_venda = 0.30
        orcamento_diario = 20
    elif preco_venda <= 150000:
        cpl_base = 8.0      # Premium: CPL mais alto (publico menor)
        taxa_lead_visita = 0.15
        taxa_visita_venda = 0.25
        orcamento_diario = 40
    else:
        cpl_base = 12.0     # Luxo
        taxa_lead_visita = 0.10
        taxa_visita_venda = 0.20
        orcamento_diario = 60
    
    # Ajustes por qualidade do anuncio
    fator_fotos = 0.7 if not tem_fotos else 1.0    # Sem fotos = CPL 40% maior
    fator_video = 0.6 if tem_video else 1.0         # Com video = CPL 40% menor
    fator_cidade = 1.3 if "Blumenau" in cidade else 1.0  # Cidade grande = mais concorrencia
    
    cpl_real = cpl_base * fator_fotos * fator_video * fator_cidade
    
    # Fases de campanha
    fases = []
    
    # Fase 1: Teste (5 dias)
    dias_teste = 5
    gasto_teste = orcamento_diario * dias_teste
    leads_teste = gasto_teste / cpl_real
    visitas_teste = leads_teste * taxa_lead_visita
    vendas_teste = visitas_teste * taxa_visita_venda
    fases.append({
        "nome": "Fase 1: Teste (5 dias)",
        "dias": dias_teste,
        "orcamento_diario": orcamento_diario,
        "gasto_total": gasto_teste,
        "cpl": cpl_real,
        "leads": leads_teste,
        "visitas": visitas_teste,
        "vendas": vendas_teste,
    })
    
    # Fase 2: Otimizacao (7 dias) — se CPL < R$10
    if cpl_real < 10:
        orcamento_otim = int(orcamento_diario * 2)
        dias_otim = 7
        gasto_otim = orcamento_otim * dias_otim
        leads_otim = gasto_otim / cpl_real
        visitas_otim = leads_otim * taxa_lead_visita
        vendas_otim = visitas_otim * taxa_visita_venda
        fases.append({
            "nome": "Fase 2: Otimizacao (7 dias)",
            "dias": dias_otim,
            "orcamento_diario": orcamento_otim,
            "gasto_total": gasto_otim,
            "cpl": cpl_real,
            "leads": leads_otim,
            "visitas": visitas_otim,
            "vendas": vendas_otim,
        })
    
    # Fase 3: Escala (ate vender) — se vendeu na fase 2
    if fases[-1]["vendas"] >= 0.5:
        orcamento_escala = int(orcamento_diario * 4)
        # Assume que vende em 10 dias nessa fase
        dias_escala = 10
        gasto_escala = orcamento_escala * dias_escala
        fases.append({
            "nome": "Fase 3: Escala (ate vender)",
            "dias": dias_escala,
            "orcamento_diario": orcamento_escala,
            "gasto_total": gasto_escala,
            "cpl": cpl_real * 1.3,  # CPL sobe 30% na escala
            "leads": gasto_escala / (cpl_real * 1.3),
            "visitas": (gasto_escala / (cpl_real * 1.3)) * taxa_lead_visita,
            "vendas": 1.0,  # Assume que vende 1
        })
    
    # Totais
    custo_total = sum(f["gasto_total"] for f in fases)
    vendas_total = sum(f["vendas"] for f in fases)
    roi = (spread * vendas_total) / custo_total if custo_total > 0 else 0
    custo_por_venda = custo_total / vendas_total if vendas_total > 0 else 0
    percentual_spread = (custo_por_venda / spread * 100) if spread > 0 else 0
    
    return {
        "cpl_estimado": cpl_real,
        "fases": fases,
        "custo_total": custo_total,
        "vendas_estimadas": vendas_total,
        "roi": roi,
        "custo_por_venda": custo_por_venda,
        "percentual_spread": percentual_spread,
        "spread": spread,
    }


def imprimir_relatorio(veiculo, resultado):
    print(f"\n{'='*70}")
    print(f"  SIMULACAO DE CAMPANHA: {veiculo}")
    print(f"{'='*70}")
    print(f"  Spread: R$ {resultado['spread']:,.0f}")
    print(f"  CPL Estimado: R$ {resultado['cpl_estimado']:.2f}")
    print()
    
    for f in resultado["fases"]:
        print(f"  {f['nome']}")
        print(f"    Orcamento: R${f['orcamento_diario']}/dia x {f['dias']}d = R$ {f['gasto_total']:,.0f}")
        print(f"    Leads estimados: {f['leads']:.1f} | Visitas: {f['visitas']:.1f} | Vendas: {f['vendas']:.1f}")
        print()
    
    print(f"  {'='*50}")
    print(f"  CUSTO TOTAL ESTIMADO: R$ {resultado['custo_total']:,.0f}")
    print(f"  VENDAS ESTIMADAS: {resultado['vendas_estimadas']:.1f}")
    print(f"  CUSTO POR VENDA: R$ {resultado['custo_por_venda']:,.0f}")
    print(f"  % DO SPREAD: {resultado['percentual_spread']:.1f}%")
    print(f"  ROI: {resultado['roi']:.1f}x")
    
    if resultado['percentual_spread'] <= 20:
        print(f"\n  VEREDITO: INVISTA! Custo de anuncio e apenas {resultado['percentual_spread']:.0f}% do spread.")
    elif resultado['percentual_spread'] <= 35:
        print(f"\n  VEREDITO: VIAVEL. Otimize o criativo para reduzir CPL.")
    else:
        print(f"\n  VEREDITO: ARRISCADO. Custo muito alto vs spread. Melhore fotos/video primeiro.")


# ============================================================
# SIMULACAO COM DADOS REAIS DO MEDIATIO
# ============================================================

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════╗
    ║   CALCULADORA DE CUSTO DE VENDA             ║
    ║   Simula campanhas de trafego pago          ║
    ╚══════════════════════════════════════════════╝
    """)
    
    # Portfolio real do Mediatio (15/05/2026)
    portfolio = [
        ("Amarok 2018", 130000, 10000, False, False, "Presidente Getulio"),
        ("Strada 2023", 97000, 9000, False, False, "Rio do Sul"),
        ("Polo 2018", 76000, 8000, False, False, "Rio do Sul"),
        ("Renegade 2018", 75000, 6100, False, False, "Rio do Sul"),
        ("Fox 2021", 70000, 5500, False, False, "Presidente Getulio"),
        ("Up 2017", 54000, 5000, False, False, "Blumenau"),
        ("Civic 2020", 150000, 5000, True, False, "Blumenau"),
        ("Astra 2009", 37000, 4000, False, False, "Rio do Sul"),
        ("Voyage 2013", 32000, 2000, False, False, "Dona Emma"),
        ("CB300R 2010", 14000, 1500, True, False, "Rio do Sul"),
    ]
    
    print("  SIMULANDO CAMPANHAS PARA O PORTFOLIO ATUAL...")
    print()
    
    for nome, preco, spread, fotos, video, cidade in portfolio:
        r = calcular_custo_venda(spread, preco, fotos, video, cidade)
        
        # So mostra se o spread justificar
        if spread >= 2000:
            print(f"  {nome:<20} | Spread R${spread:>6,.0f} | CPL R${r['cpl_estimado']:.0f} | Custo venda R${r['custo_por_venda']:>6,.0f} | ROI {r['roi']:.1f}x | {'INVISTA' if r['percentual_spread']<=20 else 'VIAVEL' if r['percentual_spread']<=35 else 'MELHORE FOTOS'}")
        else:
            print(f"  {nome:<20} | Spread R${spread:>6,.0f} | Spread muito baixo — nao compensa anuncio pago")
    
    print()
    print("=" * 70)
    print("  RESUMO: MODELOS DE CAMPANHA TESTE")
    print("=" * 70)
    print("""
    FASE 1 — TESTE (5 dias, R$10-60/dia)
      Objetivo: Descobrir CPL real do veiculo
      Gasto max: R$50-300
      OK se: CPL < R$10
      
    FASE 2 — OTIMIZACAO (7 dias, R$20-120/dia)  
      Objetivo: Gerar leads e primeiras visitas
      Gasto max: R$140-840
      OK se: Pelo menos 1 visita agendada
      
    FASE 3 — ESCALA (10+ dias, R$40-240/dia)
      Objetivo: Vender o veiculo
      Gasto max: R$400-2400
      OK se: Venda concretizada
      
    REGRA DE OURO: Nunca gaste > 20% do spread na Fase 1.
    Se CPL > R$15 na Fase 1: PARE. Refaca fotos e video.
    """)
