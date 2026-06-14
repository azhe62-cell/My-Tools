// Google Analytics
(function(){
    var s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://www.googletagmanager.com/gtag/js?id=G-WJ1Z527V4S';
    document.head.appendChild(s1);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WJ1Z527V4S');
})();
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if(mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

function openTool(id) {
    const container = document.getElementById('tool-view-container');
    if(!container) return;
    
    container.classList.remove('hidden');
    document.querySelectorAll('.tool-interface').forEach(el => el.classList.add('hidden'));
    
    const toolEl = document.getElementById('tool-' + id);
    if(toolEl) {
        toolEl.classList.remove('hidden');
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function closeTools() {
    document.getElementById('tool-view-container').classList.add('hidden');
    document.querySelectorAll('.tool-interface').forEach(el => el.classList.add('hidden'));
    const selector = document.getElementById('tools-selector');
    if(selector) selector.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('DOMContentLoaded', () => {
    if(window.location.hash) {
        const hash = window.location.hash.substring(1);
        if(document.getElementById('tool-' + hash)) {
            openTool(hash);
        }
    }
});
