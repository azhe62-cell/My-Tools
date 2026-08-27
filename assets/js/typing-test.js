// ============================================================
// Typing Test — standalone page logic
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const WORD_BANKS = {
        easy: ["the","be","to","of","and","a","in","that","have","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him","know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look","only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even","new","want","because","any","these","give","day","most","us"],
        medium: ["important","business","development","system","information","company","number","group","problem","fact","between","during","before","different","following","without","however","interest","service","question","although","level","program","possible","increase","against","result","local","point","support","area","research","report","understand","policy","economic","consider","provide","include","several","similar","study","toward","player","student","industry","present","standard","practice","project","control","common","various","special","required","training","despite","condition","situation","attention","current","become","message","machine","network","feature","product","customer","material","process","quality","resource","strategy","structure","technology","platform","solution"],
        hard: ["nevertheless","approximately","significant","fundamentally","consequently","inevitably","phenomenon","subsequent","comprehensive","predominantly","circumstance","infrastructure","implementation","characteristic","substantially","methodology","perspective","controversial","unprecedented","technological","philosophical","organizational","interpretation","sophisticated","autonomous","hypothesis","legislation","perpetually","simultaneously","paradoxically","ambiguous","juxtaposition","quintessential","meticulous","unequivocal","superfluous","idiosyncratic","cognizant","ubiquitous","reconciliation","disproportionate","unequivocally","circumvent","exacerbate","proliferation"]
    };

    const LINE_HEIGHT_PX = 50;

    const setupView = document.getElementById('typing-setup-view');
    const activeView = document.getElementById('typing-active-view');
    const resultsView = document.getElementById('typing-results-view');
    const durationSelect = document.getElementById('typing-duration');
    const difficultySelect = document.getElementById('typing-difficulty');
    const hiddenInput = document.getElementById('typing-hidden-input');
    const textContentEl = document.getElementById('typing-text-content');
    const textBox = document.getElementById('typing-text-box');
    const startBtn = document.getElementById('typing-start-btn');
    const stopBtn = document.getElementById('typing-stop-btn');
    const retakeBtn = document.getElementById('typing-retake-btn');

    if (!startBtn) return;

    let timeLeft, timerInterval, playing = false, startTime;

    function bestKey() { return `toolmetri_typing_best_${difficultySelect.value}_${durationSelect.value}`; }
    function historyKey() { return `toolmetri_typing_history_${difficultySelect.value}_${durationSelect.value}`; }

    function updateBestDisplay() {
        const best = localStorage.getItem(bestKey());
        document.getElementById('typing-best-display').innerText = best ? best + ' WPM' : '--';
    }
    updateBestDisplay();
    durationSelect.addEventListener('change', updateBestDisplay);
    difficultySelect.addEventListener('change', updateBestDisplay);

    function formatTime(s) {
        const m = Math.floor(s / 60), sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    function wordsNeededFor(durationSeconds) {
        return Math.ceil((durationSeconds / 60) * 160) + 25;
    }

    function generateText(difficulty, wordCount) {
        const bank = WORD_BANKS[difficulty];
        let words = [];
        for (let i = 0; i < wordCount; i++) words.push(bank[Math.floor(Math.random() * bank.length)]);
        let result = [];
        let capitalizeNext = true;
        let sincePeriod = 0;
        for (let i = 0; i < words.length; i++) {
            let w = words[i];
            if (capitalizeNext) { w = w.charAt(0).toUpperCase() + w.slice(1); capitalizeNext = false; }
            sincePeriod++;
            const sentenceLen = 8 + Math.floor(Math.random() * 6);
            if (sincePeriod >= sentenceLen) {
                w += '.'; capitalizeNext = true; sincePeriod = 0;
            } else if (difficulty !== 'easy' && Math.random() < 0.12) {
                w += ',';
            }
            result.push(w);
        }
        if (!/\.$/.test(result[result.length - 1])) result[result.length - 1] += '.';
        return result.join(' ');
    }

    function renderText(text) {
        textContentEl.innerHTML = '';
        text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.innerText = ch;
            textContentEl.appendChild(span);
        });
    }

    hiddenInput.addEventListener('blur', () => {
        if (playing) setTimeout(() => hiddenInput.focus(), 0);
    });

    startBtn.addEventListener('click', () => {
        const duration = parseInt(durationSelect.value);
        timeLeft = duration;
        const fullText = generateText(difficultySelect.value, wordsNeededFor(duration));
        renderText(fullText);
        setupView.classList.add('hidden');
        resultsView.classList.add('hidden');
        activeView.classList.remove('hidden');
        hiddenInput.value = '';
        textBox.scrollTop = 0;
        playing = true;
        startTime = Date.now();
        document.getElementById('typing-time-display').innerText = formatTime(timeLeft);
        setTimeout(() => hiddenInput.focus(), 50);
        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('typing-time-display').innerText = formatTime(timeLeft);
            if (timeLeft <= 0) endTest();
        }, 1000);
    });

    hiddenInput.addEventListener('input', e => {
        if (!playing) return;
        const spans = textContentEl.querySelectorAll('span');
        const typed = e.target.value.split('');
        typed.forEach((ch, i) => {
            const span = spans[i];
            if (!span) return;
            if (ch === span.innerText) { span.classList.add('text-gold'); span.classList.remove('text-error'); }
            else { span.classList.add('text-error'); span.classList.remove('text-gold'); }
        });
        spans.forEach((span, i) => { if (i >= typed.length) { span.classList.remove('text-gold', 'text-error'); } });

        const currentSpan = spans[typed.length] || spans[spans.length - 1];
        if (currentSpan) {
            textBox.scrollTop = Math.max(0, currentSpan.offsetTop - LINE_HEIGHT_PX);
        }

        if (typed.length >= spans.length) endTest();
    });

    stopBtn.addEventListener('click', endTest);

    function endTest() {
        if (!playing) return;
        playing = false;
        clearInterval(timerInterval);

        const typed = hiddenInput.value.split('');
        const spans = textContentEl.querySelectorAll('span');
        let correctCount = 0;
        typed.forEach((ch, i) => { const span = spans[i]; if (span && ch === span.innerText) correctCount++; });

        const elapsedMinutes = (Date.now() - startTime) / 60000 || (1 / 60000);
        const wpm = Math.max(0, Math.round((correctCount / 5) / elapsedMinutes));
        const acc = typed.length > 0 ? Math.round((correctCount / typed.length) * 100) : 100;
        const netWpm = Math.round(wpm * (acc / 100));

        document.getElementById('typing-result-wpm').innerText = wpm;
        document.getElementById('typing-result-acc').innerText = acc + '%';
        document.getElementById('typing-result-net').innerText = netWpm;

        const best = parseInt(localStorage.getItem(bestKey())) || 0;
        if (netWpm > best) localStorage.setItem(bestKey(), netWpm);
        updateBestDisplay();
        const bestNow = localStorage.getItem(bestKey());
        document.getElementById('typing-result-best').innerText = bestNow ? bestNow + ' WPM' : '--';

        let history = JSON.parse(localStorage.getItem(historyKey()) || '[]');
        history.push(netWpm);
        if (history.length > 3) history = history.slice(-3);
        localStorage.setItem(historyKey(), JSON.stringify(history));

        renderChart(history);

        activeView.classList.add('hidden');
        resultsView.classList.remove('hidden');
    }

    function renderChart(history) {
        const container = document.getElementById('typing-chart');
        container.innerHTML = '';
        const avgTypist = 40;
        const bars = [{ label: 'Average', value: avgTypist, color: 'rgba(255,255,255,0.3)' }]
            .concat(history.map((v, i) => ({
                label: i === history.length - 1 ? 'This Test' : 'Attempt ' + (i + 1),
                value: v,
                color: i === history.length - 1 ? '#d4af37' : 'rgba(212,175,55,0.4)'
            })));
        const maxVal = Math.max(avgTypist, ...history, 10);
        bars.forEach(b => {
            const heightPct = Math.max(5, (b.value / maxVal) * 100);
            const col = document.createElement('div');
            col.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:70px;';
            col.innerHTML = `<span style="color:${b.color};font-weight:700;margin-bottom:6px;">${b.value}</span><div style="width:40px;height:${heightPct}%;background:${b.color};border-radius:6px 6px 0 0;"></div><span class="text-muted mt-2" style="font-size:0.8rem;">${b.label}</span>`;
            container.appendChild(col);
        });
    }

    retakeBtn.addEventListener('click', () => {
        resultsView.classList.add('hidden');
        setupView.classList.remove('hidden');
    });
});
