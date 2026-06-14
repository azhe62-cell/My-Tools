// ============================================================
// TOOLS REGISTRY — Add new tools here, they auto-appear in UI
// ============================================================
const TOOLS_REGISTRY = [
    { id: 'qr',          icon: 'fa-qrcode',        label: 'QR Generator'         },
    { id: 'barcode',     icon: 'fa-barcode',        label: 'Barcode Studio'       },
    { id: 'password',    icon: 'fa-key',            label: 'Password Generator'   },
    { id: 'case',        icon: 'fa-font',           label: 'Case Converter'       },
    { id: 'bmi',         icon: 'fa-weight-scale',   label: 'BMI Calculator'       },
    { id: 'unit',        icon: 'fa-arrows-rotate',  label: 'Unit Converter'       },
    { id: 'color',       icon: 'fa-palette',        label: 'Color Picker'         },
    { id: 'lorem',       icon: 'fa-align-left',     label: 'Lorem Ipsum'          },
    { id: 'imgresizer',  icon: 'fa-crop',           label: 'Image Resizer'        },
    { id: 'imgconvert',  icon: 'fa-file-image',     label: 'Image Converter'      },
    { id: 'imgcompress', icon: 'fa-compress',       label: 'Image Compressor'     },
    { id: 'json',        icon: 'fa-code',           label: 'JSON Formatter'       },
    { id: 'base64',      icon: 'fa-lock',           label: 'Base64 Encoder'       },
    { id: 'url',         icon: 'fa-link',           label: 'URL Encoder/Decoder'  },
    { id: 'percent',     icon: 'fa-percent',        label: 'Percentage Calc'      },
    { id: 'diff',        icon: 'fa-code-compare',   label: 'Text Diff Checker'    },
    { id: 'metatag',     icon: 'fa-tags',           label: 'Meta Tag Generator'   },
    { id: 'ip',          icon: 'fa-globe',          label: 'IP Lookup'            },
    { id: 'emi',         icon: 'fa-money-bill-wave',label: 'Loan / EMI Calculator'},
    { id: 'compound',    icon: 'fa-chart-line',     label: 'Compound Interest'    },
    { id: 'word',        icon: 'fa-spell-check',    label: 'Word Counter'         },
    { id: 'typing',      icon: 'fa-keyboard',       label: 'Typing Speed'         },
    { id: 'age',         icon: 'fa-calendar',       label: 'Age Calculator'       },
    { id: 'currency',    icon: 'fa-coins',          label: 'Currency Rates'       },
    { id: 'morse',       icon: 'fa-wave-square',    label: 'Morse Cipher'         },
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
// 1. QR Code Generator — FIXED
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
                a.download = 'barcode-toolmetri.png'; a.href = canvas.toDataURL('image/png'); a.click();
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
        document.getElementById('morse-output').innerText = document.getElementById('morse-input').value.toUpperCase().split('').map(c=>M[c]||c).join(' ').trim() || 'Awaiting Signal...';
    });
    document.getElementById('to-text-btn').addEventListener('click', () => {
        document.getElementById('morse-output').innerText = document.getElementById('morse-input').value.trim().split(' ').map(p=>p==='/'?' ':(R[p]||p)).join('') || 'Awaiting Signal...';
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
            currentQuote=quotes[currentDiff][Math.floor(Math.random()*quotes[currentDiff].length)];
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
        const chars = (document.getElementById('pass-upper').checked?'ABCDEFGHIJKLMNOPQRSTUVWXYZ':'')+(document.getElementById('pass-lower').checked?'abcdefghijklmnopqrstuvwxyz':'')+(document.getElementById('pass-numbers').checked?'0123456789':'')+(document.getElementById('pass-symbols').checked?'!@#$%^&*()_+-=[]{}|;:,.<>?':'');
        if (!chars) { alert('Select at least one character type'); return; }
        let pwd = '';
        for (let i = 0; i < len; i++) pwd += chars[Math.floor(Math.random()*chars.length)];
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
    const results = { upper: input.toUpperCase(), lower: input.toLowerCase(), title: input.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()), sentence: input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,c=>c.toUpperCase()), alternate: input.split('').map((c,i)=>i%2===0?c.toLowerCase():c.toUpperCase()).join('') };
    document.getElementById('case-output').value = results[type] || '';
}
function copyCaseOutput() { const t=document.getElementById('case-output').value; if(t) navigator.clipboard.writeText(t); }

