const intro = document.querySelector('#intro-screen');
const wonderland = document.querySelector('#wonderland');
const gift = document.querySelector('#gift');
const openGift = document.querySelector('#open-gift');
const restart = document.querySelector('#restart');
const snowLayer = document.querySelector('#snow-layer');
const stars = document.querySelector('#stars');
const tree = document.querySelector('#tree');
const wishButton = document.querySelector('#wish-button');
const envelopeButton = document.querySelector('#envelope-button');
const secretNote = document.querySelector('#secret-note');
const secretMessage = secretNote.querySelector('p');
const closeNote = document.querySelector('#close-note');
const toast = document.querySelector('#toast');
const musicToggle = document.querySelector('#music-toggle');
const recipientNameInput = document.querySelector('#recipient-name');
const recipientDisplay = document.querySelector('#recipient-display');
const namePlaceholders = document.querySelectorAll('.name-placeholder');
let audioContext;
let musicTimer;
let musicPlaying = false;
let typingStarted = false;
let recipientName = 'người đặc biệt';
let lastSecretMessageIndex = -1;

const secretMessages = [
  '“Cậu là một trong những điều dịu dàng nhất mà năm nay đã mang đến. Cảm ơn cậu vì đã luôn là chính mình.”',
  '“Mong những điều tốt đẹp nhất sẽ nhẹ nhàng tìm đến bên cậu, hôm nay và cả những ngày sau.”',
  '“Chúc cậu luôn giữ được nụ cười thật ấm áp, kể cả trong những ngày mùa đông lạnh giá.”',
  '“Có những người khiến thế giới trở nên đẹp hơn chỉ bằng sự hiện diện của mình. Cậu là một người như thế.”',
  '“Mong mùa Giáng Sinh này mang đến cho cậu thật nhiều bình yên, niềm vui và những bất ngờ ngọt ngào.”',
];

function updateRecipientName() {
  const enteredName = recipientNameInput.value.trim().replace(/\s+/g, ' ');
  recipientName = enteredName;
  recipientDisplay.textContent = recipientName;
  namePlaceholders.forEach((element) => { element.textContent = recipientName; });
}

function createSnow() {
  const symbols = ['❄', '·', '✦'];
  for (let i = 0; i < 38; i += 1) {
    const flake = document.createElement('span');
    flake.className = 'flake';
    flake.textContent = symbols[i % symbols.length];
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.fontSize = `${7 + Math.random() * 10}px`;
    flake.style.animationDuration = `${8 + Math.random() * 14}s`;
    flake.style.animationDelay = `${-Math.random() * 18}s`;
    snowLayer.append(flake);
  }
}

function createStars() {
  for (let i = 0; i < 30; i += 1) {
    const star = document.createElement('span');
    star.className = 'star';
    star.textContent = i % 4 === 0 ? '✦' : '·';
    star.style.left = `${5 + Math.random() * 90}%`;
    star.style.top = `${5 + Math.random() * 55}%`;
    star.style.fontSize = `${8 + Math.random() * 12}px`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    stars.append(star);
  }
}

function revealWonderland() {
  if (!recipientNameInput.value.trim()) {
    recipientNameInput.classList.remove('name-input--error');
    window.requestAnimationFrame(() => recipientNameInput.classList.add('name-input--error'));
    recipientNameInput.focus();
    showToast('Hãy nhập tên của cậu trước khi mở quà ✦');
    return;
  }
  updateRecipientName();
  gift.classList.add('opened');
  intro.classList.add('is-closing');
  window.setTimeout(() => {
    intro.hidden = true;
    wonderland.classList.add('is-visible');
    document.body.classList.add('has-wonderland');
    document.querySelector('#letter-title').scrollIntoView({ behavior: 'smooth', block: 'center' });
    startTyping();
  }, 900);
}

