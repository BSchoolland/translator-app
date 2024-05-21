document.addEventListener('DOMContentLoaded', function() {
    const colorButtons = document.querySelectorAll('.color-button');
    const savedColor = localStorage.getItem('selectedColor');

    if (savedColor) {
        const tintedColor = lightenColor(savedColor, 80); // lightenColor is a function you would need to implement
        document.body.style.backgroundColor = tintedColor;
        colorButtons.forEach(button => {
            if (button.getAttribute('data-color') === savedColor) {
                button.classList.add('selected');
            }
        });
    }

    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            const color = this.getAttribute('data-color');
            // slightly tint the body's background color to look like the button's color
            const body = document.body;
            const tintedColor = lightenColor(color, 80); // lightenColor is a function you would need to implement
            body.style.backgroundColor = tintedColor;

            localStorage.setItem('selectedColor', color);
            // remove the buttons from the DOM
            colorButtons.forEach(b => b.remove());
        });
    });

    function lightenColor(color, percent) {
        var num = parseInt(color.replace("#",""),16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    }
});