// ============================================================
// 10. BMI Calculator
// ============================================================
const bmiBtn = document.getElementById('bmi-btn');
if (bmiBtn) {
    bmiBtn.addEventListener('click', () => {
        const w=parseFloat(document.getElementById('bmi-weight').value), h=parseFloat(document.getElementById('bmi-height').value)/100;
        if(!w||!h){alert('Enter both weight and height');return;}
        const bmi=(w/(h*h)).toFixed(1);
        let cat='',col='';
        if(bmi<18.5){cat='Underweight';col='#3b82f6';}else if(bmi<25){cat='Normal Weight';col='#22c55e';}else if(bmi<30){cat='Overweight';col='#f59e0b';}else{cat='Obese';col='#ef4444';}
        document.getElementById('bmi-result').innerText=bmi;
        document.getElementById('bmi-result').style.color=col;
        document.getElementById('bmi-category').innerText=cat;
        document.getElementById('bmi-scale').style.display='block';
    });
}

// ============================================================
// 11. Unit Converter
// ============================================================
const unitData = {
    length:      {units:['Meter','Kilometer','Centimeter','Millimeter','Mile','Yard','Foot','Inch'],toBase:[1,1000,0.01,0.001,1609.34,0.9144,0.3048,0.0254]},
    weight:      {units:['Kilogram','Gram','Pound','Ounce','Ton'],toBase:[1,0.001,0.453592,0.0283495,1000]},
    temperature: {units:['Celsius','Fahrenheit','Kelvin'],toBase:null},
    speed:       {units:['m/s','km/h','mph','knot'],toBase:[1,0.277778,0.44704,0.514444]},
    area:        {units:['m²','km²','cm²','Acre','Hectare'],toBase:[1,1e6,0.0001,4046.86,10000]}
};
function updateUnitDropdowns() {
    const cat=document.getElementById('unit-category').value, {units}=unitData[cat];
    const opts=units.map(u=>`<option value="${u}">${u}</option>`).join('');
    document.getElementById('unit-from').innerHTML=opts;
    document.getElementById('unit-to').innerHTML=opts;
    if(units.length>1) document.getElementById('unit-to').selectedIndex=1;
}
if(document.getElementById('unit-category')) updateUnitDropdowns();
const unitBtn=document.getElementById('unit-btn');
if(unitBtn){
    unitBtn.addEventListener('click',()=>{
        const cat=document.getElementById('unit-category').value, from=document.getElementById('unit-from').value, to=document.getElementById('unit-to').value, val=parseFloat(document.getElementById('unit-input').value);
        if(isNaN(val)){document.getElementById('unit-result').innerText='--';return;}
        const {units,toBase}=unitData[cat]; let result;
        if(cat==='temperature'){let c;if(from==='Celsius')c=val;else if(from==='Fahrenheit')c=(val-32)*5/9;else c=val-273.15;if(to==='Celsius')result=c;else if(to==='Fahrenheit')result=c*9/5+32;else result=c+273.15;}
        else{const fi=units.indexOf(from),ti=units.indexOf(to);result=val*toBase[fi]/toBase[ti];}
        document.getElementById('unit-result').innerText=parseFloat(result.toFixed(6));
    });
}

