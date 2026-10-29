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

/*
 * Progressive disclosure: keep a short introduction visible and let visitors
 * expand the details they want to read. Native <details> keeps this keyboard-
 * accessible and works without a framework.
 */
const page = document.querySelector('.nav-links a.active')?.getAttribute('href') || '';

function makeCardExpandable(card, label = 'Read more') {
  if (!card || card.querySelector(':scope > .card-body > details')) return;
  const body = card.querySelector('.card-body');
  if (!body) return;

  const children = Array.from(body.children);
  let summaryIndex = -1;
  let foundHeading = false;
  let foundSummary = false;

  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (/^H[1-6]$/.test(node.tagName)) foundHeading = true;
    if (foundHeading && node.tagName === 'P' && !node.classList.contains('eyebrow')) {
      summaryIndex = i;
      foundSummary = true;
      break;
    }
  }
  if (!foundSummary) return;

  const remaining = children.slice(summaryIndex + 1);
  if (!remaining.length) return;

  const details = document.createElement('details');
  details.className = 'card-details';
  const summary = document.createElement('summary');
  summary.textContent = label;
  details.appendChild(summary);

  remaining.forEach((node) => details.appendChild(node));
  body.appendChild(details);
}

if (page === 'festivals.html' || page === 'rituals.html') {
  document.querySelectorAll('main .cards > article.card').forEach((card) => {
    makeCardExpandable(card, 'Read the story');
  });
}

if (page === 'food.html') {
  document.querySelectorAll('main .destination-group').forEach((section) => {
    const heading = section.querySelector(':scope > h2, :scope > .section-heading');
    const content = Array.from(section.children).filter((node) => node !== heading && !node.classList.contains('eyebrow') && !node.classList.contains('group-intro'));
    if (!content.length) return;
    const details = document.createElement('details');
    details.className = 'section-details';
    const summary = document.createElement('summary');
    summary.textContent = 'Explore this category';
    details.appendChild(summary);
    content.forEach((node) => details.appendChild(node));
    section.appendChild(details);
  });
}

if (page === 'places.html') {
  document.querySelectorAll('main .destination-group').forEach((section) => {
    const content = Array.from(section.children).filter((node) => !node.classList.contains('section-heading') && !node.classList.contains('eyebrow') && !node.classList.contains('group-intro'));
    if (!content.length) return;
    const details = document.createElement('details');
    details.className = 'section-details';
    const summary = document.createElement('summary');
    summary.textContent = 'Explore places';
    details.appendChild(summary);
    content.forEach((node) => details.appendChild(node));
    section.appendChild(details);
  });
}

if (page === 'index.html' || page === '') {
  document.querySelectorAll('main section .cards > article.card').forEach((card) => {
    makeCardExpandable(card, 'Read more');
  });
}
