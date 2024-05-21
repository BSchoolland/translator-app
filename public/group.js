// first, create a popup that asks the user their preferred language
let userLang = localStorage.getItem('userLanguage');

if (!userLang || userLang === 'null' || userLang === 'undefined' || userLang === "") {
    userLang = prompt('What is your preferred language? 선호하는 언어가 무엇인가요?');
} else {
    if (confirm('Is your preferred language ' + userLang + '? ' + userLang + ' 이(가) 선호하는 언어입니까?')) {
        userLang = userLang;
    }
    else {
        userLang = prompt('What is your preferred language? 선호하는 언어가 무엇인가요?');
    }
}

localStorage.setItem('userLanguage', userLang);

// when the page loads, ask the user to select a color
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

// when the page loads, request messages from the server
document.addEventListener('DOMContentLoaded', function() {
   
    // add the messages to the message stack. Send the user's preferred language to the server with the request
    const messageStack = document.getElementById('message-stack');
    fetch('/api/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userLang })
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        response.forEach(message => {
            const messageElement = document.createElement('div');
            
            messageElement.textContent = message.message;
            messageElement.style.backgroundColor = message.color;
            // if the color is too dark, change the text color to white
            const color = message.color;
            const r = parseInt(color.substring(1, 3), 16);
            const g = parseInt(color.substring(3, 5), 16);
            const b = parseInt(color.substring(5, 7), 16);
            const brightness = Math.sqrt(0.299 * r*r + 0.587 * g*g + 0.114 * b*b);
            if (brightness < 128) {
                messageElement.style.color = 'white';
            }
            // if the message color is the same as the user's selected color, change the class name
            const selectedColor = localStorage.getItem('selectedColor');
            if (selectedColor === message.color) {
                messageElement.classList.add('message-from-me');
            }
            else {
                messageElement.classList.add('message');

            }
            
            messageStack.appendChild(messageElement);
        });
    });
});