const swap_languages = document.getElementById('swap-languages-button');
const from_language = document.getElementById('from-language');
const to_language = document.getElementById('to-language');
swap_languages.addEventListener('click', () => {
    const from_language_value = from_language.value;
    from_language.value = to_language.value;
    to_language.value = from_language_value;
});
