#!/usr/bin/env python3
"""
PITCH DE VENDAS — Mediatio para Concessionarias
Apresentacao compacta para convencer donos de loja.

Uso: python pitch.py
"""

import sys
import os
from datetime import datetime

# ============================================================
# DADOS DO APRESENTADOR (personalize aqui)
# ============================================================

APRESENTADOR = {
    "nome": "Vinicius Odorizzi Hoppe",
    "funcao": "Intermediador de Veiculos",
    "regiao": "Alto Vale do Itajai - SC",
    "whatsapp": "47 99627-XXXX",
    "instagram": "@mediatio.veiculos",
    "site": "mediatio-vehicle-nexus.vercel.app",
}

# ============================================================
# ARGUMENTOS DE VENDA
# ============================================================

PROBLEMAS = [
    ("Giro lento", "Tem carro parado ha 60, 90, 120 dias no patio"),
    ("Custo de oportunidade", "Cada carro parado = dinheiro parado. Giro de 30 dias vira 60, 90..."),
    ("Anuncios ruins", "Fotos de celular, descricao generica, sem SEO. Nao converte."),
    ("Zero leads", "Anuncio no Marketplace organico mal chega a 50 visualizacoes."),
    ("Tempo perdido", "Voce/Dono responde WhatsApp, negocia, mostra carro. Desvia do operacional."),
]

SOLUCOES = [
    ("Fotos profissionais", "12 angulos padronizados + edicao. Aumenta 3x os cliques."),
    ("Trafego pago", "Meta Ads segmentado por cidade, renda e interesse. R$15-25/dia por carro."),
    ("CRM proprio", "Sistema que acompanha cada lead: contato -> visita -> proposta -> venda."),
    ("WhatsApp automatizado", "Respostas instantaneas 24h. Lead nao espera, nao some."),
    ("Score do veiculo", "Sistema avalia cada carro: o que melhorar pra vender mais rapido."),
]

RESULTADOS = [
    ("Taxa de conversao", "Organico: 1-2% | Com trafego pago: 5-8%"),
    ("Custo por lead", "Facebook organico: R$0 | Facebook Ads: R$5-12 | OLX: gratis"),
    ("Tempo medio de venda", "Sem otimizacao: 45-90 dias | Com otimizacao: 15-30 dias"),
    ("Valorizacao", "Fotos boas + descricao = +5% a 10% no preco final"),
]

MODELO = [
    ("Zero custo fixo", "Voce nao paga nada. NADA. So comissao quando vender."),
    ("Comissao por resultado", "30% da margem no inicio. Aumenta conforme performa."),
    ("Exclusividade", "Eu cuido do anuncio. Voce so mostra o carro quando eu agendar."),
    ("Sem risco", "Se em 30 dias nao vender, devolvo. Voce nao perdeu 1 centavo."),
]

GATILHOS = [
    ("1 carro. 15 dias.", "Me da 1 carro parado. Se eu nao trouxer comprador em 15 dias, nao deve nada."),
    ("Prova social", "Ja tenho X veiculos anunciados e Y leads ativos na regiao."),
    ("Urgencia", "Quanto mais tempo o carro parado, mais desvaloriza. Cada dia = dinheiro perdido."),
]

# ============================================================
# APRESENTACAO
# ============================================================

def limpar():
    os.system('cls' if sys.platform == 'win32' else 'clear')

def pausa(msg="\n  ENTER para continuar..."):
    input(msg)

def titulo(texto):
    print(f"\n{'='*60}")
    print(f"  {texto}")
    print(f"{'='*60}")

def cartao(titulo_card, itens):
    print(f"\n  ┌─ {titulo_card}")
    for icone, desc in itens:
        print(f"  │  {icone}  {desc}")
    print(f"  └─")

def slide1():
    limpar()
    print(f"""
  ╔══════════════════════════════════════════════╗
  ║                                              ║
  ║        COMO VENDER MAIS CARROS               ║
  ║        SEM GASTAR 1 REAL A MAIS              ║
  ║                                              ║
  ║        {APRESENTADOR['nome']:42s} ║
  ║        {APRESENTADOR['funcao']:42s} ║
  ║        {APRESENTADOR['regiao']:42s} ║
  ║                                              ║
  ╚══════════════════════════════════════════════╝
    """)
    pausa()

def slide2():
    limpar()
    titulo("O PROBLEMA (que toda concessionaria tem)")
    cartao("Conhece isso?", PROBLEMAS)
    print(f"""
  Resumo: carro parado = dinheiro parado.
  Cada dia no patio custa desvalorizacao + IPVA + oportunidade.
  
  Uma concessionaria de 50 carros com giro de 60 dias
  perde ~R$15.000/mes so em depreciacao.
  """)
    pausa()

def slide3():
    limpar()
    titulo("A SOLUCAO (o que eu faco)")
    cartao("Meu trabalho:", SOLUCOES)
    print(f"""
  Enquanto eu cuido dos anuncios e leads,
  voce cuida do que importa: comprar e vender.
  """)
    pausa()

