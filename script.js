const lines = [
  'print("hello world!")',
  'always learning new bugs',
  "it works. don't touch it.",
  'sudo make me a coffee',
  'i use arch btw',
  'rm -rf my problems',
  '404 sleep not found',
  'works on my machine',
  'git commit -m "trust me"',
  'compiling my bad decisions',
  'segmentation fault enjoyer',
  'have you tried turning it off and on?',
  'sudo pacman -S life',
  'while(true) coding;'
];

const target = document.getElementById('typing-text');
let lineIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = lines[lineIndex];
  target.textContent = current.slice(0, charIndex);
  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(typeLoop, 48);
  } else if (!deleting) {
    deleting = true;
    setTimeout(typeLoop, 1450);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 22);
  } else {
    deleting = false;
    lineIndex = (lineIndex + 1) % lines.length;
    setTimeout(typeLoop, 260);
  }
}

if (target) typeLoop();


const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const light = document.body.dataset.theme !== 'light';
    if (light) document.body.dataset.theme = 'light';
    else delete document.body.dataset.theme;
    themeToggle.textContent = light ? 'DARK MODE' : 'LIGHT MODE';
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  });
}
