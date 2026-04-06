const mobileToggle = document.querySelector('.mobile-toggle');
const sidebar = document.querySelector('.sidebar');
if(mobileToggle){
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if(sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
            sidebar.classList.remove('active');
        }
    });
}

function openTool(toolId) {
    const toolsSection = document.getElementById('tools');
    const container = document.getElementById('tool-container');
    
    if(toolsSection) toolsSection.classList.add('hidden');
    if(container) container.classList.remove('hidden');
    
    document.querySelectorAll('.tool-interface').forEach(t => t.classList.add('hidden'));
    
    const target = document.getElementById(toolId);
    if(target) {
        target.classList.remove('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

function closeTool() {
    const container = document.getElementById('tool-container');
    const toolsSection = document.getElementById('tools');
    
    if(container) container.classList.add('hidden');
    if(toolsSection) {
        toolsSection.classList.remove('hidden');
        toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if(window.location.hash) {
        const hash = window.location.hash.substring(1);
        if(hash.endsWith('tool')) {
            openTool(hash);
        }
    }
});
