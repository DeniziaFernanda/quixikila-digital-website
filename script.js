const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const themeToggle = document.querySelector('#theme-toggle');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const form = document.querySelector('.contact-form');
const feedback = document.querySelector('.form-feedback');
const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
const THEME_STORAGE_KEY = 'qd-theme';

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.body.classList.toggle('theme-dark', isDark);

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');

    const icon = themeToggle.querySelector('span');
    if (icon) {
      icon.textContent = isDark ? '☀' : '☾';
    }
  }
};

const getSavedTheme = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
};

const getInitialTheme = () => {
  const savedTheme = getSavedTheme();
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return themeMedia.matches ? 'dark' : 'light';
};

applyTheme(getInitialTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    const nextTheme = isDark ? 'light' : 'dark';

    applyTheme(nextTheme);
    saveTheme(nextTheme);
  });
}

themeMedia.addEventListener('change', (event) => {
  const savedTheme = getSavedTheme();

  if (savedTheme !== 'dark' && savedTheme !== 'light') {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const setActiveLink = () => {
  const scrollPosition = window.scrollY + 160;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.site-nav a[href="#${id}"]`);

    if (!link) {
      return;
    }

    if (scrollPosition >= top && scrollPosition < top + height) {
      navLinks.forEach((navLink) => navLink.classList.remove('active'));
      link.classList.add('active');
    }
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

if (form && feedback) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();

    feedback.textContent = `Obrigado, ${name || 'pela sua mensagem'}! Entraremos em contacto em breve.`;
    form.reset();
  });
}
