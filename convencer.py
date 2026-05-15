#!/usr/bin/env python3
"""
CONVENCER CONCESSIONARIA — Um script, uma mensagem.
Gera o texto pronto pra colar no WhatsApp do dono da loja.

Uso: python convencer.py
     python convencer.py --wilson
     python convencer.py --tarik
"""

# Dados — preenche com teus dados reais
SEUS_DADOS = {
    "nome": "Vinicius Odorizzi Hoppe",
    "funcao": "Intermediador de Veiculos",
    "regiao": "Alto Vale do Itajai - SC",
    "whatsapp": "47 99627-XXXX",
    "site": "mediatio-vehicle-nexus.vercel.app",
}

# Mensagem base
TEXTO = """Ola {dono}! Tudo bem?

Sou {nome}, intermediador de veiculos aqui no {regiao}. 
Acompanho o trabalho de voces e sei que tem carro de qualidade.

{gancho}

Como funciona:
- EU faco as fotos profissionais (12 angulos, editadas)
- EU rodo trafego pago no Facebook/Instagram (R$15-25/dia por carro)
- EU respondo leads e agendo visitas
- VOCE so mostra o carro quando eu agendar
- ZERO custo fixo. So paga comissao quando vender

Proposta: me da 1 carro. O que estiver parado ha mais tempo.
15 dias. Se eu nao trouxer comprador, nao deve nada.

{borda}
{whatsapp}
{site}
"""

GANCHOS = {
    "padrao": "Quero te propor uma parceria sem risco: eu vendo teus carros parados e a gente divide a margem. Voce nao gasta 1 real a mais.",
    "wilson": "Wilson, 20 anos de empresa, estoque forte. Imagina o giro desses 50 carros acelerado com anuncio profissional. Te proponho um teste com 1 carro, sem compromisso.",
    "tarik": "Tarik, teu estoque e premium. Meu negocio e criar conteudo de qualidade — video, Reels, trafego pago segmentado pra classe A/B. Testa com 1 carro.",
    "loja_grande": "Com {qtd} carros no patio, se a gente acelerar o giro em 30 dias, sao R${valor:,} a mais no caixa. Me da 1 pra testar.",
    "loja_pequena": "Sei que cada venda faz diferenca. Me deixa testar com 1 carro — se vender rapido, a gente expande.",
}

def gerar(dono="", loja="padrao", qtd=0, valor=0):
    gancho = GANCHOS.get(loja, GANCHOS["padrao"]).format(qtd=qtd, valor=f"{valor:,.0f}".replace(",", "."))
    return TEXTO.format(
        dono=dono or "amigo(a)",
        nome=SEUS_DADOS["nome"],
        funcao=SEUS_DADOS["funcao"],
        regiao=SEUS_DADOS["regiao"],
        whatsapp=SEUS_DADOS["whatsapp"],
        site=SEUS_DADOS["site"],
        gancho=gancho,
        borda="=" * 40,
    )

if __name__ == "__main__":
    import sys
    
    dono = ""
    loja = "padrao"
    
    for arg in sys.argv[1:]:
        if arg.startswith("--dono="):
            dono = arg.split("=", 1)[1]
        elif arg == "--wilson":
            dono = "Wilson"
            loja = "wilson"
        elif arg == "--tarik":
            dono = "Tarik"
            loja = "tarik"
    
    if not dono:
        dono = input("Nome do dono da loja: ").strip() or "amigo(a)"
    
    print()
    print(gerar(dono, loja))
    print()
    
    # Salva para copiar
    with open("convencer.txt", "w", encoding="utf-8") as f:
        f.write(gerar(dono, loja))
    
    print("(salvo em convencer.txt — so copiar e colar no WhatsApp)")
