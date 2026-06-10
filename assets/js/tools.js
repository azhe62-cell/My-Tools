// ============================================================
// TOOLS REGISTRY — Add new tools here, they auto-appear in UI
// ============================================================
const TOOLS_REGISTRY = [
    { id: 'qr',         icon: 'fa-qrcode',          label: 'QR Generator'       },
    { id: 'barcode',    icon: 'fa-barcode',          label: 'Barcode Studio'     },
    { id: 'password',   icon: 'fa-key',              label: 'Password Generator' },
    { id: 'case',       icon: 'fa-font',             label: 'Case Converter'     },
    { id: 'bmi',        icon: 'fa-weight-scale',     label: 'BMI Calculator'     },
    { id: 'unit',       icon: 'fa-arrows-rotate',    label: 'Unit Converter'     },
    { id: 'color',      icon: 'fa-palette',          label: 'Color Picker'       },
    { id: 'lorem',      icon: 'fa-align-left',       label: 'Lorem Ipsum'        },
    { id: 'imgresizer', icon: 'fa-crop',             label: 'Image Resizer'      },
    { id: 'word',       icon: 'fa-spell-check',      label: 'Word Counter'       },
    { id: 'typing',     icon: 'fa-keyboard',         label: 'Typing Speed'       },
    { id: 'age',        icon: 'fa-calendar',         label: 'Age Calculator'     },
    { id: 'currency',   icon: 'fa-coins',            label: 'Currency Rates'     },
    { id: 'morse',      icon: 'fa-wave-square',      label: 'Morse Cipher'       },
    // To add a new tool: add a line here + add its HTML panel in tools.html
];

// Auto-build tools selector grid
function buildToolsGrid() {
    const grid = document.getElementById('tools-selector');
    if (!grid) return;
    grid.innerHTML = '';
    TOOLS_REGISTRY.forEach(tool => {
        const card = document.createElement('div');
        card.className = 'tool-card glass-card p-4';
        card.setAttribute('onclick', `openTool('${tool.id}')`);
        card.innerHTML = `<i class="fa-solid ${tool.icon} text-gold fa-3x mb-3"></i><h4 style="font-size:1.2rem;">${tool.label}</h4>`;
        grid.appendChild(card);
    });
}
buildToolsGrid();