// ============================================================
// 12. Color Picker
// ============================================================
const colorPicker=document.getElementById('color-picker');
if(colorPicker){
    colorPicker.addEventListener('input',updateColor);
    function updateColor(){
        const hex=colorPicker.value, r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
        const r1=r/255,g1=g/255,b1=b/255,max=Math.max(r1,g1,b1),min=Math.min(r1,g1,b1),d=max-min;
        let h=0,s=0,l=(max+min)/2;
        if(d){s=d/(1-Math.abs(2*l-1));if(max===r1)h=((g1-b1)/d)%6;else if(max===g1)h=(b1-r1)/d+2;else h=(r1-g1)/d+4;h=Math.round(h*60);if(h<0)h+=360;}
        document.getElementById('color-hex').innerText=hex.toUpperCase();
        document.getElementById('color-rgb').innerText=`${r}, ${g}, ${b}`;
        document.getElementById('color-hsl').innerText=`${h}°, ${Math.round(s*100)}%, ${Math.round(l*100)}%`;
        document.getElementById('color-preview').style.background=hex;
    }
    updateColor();
}
function copyColor(){navigator.clipboard.writeText(document.getElementById('color-hex').innerText);}

// ============================================================
// 13. Lorem Ipsum
// ============================================================
const loremBtn=document.getElementById('lorem-btn');
if(loremBtn){
    const W="Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur".split(' ');
    const rS=()=>{let s=[];for(let i=0;i<Math.floor(Math.random()*10)+6;i++)s.push(W[Math.floor(Math.random()*W.length)]);return s.join(' ').replace(/^\w/,c=>c.toUpperCase())+'.';}
    const rP=()=>{let p=[];for(let i=0;i<Math.floor(Math.random()*4)+4;i++)p.push(rS());return p.join(' ');}
    loremBtn.addEventListener('click',()=>{
        const count=parseInt(document.getElementById('lorem-count').value)||3, type=document.getElementById('lorem-type').value;
        let out='';
        if(type==='paragraphs'){let p=[];for(let i=0;i<count;i++)p.push(rP());out=p.join('\n\n');}
        else if(type==='sentences'){let s=[];for(let i=0;i<count;i++)s.push(rS());out=s.join(' ');}
        else out=W.slice(0,count).join(' ');
        document.getElementById('lorem-output').value=out;
    });
}
function copyLorem(){const t=document.getElementById('lorem-output').value;if(t)navigator.clipboard.writeText(t);}

// ============================================================
// 14. Image Resizer
// ============================================================
const imgUpload=document.getElementById('img-upload');
if(imgUpload){
    let oW=0,oH=0;
    imgUpload.addEventListener('change',e=>{
        const file=e.target.files[0]; if(!file)return;
        const reader=new FileReader();
        reader.onload=ev=>{const img=new Image();img.onload=()=>{oW=img.width;oH=img.height;document.getElementById('img-width').value=img.width;document.getElementById('img-height').value=img.height;document.getElementById('img-controls').style.display='block';document.getElementById('img-drop-zone').innerHTML=`<i class="fa-solid fa-check-circle fa-3x text-gold mb-3"></i><p class="text-muted">${file.name} — ${img.width}×${img.height}px</p>`;};img.src=ev.target.result;window._imgSrc=ev.target.result;};
        reader.readAsDataURL(file);
    });
    document.getElementById('img-width').addEventListener('input',e=>{if(document.getElementById('img-ratio').checked&&oW)document.getElementById('img-height').value=Math.round(e.target.value*oH/oW);});
    document.getElementById('img-height').addEventListener('input',e=>{if(document.getElementById('img-ratio').checked&&oH)document.getElementById('img-width').value=Math.round(e.target.value*oW/oH);});
    document.getElementById('img-resize-btn').addEventListener('click',()=>{
        const w=parseInt(document.getElementById('img-width').value),h=parseInt(document.getElementById('img-height').value);
        if(!w||!h||!window._imgSrc)return;
        const canvas=document.getElementById('img-canvas');canvas.width=w;canvas.height=h;
        const img=new Image();img.onload=()=>{canvas.getContext('2d').drawImage(img,0,0,w,h);const link=document.getElementById('img-download');link.href=canvas.toDataURL('image/png');link.classList.remove('hidden');};img.src=window._imgSrc;
    });
}

