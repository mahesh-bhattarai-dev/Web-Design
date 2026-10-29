const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.year').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

/* Progressive disclosure: show a short introduction and expand the full story. */
const page = document.querySelector('.nav-links a.active')?.getAttribute('href') || '';

function makeCardExpandable(card, label = 'Read the story') {
  if (!card || card.querySelector(':scope > .card-body > details')) return;
  const body = card.querySelector('.card-body');
  if (!body) return;

  const children = Array.from(body.children);
  let summaryIndex = -1;
  let foundHeading = false;

  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (/^H[1-6]$/.test(node.tagName)) foundHeading = true;
    if (foundHeading && node.tagName === 'P' && !node.classList.contains('eyebrow')) {
      summaryIndex = i;
      break;
    }
  }

  if (summaryIndex < 0 || children.length <= summaryIndex + 1) return;

  const details = document.createElement('details');
  details.className = 'card-details';
  const summary = document.createElement('summary');
  summary.textContent = label;
  details.appendChild(summary);

  children.slice(summaryIndex + 1).forEach((node) => details.appendChild(node));
  body.appendChild(details);
}

if (['festivals.html', 'rituals.html', 'places.html', 'food.html'].includes(page)) {
  document.querySelectorAll('main .cards > article.card').forEach((card) => {
    makeCardExpandable(card, 'Read the story');
  });
}

if (page === 'index.html' || page === '') {
  document.querySelectorAll('main section .cards > article.card').forEach((card) => {
    makeCardExpandable(card, 'Read more');
  });
}