// ============================================================
// 1. QR Code Generator — FIXED (auto adds https://)
// ============================================================
const qrBtn = document.getElementById('qr-btn');
const qrDownloadBtn = document.getElementById('qr-download-btn');
const qrSuccessMsg = document.getElementById('qr-success-msg');
if (qrBtn) {
    qrBtn.addEventListener('click', () => {
        let input = document.getElementById('qr-input').value.trim();
        const container = document.getElementById('qrcode-canvas');
        if (qrDownloadBtn) qrDownloadBtn.classList.add('hidden');
        if (qrSuccessMsg) { qrSuccessMsg.classList.add('hidden'); qrSuccessMsg.style.opacity = '0'; }
        if (!input) { alert('Please enter text or a URL'); return; }
        // Auto-add https:// for URLs without protocol
        if (/^([\w-]+\.)+[\w-]+(\/.*)?$/.test(input) && !/^https?:\/\//i.test(input)) {
            input = 'https://' + input;
            document.getElementById('qr-input').value = input;
        }
        container.innerHTML = '';
        qrBtn.disabled = true;
        qrBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Generating...';
        setTimeout(() => {
            new QRCode(container, { text: input, width: 260, height: 260, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
            qrBtn.disabled = false;
            qrBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles me-2"></i> Generate QR Code';
            if (qrDownloadBtn) { qrDownloadBtn.classList.remove('hidden'); setTimeout(() => qrDownloadBtn.style.opacity = '1', 50); }
            if (qrSuccessMsg) { qrSuccessMsg.classList.remove('hidden'); setTimeout(() => qrSuccessMsg.style.opacity = '1', 50); }
        }, 300);
    });
    if (qrDownloadBtn) {
        qrDownloadBtn.addEventListener('click', () => {
            const canvas = document.querySelector('#qrcode-canvas canvas');
            const img = document.querySelector('#qrcode-canvas img');
            const src = canvas || img;
            if (!src) return;
            const temp = document.createElement('canvas');
            temp.width = 260; temp.height = 260;
            const ctx = temp.getContext('2d');
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 260, 260);
            ctx.drawImage(src, 0, 0, 260, 260);
            const a = document.createElement('a');
            a.href = temp.toDataURL('image/png');
            a.download = 'qrcode-toolmetri.png';
            a.click();
        });
    }
}

// ============================================================
// 2. Barcode Generator — FIXED
// ============================================================
const barcodeBtn = document.getElementById('barcode-btn');
const barcodeDownloadBtn = document.getElementById('barcode-download-btn');
const barcodeSuccessMsg = document.getElementById('barcode-success-msg');
if (barcodeBtn) {
    barcodeBtn.addEventListener('click', () => {
        const input = document.getElementById('barcode-input').value.trim();
        const svgEl = document.getElementById('barcode-canvas');
        if (barcodeDownloadBtn) barcodeDownloadBtn.classList.add('hidden');
        if (barcodeSuccessMsg) { barcodeSuccessMsg.classList.add('hidden'); barcodeSuccessMsg.style.opacity = '0'; }
        if (!input) { alert('Please enter a value'); return; }
        while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
        svgEl.removeAttribute('style');
        barcodeBtn.disabled = true;
        barcodeBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Generating...';
        setTimeout(() => {
            try {
                JsBarcode(svgEl, input, { format: "CODE128", lineColor: "#000000", background: "#ffffff", width: 2.5, height: 100, displayValue: true, font: "monospace", fontSize: 18, textMargin: 6, margin: 14 });
                if (barcodeDownloadBtn) { barcodeDownloadBtn.classList.remove('hidden'); setTimeout(() => barcodeDownloadBtn.style.opacity = '1', 50); }
                if (barcodeSuccessMsg) { barcodeSuccessMsg.classList.remove('hidden'); setTimeout(() => barcodeSuccessMsg.style.opacity = '1', 50); }
            } catch(e) { alert('Could not generate barcode. Use letters and numbers only.'); }
            barcodeBtn.disabled = false;
            barcodeBtn.innerHTML = '<i class="fa-solid fa-barcode me-2"></i> Render Barcode';
        }, 300);
    });
    if (barcodeDownloadBtn) {
        barcodeDownloadBtn.addEventListener('click', () => {
            const svg = document.getElementById('barcode-canvas');
            const data = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width; canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                const a = document.createElement('a');
                a.download = 'barcode-toolmetri.png';
                a.href = canvas.toDataURL('image/png');
                a.click();
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
        });
    }
}

// ============================================================
// 3. Word Counter
// ============================================================
const wordInput = document.getElementById('word-input');
if (wordInput) {
    wordInput.addEventListener('input', () => {
        const t = wordInput.value;
        document.getElementById('word-count').innerText = t.trim() === '' ? 0 : t.trim().split(/\s+/).length;
        document.getElementById('char-count').innerText = t.length;
        document.getElementById('char-no-space').innerText = t.replace(/\s/g, '').length;
    });
}

// ============================================================
// 4. Age Calculator
// ============================================================
const ageBtn = document.getElementById('age-btn');
if (ageBtn) {
    ageBtn.addEventListener('click', () => {
        const dobVal = document.getElementById('dob-input').value;
        if (!dobVal) return;
        const dob = new Date(dobVal), today = new Date();
        let y = today.getFullYear() - dob.getFullYear();
        let m = today.getMonth() - dob.getMonth();
        let d = today.getDate() - dob.getDate();
        if (m < 0 || (m === 0 && d < 0)) { y--; m += 12; }
        if (d < 0) { d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); m--; }
        document.getElementById('age-result').innerText = y + " Years";
        document.getElementById('age-details').innerText = `${m} Months, ${d} Days`;
    });
}

// ============================================================
// 5. Currency Converter
// ============================================================
const currBtn = document.getElementById('curr-btn');
const currFrom = document.getElementById('curr-from');
const currTo = document.getElementById('curr-to');
if (currBtn && currFrom && currTo) {
    let rates = {};
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(r => r.json())
        .then(data => {
            rates = data.rates;
            const opts = Object.keys(rates).sort().map(c => `<option value="${c}">${c}</option>`).join('');
            currFrom.innerHTML = opts; currTo.innerHTML = opts;
            currFrom.value = 'USD'; currTo.value = 'EUR';
        })
        .catch(() => { rates = { USD:1,EUR:0.92,GBP:0.79,JPY:151.2,INR:83.4,AUD:1.5,CAD:1.35,PKR:278 }; });
    currBtn.addEventListener('click', () => {
        const amt = parseFloat(document.getElementById('curr-amount').value);
        if (isNaN(amt)) return;
        document.getElementById('curr-result').innerText = ((amt / rates[currFrom.value]) * rates[currTo.value]).toFixed(2) + ' ' + currTo.value;
    });
}

