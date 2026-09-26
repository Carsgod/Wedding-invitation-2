const card = document.getElementById('card');
const stateLabel = document.getElementById('stateLabel');
const hint = document.getElementById('hint');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const frontPage = document.getElementById('frontPage');
const leftPage = document.getElementById('leftPage');
const centerPage = document.getElementById('centerPage');
const rightPage = document.getElementById('rightPage');
const backPage = document.getElementById('backPage');

const states = [
  { key: 'closed', label: 'Front Cover' },
  { key: 'left', label: 'Inside Left' },
  { key: 'center', label: 'Inside Center' },
  { key: 'right', label: 'Inside Right' },
  { key: 'back', label: 'Back Cover' }
];
let currentState = 0;

function updateUI() {
  const state = states[currentState];
  card.setAttribute('data-state', state.key);
  stateLabel.textContent = state.label;

  [frontPage, leftPage, centerPage, rightPage, backPage].forEach(page => {
    page.classList.remove('flipped');
  });

  if (state.key === 'left' || state.key === 'center' || state.key === 'right' || state.key === 'back') {
    frontPage.classList.add('flipped');
  }
  if (state.key === 'center' || state.key === 'right' || state.key === 'back') {
    leftPage.classList.add('flipped');
  }
  if (state.key === 'right' || state.key === 'back') {
    centerPage.classList.add('flipped');
  }
  if (state.key === 'back') {
    rightPage.classList.add('flipped');
  }

  const hints = {
    closed: 'Click the card to open',
    left: 'Click to see center',
    center: 'Click to see right',
    right: 'Click to see back cover',
    back: 'Click to return to front'
  };
  hint.textContent = hints[state.key];
}

function nextState() {
  const prevState = currentState;
  currentState = (currentState + 1) % states.length;

  if (prevState === 0 && currentState === 1) {
    triggerCinematicOpen();
  }

  updateUI();
}

function prevState() {
  currentState = (currentState - 1 + states.length) % states.length;
  updateUI();
}

function triggerCinematicOpen() {
  card.classList.add('opening');

  setTimeout(() => {
    card.classList.remove('opening');
  }, 1000);
}

card.addEventListener('click', nextState);
nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextState(); });
prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevState(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextState();
  if (e.key === 'ArrowLeft') prevState();
});

let touchStartX = 0;
card.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

card.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextState();
    else prevState();
  }
}, { passive: true });