// ============================================================
// 15. Image Converter (PNG/JPG/WEBP)
// ============================================================
const imgConvertUpload=document.getElementById('imgconvert-upload');
if(imgConvertUpload){
    imgConvertUpload.addEventListener('change',e=>{
        const file=e.target.files[0]; if(!file)return;
        document.getElementById('imgconvert-zone').innerHTML=`<i class="fa-solid fa-check-circle fa-3x text-gold mb-3"></i><p class="text-muted">${file.name} uploaded</p>`;
        document.getElementById('imgconvert-controls').style.display='block';
        const reader=new FileReader();
        reader.onload=ev=>{window._convertSrc=ev.target.result;};
        reader.readAsDataURL(file);
    });
    document.getElementById('imgconvert-btn').addEventListener('click',()=>{
        if(!window._convertSrc){alert('Please upload an image first');return;}
        const fmt=document.getElementById('imgconvert-format').value;
        const quality=parseFloat(document.getElementById('imgconvert-quality').value)||0.92;
        const img=new Image();
        img.onload=()=>{
            const canvas=document.createElement('canvas');
            canvas.width=img.width;canvas.height=img.height;
            canvas.getContext('2d').drawImage(img,0,0);
            const mimeMap={'png':'image/png','jpg':'image/jpeg','webp':'image/webp'};
            const link=document.getElementById('imgconvert-download');
            link.href=canvas.toDataURL(mimeMap[fmt],quality);
            link.download=`converted-toolmetri.${fmt}`;
            link.classList.remove('hidden');
            link.style.display='block';
        };
        img.src=window._convertSrc;
    });
}

// ============================================================
// 16. Image Compressor
// ============================================================
const imgCompressUpload=document.getElementById('imgcompress-upload');
if(imgCompressUpload){
    imgCompressUpload.addEventListener('change',e=>{
        const file=e.target.files[0]; if(!file)return;
        document.getElementById('imgcompress-zone').innerHTML=`<i class="fa-solid fa-check-circle fa-3x text-gold mb-3"></i><p class="text-muted">${file.name} — ${(file.size/1024).toFixed(1)} KB</p>`;
        document.getElementById('imgcompress-controls').style.display='block';
        const reader=new FileReader();
        reader.onload=ev=>{window._compressSrc=ev.target.result;window._origSize=file.size;};
        reader.readAsDataURL(file);
    });
    document.getElementById('imgcompress-btn').addEventListener('click',()=>{
        if(!window._compressSrc){alert('Please upload an image first');return;}
        const quality=parseInt(document.getElementById('imgcompress-quality').value)/100;
        const img=new Image();
        img.onload=()=>{
            const canvas=document.createElement('canvas');
            canvas.width=img.width;canvas.height=img.height;
            canvas.getContext('2d').drawImage(img,0,0);
            const dataUrl=canvas.toDataURL('image/jpeg',quality);
            const newSize=Math.round((dataUrl.length*3)/4/1024);
            const origKB=(window._origSize/1024).toFixed(1);
            document.getElementById('imgcompress-info').innerText=`Original: ${origKB} KB → Compressed: ~${newSize} KB`;
            document.getElementById('imgcompress-info').style.display='block';
            const link=document.getElementById('imgcompress-download');
            link.href=dataUrl;link.download='compressed-toolmetri.jpg';
            link.classList.remove('hidden');link.style.display='block';
        };
        img.src=window._compressSrc;
    });
    const slider=document.getElementById('imgcompress-quality');
    if(slider) slider.addEventListener('input',()=>{document.getElementById('imgcompress-quality-label').innerText=slider.value+'%';});
}