// ============================================================
// 6. Morse Code
// ============================================================
const toMorseBtn = document.getElementById('to-morse-btn');
if (toMorseBtn) {
    const M = {'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','0':'-----',' ':' / '};
    const R = Object.fromEntries(Object.entries(M).map(([k,v])=>[v,k]));
    toMorseBtn.addEventListener('click', () => {
        const t = document.getElementById('morse-input').value.toUpperCase();
        document.getElementById('morse-output').innerText = t.split('').map(c=>M[c]||c).join(' ').trim() || 'Awaiting Signal...';
    });
    document.getElementById('to-text-btn').addEventListener('click', () => {
        const parts = document.getElementById('morse-input').value.trim().split(' ');
        document.getElementById('morse-output').innerText = parts.map(p=>p==='/'?' ':(R[p]||p)).join('') || 'Awaiting Signal...';
    });
}

// ============================================================
// 7. Typing Test
// ============================================================
const typeStartBtn = document.getElementById('start-typing-btn');
if (typeStartBtn) {
    const quotes = {
        easy: ["The sun is shining brightly today.","A cat sat on the mat.","I love to eat fresh apples.","Technology is advancing fast.","This is a premium service."],
        medium: ["Success is not final, failure is not fatal.","Life is what happens when you're busy making other plans.","The quick brown fox jumps over the lazy dog."],
        hard: ["To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer.","Quantum computing algorithms significantly alter current cryptography methodologies.","Robust system architectures depend on resilient infrastructure protocols."]
    };
    let timer=60,interval=null,playing=false,currentQuote='',currentDiff='easy';
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            if(playing) return;
            document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
            e.target.classList.add('active');
            currentDiff = e.target.getAttribute('data-diff');
        });
    });
    typeStartBtn.addEventListener('click', () => {
        const box = document.getElementById('quote-display'), inp = document.getElementById('typing-input');
        if (!playing) {
            playing=true; timer=60;
            const list=quotes[currentDiff];
            currentQuote=list[Math.floor(Math.random()*list.length)];
            box.innerHTML='';
            currentQuote.split('').forEach(c=>{ const s=document.createElement('span'); s.innerText=c; box.appendChild(s); });
            inp.disabled=false; inp.value=''; inp.focus();
            typeStartBtn.innerHTML='<i class="fa-solid fa-stop me-2"></i> Stop';
            document.getElementById('wpm-display').innerText='0';
            document.getElementById('acc-display').innerText='100%';
            interval=setInterval(()=>{ timer--; document.getElementById('time-display').innerText=timer+'s'; if(timer<=0) endTest(); },1000);
        } else endTest();
    });
    document.getElementById('typing-input').addEventListener('input', e => {
        if(!playing) return;
        const spans=document.querySelectorAll('#quote-display span'), typed=e.target.value.split('');
        let ok=true;
        spans.forEach((s,i)=>{ if(typed[i]==null){s.classList.remove('text-gold','text-error');ok=false;} else if(typed[i]===s.innerText){s.classList.add('text-gold');s.classList.remove('text-error');} else{s.classList.add('text-error');s.classList.remove('text-gold');ok=false;} });
        calcStats(e.target.value,currentQuote);
        if(ok) endTest();
    });
    function endTest(){ playing=false; clearInterval(interval); const i=document.getElementById('typing-input'); i.disabled=true; typeStartBtn.innerHTML='<i class="fa-solid fa-redo me-2"></i> Restart'; calcStats(i.value,currentQuote); }
    function calcStats(typed,actual){ if(!typed) return; const mins=(60-timer)/60||1/60; const wpm=Math.round(typed.trim().split(/\s+/).length/mins); let c=0; for(let i=0;i<typed.length;i++) if(typed[i]===actual[i]) c++; const acc=typed.length>0?Math.round((c/typed.length)*100):100; document.getElementById('wpm-display').innerText=isFinite(wpm)?wpm:0; document.getElementById('acc-display').innerText=acc+'%'; }
}

