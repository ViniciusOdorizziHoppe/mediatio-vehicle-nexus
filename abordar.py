#!/usr/bin/env python3
"""
GERADOR DE ABORDAGEM — Mediatio
Cole a URL do anuncio, veja os dados, gere a mensagem.
Sem menu, sem complexidade.

Uso: python abordar.py
     python abordar.py --url "https://www.facebook.com/marketplace/item/123"
"""

import sys
import os
import re
import webbrowser

# ============================================================
# ROTEIROS PADRAO (voce adapta)
# ============================================================

ROTEIRO_WHATSAPP = """Ola {nome}! Tudo bem?

Sou intermediador de veiculos aqui no Alto Vale. Vi seu {marca} {modelo} {ano} no Marketplace e tenho clientes procurando esse perfil.

O carro ainda ta vendendo? Me fala um pouco: doc em dia? Aceita troca? Qual o minimo que faz?

{pergunta_personalizada}

Fico no aguardo!""" 

ROTEIRO_FACEBOOK = """Ola! Vi seu anuncio do {marca} {modelo} {ano}.

Trabalho com intermediação de veículos na região — tenho compradores certos pra esse modelo. Se ainda estiver disponível, me chama no WhatsApp: 47 99627-XXXX""" 

ROTEIRO_LIGACAO = """Script para ligação:

1. "Ola {nome}, aqui e o Vinicius, intermediador de veiculos"
2. "Vi seu {marca} {modelo} {ano} anunciado"
3. "To com cliente interessado nesse perfil, pagamento a vista"
4. "O carro ta com documentacao em dia?"
5. "Qual o minimo que voce faz no dinheiro?"
6. "Posso ir ver o carro hoje/tarde?"""

# ============================================================
# FUNCOES
# ============================================================

def limpar_numero(texto):
    return re.sub(r'\D', '', texto)

def formatar_preco(valor):
    return f"R$ {valor:,.0f}".replace(",", "X").replace(".", ",").replace("X", ".")

def gerar_mensagem(dados, template="whatsapp"):
    """Preenche o template com os dados do veiculo."""
    templates = {
        "whatsapp": ROTEIRO_WHATSAPP,
        "facebook": ROTEIRO_FACEBOOK,
        "ligacao": ROTEIRO_LIGACAO,
    }
    texto = templates.get(template, ROTEIRO_WHATSAPP)
    
    # Pergunta personalizada conforme faixa de preco
    preco = dados.get("preco", 0)
    if preco <= 35000:
        pergunta = "Ah, e o carro tem algum detalhe pra fazer? (pneu, revisao, estetica)"
    elif preco <= 70000:
        pergunta = "Tem manual, chave reserva e historico de revisao?"
    else:
        pergunta = "O carro tem laudo cautelar aprovado? Unico dono?"
    
    return texto.format(
        nome=dados.get("nome", "amigo(a)"),
        marca=dados.get("marca", "______"),
        modelo=dados.get("modelo", "______"),
        ano=dados.get("ano", "____"),
        preco=formatar_preco(preco) if preco else "R$ ______",
        km=f"{dados.get('km', 0):,}".replace(",", ".") if dados.get("km") else "______",
        cor=dados.get("cor", "______"),
        cidade=dados.get("cidade", "______"),
        pergunta_personalizada=pergunta,
    )

def abrir_whatsapp(numero, mensagem):
    """Abre WhatsApp Web com mensagem."""
    num = limpar_numero(numero)
    if not num:
        print("\n  (!) WhatsApp nao informado. Copie a mensagem manualmente.")
        return
    
    from urllib.parse import quote
    msg = quote(mensagem)
    url = f"https://wa.me/55{num}?text={msg}"
    
    print(f"\n  Link WhatsApp: {url}")
    webbrowser.open(url)

def modo_interativo():
    """Modo passo a passo simples."""
    print("""
  ╔══════════════════════════════════════╗
  ║   GERADOR DE ABORDAGEM — Mediatio   ║
  ╚══════════════════════════════════════╝
  
  Preencha os dados do veiculo (ENTER = pula)
  """)
    
    url = input("URL do anuncio: ").strip()
    marca = input("Marca: ").strip()
    modelo = input("Modelo: ").strip()
    ano = input("Ano: ").strip()
    preco = input("Preco: ").strip()
    km = input("KM: ").strip()
    cor = input("Cor: ").strip()
    cidade = input("Cidade: ").strip()
    nome = input("Nome do dono: ").strip()
    whatsapp = input("WhatsApp (so numeros): ").strip()
    
    dados = {
        "marca": marca,
        "modelo": modelo,
        "ano": int(ano) if ano.isdigit() else 0,
        "preco": int(preco) if preco.isdigit() else 0,
        "km": int(km) if km.isdigit() else 0,
        "cor": cor,
        "cidade": cidade,
        "nome": nome,
        "whatsapp": whatsapp,
    }
    
    print(f"\n  Como quer abordar?")
    print(f"  [1] WhatsApp (recomendado)")
    print(f"  [2] Facebook Messenger")
    print(f"  [3] Ligacao (roteiro)")
    print(f"  [4] So gerar texto (copiar)")
    op = input("  Opcao: ").strip()
    
    templates = {"1": "whatsapp", "2": "facebook", "3": "ligacao", "4": "whatsapp"}
    tipo = templates.get(op, "whatsapp")
    
    mensagem = gerar_mensagem(dados, tipo)
    
    print("\n" + "=" * 55)
    print(mensagem)
    print("=" * 55)
    
    if op in ("1", "4") and whatsapp:
        abrir = input("\n  Abrir WhatsApp? (s/n): ").strip().lower()
        if abrir == "s":
            abrir_whatsapp(whatsapp, mensagem)
    
    # Salva no historico
    with open("abordagens.txt", "a", encoding="utf-8") as f:
        f.write(f"\n--- {marca} {modelo} {ano} | {cidade} | R${preco} ---\n")
        f.write(f"URL: {url}\nWhatsApp: {whatsapp}\n")
        f.write(mensagem + "\n")
    
    print(f"\n  Salvo em abordagens.txt")

def modo_rapido():
    """Recebe dados pela linha de comando."""
    args = {}
    for arg in sys.argv[1:]:
        if arg.startswith("--"):
            key = arg[2:].split("=")[0]
            val = arg.split("=", 1)[1] if "=" in arg else ""
            args[key] = val
    
    dados = {
        "marca": args.get("marca", "______"),
        "modelo": args.get("modelo", "______"),
        "ano": int(args.get("ano", 0)),
        "preco": int(args.get("preco", 0)),
        "km": int(args.get("km", 0)),
        "cor": args.get("cor", "______"),
        "cidade": args.get("cidade", "______"),
        "nome": args.get("nome", "amigo(a)"),
        "whatsapp": args.get("whatsapp", ""),
    }
    
    mensagem = gerar_mensagem(dados)
    print("\n" + "=" * 55)
    print(mensagem)
    print("=" * 55)
    
    if dados["whatsapp"]:
        abrir_whatsapp(dados["whatsapp"], mensagem)

# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    if len(sys.argv) > 1:
        modo_rapido()
    else:
        modo_interativo()
