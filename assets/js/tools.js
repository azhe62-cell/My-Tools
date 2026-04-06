// 1. QR Code Generator
const qrBtn = document.getElementById('qr-btn');
if(qrBtn){
    qrBtn.addEventListener('click', () => {
        const input = document.getElementById('qr-input').value;
        const canvasContainer = document.getElementById('qrcode-canvas');
        canvasContainer.innerHTML = ''; 
        if(input.trim() === '') { alert('Please enter premium text or URL'); return; }
        
        new QRCode(canvasContainer, {
            text: input,
            width: 250,
            height: 250,
            colorDark : "#d4af37",
            colorLight : "#0a0a0a",
            correctLevel : QRCode.CorrectLevel.H
        });
    });
}

// 2. Barcode Generator
const barcodeBtn = document.getElementById('barcode-btn');
if(barcodeBtn){
    barcodeBtn.addEventListener('click', () => {
        const input = document.getElementById('barcode-input').value;
        const canvas = document.getElementById('barcode-canvas');
        if(input.trim() === '') { alert('Please enter code value'); return; }
        // reset canvas
        canvas.innerHTML = '';
        try {
            JsBarcode("#barcode-canvas", input, {
                format: "CODE128",
                lineColor: "#d4af37",
                background: "#000000",
                width: 3,
                height: 120,
                displayValue: true,
                fontOptions: "bold",
                fontSize: 22,
                margin: 0
            });
        } catch(e) {
            alert('Invalid barcode format. Use alphanumeric characters.');
        }
    });
}

// 3. Word Counter
const wordInput = document.getElementById('word-input');
if(wordInput){
    wordInput.addEventListener('input', () => {
        const text = wordInput.value;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        document.getElementById('word-count').innerText = words;
        document.getElementById('char-count').innerText = chars;
        document.getElementById('char-no-space').innerText = charsNoSpace;
    });
}

// 4. Age Calculator
const ageBtn = document.getElementById('age-btn');
if(ageBtn){
    ageBtn.addEventListener('click', () => {
        const dobVal = document.getElementById('dob-input').value;
        if(!dobVal) return;
        
        const dob = new Date(dobVal);
        const today = new Date();
        
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();
        
        if (months < 0 || (months === 0 && days < 0)) {
            years--;
            months += 12;
        }
        if (days < 0) {
            const tempDate = new Date(today.getFullYear(), today.getMonth(), 0);
            days += tempDate.getDate();
            months--;
        }
        
        document.getElementById('age-result').innerText = years + " Years";
        document.getElementById('age-details').innerText = `${months} Months, ${days} Days Duration`;
    });
}

// 5. Currency Calculator (Mock API)
const currBtn = document.getElementById('curr-btn');
if(currBtn) {
    const rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.2, INR: 83.4, AUD: 1.5, CAD: 1.35 };
    currBtn.addEventListener('click', () => {
        const amt = parseFloat(document.getElementById('curr-amount').value);
        const from = document.getElementById('curr-from').value;
        const to = document.getElementById('curr-to').value;
        
        if(isNaN(amt)) return;
        
        const inUSD = amt / rates[from];
        const result = inUSD * rates[to];
        
        document.getElementById('curr-result').innerText = result.toFixed(2) + ' ' + to;
    });
}

// 6. Morse Code
const toMorseBtn = document.getElementById('to-morse-btn');
const toTextBtn = document.getElementById('to-text-btn');
if(toMorseBtn) {
    const morseDict = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----', ' ': ' / '
    };
    
    const reverseDict = {};
    for (const [key, value] of Object.entries(morseDict)) {
        reverseDict[value] = key;
    }

    toMorseBtn.addEventListener('click', () => {
        const text = document.getElementById('morse-input').value.toUpperCase();
        let result = '';
        for(let i=0; i<text.length; i++){
            const char = text[i];
            if(morseDict[char]) {
                result += morseDict[char] + ' ';
            } else if (char !== ' ') {
                result += char + ' ';
            }
        }
        document.getElementById('morse-output').innerText = result.trim() || 'Awaiting Signal...';
    });

    toTextBtn.addEventListener('click', () => {
        const morse = document.getElementById('morse-input').value.trim().split(' ');
        let result = '';
        for(let i=0; i<morse.length; i++){
            const code = morse[i];
            if(code === '/') result += ' ';
            else if(reverseDict[code]) result += reverseDict[code];
            else result += code;
        }
        document.getElementById('morse-output').innerText = result || 'Awaiting Signal...';
    });
}