// ============================================================
// 17. JSON Formatter
// ============================================================
const jsonBtn=document.getElementById('json-btn');
if(jsonBtn){
    jsonBtn.addEventListener('click',()=>{
        const input=document.getElementById('json-input').value.trim();
        const output=document.getElementById('json-output');
        if(!input){alert('Paste some JSON first');return;}
        try{
            const parsed=JSON.parse(input);
            output.value=JSON.stringify(parsed,null,2);
            document.getElementById('json-status').innerText='✅ Valid JSON';
            document.getElementById('json-status').style.color='#22c55e';
        }catch(e){
            output.value='';
            document.getElementById('json-status').innerText='❌ Invalid JSON: '+e.message;
            document.getElementById('json-status').style.color='#ef4444';
        }
    });
    document.getElementById('json-minify-btn').addEventListener('click',()=>{
        const input=document.getElementById('json-input').value.trim();
        try{document.getElementById('json-output').value=JSON.stringify(JSON.parse(input));}
        catch(e){alert('Invalid JSON');}
    });
    document.getElementById('json-copy-btn').addEventListener('click',()=>{const t=document.getElementById('json-output').value;if(t)navigator.clipboard.writeText(t);});
    document.getElementById('json-clear-btn').addEventListener('click',()=>{document.getElementById('json-input').value='';document.getElementById('json-output').value='';document.getElementById('json-status').innerText='';});
}

// ============================================================
// 18. Base64 Encoder/Decoder
// ============================================================
const b64EncBtn=document.getElementById('b64-encode-btn');
if(b64EncBtn){
    b64EncBtn.addEventListener('click',()=>{
        const input=document.getElementById('b64-input').value;
        try{document.getElementById('b64-output').value=btoa(unescape(encodeURIComponent(input)));}
        catch(e){alert('Could not encode. Make sure text is valid.');}
    });
    document.getElementById('b64-decode-btn').addEventListener('click',()=>{
        const input=document.getElementById('b64-input').value.trim();
        try{document.getElementById('b64-output').value=decodeURIComponent(escape(atob(input)));}
        catch(e){alert('Invalid Base64 string.');}
    });
    document.getElementById('b64-copy-btn').addEventListener('click',()=>{const t=document.getElementById('b64-output').value;if(t)navigator.clipboard.writeText(t);});
    document.getElementById('b64-clear-btn').addEventListener('click',()=>{document.getElementById('b64-input').value='';document.getElementById('b64-output').value='';});
}

// ============================================================
// 19. URL Encoder/Decoder
// ============================================================
const urlEncBtn=document.getElementById('url-encode-btn');
if(urlEncBtn){
    urlEncBtn.addEventListener('click',()=>{document.getElementById('url-output').value=encodeURIComponent(document.getElementById('url-input').value);});
    document.getElementById('url-decode-btn').addEventListener('click',()=>{
        try{document.getElementById('url-output').value=decodeURIComponent(document.getElementById('url-input').value);}
        catch(e){alert('Invalid encoded URL string.');}
    });
    document.getElementById('url-copy-btn').addEventListener('click',()=>{const t=document.getElementById('url-output').value;if(t)navigator.clipboard.writeText(t);});
}

// ============================================================
// 20. Percentage Calculator
// ============================================================
const percentBtn=document.getElementById('percent-btn');
if(percentBtn){
    percentBtn.addEventListener('click',()=>{
        const type=document.getElementById('percent-type').value;
        const a=parseFloat(document.getElementById('percent-a').value);
        const b=parseFloat(document.getElementById('percent-b').value);
        let result='', explanation='';
        if(isNaN(a)||isNaN(b)){alert('Enter both values');return;}
        if(type==='whatpercent'){result=((a/b)*100).toFixed(2)+'%';explanation=`${a} is ${result} of ${b}`;}
        else if(type==='percentof'){result=((a/100)*b).toFixed(2);explanation=`${a}% of ${b} = ${result}`;}
        else if(type==='increase'){result=((b-a)/a*100).toFixed(2)+'%';explanation=`Change from ${a} to ${b} = ${result}`;}
        document.getElementById('percent-result').innerText=result;
        document.getElementById('percent-explanation').innerText=explanation;
    });
    document.getElementById('percent-type').addEventListener('change',()=>{
        const labels={'whatpercent':['Number','Total'],'percentof':['Percentage (%)','Of Number'],'increase':['Original Value','New Value']};
        const type=document.getElementById('percent-type').value;
        document.getElementById('percent-label-a').innerText=labels[type][0];
        document.getElementById('percent-label-b').innerText=labels[type][1];
    });
}

