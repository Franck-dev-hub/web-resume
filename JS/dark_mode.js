function toggleThemeInit() {
  const toggleBtn = document.getElementById('toggle-theme');
  if (!toggleBtn) return;

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}
}

window.addEventListener('DOMContentLoaded', toggleThemeInit);