// ============================================================
// 8. Password Generator
// ============================================================
const passBtn = document.getElementById('pass-btn');
if (passBtn) {
    passBtn.addEventListener('click', generatePassword);
    function generatePassword() {
        const len = parseInt(document.getElementById('pass-length').value);
        const upper = document.getElementById('pass-upper').checked ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '';
        const lower = document.getElementById('pass-lower').checked ? 'abcdefghijklmnopqrstuvwxyz' : '';
        const nums  = document.getElementById('pass-numbers').checked ? '0123456789' : '';
        const syms  = document.getElementById('pass-symbols').checked ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '';
        const chars = upper + lower + nums + syms;
        if (!chars) { alert('Select at least one character type'); return; }
        let pwd = '';
        for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
        document.getElementById('password-output').innerText = pwd;
    }
}
function copyPassword() {
    const pwd = document.getElementById('password-output').innerText;
    if (pwd === 'Click Generate') return;
    navigator.clipboard.writeText(pwd).then(() => {
        const msg = document.getElementById('pass-copied');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 2000);
    });
}

// ============================================================
// 9. Case Converter
// ============================================================
function convertCase(type) {
    const input = document.getElementById('case-input').value;
    let result = '';
    switch(type) {
        case 'upper': result = input.toUpperCase(); break;
        case 'lower': result = input.toLowerCase(); break;
        case 'title': result = input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); break;
        case 'sentence': result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
        case 'alternate': result = input.split('').map((c,i) => i%2===0 ? c.toLowerCase() : c.toUpperCase()).join(''); break;
    }
    document.getElementById('case-output').value = result;
}
function copyCaseOutput() {
    const text = document.getElementById('case-output').value;
    if (text) navigator.clipboard.writeText(text);
}

// ============================================================
// 10. BMI Calculator
// ============================================================
const bmiBtn = document.getElementById('bmi-btn');
if (bmiBtn) {
    bmiBtn.addEventListener('click', () => {
        const w = parseFloat(document.getElementById('bmi-weight').value);
        const h = parseFloat(document.getElementById('bmi-height').value) / 100;
        if (!w || !h) { alert('Enter both weight and height'); return; }
        const bmi = (w / (h * h)).toFixed(1);
        let category = '', color = '';
        if (bmi < 18.5) { category='Underweight'; color='#3b82f6'; }
        else if (bmi < 25) { category='Normal Weight'; color='#22c55e'; }
        else if (bmi < 30) { category='Overweight'; color='#f59e0b'; }
        else { category='Obese'; color='#ef4444'; }
        document.getElementById('bmi-result').innerText = bmi;
        document.getElementById('bmi-result').style.color = color;
        document.getElementById('bmi-category').innerText = category;
        document.getElementById('bmi-scale').style.display = 'block';
    });
}

// ============================================================
// 11. Unit Converter
// ============================================================
const unitData = {
    length:      { units: ['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch'], toBase: [1,1000,0.01,0.001,1609.34,0.9144,0.3048,0.0254] },
    weight:      { units: ['Kilogram','Gram','Pound','Ounce','Ton'], toBase: [1,0.001,0.453592,0.0283495,1000] },
    temperature: { units: ['Celsius','Fahrenheit','Kelvin'], toBase: null },
    speed:       { units: ['m/s','km/h','mph','knot'], toBase: [1,0.277778,0.44704,0.514444] },
    area:        { units: ['m²','km²','cm²','Acre','Hectare'], toBase: [1,1e6,0.0001,4046.86,10000] }
};
function updateUnitDropdowns() {
    const cat = document.getElementById('unit-category').value;
    const { units } = unitData[cat];
    const opts = units.map(u=>`<option value="${u}">${u}</option>`).join('');
    document.getElementById('unit-from').innerHTML = opts;
    document.getElementById('unit-to').innerHTML = opts;
    if (units.length > 1) document.getElementById('unit-to').selectedIndex = 1;
}
updateUnitDropdowns();
const unitBtn = document.getElementById('unit-btn');
if (unitBtn) {
    unitBtn.addEventListener('click', () => {
        const cat = document.getElementById('unit-category').value;
        const from = document.getElementById('unit-from').value;
        const to   = document.getElementById('unit-to').value;
        const val  = parseFloat(document.getElementById('unit-input').value);
        if (isNaN(val)) { document.getElementById('unit-result').innerText = '--'; return; }
        const { units, toBase } = unitData[cat];
        let result;
        if (cat === 'temperature') {
            let celsius;
            if (from==='Celsius') celsius=val;
            else if (from==='Fahrenheit') celsius=(val-32)*5/9;
            else celsius=val-273.15;
            if (to==='Celsius') result=celsius;
            else if (to==='Fahrenheit') result=celsius*9/5+32;
            else result=celsius+273.15;
        } else {
            const fi=units.indexOf(from), ti=units.indexOf(to);
            result = val * toBase[fi] / toBase[ti];
        }
        document.getElementById('unit-result').innerText = parseFloat(result.toFixed(6));
    });
}