// ============================================================
// 21. Text Diff Checker
// ============================================================
const diffBtn=document.getElementById('diff-btn');
if(diffBtn){
    diffBtn.addEventListener('click',()=>{
        const a=document.getElementById('diff-a').value.split('\n');
        const b=document.getElementById('diff-b').value.split('\n');
        const maxLen=Math.max(a.length,b.length);
        let html='', added=0, removed=0, same=0;
        for(let i=0;i<maxLen;i++){
            const la=a[i]??null, lb=b[i]??null;
            if(la===lb){html+=`<div style="padding:4px 8px;color:#aaa;">&nbsp; ${escapeHtml(la||'')}</div>`;same++;}
            else{
                if(la!==null){html+=`<div style="padding:4px 8px;background:rgba(239,68,68,0.15);color:#fca5a5;">- ${escapeHtml(la)}</div>`;removed++;}
                if(lb!==null){html+=`<div style="padding:4px 8px;background:rgba(34,197,94,0.15);color:#86efac;">+ ${escapeHtml(lb)}</div>`;added++;}
            }
        }
        document.getElementById('diff-output').innerHTML=html||'<p style="color:#aaa;text-align:center;">No differences found — texts are identical!</p>';
        document.getElementById('diff-stats').innerText=`${added} additions · ${removed} deletions · ${same} unchanged lines`;
    });
    function escapeHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
}

// ============================================================
// 22. Meta Tag Generator
// ============================================================
const metaBtn=document.getElementById('meta-btn');
if(metaBtn){
    metaBtn.addEventListener('click',()=>{
        const title=document.getElementById('meta-title').value.trim();
        const desc=document.getElementById('meta-desc').value.trim();
        const keywords=document.getElementById('meta-keywords').value.trim();
        const url=document.getElementById('meta-url').value.trim();
        const author=document.getElementById('meta-author').value.trim();
        if(!title||!desc){alert('Title and description are required');return;}
        const code=`<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">${keywords?`\n<meta name="keywords" content="${keywords}">`:''}${author?`\n<meta name="author" content="${author}">`:''}
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">${url?`\n<meta property="og:url" content="${url}">`:''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">${url?`\n<meta property="twitter:url" content="${url}">`:''}

<!-- Canonical -->
${url?`<link rel="canonical" href="${url}">`:''}`
        document.getElementById('meta-output').value=code;
        document.getElementById('meta-output-box').style.display='block';
    });
    document.getElementById('meta-copy-btn').addEventListener('click',()=>{const t=document.getElementById('meta-output').value;if(t)navigator.clipboard.writeText(t);});
}

// ============================================================
// 23. IP Lookup
// ============================================================
const ipBtn=document.getElementById('ip-btn');
if(ipBtn){
    ipBtn.addEventListener('click',async()=>{
        ipBtn.disabled=true;
        ipBtn.innerHTML='<i class="fa-solid fa-spinner fa-spin me-2"></i> Looking up...';
        try{
            const r=await fetch('https://ipwho.is/');
            const d=await r.json();
            document.getElementById('ip-result').innerHTML=`
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
                    <div class="output-box" style="flex-direction:column;gap:4px;padding:1rem;"><span class="text-muted" style="font-size:0.85rem;">IP Address</span><span style="font-size:1.2rem;font-weight:700;">${d.ip||'N/A'}</span></div>
                    <div class="output-box" style="flex-direction:column;gap:4px;padding:1rem;"><span class="text-muted" style="font-size:0.85rem;">Country</span><span style="font-size:1.2rem;font-weight:700;">${d.country||'N/A'}</span></div>
                    <div class="output-box" style="flex-direction:column;gap:4px;padding:1rem;"><span class="text-muted" style="font-size:0.85rem;">City</span><span style="font-size:1.2rem;font-weight:700;">${d.city||'N/A'}</span></div>
                    <div class="output-box" style="flex-direction:column;gap:4px;padding:1rem;"><span class="text-muted" style="font-size:0.85rem;">Region</span><span style="font-size:1.2rem;font-weight:700;">${d.region||'N/A'}</span></div>
                    <div class="output-box" style="flex-direction:column;gap:4px;padding:1rem;"><span class="text-muted" style="font-size:0.85rem;">ISP</span><span style="font-size:1.1rem;font-weight:700;">${(d.connection&&d.connection.isp)||'N/A'}</span></div>
                    <div class="output-box" style="flex-direction:column;gap:4px;padding:1rem;"><span class="text-muted" style="font-size:0.85rem;">Timezone</span><span style="font-size:1.1rem;font-weight:700;">${(d.timezone&&d.timezone.id)||'N/A'}</span></div>
                </div>`;
        }catch(e){document.getElementById('ip-result').innerHTML='<p style="color:#ef4444;">Could not fetch IP info. Try again.</p>';}
        ipBtn.disabled=false;
        ipBtn.innerHTML='<i class="fa-solid fa-globe me-2"></i> Lookup My IP';
    });
}

