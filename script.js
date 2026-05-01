const sfx = {
    click: new Audio('./assets/click.mp3'),
    increment: new Audio('./assets/increment.mp3'),
    decrement: new Audio('./assets/decrement.mp3'),
}

const counterDisplay = document.querySelector('h2');

const resetBtn = document.querySelector('.reset');
const incrementBtn = document.querySelector('.add');
const decrementBtn = document.querySelector('.subtract');
const typeBtns = [incrementBtn, decrementBtn];

const multiplier1x = document.querySelector('.s100');
const multiplier10x = document.querySelector('.s200');
const multiplier100x = document.querySelector('.s300');
const multiplier400x = document.querySelector('.s400');
const multiplier500x = document.querySelector('.s500');
const multiplierBtns = [multiplier1x, multiplier10x, multiplier100x, multiplier400x, multiplier500x];

const muteBtn = document.querySelector('.mute');
const helpBtn = document.querySelector('.help');
const historyDiv = document.querySelector('.history');

let counter = 0;
let multiplier = 100;

let muted = localStorage.getItem('muted') === 'true';
muteBtn.querySelector('abbr').textContent = muted ? '🔇' : '🔊';

function updateCounterDisplay(value) {
    counter += value;
    counterDisplay.textContent = counter;
    playSound(value > 0 ? sfx.increment : sfx.decrement);

    historyDiv.classList.add('shown');
    const newEntry = document.createElement('h3');
    newEntry.textContent = (value > 0 ? '+' : '') + value;
    newEntry.classList.add(value > 0 ? 'positive' : 'negative');
    historyDiv.prepend(newEntry);

    if (counter.toString().length > 4) {
        counterDisplay.classList.add('xsmall');
        counterDisplay.classList.remove('small');
    } else if (counter.toString().length > 2) {
        counterDisplay.classList.add('small');
        counterDisplay.classList.remove('xsmall');
    } else {
        counterDisplay.classList.remove('small', 'xsmall');
    }
}
function setType(newType) {
    playSound(sfx.click);
    typeBtns.forEach(b => b.classList.remove('selected'));
    (newType === 'increment' ? incrementBtn : decrementBtn).classList.add('selected');
    multiplier = newType === 'increment' ? Math.abs(multiplier) : -Math.abs(multiplier);
}
function setMultiplier(newMultiplier) {
    playSound(sfx.click);
    multiplierBtns.forEach(b => b.classList.remove('selected'));
    multiplier = multiplier > 0 ? newMultiplier : -newMultiplier;

    if (newMultiplier === 100) multiplier1x.classList.add('selected');
    else if (newMultiplier === 200) multiplier10x.classList.add('selected');
    else if (newMultiplier === 300) multiplier100x.classList.add('selected');
    else if (newMultiplier === 400) multiplier400x.classList.add('selected');
    else if (newMultiplier === 500) multiplier500x.classList.add('selected');
}
function toggleMute() {
    playSound(sfx.click, true);
    muted = !muted;
    localStorage.setItem('muted', muted);
    muteBtn.querySelector('abbr').textContent = muted ? '🔇' : '🔊';
}
function showHelp() {
    playSound(sfx.click);
    setTimeout(() => {
        alert(`Keyboard Shortcuts:

Space: ${multiplier > 0 ? 'Increment' : 'Decrement'} by ${Math.abs(multiplier)}
R: Reset counter
A: Set to Increment mode
S: Set to Decrement mode

1: Set multiplier to 100x
2: Set multiplier to 200x
3: Set multiplier to 300x
4: Set multiplier to 400x
5: Set multiplier to 500x

M: Toggle mute
H: Show this help message`);
    }, 100);
}

document.addEventListener("keydown", (e) => {
    if (document.activeElement instanceof HTMLButtonElement) {
        document.activeElement.blur();
    }

    if (e.key ==  " ") {
        e.preventDefault();
        updateCounterDisplay(multiplier);
    } else if (e.key == "r" || e.key == "R") {
        updateCounterDisplay(-counter);
    } else if (e.key == "a" || e.key == "A") {
        setType('increment');
    } else if (e.key == "s" || e.key == "S") {
        setType('decrement');
    } else if (e.key == "1") {
        setMultiplier(100);
    } else if (e.key == "2") {
        setMultiplier(200);
    } else if (e.key == "3") {
        setMultiplier(300);
    } else if (e.key == "4") {
        setMultiplier(400);
    } else if (e.key == "5") {
        setMultiplier(500);
    } else if (e.key == "m" || e.key == "M") {
        toggleMute();
    } else if (e.key == "h" || e.key == "H") {
        showHelp();
    }
});
counterDisplay.addEventListener('click', () => {
    updateCounterDisplay(multiplier);
});
resetBtn.addEventListener('click', () => {
    updateCounterDisplay(-counter);
    historyDiv.classList.remove('shown');
    historyDiv.innerHTML = '';
});

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setType(btn.value);
    });
});
multiplierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setMultiplier(parseInt(btn.value));
    });
});
muteBtn.addEventListener('click', toggleMute);
helpBtn.addEventListener('click', showHelp);

function playSound(sfx, skipIfMuted = false) {
    if (muted && !skipIfMuted) return;
    const audio = sfx.cloneNode();
    audio.play();
    audio.addEventListener('ended', () => {
        audio.remove();
    });
}
