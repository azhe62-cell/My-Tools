const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Replace Navigation
const navReplacement = `<ul class="nav-links">
            <li class="nav-btn active cursor-pointer" data-target="dashboard"><i class="fa-solid fa-house"></i> Dashboard</li>
            <li class="nav-btn cursor-pointer" data-target="qr"><i class="fa-solid fa-qrcode"></i> QR Generator</li>
            <li class="nav-btn cursor-pointer" data-target="barcode"><i class="fa-solid fa-barcode"></i> Barcode Gen</li>
            <li class="nav-btn cursor-pointer" data-target="word"><i class="fa-solid fa-spell-check"></i> Word Counter</li>
            <li class="nav-btn cursor-pointer" data-target="typing"><i class="fa-solid fa-keyboard"></i> Typing Matrix</li>
            <li class="nav-btn cursor-pointer" data-target="age"><i class="fa-solid fa-calendar-check"></i> Age Analytics</li>
            <li class="nav-btn cursor-pointer" data-target="currency"><i class="fa-solid fa-comments-dollar"></i> Live Exchange</li>
            <li class="nav-btn cursor-pointer" data-target="morse"><i class="fa-solid fa-wave-square"></i> Morse Telecom</li>
        </ul>`;

html = html.replace(/<ul class="nav-links">[\s\S]*?<\/ul>/, navReplacement);

// 2. Wrap Dashboard content
// Find where hero section starts, up to tools-section end.
const dashboardStart = `<section class="hero text-center slide-up mb-5 glass-card"`;
const toolsSectionEndMatch = html.match(/<\/section>\s*<!-- Tool Container/);
const dashboardEnd = `</section>\n            </div>`; // Close dashboard div

html = html.replace(dashboardStart, `<div id="dashboard" class="tool-section active-section">\n            <section class="hero text-center slide-up mb-5 glass-card"`);
html = html.replace(/<\/section>\n\s*<!-- Tool Container/, `</section>\n            </div>\n\n            <!-- Tool Container`);

// 3. Update Tools wrapper, we can just remove the `<section id="tool-container"...>` and its `</section>`
// Then change each tool div.
html = html.replace(/<section id="tool-container"[\s\S]*?Back to Dashboard<\/button>/, `<!-- Tools Content Containers -->`);
html = html.replace(/<\/section>\s*<\/div>\s*<footer>/, `    </div>\n        <footer>`); // Adjust the closing of tool-container section which was `</section>`

// 4. Update each tool div
const tools = [
    { oldId: 'qr-tool', newId: 'qr' },
    { oldId: 'barcode-tool', newId: 'barcode' },
    { oldId: 'word-tool', newId: 'word' },
    { oldId: 'typing-tool', newId: 'typing' },
    { oldId: 'age-tool', newId: 'age' },
    { oldId: 'currency-tool', newId: 'currency' },
    { oldId: 'morse-tool', newId: 'morse' }
];

tools.forEach(tool => {
    const oldStr = `id="${tool.oldId}" class="tool-interface glass-card p-5 hidden slide-up"`;
    const newStr = `id="${tool.newId}" class="tool-section tool-interface glass-card p-5 slide-up"`;
    // For typing tool, it has an extra 'mt-3' class
    const oldStr2 = `id="${tool.oldId}" class="tool-interface glass-card p-5 hidden slide-up mt-3"`;
    const newStr2 = `id="${tool.newId}" class="tool-section tool-interface glass-card p-5 slide-up mt-3"`;
    
    html = html.replace(oldStr, newStr);
    html = html.replace(oldStr2, newStr2);
});

// Remove any onclick="openTool(...)" from dashboard grid items to let the dashboard work smoothly.
// Wait, the grid items in dashboard shouldn't use "openTool" anymore. They should just trigger the nav logic or we script them.
// Let's modify all openTool('xyz-tool') to something else or just leave them and handle it in JS.
// Actually, fixing those click handlers on tool cards in the dashboard:
html = html.replace(/onclick="openTool\('([^']+)-tool'\)"/g, `onclick="document.querySelector('.nav-links li[data-target=\\'$1\\']').click()"`);


fs.writeFileSync(filePath, html);
console.log('HTML restructured successfully.');