// ============================================================
// 24. Loan / EMI Calculator
// ============================================================
const emiBtn=document.getElementById('emi-btn');
if(emiBtn){
    emiBtn.addEventListener('click',()=>{
        const principal=parseFloat(document.getElementById('emi-principal').value);
        const annualRate=parseFloat(document.getElementById('emi-rate').value);
        const months=parseFloat(document.getElementById('emi-tenure').value);
        if(!principal||!annualRate||!months){alert('Please fill in all fields');return;}
        const monthlyRate=(annualRate/12)/100;
        const emi=(principal*monthlyRate*Math.pow(1+monthlyRate,months))/(Math.pow(1+monthlyRate,months)-1);
        const totalPayment=emi*months;
        const totalInterest=totalPayment-principal;
        document.getElementById('emi-result').innerText=isFinite(emi)?emi.toFixed(2):'--';
        document.getElementById('emi-total-payment').innerText=isFinite(totalPayment)?totalPayment.toFixed(2):'--';
        document.getElementById('emi-total-interest').innerText=isFinite(totalInterest)?totalInterest.toFixed(2):'--';
        document.getElementById('emi-breakdown').style.display='block';
        const principalPct=(principal/totalPayment*100).toFixed(1);
        const interestPct=(totalInterest/totalPayment*100).toFixed(1);
        document.getElementById('emi-principal-bar').style.width=principalPct+'%';
        document.getElementById('emi-interest-bar').style.width=interestPct+'%';
        document.getElementById('emi-principal-pct').innerText=principalPct+'%';
        document.getElementById('emi-interest-pct').innerText=interestPct+'%';
    });
}

// ============================================================
// 25. Compound Interest Calculator
// ============================================================
const compoundBtn=document.getElementById('compound-btn');
if(compoundBtn){
    compoundBtn.addEventListener('click',()=>{
        const principal=parseFloat(document.getElementById('compound-principal').value);
        const rate=parseFloat(document.getElementById('compound-rate').value);
        const years=parseFloat(document.getElementById('compound-years').value);
        const freq=parseInt(document.getElementById('compound-freq').value);
        const contribution=parseFloat(document.getElementById('compound-contribution').value)||0;
        if(!principal||!rate||!years){alert('Please fill in principal, rate, and years');return;}
        const r=rate/100;
        const n=freq;
        const t=years;
        let amount=principal*Math.pow(1+r/n,n*t);
        if(contribution>0){
            const periodicRate=r/n;
            const numPeriods=n*t;
            const futureValueContributions=contribution*((Math.pow(1+periodicRate,numPeriods)-1)/periodicRate);
            amount+=futureValueContributions;
        }
        const totalContributions=principal+(contribution*n*t);
        const totalInterestEarned=amount-totalContributions;
        document.getElementById('compound-result').innerText=amount.toFixed(2);
        document.getElementById('compound-total-contributions').innerText=totalContributions.toFixed(2);
        document.getElementById('compound-total-interest').innerText=totalInterestEarned.toFixed(2);
        document.getElementById('compound-breakdown').style.display='block';
    });
}
