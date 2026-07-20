module.exports = {
  // --- KIT GARI ---
  varrer: {
    itemName: "🧹 Vassoura",
    cooldown: 15 * 60 * 1000, // 15 min
    minMoney: 50, maxMoney: 100,
    minXp: 15, maxXp: 25, // Média 20
    failChance: 0.05,
    messages: {
      success: [
        "Você varreu a calçada do bairro e recebeu **R$ {money}**!",
        "Você limpou o sótão da vizinha e ganhou **R$ {money}** pelas velharias!",
        "Você varreu as folhas do parque e o guarda te deu **R$ {money}**!",
        "Você ajudou a limpar o pátio da escola e ganhou **R$ {money}**!",
        "Você tirou toda a poeira da biblioteca e recebeu **R$ {money}**!"
      ],
      fail: [
        "Você tentou varrer, mas a vassoura quebrou no meio! Ganhou nada.",
        "Veio um vento forte e sujou tudo de novo. Trabalho perdido!",
        "Você ficou com preguiça e dormiu em cima da vassoura.",
        "Um cachorro correu atrás de você e você largou o serviço.",
        "Você varreu, varreu, mas ninguém te pagou. Que azar!"
      ]
    }
  },
  limpar: {
    itemName: "🧽 Esponja",
    cooldown: 20 * 60 * 1000, // 20 min
    minMoney: 120, maxMoney: 200,
    minXp: 30, maxXp: 40, // Média 35
    failChance: 0.1,
    messages: {
      success: [
        "Você lavou um carro esportivo e o dono te deu **R$ {money}** de gorjeta!",
        "Você limpou as vidraças de um prédio e recebeu **R$ {money}**!",
        "Você lavou a louça de um restaurante lotado e ganhou **R$ {money}**!",
        "Você limpou uma mancha difícil no tapete do prefeito: **R$ {money}**!",
        "Você encerou o chão do shopping e foi pago com **R$ {money}**!"
      ],
      fail: [
        "A esponja estava velha e esfarelou inteira.",
        "Você misturou os produtos errados e desmaiou com o cheiro.",
        "Você riscou a pintura do carro enquanto limpava.",
        "A água acabou no meio do serviço.",
        "Você derrubou o balde de água suja no cliente."
      ]
    }
  },

  // --- KIT PESCADOR ---
  pescar: {
    itemName: "🎣 Vara de Pesca",
    cooldown: 60 * 60 * 1000, // 1h
    minMoney: 500, maxMoney: 900,
    minXp: 80, maxXp: 120, // Média 100
    failChance: 0.15,
    messages: {
      success: [
        "Você pescou um atum gigante e o mercado pagou **R$ {money}**!",
        "Você pegou vários peixes e vendeu na feira por **R$ {money}**!",
        "Você pescou uma bota velha... mas tinha **R$ {money}** dentro!",
        "Você participou de um torneio de pesca e ganhou o prêmio de **R$ {money}**!",
        "Você encontrou um peixe raro e um colecionador pagou **R$ {money}**!"
      ],
      fail: [
        "A linha arrebentou e o peixe levou sua isca.",
        "Você pescou apenas lixo e botas velhas.",
        "Um jacaré comeu o peixe que você tinha pescado.",
        "O barco virou e você perdeu os peixes.",
        "Você dormiu segurando a vara e não pegou nada."
      ]
    }
  },
  arrastar: {
    itemName: "🕸️ Rede",
    cooldown: 2 * 60 * 60 * 1000, // 2h
    minMoney: 1200, maxMoney: 1800,
    minXp: 180, maxXp: 220, // Média 200
    failChance: 0.2,
    messages: {
      success: [
        "Você lançou a rede e pegou um cardume inteiro! Lucro de **R$ {money}**!",
        "Você pescou camarões gigantes e vendeu por **R$ {money}**!",
        "Sua rede trouxe tesouros perdidos do mar valendo **R$ {money}**!",
        "Você pegou peixes suficientes para alimentar a cidade: **R$ {money}**!",
        "Uma sereia te deu **R$ {money}** para você soltar os peixinhos."
      ],
      fail: [
        "A rede prendeu em um coral e rasgou toda.",
        "Você pegou um tubarão e teve que cortar a rede para fugir.",
        "A guarda costeira confiscou sua rede por pesca ilegal.",
        "Veio uma tempestade e você voltou sem nada.",
        "Sua rede veio cheia apenas de algas e plástico."
      ]
    }
  },

  // --- KIT TRABALHADOR ---
  cavar: {
    itemName: "⛏️ Pá",
    cooldown: 3 * 60 * 60 * 1000, // 3h
    minMoney: 2000, maxMoney: 2800,
    minXp: 250, maxXp: 350, // Média 300
    failChance: 0.2,
    messages: {
      success: [
        "Você cavou um poço artesiano e recebeu **R$ {money}**!",
        "Você ajudou numa obra da prefeitura e ganhou **R$ {money}**!",
        "Cavando no quintal, achou um cofre antigo com **R$ {money}**!",
        "Você fez a terraplanagem de um terreno e lucrou **R$ {money}**!",
        "Você encontrou trufas valiosas debaixo da terra: **R$ {money}**!"
      ],
      fail: [
        "Você acertou um cano de água e teve que pagar o conserto.",
        "A pá bateu numa pedra e o cabo quebrou.",
        "Você cavou, cavou, mas só achou minhocas.",
        "Você caiu dentro do buraco que cavou e ficou preso.",
        "Deu uma dor nas costas terrível e você foi pra casa."
      ]
    }
  },
  cozinhar: {
    itemName: "🔪 Faca",
    cooldown: 4 * 60 * 60 * 1000, // 4h
    minMoney: 3000, maxMoney: 4500,
    minXp: 350, maxXp: 450, // Média 400
    failChance: 0.25,
    messages: {
      success: [
        "Você trabalhou como Sushi-man por uma noite e ganhou **R$ {money}**!",
        "Você picou ingredientes para um banquete e recebeu **R$ {money}**!",
        "Você venceu um concurso de culinária local: prêmio de **R$ {money}**!",
        "Você foi chef particular de uma celebridade e ganhou **R$ {money}**!",
        "Você cortou legumes com precisão cirúrgica e foi contratado por **R$ {money}**!"
      ],
      fail: [
        "Você cortou o dedo cortando cebola. Foi pro hospital!",
        "A faca estava cega e amassou todo o tomate.",
        "Você deixou a comida queimar e o cliente não pagou.",
        "Você confundiu sal com açúcar e estragou o prato.",
        "O gato roubou a carne que você estava cortando."
      ]
    }
  },
  arar: {
    itemName: "🚜 Enxada",
    cooldown: 4 * 60 * 60 * 1000, // 4h
    minMoney: 5000, maxMoney: 7500,
    minXp: 450, maxXp: 550, // Média 500
    failChance: 0.25,
    messages: {
      success: [
        "Você carpiu um lote inteiro sob o sol e ganhou **R$ {money}**!",
        "Você preparou a terra para o plantio de soja: **R$ {money}**!",
        "Você capinou o jardim da mansão e recebeu **R$ {money}**!",
        "Você ajudou na colheita da fazenda vizinha e lucrou **R$ {money}**!",
        "Você encontrou uma moeda de ouro enquanto arava a terra: **R$ {money}**!"
      ],
      fail: [
        "A enxada quebrou na terra seca.",
        "Deu calo na mão e você não conseguiu terminar o serviço.",
        "Você pisou num formigueiro enquanto trabalhava.",
        "Começou a chover granizo e estragou a plantação.",
        "A cobra picou o cabo da enxada e você correu de medo."
      ]
    }
  },
  cortar: {
    itemName: "🪓 Machado",
    cooldown: 5 * 60 * 60 * 1000, // 5h
    minMoney: 8000, maxMoney: 12000,
    minXp: 700, maxXp: 900, // Média 800
    failChance: 0.3,
    messages: {
      success: [
        "Você cortou árvores de reflorestamento e vendeu por **R$ {money}**!",
        "Você forneceu lenha para todas as lareiras da cidade: **R$ {money}**!",
        "Você esculpiu uma estátua de madeira com o machado: **R$ {money}**!",
        "Você removeu uma árvore caída da estrada e a prefeitura pagou **R$ {money}**!",
        "Você participou de uma competição de lenhadores e ganhou **R$ {money}**!"
      ],
      fail: [
        "O machado ficou preso no tronco e você não conseguiu tirar.",
        "A árvore caiu em cima da sua barraca de almoço.",
        "O guarda florestal te pegou sem licença.",
        "O machado estava enferrujado e não cortou nada.",
        "Você cansou depois da primeira machadada."
      ]
    }
  },
  minerar: {
    itemName: "⛏️ Picareta",
    cooldown: 6 * 60 * 60 * 1000, // 6h
    minMoney: 15000, maxMoney: 22000,
    minXp: 1000, maxXp: 1400, // Média 1200
    failChance: 0.35,
    messages: {
      success: [
        "Você encontrou um veio de ouro puro! Vendeu por **R$ {money}**!",
        "Você achou diamantes brutos na caverna: **R$ {money}**!",
        "Você minerou carvão suficiente para o inverno: **R$ {money}**!",
        "Você descobriu uma geada de ametistas valendo **R$ {money}**!",
        "Uma mineradora te contratou pela sua habilidade: **R$ {money}**!"
      ],
      fail: [
        "A caverna começou a desmoronar e você fugiu sem nada.",
        "Você bateu numa rocha muito dura e a picareta quebrou.",
        "Morcegos te atacaram e você derrubou os minérios.",
        "Você achou apenas 'ouro de tolo' (pirita).",
        "O gás da mina te deixou tonto e você teve que sair."
      ]
    }
  },
  construir: {
    itemName: "🔨 Martelo",
    cooldown: 8 * 60 * 60 * 1000, // 8h
    minMoney: 25000, maxMoney: 35000,
    minXp: 1800, maxXp: 2200, // Média 2000
    failChance: 0.35,
    messages: {
      success: [
        "Você construiu um anexo na casa do vizinho e ganhou **R$ {money}**!",
        "Você consertou o telhado da igreja e o padre pagou **R$ {money}**!",
        "Você montou móveis planejados de luxo: **R$ {money}**!",
        "Você reformou a cozinha de um restaurante famoso: **R$ {money}**!",
        "Você construiu uma casa na árvore incrível e vendeu o projeto por **R$ {money}**!"
      ],
      fail: [
        "Você martelou o dedo e foi chorar no hospital.",
        "A parede que você levantou ficou torta e caiu.",
        "O cliente odiou a reforma e se recusou a pagar.",
        "Faltou material e a obra foi cancelada.",
        "Você pregou o próprio sapato no chão sem querer."
      ]
    }
  },

  // --- KIT ROUBO ---
  roubar: {
    itemName: "🔫 Pistola",
    cooldown: 12 * 60 * 60 * 1000, // 12h
    minMoney: 40000, maxMoney: 60000,
    minXp: 2500, maxXp: 3500, // Média 3000
    failChance: 0.50,
    messages: {
      success: [
        "Você assaltou um carro forte e levou **R$ {money}**!",
        "Você rendeu um magnata saindo do cassino e pegou **R$ {money}**!",
        "Você invadiu uma mansão e roubou joias valendo **R$ {money}**!",
        "Você realizou um grande golpe em uma joalheria: **R$ {money}**!",
        "Você cobrou uma dívida do submundo e recebeu **R$ {money}**!"
      ],
      fail: [
        "A polícia chegou na hora e você teve que fugir sem o dinheiro.",
        "A arma travou e a vítima te deu uma surra.",
        "Você entrou na casa errada (era a casa de um policial).",
        "O alarme disparou e os cães de guarda te morderam.",
        "Seu parceiro de crime fugiu com todo o dinheiro e te deixou para trás."
      ]
    }
  },
  hackear: {
    itemName: "💻 Computador",
    cooldown: 24 * 60 * 60 * 1000, // 24h
    minMoney: 80000, maxMoney: 150000,
    minXp: 4000, maxXp: 6000, // Média 5000
    failChance: 0.45,
    messages: {
      success: [
        "Você invadiu contas bancárias nas Ilhas Cayman: **R$ {money}**!",
        "Você roubou dados secretos da NASA e vendeu por **R$ {money}**!",
        "Você minerou uma nova criptomoeda e lucrou **R$ {money}**!",
        "Você descobriu podres de um político e cobrou **R$ {money}** pelo silêncio!",
        "Você criou um vírus de resgate (ransomware) e pagaram **R$ {money}**!"
      ],
      fail: [
        "O FBI rastreou seu IP e você queimou o HD para não ser preso.",
        "Caiu a internet bem na hora da transferência milionária.",
        "Você foi hackeado por um chinês e perdeu o acesso.",
        "O computador superaqueceu e pegou fogo.",
        "Você esqueceu a senha da carteira de Bitcoin."
      ]
    }
  }
};