function startTyping() {
  if (typingStarted) return;
  typingStarted = true;
  const lines = [...document.querySelectorAll('.typing-line')];
  lines.forEach((line, index) => {
    window.setTimeout(() => {
      line.classList.add('visible');
      const text = index === 0 ? `Giáng Sinh an lành, ${recipientName}!` : line.dataset.text;
      let position = 0;
      const type = () => {
        line.textContent = text.slice(0, position);
        position += 1;
        if (position <= text.length) window.setTimeout(type, index === 0 ? 55 : 18);
      };
      type();
    }, index * 1900);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2600);
}

function makeWish() {
  const burst = document.createElement('div');
  burst.className = 'wish-burst';
  for (let i = 0; i < 90; i += 1) {
    const star = document.createElement('i');
    star.textContent = i % 3 ? '✦' : '·';
    star.style.setProperty('--x', `${(Math.random() - 0.5) * 90}vw`);
    star.style.setProperty('--y', `${-(20 + Math.random() * 75)}vh`);
    star.style.setProperty('--delay', `${Math.random() * .5}s`);
    burst.append(star);
  }
  document.body.append(burst);
  window.setTimeout(() => burst.remove(), 2200);
  showToast('Điều ước của cậu đang bay lên các vì sao ✦');
}

function toggleMusic() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (musicPlaying) {
    window.clearInterval(musicTimer);
    audioContext.suspend();
    musicPlaying = false;
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.querySelector('.music-label').textContent = 'Bật nhạc đêm';
    return;
  }
  audioContext.resume();
  const melody = [
    [261.63, 329.63, 392], [329.63, 392, 523.25], [392, 493.88, 587.33],
    [523.25, 659.25, 783.99], [587.33, 739.99, 880], [523.25, 659.25, 783.99],
    [392, 493.88, 587.33], [329.63, 392, 493.88],
  ];
  let step = 0;
  const chime = () => {
    const now = audioContext.currentTime;
    melody[step % melody.length].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(index === 0 ? .045 : .018, now + .08);
      gain.gain.exponentialRampToValueAtTime(.001, now + 1.1);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 1.2);
    });
    step += 1;
  };
  chime();
  musicTimer = window.setInterval(chime, 1250);
  musicPlaying = true;
  musicToggle.classList.add('is-playing');
  musicToggle.setAttribute('aria-pressed', 'true');
  musicToggle.querySelector('.music-label').textContent = 'Tạm dừng nhạc';
}

function restartExperience() {
  document.querySelector('#ending').scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => {
    intro.hidden = false;
    intro.classList.remove('is-closing');
    wonderland.classList.remove('is-visible');
    typingStarted = false;
    document.querySelectorAll('.typing-line').forEach((line) => { line.textContent = ''; line.classList.remove('visible'); });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 700);
}

createSnow();
createStars();
openGift.addEventListener('click', revealWonderland);
gift.addEventListener('click', revealWonderland);
recipientNameInput.addEventListener('input', () => recipientNameInput.classList.remove('name-input--error'));
tree.addEventListener('click', () => { tree.classList.toggle('lights-off'); showToast(tree.classList.contains('lights-off') ? 'Đèn đang nghỉ một chút' : 'Cây thông đang tỏa sáng dành cho cậu ✦'); });
wishButton.addEventListener('click', makeWish);
envelopeButton.addEventListener('click', () => {
  let messageIndex = Math.floor(Math.random() * secretMessages.length);
  while (messageIndex === lastSecretMessageIndex && secretMessages.length > 1) {
    messageIndex = Math.floor(Math.random() * secretMessages.length);
  }
  lastSecretMessageIndex = messageIndex;
  secretMessage.textContent = secretMessages[messageIndex];
  secretNote.classList.add('is-open');
  secretNote.setAttribute('aria-hidden', 'false');
});
closeNote.addEventListener('click', () => { secretNote.classList.remove('is-open'); secretNote.setAttribute('aria-hidden', 'true'); });
musicToggle.addEventListener('click', toggleMusic);
restart.addEventListener('click', restartExperience);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { secretNote.classList.remove('is-open'); secretNote.setAttribute('aria-hidden', 'true'); }
});
