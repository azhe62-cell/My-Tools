// =============================================
// TOOL NAVIGATION
// =============================================
function openTool(id) {
    document.getElementById('tools-selector').classList.add('hidden');
    document.getElementById('tool-view-container').classList.remove('hidden');
    document.querySelectorAll('.tool-interface').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('tool-' + id);
    if (target) target.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeTools() {
    document.getElementById('tool-view-container').classList.add('hidden');
    document.getElementById('tools-selector').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Auto-open tool if passed via sessionStorage (from homepage links)
window.addEventListener('DOMContentLoaded', () => {
    const tool = sessionStorage.getItem('openTool');
    if (tool) {
        sessionStorage.removeItem('openTool');
        openTool(tool);
    }
    updateUnitOptions();
    updateColorInfo();
});

// =============================================
// 1. QR CODE GENERATOR
// =============================================
const qrBtn = document.getElementById('qr-btn');
const qrDownloadBtn = document.getElementById('qr-download-btn');
const qrSuccessMsg = document.getElementById('qr-success-msg');

if (qrBtn) {
    qrBtn.addEventListener('click', () => {
        let input = document.getElementById('qr-input').value.trim();
        const canvasContainer = document.getElementById('qrcode-canvas');

        if (qrDownloadBtn) qrDownloadBtn.style.display = 'none';
        if (qrSuccessMsg) { qrSuccessMsg.style.display = 'none'; qrSuccessMsg.style.opacity = '0'; }

        if (!input) { alert('Please enter text or a URL'); return; }

        // Auto-fix URLs so phones open browser, not search
        if (/^(www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/.test(input) && !input.startsWith('http')) {
            input = 'https://' + input;
        }

        canvasContainer.innerHTML = '';
        qrBtn.disabled = true;
        qrBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Generating...';

        setTimeout(() => {
            new QRCode(canvasContainer, {
                text: input,
                width: 250,
                height: 250,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            qrBtn.disabled = false;
            qrBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles me-2"></i> Generate QR Code';

            if (qrDownloadBtn) { qrDownloadBtn.style.display = 'block'; setTimeout(() => qrDownloadBtn.style.opacity = '1', 50); }
            if (qrSuccessMsg) { qrSuccessMsg.style.display = 'block'; setTimeout(() => qrSuccessMsg.style.opacity = '1', 50); }
        }, 300);
    });

    if (qrDownloadBtn) {
        qrDownloadBtn.addEventListener('click', () => {
            const canvas = document.querySelector('#qrcode-canvas canvas');
            if (canvas) {
                const tmp = document.createElement('canvas');
                tmp.width = canvas.width; tmp.height = canvas.height;
                const ctx = tmp.getContext('2d');
                ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, tmp.width, tmp.height);
                ctx.drawImage(canvas, 0, 0);
                const a = document.createElement('a'); a.href = tmp.toDataURL("image/png"); a.download = 'qrcode.png'; a.click();
            } else {
                const img = document.querySelector('#qrcode-canvas img');
                if (img) {
                    const tmp = document.createElement('canvas');
                    tmp.width = 250; tmp.height = 250;
                    const ctx = tmp.getContext('2d');
                    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,250,250);
                    ctx.drawImage(img, 0, 0, 250, 250);
                    const a = document.createElement('a'); a.href = tmp.toDataURL("image/png"); a.download = 'qrcode.png'; a.click();
                }
            }
        });
    }
}

// =============================================
// 2. BARCODE GENERATOR
// =============================================
const barcodeBtn = document.getElementById('barcode-btn');
const barcodeDownloadBtn = document.getElementById('barcode-download-btn');
const barcodeSuccessMsg = document.getElementById('barcode-success-msg');

if (barcodeBtn) {
    barcodeBtn.addEventListener('click', () => {
        const input = document.getElementById('barcode-input').value.trim();
        const canvas = document.getElementById('barcode-canvas');

        if (barcodeDownloadBtn) barcodeDownloadBtn.style.display = 'none';
        if (barcodeSuccessMsg) { barcodeSuccessMsg.style.display = 'none'; barcodeSuccessMsg.style.opacity = '0'; }
        if (!input) { alert('Please enter a value'); return; }

        canvas.innerHTML = '';
        barcodeBtn.disabled = true;
        barcodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Generating...';

        setTimeout(() => {
            try {
                JsBarcode("#barcode-canvas", input, {
                    format: "CODE128",
                    lineColor: "#000000",
                    background: "#ffffff",
                    width: 3,
                    height: 120,
                    displayValue: true,
                    fontOptions: "bold",
                    fontSize: 22,
                    margin: 10
                });
                if (barcodeDownloadBtn) { barcodeDownloadBtn.style.display = 'block'; setTimeout(() => barcodeDownloadBtn.style.opacity = '1', 50); }
                if (barcodeSuccessMsg) { barcodeSuccessMsg.style.display = 'block'; setTimeout(() => barcodeSuccessMsg.style.opacity = '1', 50); }
            } catch (e) { alert('Invalid input. Use alphanumeric characters.'); }
            barcodeBtn.disabled = false;
            barcodeBtn.innerHTML = '<i class="fa-solid fa-barcode me-2"></i> Render Barcode';
        }, 300);
    });

    if (barcodeDownloadBtn) {
        barcodeDownloadBtn.addEventListener('click', () => {
            const svg = document.getElementById('barcode-canvas');
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas2 = document.createElement("canvas");
            const ctx = canvas2.getContext("2d");
            const img = new Image();
            img.onload = () => {
                canvas2.width = img.width; canvas2.height = img.height;
                ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas2.width, canvas2.height);
                ctx.drawImage(img, 0, 0);
                const a = document.createElement("a"); a.download = "barcode.png"; a.href = canvas2.toDataURL("image/png"); a.click();
            };
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        });
    }
}

// =============================================
// 3. WORD COUNTER
// =============================================
const wordInput = document.getElementById('word-input');
if (wordInput) {
    wordInput.addEventListener('input', () => {
        const text = wordInput.value;
        document.getElementById('word-count').innerText = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        document.getElementById('char-count').innerText = text.length;
        document.getElementById('char-no-space').innerText = text.replace(/\s/g, '').length;
    });
}

// =============================================
// 4. AGE CALCULATOR
// =============================================
const ageBtn = document.getElementById('age-btn');
if (ageBtn) {
    ageBtn.addEventListener('click', () => {
        const dobVal = document.getElementById('dob-input').value;
        if (!dobVal) return;
        const dob = new Date(dobVal);
        const today = new Date();
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();
        if (months < 0 || (months === 0 && days < 0)) { years--; months += 12; }
        if (days < 0) { const tmp = new Date(today.getFullYear(), today.getMonth(), 0); days += tmp.getDate(); months--; }
        document.getElementById('age-result').innerText = years + " Years";
        document.getElementById('age-details').innerText = `${months} Months, ${days} Days`;
    });
}

// =============================================
// 5. CURRENCY CONVERTER
// =============================================
const currBtn = document.getElementById('curr-btn');
const currFrom = document.getElementById('curr-from');
const currTo = document.getElementById('curr-to');

if (currBtn && currFrom && currTo) {
    let liveRates = {};
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(res => res.json())
        .then(data => {
            liveRates = data.rates;
            const currencies = Object.keys(liveRates).sort();
            const opts = currencies.map(c => `<option value="${c}">${c}</option>`).join('');
            currFrom.innerHTML = opts; currTo.innerHTML = opts;
            currFrom.value = 'USD'; currTo.value = 'PKR';
        })
        .catch(() => { liveRates = { USD:1, EUR:0.92, GBP:0.79, JPY:151.2, INR:83.4, PKR:280, AUD:1.5, CAD:1.35 }; });

    currBtn.addEventListener('click', () => {
        const amt = parseFloat(document.getElementById('curr-amount').value);
        if (isNaN(amt)) return;
        const inUSD = amt / liveRates[currFrom.value];
        const result = inUSD * liveRates[currTo.value];
        document.getElementById('curr-result').innerText = result.toFixed(2) + ' ' + currTo.value;
    });
}

// =============================================
// 6. MORSE CODE
// =============================================
const toMorseBtn = document.getElementById('to-morse-btn');
const toTextBtn = document.getElementById('to-text-btn');
if (toMorseBtn) {
    const morseDict = {
        'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','0':'-----',' ':' / '
    };
    const reverseDict = {};
    for (const [k, v] of Object.entries(morseDict)) reverseDict[v] = k;

    toMorseBtn.addEventListener('click', () => {
        const text = document.getElementById('morse-input').value.toUpperCase();
        let result = '';
        for (let c of text) result += (morseDict[c] || c) + ' ';
        document.getElementById('morse-output').innerText = result.trim() || 'Awaiting Signal...';
    });
    toTextBtn.addEventListener('click', () => {
        const morse = document.getElementById('morse-input').value.trim().split(' ');
        let result = '';
        for (let code of morse) result += (code === '/' ? ' ' : (reverseDict[code] || code));
        document.getElementById('morse-output').innerText = result || 'Awaiting Signal...';
    });
}

// =============================================
// 7. TYPING TEST
// =============================================
const typeStartBtn = document.getElementById('start-typing-btn');
if (typeStartBtn) {
    const quotes = {
        easy: ["The sun is shining bright today.", "A cat sat on the mat.", "I love to eat fresh apples.", "Technology is advancing fast.", "This is a free online tool."],
        medium: ["Success is not final, failure is not fatal.", "Life is what happens when you are busy making other plans.", "The quick brown fox jumps over the lazy dog instantly."],
        hard: ["To be, or not to be, that is the question: Whether tis nobler in the mind to suffer.", "Robust system architectures depend on highly resilient infrastructure protocols and distributed clusters.", "Quantum computing algorithms drastically alter current cryptography methodologies and paradigms."]
    };
    let timer = 60, interval = null, playing = false, currentQuote = "";
    let currentDiff = 'easy';
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if (playing) return;
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDiff = e.target.getAttribute('data-diff');
        });
    });
    typeStartBtn.addEventListener('click', () => {
        const quoteBox = document.getElementById('quote-display');
        const input = document.getElementById('typing-input');
        if (!playing) {
            playing = true; timer = 60;
            const list = quotes[currentDiff];
            currentQuote = list[Math.floor(Math.random() * list.length)];
            quoteBox.innerHTML = '';
            currentQuote.split('').forEach(ch => { const s = document.createElement('span'); s.innerText = ch; quoteBox.appendChild(s); });
            input.disabled = false; input.value = ''; input.focus();
            typeStartBtn.innerHTML = '<i class="fa-solid fa-stop me-2"></i> Stop Test';
            document.getElementById('wpm-display').innerText = '0';
            document.getElementById('acc-display').innerText = '100%';
            interval = setInterval(() => { timer--; document.getElementById('time-display').innerText = timer + 's'; if (timer <= 0) endTest(); }, 1000);
        } else { endTest(); }
    });
    document.getElementById('typing-input').addEventListener('input', e => {
        if (!playing) return;
        const spans = document.querySelectorAll('#quote-display span');
        const vals = e.target.value.split('');
        let correct = true;
        spans.forEach((s, i) => {
            if (vals[i] == null) { s.classList.remove('text-gold','text-error'); correct = false; }
            else if (vals[i] === s.innerText) { s.classList.add('text-gold'); s.classList.remove('text-error'); }
            else { s.classList.remove('text-gold'); s.classList.add('text-error'); correct = false; }
        });
        calcStats(e.target.value, currentQuote);
        if (correct) endTest();
    });
    function endTest() {
        playing = false; clearInterval(interval);
        const input = document.getElementById('typing-input');
        input.disabled = true;
        typeStartBtn.innerHTML = '<i class="fa-solid fa-redo me-2"></i> Restart Test';
        calcStats(input.value, currentQuote);
    }
    function calcStats(typed, actual) {
        if (!typed) return;
        const words = typed.trim().split(/\s+/).length;
        const mins = (60 - timer) / 60 || 1/60;
        const wpm = Math.round(words / mins);
        let correct = 0;
        for (let i = 0; i < typed.length; i++) if (typed[i] === actual[i]) correct++;
        const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
        document.getElementById('wpm-display').innerText = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
        document.getElementById('acc-display').innerText = acc + '%';
    }
}

