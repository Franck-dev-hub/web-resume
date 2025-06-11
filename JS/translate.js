const switcher = document.getElementById('language-switcher');

switcher.addEventListener('change', (e) => {
    loadLanguage(e.target.value);
});

function loadLanguage(lang) {
    fetch(`lang/${lang}.json`)
        .then(response => response.json())
        .then(translations => {
            document.querySelectorAll('[translate]').forEach(el => {
                const key = el.getAttribute('translate');
                if (translations[key]) {
                    el.innerText = translations[key];
                }
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadLanguage('fr');
});
