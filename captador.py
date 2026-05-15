#!/usr/bin/env python3
"""
CAPTADOR DE VEICULOS — Mediatio
Script para encontrar donos de veiculos no Facebook Marketplace e OLX
e gerar mensagens de abordagem personalizadas.

Uso: python captador.py [--modo=auto|manual] [--cidade="Rio do Sul"] [--raio=80]
"""

import json
import csv
import os
import re
import sys
import time
import textwrap
from datetime import datetime
from pathlib import Path

# ============================================================
# CONFIGURACAO
# ============================================================

CONFIG = {
    # Regiao de busca (Alto Vale do Itajai + cidades vizinhas)
    "cidades_alvo": [
        "Rio do Sul", "Ibirama", "Ituporanga", "Taió", "Lontras",
        "Presidente Getulio", "Dona Emma", "José Boiteux", "Vitor Meireles",
        "Salete", "Mirim Doce", "Pouso Redondo", "Braço do Trombudo",
        "Trombudo Central", "Agrolândia", "Petrolândia", "Atalanta",
        "Chapadão do Lageado", "Apiúna", "Ascurra", "Rodeio",
        "Benedito Novo", "Doutor Pedrinho", "Blumenau", "Indaial",
        "Timbó", "Pomerode", "Brusque", "Gaspar"
    ],
    "raio_km": 80,
    "preco_min": 8000,
    "preco_max": 180000,
    "ano_min": 2008,

    # URLs de busca (Facebook Marketplace + OLX)
    "urls_facebook": [
        "https://www.facebook.com/marketplace/riodosul/vehicles",
        "https://www.facebook.com/marketplace/blumenau/vehicles",
        "https://www.facebook.com/marketplace/ibirama/vehicles",
    ],
    "urls_olx": [
        "https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios/estado-sc/regiao-vale-do-itajai",
    ],
}

# ============================================================
# TEMPLATES DE ABORDAGEM
# ============================================================

TEMPLATES_WHATSAPP = {
    "primeiro_contato": """Ola {nome_dono}! Tudo bem?

Vi seu {marca} {modelo} {ano} anunciado e achei interessante. Sou intermediador de veiculos aqui na regiao do Alto Vale e tenho clientes procurando exatamente esse perfil de carro.

Voce ainda esta vendendo? Se sim, posso ajudar a vender mais rapido — trabalho com carteira de compradores e anuncios profissionais.

Me fala mais sobre o carro: esta com documentacao em dia? Aceita troca?

Fico no aguardo!""",

    "seguimento_48h": """Ola {nome_dono}, passando aqui pra saber se o {marca} {modelo} ainda esta disponivel.

Tenho um cliente que se interessou especificamente nesse modelo. Se ainda estiver vendendo, podemos agendar uma visita.

Abracos!""",

    "contra_proposta": """Ola {nome_dono}! 

Conversei com meu cliente e ele ficou bem interessado no {marca} {modelo}. 

Ele ofereceu R$ {contra_proposta} — sei que voce esta pedindo R$ {preco_original}, mas ele tem o dinheiro a vista e pode fechar essa semana.

O que acha? Se quiser, podemos negociar!""",
}

# ============================================================
# MODELOS DE DADOS
# ============================================================

class VeiculoCaptado:
    def __init__(self, dados: dict):
        self.url = dados.get("url", "")
        self.plataforma = dados.get("plataforma", "facebook")
        self.marca = dados.get("marca", "")
        self.modelo = dados.get("modelo", "")
        self.ano = dados.get("ano", 0)
        self.preco = dados.get("preco", 0)
        self.km = dados.get("km", 0)
        self.cor = dados.get("cor", "")
        self.cidade = dados.get("cidade", "")
        self.nome_dono = dados.get("nome_dono", "")
        self.whatsapp = dados.get("whatsapp", "")
        self.telefone = dados.get("telefone", "")
        self.observacoes = dados.get("observacoes", "")
        self.status = dados.get("status", "novo")  # novo|contatado|negociando|fechado|desistiu
        self.data_captacao = dados.get("data_captacao", datetime.now().isoformat())
        self.data_contato = dados.get("data_contato", "")
        self.notas = dados.get("notas", "")

    def to_dict(self):
        return self.__dict__

    def gerar_abordagem(self, template="primeiro_contato"):
        texto = TEMPLATES_WHATSAPP.get(template, TEMPLATES_WHATSAPP["primeiro_contato"])
        return texto.format(
            nome_dono=self.nome_dono or "amigo(a)",
            marca=self.marca,
            modelo=self.modelo,
            ano=self.ano,
            preco_original=f"{self.preco:,.0f}".replace(",", "."),
            contra_proposta=f"{int(self.preco * 0.9):,.0f}".replace(",", "."),
        )

