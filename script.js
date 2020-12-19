function Play(theme) {
    ClearAndUpdateTimeAndScore();
    ActivateTheme(theme);
    HideTheFirstScreen();
    idOfBtn = theme;
}

function HideTheFirstScreen() {
    //preElt.classList.add("animation");
    setTimeout(function() {
        preElt.classList.add("animation");;
    }, 300);
}

function UpdateUIAfterCreatingGameBoard(background) {
    const cards = document.querySelectorAll('.card-container');
    cards.forEach(card => card.addEventListener('click', FlipCard));
    state.classList.remove("hidden");
    document.body.style.backgroundImage = background;
}

function ActivateTheme(theme) {
    switch (theme) {
        case "animals":
            choosenTheme = games.animals;
            CreateGameBoard(games.animals, games.animalsNames, games.animalsNames, 12, "twelve-cards", "images/animal/confused.svg", "card", "back-card");
            UpdateUIAfterCreatingGameBoard('url("./images/animal/snowymountains.jpg")');
            break;
        case "superhero":
            choosenTheme = games.superhero;
            CreateGameBoard(games.superhero, games.superheroNames, games.superheroNames, 16, "sixteen-cards", "images/superhero/burglar.svg", "dark-card", "dark-back-card");
            UpdateUIAfterCreatingGameBoard('url("./images/superhero/superHero.jpg")');
            break;
        case "wildwest":
            CreateGameBoard(games.wildwest, games.wildWestNames, games.wildWestNames, 16, "sixteen-cards", "images/wildwest/back_desert.svg", "dark-card", "dark-back-card");
            choosenTheme = games.superhero;
            UpdateUIAfterCreatingGameBoard('url("./images/wildwest/westbackground.jpg")');
            break;
    }
    StartTimer();
}

function CreateGameBoard(array, alt, datasetName, randomNumber, cardSize, backSideImage, cardDesign, cardBackSideDesign) {
    for (let i = 0; i < array.length; i++) {
        const node = document.createElement("div");
        node.classList.add("card-container");
        node.classList.add(cardSize);
        node.dataset.card = datasetName[i];
        node.innerHTML = `
        <img id="${alt[i]}" class="${cardDesign} main-card" src="${array[i]}" alt="${alt[i]}">
        <img id="back-side" class="${cardBackSideDesign} main-card" src="${backSideImage}" alt="Card">
        `;
        main.append(node);
    }
    const cards = document.querySelectorAll('.card-container');
    cards.forEach(card => {
        let ramdomPos = Math.floor(Math.random() * randomNumber);
        card.style.order = ramdomPos;
    });
}

function FlipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    moves += 1;
    CheckForMatchAndUpdatesScore();
}

function CheckForMatchAndUpdatesScore() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
        firstCard.childNodes[1].classList.add("pulse");
        secondCard.childNodes[1].classList.add("pulse");
        score += 10;
        MoveCounter(score);
        DisableCards();
    } else {
        secondCard.childNodes[1].classList.add("shake");
        firstCard.childNodes[1].classList.add("shake");
        if (score != 0) {
            score -= 2;
            MoveCounter(score);
        }
        UnflipCards();
    }
}

function DisableCards() {
    firstCard.removeEventListener('click', FlipCard);
    secondCard.removeEventListener('click', FlipCard);
    ResetBoard();
    matchedCard += 2;
    if (matchedCard === choosenTheme.length) {
        setTimeout(Congratulations, 1800);
    }
}

function UnflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        secondCard.childNodes[1].classList.remove("shake");
        firstCard.childNodes[1].classList.remove("shake");
        ResetBoard();
    }, 1500);
}


function ResetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// @description game timer
function StartTimer() {
    interval = setInterval(function() {
        timer.innerHTML = "TIME   " + minute + " : " + second;
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

function Congratulations() {
    modal.classList.add('show');
    overlay.classList.remove('hidden');
    state.classList.remove("hidden");
    clearInterval(interval);
    finalTime = time.innerHTML;
    second = second - 1;

    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("finalPoints").innerHTML = score;
    document.getElementById("totalTime").innerHTML = "Time : " + minute + "  minutes " + second + "  seconds";
    matchedCard = 0;
}

function BackToMainMenu() {
    preElt.classList.remove("hidden");
    state.classList.add("hidden");
    preElt.classList.remove("animation")
    document.body.style.backgroundImage = 'url("./images/main-background.jpg")';
    SameActionsInCaseOfPlayAgain();
}

function PlayAgain() {
    SameActionsInCaseOfPlayAgain();
    Play(idOfBtn);
}

function SameActionsInCaseOfPlayAgain() {
    document.querySelectorAll('.card-container').forEach(e => e.remove());
    overlay.classList.add('hidden');
}

function ClearAndUpdateTimeAndScore() {
    clearInterval(interval);
    second = 0;
    minute = 0;
    score = 0;
    moves = 0;
    //update UI 
    scoreElt.innerHTML = score;
}

// count player's moves
function MoveCounter(score) {
    scoreElt.innerHTML = score;
}