def slide4():
    limpar()
    titulo("RESULTADOS ESPERADOS")
    cartao("Metricas reais de mercado:", RESULTADOS)
    print(f"""
  Um carro de R$60.000 vendido 30 dias mais rapido
  representa R$1.800 a menos em depreciacao.
  
  Multiplique por 10 carros = R$18.000/ANO economizado.
  """)
    pausa()

def slide5():
    limpar()
    titulo("O MODELO (risco zero pra voce)")
    cartao("Como funciona:", MODELO)
    print(f"""
  Exemplo real:
  
  Carro anunciado a R$60.000 — margem de R$5.000
  Eu vendo. Minha comissao: 30% × R$5.000 = R$1.500
  Voce embolsa: R$3.500 (fora o giro do estoque)
  
  Se eu nao vender: voce nao paga nada.
  """)
    pausa()

def slide6():
    limpar()
    titulo("MINHA PROPOSTA")
    cartao("Teste sem compromisso:", GATILHOS)
    print(f"""
  Me da 1 carro. O que estiver parado ha mais tempo.
  
  Em 15 dias eu mostro resultado concreto:
  - Quantos leads gerou
  - Quantas visitas agendou  
  - Se vendeu ou nao
  
  Ai a gente conversa sobre os outros.
  
  {APRESENTADOR['whatsapp']}
  {APRESENTADOR['instagram']}
  {APRESENTADOR['site']}
  """)
    pausa()

def slide_objeções():
    """Slide extra: respostas para objeções comuns."""
    limpar()
    titulo("OBJECOES COMUNS (e minhas respostas)")
    objs = [
        ("'Ja tenho vendedor'", "Otimo! Eu nao substituo ninguem. Eu trago MAIS leads qualificados. Seu vendedor fecha mais."),
        ("'Nao quero dividir margem'", "30% de algo > 100% de nada. Carro parado margem zero."),
        ("'Meus carros vendem sozinhos'", "Entao me empresta 1 que esteja ha mais de 60 dias. Se vender sozinho, nao precisa de mim."),
        ("'So trabalho com indicacao'", "Indicacao + anuncio profissional = mais leads. Um nao exclui o outro."),
        ("'To sem tempo pra testar'", "Voce nao gasta tempo. EU gasto. Voce so aparece pra mostrar o carro quando eu agendar."),
    ]
    for obj, resp in objs:
        print(f"\n  {obj}")
        print(f"  -> {resp}")
    pausa()

# ============================================================
# MENU
# ============================================================

def menu():
    while True:
        limpar()
        print(f"""
  ╔══════════════════════════════════════════╗
  ║     PITCH PARA CONCESSIONARIAS           ║
  ║     {APRESENTADOR['nome']:36s} ║
  ╚══════════════════════════════════════════╝

  [1] Problema (carro parado = prejuizo)
  [2] Solucao (o que eu faco)
  [3] Resultados (metricas)
  [4] Modelo (risco zero)
  [5] Proposta final (1 carro, 15 dias)
  [6] Objecoes (respostas prontas)
  [7] APRESENTACAO COMPLETA (rodar todas)
  [8] Gerar PDF/Texto para WhatsApp
  [0] Sair

        """)
        op = input("  Slide: ").strip()

        if op == "1": slide2()
        elif op == "2": slide3()
        elif op == "3": slide4()
        elif op == "4": slide5()
        elif op == "5": slide6()
        elif op == "6": slide_objeções()
        elif op == "7":
            slide1(); slide2(); slide3(); slide4(); slide5(); slide6()
            print("\n  APRESENTACAO CONCLUIDA!")
            print(f"  Agora e so pedir: 'Me da 1 carro pra testar?'")
            pausa()
        elif op == "8":
            gerar_texto()
        elif op == "0":
            print(f"\n  Boa sorte, {APRESENTADOR['nome'].split()[0]}! Vai la e fecha.")
            break
        else:
            print("  Opcao invalida.")

def gerar_texto():
    """Gera versao texto para WhatsApp."""
    texto = f"""
*COMO VENDER MAIS CARROS SEM GASTAR 1 REAL A MAIS*

Problema: carro parado no patio = dinheiro parado.
Uma loja de 50 carros perde ~R$15.000/mes em depreciacao.

O que eu faco:
• Fotos profissionais (12 angulos)
• Trafego pago segmentado (R$15-25/dia por carro)
• CRM que acompanha lead ate a venda
• WhatsApp 24h

Resultados:
• Conversao: 5-8% (organico: 1-2%)
• Tempo de venda: 15-30 dias (sem otimizar: 45-90)
• Valorizacao: +5-10% no preco final

Modelo: RISCO ZERO
• Voce nao paga nada. So comissao quando vender
• 30% da margem. Vendeu? Paga. Nao vendeu? Nao paga.

PROPOSTA: Me da 1 carro. 15 dias. 
Se eu nao trouxer comprador, nao deve nada.

{APRESENTADOR['whatsapp']}
{APRESENTADOR['instagram']}
    """
    with open("pitch.txt", "w", encoding="utf-8") as f:
        f.write(texto)
    print("\n  Salvo em pitch.txt")
    print("\n" + texto)
    pausa()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--completo":
        slide1(); slide2(); slide3(); slide4(); slide5(); slide6()
        print("\n  FIM DA APRESENTACAO")
    else:
        menu()