// =============================================
// 8. PASSWORD GENERATOR
// =============================================
function generatePassword() {
    const len = parseInt(document.getElementById('pw-length').value);
    const upper = document.getElementById('pw-upper').checked;
    const lower = document.getElementById('pw-lower').checked;
    const nums = document.getElementById('pw-numbers').checked;
    const syms = document.getElementById('pw-symbols').checked;
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (nums) chars += '0123456789';
    if (syms) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { alert('Select at least one character type.'); return; }
    let pw = '';
    for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById('password-output').textContent = pw;
    document.getElementById('pw-copy-msg').style.display = 'none';
}

function copyPassword() {
    const pw = document.getElementById('password-output').textContent;
    if (pw === 'Click Generate') return;
    navigator.clipboard.writeText(pw).then(() => {
        const msg = document.getElementById('pw-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 9. CASE CONVERTER
// =============================================
function convertCase(type) {
    const text = document.getElementById('case-input').value;
    let result = '';
    switch(type) {
        case 'upper': result = text.toUpperCase(); break;
        case 'lower': result = text.toLowerCase(); break;
        case 'title': result = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()); break;
        case 'sentence': result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
        case 'toggle': result = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
    }
    document.getElementById('case-output').value = result;
}

function copyCaseOutput() {
    const val = document.getElementById('case-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const msg = document.getElementById('case-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 10. BMI CALCULATOR
// =============================================
let bmiUnit = 'metric';
function setBmiUnit(u) {
    bmiUnit = u;
    if (u === 'metric') {
        document.getElementById('bmi-metric-btn').className = 'btn btn-primary w-100';
        document.getElementById('bmi-imperial-btn').className = 'btn btn-outline w-100';
        document.getElementById('bmi-weight-label').textContent = 'Weight (kg)';
        document.getElementById('bmi-height-label').textContent = 'Height (cm)';
        document.getElementById('bmi-weight').placeholder = '70';
        document.getElementById('bmi-height').placeholder = '175';
    } else {
        document.getElementById('bmi-metric-btn').className = 'btn btn-outline w-100';
        document.getElementById('bmi-imperial-btn').className = 'btn btn-primary w-100';
        document.getElementById('bmi-weight-label').textContent = 'Weight (lbs)';
        document.getElementById('bmi-height-label').textContent = 'Height (inches)';
        document.getElementById('bmi-weight').placeholder = '154';
        document.getElementById('bmi-height').placeholder = '69';
    }
}

function calculateBMI() {
    let w = parseFloat(document.getElementById('bmi-weight').value);
    let h = parseFloat(document.getElementById('bmi-height').value);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) { alert('Please enter valid values.'); return; }
    let bmi;
    if (bmiUnit === 'metric') {
        h = h / 100;
        bmi = w / (h * h);
    } else {
        bmi = (703 * w) / (h * h);
    }
    bmi = parseFloat(bmi.toFixed(1));
    let cat = '', color = '';
    if (bmi < 18.5) { cat = 'Underweight'; color = '#87ceeb'; }
    else if (bmi < 25) { cat = 'Normal Weight'; color = '#90ee90'; }
    else if (bmi < 30) { cat = 'Overweight'; color = '#ffa500'; }
    else { cat = 'Obese'; color = '#ff6b6b'; }
    document.getElementById('bmi-result').textContent = bmi;
    const catEl = document.getElementById('bmi-category');
    catEl.textContent = cat; catEl.style.color = color;
    document.getElementById('bmi-range').textContent = 'Healthy range: 18.5 – 24.9';
}

// =============================================
// 11. UNIT CONVERTER
// =============================================
const unitData = {
    length: { units: ['Meter','Kilometer','Mile','Yard','Foot','Inch','Centimeter','Millimeter','Nautical Mile'], toBase: [1,1000,1609.344,0.9144,0.3048,0.0254,0.01,0.001,1852] },
    weight: { units: ['Kilogram','Gram','Pound','Ounce','Ton','Milligram','Stone'], toBase: [1,0.001,0.453592,0.0283495,1000,0.000001,6.35029] },
    temperature: { units: ['Celsius','Fahrenheit','Kelvin'], toBase: null },
    area: { units: ['Square Meter','Square Kilometer','Square Mile','Square Foot','Acre','Hectare'], toBase: [1,1e6,2589988.11,0.092903,4046.856,10000] },
    speed: { units: ['m/s','km/h','mph','knot','ft/s'], toBase: [1,0.277778,0.44704,0.514444,0.3048] },
    volume: { units: ['Liter','Milliliter','Cubic Meter','Gallon (US)','Quart','Pint','Cup','Fluid Ounce'], toBase: [1,0.001,1000,3.78541,0.946353,0.473176,0.236588,0.0295735] }
};

function updateUnitOptions() {
    const cat = document.getElementById('unit-category');
    if (!cat) return;
    const sel = cat.value;
    const data = unitData[sel];
    const opts = data.units.map(u => `<option value="${u}">${u}</option>`).join('');
    document.getElementById('unit-from').innerHTML = opts;
    document.getElementById('unit-to').innerHTML = opts;
    if (data.units[1]) document.getElementById('unit-to').value = data.units[1];
}

function convertUnit() {
    const cat = document.getElementById('unit-category').value;
    const val = parseFloat(document.getElementById('unit-input-val').value);
    const from = document.getElementById('unit-from').value;
    const to = document.getElementById('unit-to').value;
    if (isNaN(val)) { document.getElementById('unit-result').textContent = 'Enter a value'; return; }
    const data = unitData[cat];
    let result;
    if (cat === 'temperature') {
        let celsius;
        if (from === 'Celsius') celsius = val;
        else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
        else celsius = val - 273.15;
        if (to === 'Celsius') result = celsius;
        else if (to === 'Fahrenheit') result = celsius * 9/5 + 32;
        else result = celsius + 273.15;
    } else {
        const fromIdx = data.units.indexOf(from);
        const toIdx = data.units.indexOf(to);
        const inBase = val * data.toBase[fromIdx];
        result = inBase / data.toBase[toIdx];
    }
    document.getElementById('unit-result').textContent = parseFloat(result.toFixed(6)).toString() + ' ' + to;
}

// =============================================
// 12. COLOR PICKER
// =============================================
function updateColorInfo() {
    const hex = document.getElementById('color-picker-input').value;
    document.getElementById('color-hex').textContent = hex.toUpperCase();
    document.getElementById('color-preview').style.background = hex;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    document.getElementById('color-rgb').textContent = `${r}, ${g}, ${b}`;
    const rn=r/255, gn=g/255, bn=b/255;
    const max=Math.max(rn,gn,bn), min=Math.min(rn,gn,bn);
    let h=0, s=0, l=(max+min)/2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        switch(max) {
            case rn: h=((gn-bn)/d+(gn<bn?6:0))/6; break;
            case gn: h=((bn-rn)/d+2)/6; break;
            case bn: h=((rn-gn)/d+4)/6; break;
        }
    }
    document.getElementById('color-hsl').textContent = `${Math.round(h*360)}°, ${Math.round(s*100)}%, ${Math.round(l*100)}%`;
}

function copyColorHex() {
    const hex = document.getElementById('color-picker-input').value.toUpperCase();
    navigator.clipboard.writeText(hex).then(() => {
        const msg = document.getElementById('color-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 13. LOREM IPSUM GENERATOR
// =============================================
const loremWords = ["lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud","exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure","in","reprehenderit","voluptate","velit","esse","cillum","eu","fugiat","nulla","pariatur","excepteur","sint","occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","est","laborum","perspiciatis","unde","omnis","iste","natus","error","accusantium","doloremque","laudantium","totam","rem","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","quasi","architecto","beatae","vitae","dicta","explicabo","nemo","ipsam","voluptatem","quia","voluptas","aspernatur","odit","fugit","consequuntur","magni","dolores","eos","ratione","sequi","nesciunt","neque","porro","quisquam","est","qui","dolorem","ipsum","quia","dolor","sit","amet"];

function generateLorem() {
    const count = parseInt(document.getElementById('lorem-count').value) || 3;
    let paragraphs = [];
    for (let p = 0; p < count; p++) {
        let sentences = [];
        const numSents = 4 + Math.floor(Math.random() * 4);
        for (let s = 0; s < numSents; s++) {
            const numWords = 8 + Math.floor(Math.random() * 10);
            let words = [];
            for (let w = 0; w < numWords; w++) words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            sentences.push(words.join(' ') + '.');
        }
        paragraphs.push(sentences.join(' '));
    }
    document.getElementById('lorem-output').value = paragraphs.join('\n\n');
}

function copyLorem() {
    const val = document.getElementById('lorem-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const msg = document.getElementById('lorem-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 14. JSON FORMATTER
// =============================================
function formatJSON() {
    const input = document.getElementById('json-input').value.trim();
    const errEl = document.getElementById('json-error');
    errEl.style.display = 'none';
    try {
        const parsed = JSON.parse(input);
        document.getElementById('json-output').value = JSON.stringify(parsed, null, 2);
    } catch(e) {
        errEl.textContent = 'Invalid JSON: ' + e.message;
        errEl.style.display = 'block';
        document.getElementById('json-output').value = '';
    }
}

function minifyJSON() {
    const input = document.getElementById('json-input').value.trim();
    const errEl = document.getElementById('json-error');
    errEl.style.display = 'none';
    try {
        const parsed = JSON.parse(input);
        document.getElementById('json-output').value = JSON.stringify(parsed);
    } catch(e) {
        errEl.textContent = 'Invalid JSON: ' + e.message;
        errEl.style.display = 'block';
    }
}

function copyJSON() {
    const val = document.getElementById('json-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const msg = document.getElementById('json-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 15. BASE64 ENCODER/DECODER
// =============================================
function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    document.getElementById('base64-error').style.display = 'none';
    document.getElementById('base64-output').value = btoa(unescape(encodeURIComponent(input)));
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value.trim();
    const errEl = document.getElementById('base64-error');
    errEl.style.display = 'none';
    try {
        document.getElementById('base64-output').value = decodeURIComponent(escape(atob(input)));
    } catch(e) {
        errEl.textContent = 'Invalid Base64 string.';
        errEl.style.display = 'block';
    }
}

function copyBase64() {
    const val = document.getElementById('base64-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const msg = document.getElementById('base64-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 16. URL ENCODER/DECODER
// =============================================
function encodeURL() {
    document.getElementById('url-output').value = encodeURIComponent(document.getElementById('url-input').value);
}

function decodeURL() {
    try {
        document.getElementById('url-output').value = decodeURIComponent(document.getElementById('url-input').value);
    } catch(e) {
        document.getElementById('url-output').value = 'Invalid encoded URL.';
    }
}

function copyURL() {
    const val = document.getElementById('url-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const msg = document.getElementById('url-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 17. PERCENTAGE CALCULATOR
// =============================================
function calcPercent1() {
    const x = parseFloat(document.getElementById('p1-x').value);
    const y = parseFloat(document.getElementById('p1-y').value);
    document.getElementById('p1-result').textContent = isNaN(x)||isNaN(y) ? '---' : ((x/100)*y).toFixed(2);
}
function calcPercent2() {
    const x = parseFloat(document.getElementById('p2-x').value);
    const y = parseFloat(document.getElementById('p2-y').value);
    document.getElementById('p2-result').textContent = isNaN(x)||isNaN(y)||y===0 ? '---' : ((x/y)*100).toFixed(2) + '%';
}
function calcPercent3() {
    const x = parseFloat(document.getElementById('p3-x').value);
    const y = parseFloat(document.getElementById('p3-y').value);
    document.getElementById('p3-result').textContent = isNaN(x)||isNaN(y)||x===0 ? '---' : (((y-x)/x)*100).toFixed(2) + '%';
}

// =============================================
// 18. IMAGE CONVERTER
// =============================================
let imgConvertSource = null;
function loadImgConvert(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        imgConvertSource = e.target.result;
        const preview = document.getElementById('imgconv-preview');
        preview.src = imgConvertSource; preview.style.display = 'block';
        document.getElementById('imgconv-msg').textContent = 'Image loaded! Choose a format to download.';
    };
    reader.readAsDataURL(file);
}

function convertImage(mimeType, ext) {
    if (!imgConvertSource) { alert('Upload an image first.'); return; }
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (mimeType === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height); }
        ctx.drawImage(img, 0, 0);
        const a = document.createElement('a'); a.href = canvas.toDataURL(mimeType, 0.95); a.download = 'converted.' + ext; a.click();
    };
    img.src = imgConvertSource;
}

// =============================================
// 19. IMAGE COMPRESSOR
// =============================================
let imgCompressSource = null;
let imgCompressOriginalSize = 0;
function loadImgCompress(input) {
    const file = input.files[0];
    if (!file) return;
    imgCompressOriginalSize = file.size;
    const reader = new FileReader();
    reader.onload = e => {
        imgCompressSource = e.target.result;
        const info = document.getElementById('imgcomp-info');
        info.style.display = 'block';
        document.getElementById('imgcomp-preview').src = imgCompressSource;
        document.getElementById('imgcomp-size-info').textContent = `Original size: ${(file.size/1024).toFixed(1)} KB`;
    };
    reader.readAsDataURL(file);
}

function compressImage() {
    if (!imgCompressSource) { alert('Upload an image first.'); return; }
    const quality = parseInt(document.getElementById('comp-quality').value) / 100;
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxSize = Math.round((dataUrl.length * 3/4) / 1024);
        document.getElementById('imgcomp-size-info').textContent = `Original: ${(imgCompressOriginalSize/1024).toFixed(1)} KB → Compressed: ~${approxSize} KB`;
        const a = document.createElement('a'); a.href = dataUrl; a.download = 'compressed.jpg'; a.click();
    };
    img.src = imgCompressSource;
}

// =============================================
// 20. TEXT DIFF CHECKER
// =============================================
function checkDiff() {
    const orig = document.getElementById('diff-original').value.split('\n');
    const mod = document.getElementById('diff-modified').value.split('\n');
    const output = document.getElementById('diff-output');
    let html = '';
    const maxLen = Math.max(orig.length, mod.length);
    let hasDiff = false;
    for (let i = 0; i < maxLen; i++) {
        const o = orig[i] !== undefined ? orig[i] : '';
        const m = mod[i] !== undefined ? mod[i] : '';
        if (o === m) {
            html += `<span style="color:#aaa;">  ${escapeHtml(o)}</span>\n`;
        } else {
            hasDiff = true;
            if (o) html += `<span style="color:#ff6b6b; background:rgba(255,107,107,0.1);">- ${escapeHtml(o)}</span>\n`;
            if (m) html += `<span style="color:#90ee90; background:rgba(144,238,144,0.1);">+ ${escapeHtml(m)}</span>\n`;
        }
    }
    if (!hasDiff) html = '<span style="color:#90ee90;">✓ No differences found. Texts are identical.</span>';
    output.innerHTML = html;
}

function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// =============================================
// 21. META TAG GENERATOR
// =============================================
function generateMeta() {
    const title = document.getElementById('meta-title').value.trim();
    const desc = document.getElementById('meta-desc').value.trim();
    const keywords = document.getElementById('meta-keywords').value.trim();
    const url = document.getElementById('meta-url').value.trim();
    const author = document.getElementById('meta-author').value.trim();

    let tags = `<!-- Primary Meta Tags -->\n`;
    if (title) tags += `<title>${title}</title>\n<meta name="title" content="${title}">\n`;
    if (desc) tags += `<meta name="description" content="${desc}">\n`;
    if (keywords) tags += `<meta name="keywords" content="${keywords}">\n`;
    if (author) tags += `<meta name="author" content="${author}">\n`;
    tags += `<meta name="robots" content="index, follow">\n`;
    tags += `\n<!-- Open Graph / Facebook -->\n`;
    tags += `<meta property="og:type" content="website">\n`;
    if (url) tags += `<meta property="og:url" content="${url}">\n`;
    if (title) tags += `<meta property="og:title" content="${title}">\n`;
    if (desc) tags += `<meta property="og:description" content="${desc}">\n`;
    tags += `\n<!-- Twitter -->\n`;
    tags += `<meta property="twitter:card" content="summary_large_image">\n`;
    if (url) tags += `<meta property="twitter:url" content="${url}">\n`;
    if (title) tags += `<meta property="twitter:title" content="${title}">\n`;
    if (desc) tags += `<meta property="twitter:description" content="${desc}">\n`;

    document.getElementById('meta-output').value = tags;
}

function copyMeta() {
    const val = document.getElementById('meta-output').value;
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
        const msg = document.getElementById('meta-copy-msg');
        msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// =============================================
// 22. IP LOOKUP
// =============================================
function getMyIP() {
    const loading = document.getElementById('ip-loading');
    const result = document.getElementById('ip-result');
    loading.style.display = 'block';
    result.style.display = 'none';
    fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(data => {
            document.getElementById('ip-address').textContent = data.ip || '--';
            document.getElementById('ip-country').textContent = (data.country_flag_emoji || '') + ' ' + (data.country_name || '--');
            document.getElementById('ip-city').textContent = data.city || '--';
            document.getElementById('ip-region').textContent = data.region || '--';
            document.getElementById('ip-org').textContent = data.org || '--';
            document.getElementById('ip-timezone').textContent = data.timezone || '--';
            loading.style.display = 'none';
            result.style.display = 'block';
        })
        .catch(() => {
            loading.style.display = 'none';
            result.innerHTML = '<p class="text-muted">Could not fetch IP info. Try again.</p>';
            result.style.display = 'block';
        });
}

// =============================================
// 23. IMAGE RESIZER
// =============================================
let imgResizeSource = null;
let imgOriginalWidth = 0, imgOriginalHeight = 0;

function loadImgResize(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        imgResizeSource = e.target.result;
        const img = new Image();
        img.onload = () => {
            imgOriginalWidth = img.width;
            imgOriginalHeight = img.height;
            document.getElementById('resize-width').value = img.width;
            document.getElementById('resize-height').value = img.height;
            const preview = document.getElementById('imgresize-preview');
            preview.src = imgResizeSource; preview.style.display = 'block';
            document.getElementById('imgresize-msg').textContent = `Original: ${img.width} × ${img.height}px`;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Keep aspect ratio on width/height change
document.addEventListener('DOMContentLoaded', () => {
    const wInput = document.getElementById('resize-width');
    const hInput = document.getElementById('resize-height');
    if (wInput) {
        wInput.addEventListener('input', () => {
            if (document.getElementById('resize-ratio').checked && imgOriginalWidth > 0) {
                hInput.value = Math.round(wInput.value * imgOriginalHeight / imgOriginalWidth);
            }
        });
        hInput.addEventListener('input', () => {
            if (document.getElementById('resize-ratio').checked && imgOriginalHeight > 0) {
                wInput.value = Math.round(hInput.value * imgOriginalWidth / imgOriginalHeight);
            }
        });
    }
});

function resizeImage() {
    if (!imgResizeSource) { alert('Upload an image first.'); return; }
    const w = parseInt(document.getElementById('resize-width').value);
    const h = parseInt(document.getElementById('resize-height').value);
    if (!w || !h) { alert('Enter width and height.'); return; }
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = `resized_${w}x${h}.png`; a.click();
        document.getElementById('imgresize-msg').textContent = `Downloaded as ${w} × ${h}px PNG.`;
    };
    img.src = imgResizeSource;
}
