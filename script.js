'use strict';

const playerScore = document.querySelector('#player-score');
const computerScore = document.querySelector('#computer-score');
const text = document.querySelector('#text');
//player icon
const iconLeft = document.querySelector('#icon-left');
//computer icon
const iconRight = document.querySelector('#icon-right');
const btnsContainer = document.querySelector('#btns-container');

//player score, computer score 
let pScore = 0;
let cScore = 0;
let timer;
let playerIndex;
let rngComputerIndex;
let eventObj;
const outcomes = ['rock', 'paper', 'scissors'];

const win = new Audio('/res/win.mp3');
const lose = new Audio('/res/lose.mp3');
const winRound = new Audio('/res/winRound.mp3');
const loseRound = new Audio('/res/loseRound.mp3');
const drawRound = new Audio('/res/drawRound.mp3');

//called after icon animations have ended via timer
const updateGame = () => {
    //generate random indexes for computer that can be 0, 1 or 2
    rngComputerIndex = Math.round(Math.random() * 2);

    if(playerIndex === rngComputerIndex){
        playerDrawRound();
    } else if (playerIndex === 0 && rngComputerIndex === 2) {  
        playerWinRound();
    } else if (playerIndex === 2 && rngComputerIndex === 1) {
        playerWinRound();
    } else if (playerIndex === 1 && rngComputerIndex === 0) {
        playerWinRound();
    } else {
        computerWinRound();
    }

    checkWinner(eventObj);
};

//play animations by adding and removing animation css classes
const playIconAnimation = () => {
    resetIcons();
    iconLeft.classList.add('anim__updown--left');
    iconRight.classList.add('anim__updown--right');

    timer = setTimeout(() => {
        iconLeft.classList.remove('anim__updown--left');
        iconRight.classList.remove('anim__updown--right');

        updateGame();
        clearTimeout(timer);
        playTextAnimation();
    }, 2250);
};

const playTextAnimation = () => {
    text.classList.add('anim__shake');

    timer = setTimeout(() => {
        text.classList.remove('anim__shake');

        clearTimeout(timer);
    }, 800);
};

//initialize player index based on whatever button was pressed
const setPlayerIndex = (index) => {
    playerIndex = index;
};

//update the h1 text element
const setText = (string) => {
    text.textContent = `${string}`;
};

//update icons, increment player score, text
const playerWinRound = () => {
    updateIcons(outcomes[playerIndex], outcomes[rngComputerIndex]);
    pScore+=1;
    playerScore.textContent = pScore;
    setText('Player won a point!');
    if(pScore != 5) playSound(winRound);
};

//update icons, increment computer score, text
const computerWinRound = () => {
    updateIcons(outcomes[playerIndex], outcomes[rngComputerIndex]);   
    cScore+=1;
    computerScore.textContent = cScore;
    setText('Computer won a point!');
    if(cScore != 5) playSound(loseRound);
};

//if both have same outcome
const playerDrawRound = () => {
    updateIcons(outcomes[playerIndex], outcomes[rngComputerIndex]);
    setText('Round was a draw!');  
    playSound(drawRound);
    return;
}

//reset icons back to rock
const resetIcons = () => {
    iconLeft.setAttribute('src', `./res/rock.png`);
    iconRight.setAttribute('src', `./res/rock.png`);
};

//player icon
const updateIcons = (playerChoice, computerChoice) => {
    iconLeft.setAttribute('src', `./res/${playerChoice}.png`);
    iconRight.setAttribute('src', `./res/${computerChoice}.png`);
};

//check if either scores reach 10
const checkWinner = (event) => {
    if(pScore === 3 || cScore === 3){
        if(pScore === 3) {
            setText('Congratulations, You Won!');
            playSound(win);
        } else if (cScore === 3) {
            setText('You Lose!');
            playSound(lose);
        }

        event.target.closest('.btns__panel').classList.add('hidden');
        event.target.closest('.btns__panel').nextElementSibling.classList.remove('hidden');
    }
};

//play sound
const playSound = (sound) => {
    sound.play();
};

//reset game when 'try again' button clicked
const resetGame = () => {
    pScore = 0;
    cScore = 0;
    playerScore.textContent = pScore;
    computerScore.textContent = cScore;
    setText('Choose an option');
    resetIcons();
};


//event delegation on parent for all buttons
btnsContainer.addEventListener('click', (e) => {
    if(e.target.closest('.btns__panel').classList.contains('btns__panel--start')){
        e.target.closest('.btns__panel').classList.add('hidden');
        e.target.closest('.btns__panel').nextElementSibling.classList.remove('hidden');
        setText('Choose an option');
    }

    if(e.target.textContent === 'Rock') {
        setPlayerIndex(0);
        playIconAnimation();
    }

    if(e.target.textContent === 'Paper') {
        setPlayerIndex(1);
        playIconAnimation();
    }

    if(e.target.textContent === 'Scissors') {
        setPlayerIndex(2);
        playIconAnimation();
    }

    if(e.target.closest('.btns__panel').classList.contains('btns__panel--end')){
        e.target.closest('.btns__panel').classList.add('hidden');
        e.target.closest('.btns__panel').previousElementSibling.classList.remove('hidden');
        resetGame();
    }

    //parsing this variable containg the event object to 'checkWinner()' 
    eventObj = e;
});