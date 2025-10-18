// Importa o módulo readline
import { createInterface } from 'readline';

// Cria uma interface para a entrada (input) e saída (output)
const term = createInterface({
  input: process.stdin,
  output: process.stdout
});


// Objetos dos jogadores com suas respectivas características.
const player1 = {
    NOME: "Mario",
    VELOCIDADE: 4,
    MANOBRABILIDADE: 3,
    PODER: 3,
    PONTOS: 0,
};

const player2 = {
    NOME: "Luigi",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 4,
    PONTOS: 0,
};

const player3 = {
    NOME: "Peach",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    PODER: 2,
    PONTOS: 0,
};

const player4 = {
    NOME: "Yoshi",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 4,
    PODER: 3,
    PONTOS: 0,
};

const player5 = {
    NOME: "Bowser",
    VELOCIDADE: 5,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
};
const player6 = {
    NOME: "Donkey Kong",
    VELOCIDADE: 2,
    MANOBRABILIDADE: 2,
    PODER: 5,
    PONTOS: 0,
};

// async faz com que a função rode de forma assíncrona(ou seja, de forma sequencial).
// Essa função lança um dado e retorna um número aleatório entre 1 e 6.
async function rollDice() {
    return Math.floor(Math.random() * 6)+1;
};

async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random <0.33:
            result = "RETA";
            break;
        case random <0.66:
            result = "CURVA";
            break;
        default:
            result = "CONFRONTO";
            break;
    }
    return result;
}

// Array com todos os jogadores disponíveis.
const players = [player1, player2, player3, player4, player5, player6];

async function logRoundResults(characterName, block, diceResult, attribute) {
    console.log(`${characterName}  🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}


async function playRaceEngine (character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`🏁 Rodada ${round}`);

        // sortear bloco
        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        // rolar os dados
        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        //teste de habilidade
        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === "RETA") {
            totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
            totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

            await logRoundResults(character1.NOME, "velocidade", diceResult1, character1.VELOCIDADE);
            await logRoundResults(character2.NOME, "velocidade", diceResult2, character2.VELOCIDADE);
        }


        if (block === "CURVA") {
            totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
            totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

            await logRoundResults(character1.NOME, "manobrabilidade", diceResult1, character1.MANOBRABILIDADE);
            await logRoundResults(character2.NOME, "manobrabilidade", diceResult2, character2.MANOBRABILIDADE);
        }

        if (block === "CONFRONTO") {
            let powerResult1 = diceResult1 + character1.PODER;
            let powerResult2 = diceResult2 + character2.PODER;

            console.log(`${character1.NOME} confrontou com  ${character2.NOME}`);
            await logRoundResults(character1.NOME, "poder", diceResult1, character1.PODER);
            await logRoundResults(character2.NOME, "poder", diceResult2, character2.PODER);

            if(powerResult1 > powerResult2 && character2.PONTOS > 0) {
                console.log(`${character1.NOME} venceu o confronto! ${character2.NOME} perdeu 1 ponto.`);
                character2.PONTOS--;
            }

            if(powerResult2 > powerResult1 && character1.PONTOS > 0) {
                console.log(`${character2.NOME} venceu o confronto! ${character1.NOME} perdeu 1 ponto.`);
                character1.PONTOS--;
            }

            console.log(powerResult1 === powerResult2 ? "Empate no confronto! Nenhum ponto foi perdido." : "");
        }

        //Verificando o vencedor da rodada
        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`${character1.NOME} marcou um ponto!\n`);
            character1.PONTOS++;
        } else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`${character2.NOME} marcou um ponto!\n`);
            character2.PONTOS++;
        }

        console.log("--------------------------------------------------\n");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado Final:");
    console.log(`${character1.NOME}: ${character1.PONTOS} ponto(s)`);
    console.log(`${character2.NOME}: ${character2.PONTOS} ponto(s)`);

    if (character1.PONTOS > character2.PONTOS) {
        console.log(`\n🏆 ${character1.NOME} é o grande vencedor!`);
    } else if (character2.PONTOS > character1.PONTOS) {
        console.log(`\n🏆 ${character2.NOME} é o grande vencedor!`);
    } else {
        console.log("\n🤝 A corrida terminou em empate!");
    }
}

// Função para escolher um jogador
async function choosePlayer(promptText) {
    return new Promise((resolve) => {
        console.log(`\n${promptText}`);
        console.log("1 - Mario");
        console.log("2 - Luigi");
        console.log("3 - Peach");
        console.log("4 - Yoshi");
        console.log("5 - Bowser");
        console.log("6 - Donkey Kong");

        term.question("Escolha o número do jogador: ", (answer) => {
            const choice = parseInt(answer);
            if (choice >= 1 && choice <= 6) {
                resolve(players[choice - 1]);
            } else {
                console.log("Escolha inválida. Tente novamente.");
                resolve(choosePlayer(promptText));
            }
        });
    });
}

// Função para escolher oponente aleatório
function chooseRandomOpponent(excludePlayer) {
    const filteredPlayers = players.filter(player => player.NOME !== excludePlayer.NOME);
    const randomIndex = Math.floor(Math.random() * filteredPlayers.length);
    return filteredPlayers[randomIndex];
}

// O () na função main a torna auto-invocada.
(async function main() {   
    console.log("🎮 SUPER MARIO KART - CORRIDA 🏁");

    // Escolher jogador
    const player1 = await choosePlayer("🎯 JOGADOR 1 - Escolha seu personagem:");

    // Escolher entre jogador 2 ou oponente aleatório
    const opponentChoice = await new Promise((resolve) => {
        term.question("\nVocê quer escolher o Jogador 2 ou enfrentar um oponente aleatório? (digite '1' para escolher ou '2' para aleatório): ", (answer) => {
            resolve(answer.trim());
        });
    });
    let player2;
    if (opponentChoice === '1') {
        player2 = await choosePlayer("🎯 JOGADOR 2 - Escolha seu personagem:");
    } else {
        player2 = chooseRandomOpponent(player1);
    }
    console.log(`🏁 🚨 Corrida entre ${player1.NOME} e ${player2.NOME} começando...\n`);

    //await faz com que a execução espere a outra função terminar para continuar.
    await playRaceEngine(player1, player2);
    await declareWinner(player1, player2);
    term.close(); // Fecha a interface após o término do jogo
})();


