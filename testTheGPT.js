const toMessages = [
    "Hey, how's it going?",
    "I'm doing pretty good, thanks!",
    "What's your name?",
    "I'm Alice.",
    "Where are you from?",
    "I'm from Paris.",
    "What do you do?",
    "I work as a software developer.",
]; // one extra message to translate

const fromMessages = [
    "안녕, 잘 지내?",
    "꽤 잘 지내고 있어, 고마워!",
    "이름이 뭐야?",
    "나는 앨리스야.",
    "어디에서 왔어?",
    "나는 파리에서 왔어.",
    "무슨 일을 해?",
    "나는 소프트웨어 개발자로 일해.",
    "좋아요, 정말 멋져요! 어떤 종류의 소프트웨어를 작업하시나요?"
];

const translateMessage = require('./GPTranslate.js');

(async () => {
    const translatedMessage = await translateMessage(fromMessages, toMessages, "ko", "en");
    console.log('Final translated message:', translatedMessage);
})();