# ============================================================
# FUNCOES PRINCIPAIS
# ============================================================

def extrair_dados_url(url: str) -> dict:
    """Tenta extrair dados de uma URL do Facebook Marketplace ou OLX."""
    dados = {"url": url, "plataforma": "desconhecida"}

    if "facebook.com/marketplace" in url:
        dados["plataforma"] = "facebook"
    elif "olx.com.br" in url:
        dados["plataforma"] = "olx"

    # Extrai titulo da URL (contem marca/modelo/ano em muitos casos)
    # Ex: /item/volkswagen-gol-1-6-2019-50000km/
    match = re.search(r'/item/([^/?]+)', url)
    if match:
        slug = match.group(1).replace("-", " ")
        dados["slug"] = slug

    return dados


def adicionar_manual() -> VeiculoCaptado:
    """Modo manual: usuario digita os dados do veiculo encontrado."""
    print("\n" + "=" * 60)
    print("  NOVO VEICULO — Preencha os dados (ENTER para pular)")
    print("=" * 60)

    url = input("URL do anuncio: ").strip()
    plataforma = "facebook" if "facebook" in url else "olx" if "olx" in url else "outro"

    print("\n--- Dados do Veiculo ---")
    marca = input("Marca (ex: Volkswagen): ").strip()
    modelo = input("Modelo (ex: Gol 1.6): ").strip()
    ano = input("Ano (ex: 2019): ").strip()
    preco = input("Preco pedido (ex: 35000): ").strip()
    km = input("KM (ex: 50000): ").strip()
    cor = input("Cor: ").strip()
    cidade = input("Cidade: ").strip()

    print("\n--- Dados do Dono ---")
    nome = input("Nome do dono: ").strip()
    whatsapp = input("WhatsApp (so numeros, ex: 47999998888): ").strip()
    telefone = input("Telefone alternativo: ").strip()
    obs = input("Observacoes (estado, docs, etc): ").strip()

    return VeiculoCaptado({
        "url": url,
        "plataforma": plataforma,
        "marca": marca,
        "modelo": modelo,
        "ano": int(ano) if ano.isdigit() else 0,
        "preco": int(preco) if preco.isdigit() else 0,
        "km": int(km) if km.isdigit() else 0,
        "cor": cor,
        "cidade": cidade,
        "nome_dono": nome,
        "whatsapp": whatsapp,
        "telefone": telefone,
        "observacoes": obs,
    })