// 7. Typing Test
const typeStartBtn = document.getElementById('start-typing-btn');
if(typeStartBtn) {
    const quotes = {
        easy: ["The sun is shining.", "A cat sat on the mat.", "I love to eat fresh apples.", "Technology is highly advancing.", "This is a premium service."],
        medium: ["Success is not final, failure is not fatal.", "Life is what happens when you're busy making other plans.", "The quick brown fox jumps over the lazy dog instantly."],
        hard: ["To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer.", "The robust system architectures depend on highly resilient infrastructure protocols and distributed clusters.", "Quantum computing algorithms significantly drastically alter current cryptography methodologies and paradigms."]
    };
    
    let timer = 60;
    let interval = null;
    let playing = false;
    let currentQuote = "";
    
    const diffBtns = document.querySelectorAll('.diff-btn');
    let currentDiff = 'easy';
    
    diffBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(playing) return;
            diffBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDiff = e.target.getAttribute('data-diff');
        });
    });
    
    typeStartBtn.addEventListener('click', () => {
        const quoteBox = document.getElementById('quote-display');
        const input = document.getElementById('typing-input');
        
        if(!playing) {
            playing = true;
            timer = 60;
            const quoteList = quotes[currentDiff];
            currentQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
            
            // Format quote for highlighting
            quoteBox.innerHTML = '';
            currentQuote.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                quoteBox.appendChild(charSpan);
            });
            
            input.disabled = false;
            input.value = '';
            input.focus();
            typeStartBtn.innerHTML = '<i class="fa-solid fa-stop me-2"></i> Stop Sequence';
            document.getElementById('wpm-display').innerText = '0';
            document.getElementById('acc-display').innerText = '100%';
            
            interval = setInterval(() => {
                timer--;
                document.getElementById('time-display').innerText = timer + 's';
                
                if(timer <= 0) {
                    endTest();
                }
            }, 1000);
        } else {
            endTest();
        }
    });
    
    document.getElementById('typing-input').addEventListener('input', (e) => {
        if(!playing) return;
        const arrayQuote = document.querySelectorAll('#quote-display span');
        const arrayValue = e.target.value.split('');
        
        let correct = true;
        arrayQuote.forEach((charSpan, index) => {
            const character = arrayValue[index];
            if(character == null) {
                charSpan.classList.remove('text-gold');
                charSpan.classList.remove('text-error');
                correct = false;
            } else if (character === charSpan.innerText) {
                charSpan.classList.add('text-gold');
                charSpan.classList.remove('text-error');
            } else {
                charSpan.classList.remove('text-gold');
                charSpan.classList.add('text-error');
                correct = false;
            }
        });
        calculateTypingStats(e.target.value, currentQuote);
        if(correct) endTest();
    });
    
    function endTest() {
        playing = false;
        clearInterval(interval);
        const input = document.getElementById('typing-input');
        input.disabled = true;
        typeStartBtn.innerHTML = '<i class="fa-solid fa-redo me-2"></i> Restart Test';
        calculateTypingStats(input.value, currentQuote);
    }
    
    function calculateTypingStats(typed, actual) {
        if(!typed) return;
        const wordsTyped = typed.trim().split(/\s+/).length;
        const mins = (60 - timer) / 60 || 1/60;
        const wpm = Math.round(wordsTyped / mins);
        
        let correct = 0;
        for(let i=0; i<typed.length; i++) {
            if(typed[i] === actual[i]) correct++;
        }
        const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
        
        document.getElementById('wpm-display').innerText = isNaN(wpm) || wpm === Infinity ? 0 : wpm;
        document.getElementById('acc-display').innerText = acc + '%';
    }
}
