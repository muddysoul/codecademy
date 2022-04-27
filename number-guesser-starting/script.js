let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

// Write your code below:
const generateTarget = () => Math.floor(Math.random() * 10);

const compareGuesses = (humanGuess, computerGuess, targetNum) => {
    const humanDiff = Math.abs(humanGuess - targetNum);
    const computerDiff = Math.abs(computerGuess - targetNum);
    return humanDiff <= computerDiff;
};

const updateScore = winner => winner ? humanScore++ : computerScore++;
const advanceRound = () => currentRoundNumber++;