def importar_csv(arquivo: str = "captados.csv") -> list:
    """Importa veiculos ja captados de um CSV."""
    veiculos = []
    if not os.path.exists(arquivo):
        return veiculos

    with open(arquivo, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            veiculos.append(VeiculoCaptado(row))
    return veiculos


def exportar_csv(veiculos: list, arquivo: str = "captados.csv"):
    """Exporta lista de veiculos para CSV."""
    if not veiculos:
        print("Nenhum veiculo para exportar.")
        return

    with open(arquivo, "w", encoding="utf-8", newline="") as f:
        campos = veiculos[0].to_dict().keys()
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        for v in veiculos:
            writer.writerow(v.to_dict())

    print(f"\n {len(veiculos)} veiculos exportados para '{arquivo}'")


def gerar_link_whatsapp(numero: str, mensagem: str) -> str:
    """Gera link do WhatsApp com mensagem pre-preenchida."""
    num_limpo = re.sub(r'\D', '', numero)
    msg_encoded = mensagem.replace(" ", "%20").replace("\n", "%0A")
    return f"https://wa.me/55{num_limpo}?text={msg_encoded}"


def mostrar_resumo(veiculos: list):
    """Mostra tabela resumo dos veiculos captados."""
    if not veiculos:
        print("\n  Nenhum veiculo captado ainda.")
        return

    print(f"\n{'='*90}")
    print(f"  CAPTADOS: {len(veiculos)} veiculos")
    print(f"{'='*90}")
    print(f"{'#':<4} {'Marca':<12} {'Modelo':<15} {'Ano':<6} {'Preco':>10} {'Cidade':<18} {'Status':<12} {'WhatsApp'}")
    print(f"{'-'*90}")

    for i, v in enumerate(veiculos, 1):
        preco_str = f"R${v.preco:,.0f}" if v.preco else "—"
        print(f"{i:<4} {v.marca:<12} {v.modelo:<15} {v.ano:<6} {preco_str:>10} {v.cidade:<18} {v.status:<12} {v.whatsapp or '—'}")

    print(f"{'='*90}")

    # Estatisticas
    total_valor = sum(v.preco for v in veiculos if v.preco > 0)
    por_status = {}
    for v in veiculos:
        por_status[v.status] = por_status.get(v.status, 0) + 1

    print(f"\n  Valor total dos veiculos: R$ {total_valor:,.0f}")
    print(f"  Por status: {', '.join(f'{k}: {v}' for k, v in por_status.items())}")

    # Potencial de spread (8%)
    spread_potencial = total_valor * 0.08
    print(f"  Potencial de spread (~8%): R$ {spread_potencial:,.0f}")
    print()


def abrir_whatsapp(veiculo: VeiculoCaptado, template="primeiro_contato"):
    """Abre o WhatsApp Web com a mensagem de abordagem."""
    if not veiculo.whatsapp:
        print("  WhatsApp nao informado para este veiculo.")
        return

    mensagem = veiculo.gerar_abordagem(template)
    link = gerar_link_whatsapp(veiculo.whatsapp, mensagem)

    print(f"\n{'='*60}")
    print(f"  ABORDAGEM PARA: {veiculo.nome_dono or veiculo.whatsapp}")
    print(f"  VEICULO: {veiculo.marca} {veiculo.modelo} {veiculo.ano}")
    print(f"  PRECO: R$ {veiculo.preco:,.0f}" if veiculo.preco else "")
    print(f"{'='*60}")
    print(f"\n{mensagem}\n")
    print(f"{'='*60}")
    print(f"\n  Link WhatsApp: {link}")
    print(f"\n  (Cole o link no navegador para abrir o WhatsApp)")

    # Tenta abrir no navegador (Windows)
    if sys.platform == "win32":
        os.system(f'start "" "{link}"')
    elif sys.platform == "darwin":
        os.system(f'open "{link}"')
    else:
        print(f"  Abra manualmente: {link}")


# ============================================================
# INTERFACE
# ============================================================

def menu_principal():
    """Menu interativo do captador."""
    veiculos = importar_csv()

    while True:
        print("\n" + "=" * 50)
        print("  CAPTADOR DE VEICULOS — Mediatio")
        print("=" * 50)
        print(f"  Veiculos captados: {len(veiculos)}")
        print()
        print("  1. Adicionar veiculo manualmente")
        print("  2. Ver veiculos captados")
        print("  3. Gerar abordagem para um veiculo")
        print("  4. Abordagem em lote (todos 'novo')")
        print("  5. Atualizar status de um veiculo")
        print("  6. Remover veiculo")
        print("  7. Exportar CSV")
        print("  8. Gerar links WhatsApp para todos")
        print("  9. Abrir Facebook Marketplace (navegador)")
        print("  10. Abrir OLX Carros SC (navegador)")
        print("  0. Sair")
        print()

        opcao = input("Escolha: ").strip()

        if opcao == "1":
            v = adicionar_manual()
            veiculos.append(v)
            exportar_csv(veiculos)
            print(f"\n  Veiculo '{v.marca} {v.modelo}' adicionado!")

            # Pergunta se quer gerar abordagem
            if v.whatsapp:
                gerar = input("\nGerar mensagem de abordagem agora? (s/n): ").strip().lower()
                if gerar == "s":
                    abrir_whatsapp(v)

        elif opcao == "2":
            mostrar_resumo(veiculos)

        elif opcao == "3":
            if not veiculos:
                print("Nenhum veiculo captado.")
                continue
            mostrar_resumo(veiculos)
            idx = input("Numero do veiculo para abordar: ").strip()
            if idx.isdigit() and 1 <= int(idx) <= len(veiculos):
                abrir_whatsapp(veiculos[int(idx) - 1])

        elif opcao == "4":
            novos = [v for v in veiculos if v.status == "novo" and v.whatsapp]
            if not novos:
                print("Nenhum veiculo 'novo' com WhatsApp.")
                continue
            print(f"\nGerando abordagens para {len(novos)} veiculos...")
            for v in novos:
                print(f"\n--- {v.marca} {v.modelo} ---")
                abrir_whatsapp(v)
                v.status = "contatado"
                v.data_contato = datetime.now().isoformat()
                pausa = input("\nENTER para proximo (ou 'p' para parar): ").strip().lower()
                if pausa == "p":
                    break
            exportar_csv(veiculos)

        elif opcao == "5":
            mostrar_resumo(veiculos)
            idx = input("Numero do veiculo: ").strip()
            if idx.isdigit() and 1 <= int(idx) <= len(veiculos):
                v = veiculos[int(idx) - 1]
                print(f"Status atual: {v.status}")
                print("Opcoes: novo, contatado, negociando, fechado, desistiu")
                novo_status = input("Novo status: ").strip().lower()
                if novo_status in ["novo", "contatado", "negociando", "fechado", "desistiu"]:
                    v.status = novo_status
                    exportar_csv(veiculos)
                    print(f"Status atualizado para '{novo_status}'")

        elif opcao == "6":
            mostrar_resumo(veiculos)
            idx = input("Numero do veiculo para remover: ").strip()
            if idx.isdigit() and 1 <= int(idx) <= len(veiculos):
                v = veiculos.pop(int(idx) - 1)
                exportar_csv(veiculos)
                print(f"'{v.marca} {v.modelo}' removido.")

        elif opcao == "7":
            exportar_csv(veiculos)

        elif opcao == "8":
            for v in veiculos:
                if v.whatsapp and v.status == "novo":
                    msg = v.gerar_abordagem()
                    link = gerar_link_whatsapp(v.whatsapp, msg)
                    print(f"\n{v.marca} {v.modelo} ({v.cidade}):")
                    print(f"  {link}")
            exportar_csv(veiculos)

        elif opcao == "9":
            print("\nAbrindo Facebook Marketplace...")
            for url in CONFIG["urls_facebook"]:
                if sys.platform == "win32":
                    os.system(f'start "" "{url}"')
                else:
                    print(f"  {url}")

        elif opcao == "10":
            print("\nAbrindo OLX Carros SC...")
            for url in CONFIG["urls_olx"]:
                if sys.platform == "win32":
                    os.system(f'start "" "{url}"')
                else:
                    print(f"  {url}")

        elif opcao == "0":
            exportar_csv(veiculos)
            print("\nAte mais! Bons negocios!")
            break

        else:
            print("Opcao invalida.")


# ============================================================
# MODO RAPIDO (linha de comando)
# ============================================================

def modo_rapido():
    """Adiciona veiculo rapidamente via argumentos de linha de comando."""
    import argparse

    parser = argparse.ArgumentParser(description="Captador de Veiculos — Mediatio")
    parser.add_argument("--url", help="URL do anuncio")
    parser.add_argument("--marca", help="Marca do veiculo")
    parser.add_argument("--modelo", help="Modelo do veiculo")
    parser.add_argument("--ano", type=int, help="Ano do veiculo")
    parser.add_argument("--preco", type=int, help="Preco pedido")
    parser.add_argument("--km", type=int, help="Quilometragem")
    parser.add_argument("--cor", help="Cor do veiculo")
    parser.add_argument("--cidade", help="Cidade do anuncio")
    parser.add_argument("--nome", help="Nome do dono")
    parser.add_argument("--whatsapp", help="WhatsApp do dono")
    parser.add_argument("--abordar", action="store_true", help="Gerar abordagem imediatamente")
    parser.add_argument("--csv", default="captados.csv", help="Arquivo CSV de saida")

    args = parser.parse_args()

    veiculos = importar_csv(args.csv)
    v = VeiculoCaptado({
        "url": args.url or "",
        "marca": args.marca or "",
        "modelo": args.modelo or "",
        "ano": args.ano or 0,
        "preco": args.preco or 0,
        "km": args.km or 0,
        "cor": args.cor or "",
        "cidade": args.cidade or "",
        "nome_dono": args.nome or "",
        "whatsapp": args.whatsapp or "",
    })

    veiculos.append(v)
    exportar_csv(veiculos, args.csv)
    print(f"\nVeiculo '{v.marca} {v.modelo}' adicionado!")

    if args.abordar and v.whatsapp:
        abrir_whatsapp(v)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    print(r"""
    ╔══════════════════════════════════════════╗
    ║     CAPTADOR DE VEICULOS — Mediatio      ║
    ║   Encontre donos. Aborde. Venda.         ║
    ╚══════════════════════════════════════════╝
    """)

    # Se tem argumentos, modo rapido
    if len(sys.argv) > 1:
        modo_rapido()
    else:
        menu_principal()