// ============================================================
// 12. Color Picker
// ============================================================
const colorPicker = document.getElementById('color-picker');
if (colorPicker) {
    colorPicker.addEventListener('input', updateColor);
    function updateColor() {
        const hex = colorPicker.value;
        const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
        const r1=r/255, g1=g/255, b1=b/255;
        const max=Math.max(r1,g1,b1), min=Math.min(r1,g1,b1), d=max-min;
        let h=0,s=0,l=(max+min)/2;
        if(d){ s=d/(1-Math.abs(2*l-1)); if(max===r1) h=((g1-b1)/d)%6; else if(max===g1) h=(b1-r1)/d+2; else h=(r1-g1)/d+4; h=Math.round(h*60); if(h<0)h+=360; }
        document.getElementById('color-hex').innerText = hex.toUpperCase();
        document.getElementById('color-rgb').innerText = `${r}, ${g}, ${b}`;
        document.getElementById('color-hsl').innerText = `${h}°, ${Math.round(s*100)}%, ${Math.round(l*100)}%`;
        document.getElementById('color-preview').style.background = hex;
    }
    updateColor();
}
function copyColor() {
    const hex = document.getElementById('color-hex').innerText;
    navigator.clipboard.writeText(hex);
}

// ============================================================
// 13. Lorem Ipsum Generator
// ============================================================
const loremBtn = document.getElementById('lorem-btn');
if (loremBtn) {
    const loremBase = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(' ');
    function randomSentence() { const len=Math.floor(Math.random()*10)+6; let s=[]; for(let i=0;i<len;i++) s.push(loremBase[Math.floor(Math.random()*loremBase.length)]); return s.join(' ').replace(/^\w/,c=>c.toUpperCase())+'.'; }
    function randomParagraph() { const n=Math.floor(Math.random()*4)+4; let p=[]; for(let i=0;i<n;i++) p.push(randomSentence()); return p.join(' '); }
    loremBtn.addEventListener('click', () => {
        const count = parseInt(document.getElementById('lorem-count').value)||3;
        const type  = document.getElementById('lorem-type').value;
        let output = '';
        if (type==='paragraphs') { let p=[]; for(let i=0;i<count;i++) p.push(randomParagraph()); output=p.join('\n\n'); }
        else if (type==='sentences') { let s=[]; for(let i=0;i<count;i++) s.push(randomSentence()); output=s.join(' '); }
        else { output=loremBase.slice(0,count).join(' '); }
        document.getElementById('lorem-output').value = output;
    });
}
function copyLorem() { const t=document.getElementById('lorem-output').value; if(t) navigator.clipboard.writeText(t); }

// ============================================================
// 14. Image Resizer
// ============================================================
const imgUpload = document.getElementById('img-upload');
if (imgUpload) {
    let origWidth=0, origHeight=0;
    imgUpload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const img = new Image();
            img.onload = () => {
                origWidth=img.width; origHeight=img.height;
                document.getElementById('img-width').value = img.width;
                document.getElementById('img-height').value = img.height;
                document.getElementById('img-controls').style.display='block';
                document.getElementById('img-drop-zone').innerHTML=`<i class="fa-solid fa-check-circle fa-3x text-gold mb-3"></i><p class="text-muted">${file.name} — ${img.width}×${img.height}px</p>`;
            };
            img.src = ev.target.result;
            window._imgSrc = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
    document.getElementById('img-width').addEventListener('input', e => {
        if (document.getElementById('img-ratio').checked && origWidth)
            document.getElementById('img-height').value = Math.round(e.target.value * origHeight / origWidth);
    });
    document.getElementById('img-height').addEventListener('input', e => {
        if (document.getElementById('img-ratio').checked && origHeight)
            document.getElementById('img-width').value = Math.round(e.target.value * origWidth / origHeight);
    });
    document.getElementById('img-resize-btn').addEventListener('click', () => {
        const w=parseInt(document.getElementById('img-width').value);
        const h=parseInt(document.getElementById('img-height').value);
        if (!w||!h||!window._imgSrc) return;
        const canvas=document.getElementById('img-canvas');
        canvas.width=w; canvas.height=h;
        const ctx=canvas.getContext('2d');
        const img=new Image();
        img.onload=()=>{ ctx.drawImage(img,0,0,w,h); const link=document.getElementById('img-download'); link.href=canvas.toDataURL('image/png'); link.classList.remove('hidden'); };
        img.src=window._imgSrc;
    });
}
