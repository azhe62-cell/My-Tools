// ============================================================
// Typing Test — standalone page logic
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const STORY_BANKS = {
        easy: [
            "Maria woke up early and opened her window. The morning air felt cool and fresh. She could hear birds singing in the garden below. Her cat jumped onto the bed and looked at her with sleepy eyes. Maria smiled and got up to make breakfast. The kitchen was quiet and calm. She poured herself a cup of tea and sat by the window to watch the sunrise.",
            "Tom walked to the store every Saturday morning. He liked the quiet streets before the town woke up. The baker always waved at him through the window. Tom bought fresh bread and a small bag of apples. On his way home, he stopped to feed the ducks by the pond. It was his favorite part of the week.",
            "The old dog slept most of the day under the porch. When the children came home from school, he would wake up and wag his tail. They played in the yard until dinner time. Their mother called them inside when the sky turned orange. The dog followed them in and lay down by the door, happy and tired.",
            "Sarah found a small box in the attic. Inside were old photographs of her grandparents. She sat on the dusty floor and looked through each one slowly. Some pictures showed a farm with tall trees and a red barn. Others showed a young couple smiling on their wedding day. Sarah decided to keep the box safe.",
            "Every evening, Jake rode his bike along the river path. The water moved slowly and reflected the last light of the sun. He often stopped at a bench to rest and watch the boats pass by. As the sky grew dark, streetlights turned on one by one. Jake rode home just before dinner was ready.",
            "The little bakery on Main Street opened at six every morning. Fresh bread filled the air with a warm, sweet smell. Neighbors lined up outside, chatting quietly while they waited. The baker greeted each person by name and asked about their day. By noon, the shelves were almost empty, and the baker began preparing for tomorrow.",
            "Emma planted tomatoes in her small backyard every spring. She watered them each morning before work and checked for weeds in the evening. By summer, the plants grew tall and full of fruit. Her neighbors often stopped by to admire the garden. Emma shared baskets of ripe tomatoes with anyone who asked, happy to see her hard work bring people together."
        ],
        medium: [
            "The company had spent months developing a new system to manage customer data more efficiently. Engineers worked closely with the support team to understand which features mattered most. After several rounds of testing, the platform finally launched to a small group of users. Early feedback was mostly positive, though a few technical issues needed attention. The team scheduled weekly meetings to track progress and address any remaining concerns before a full public release.",
            "Understanding how markets respond to change requires patience and careful observation. Analysts often study historical trends to predict future behavior, though outcomes are never guaranteed. A sudden shift in consumer demand can affect entire industries within weeks. Companies that adapt quickly tend to maintain their position, while others struggle to catch up. Successful organizations usually combine research with a willingness to take calculated risks when opportunities arise.",
            "Remote work changed the way many teams communicate on a daily basis. Meetings that once happened in person moved entirely online, requiring new tools and habits. Some employees found the transition difficult, missing the casual conversations that happened in an office. Others appreciated the flexibility and reduced commute time. Over time, most companies developed a hybrid approach that balanced structure with personal choice, allowing employees to work in whatever environment suited them best.",
            "Developing a new product often begins with a simple observation about an unmet need. Designers sketch early concepts, testing rough prototypes with a small group of users. Feedback from these sessions shapes the direction of the entire project, sometimes leading to unexpected changes. Engineers then translate approved designs into working systems, balancing performance with cost. Only after extensive testing does a product reach the wider market, ready for real customers to use.",
            "Climate research depends heavily on long-term data collected from multiple regions around the world. Scientists compare temperature records, ocean patterns, and atmospheric conditions to identify meaningful trends. Because natural systems are complex, researchers must account for many variables before drawing conclusions. International collaboration has become essential, as no single country holds enough data to fully understand global patterns. Publishing findings openly allows other experts to review and strengthen the overall body of research."
        ],
        hard: [
            "The philosophical debate surrounding artificial consciousness has intensified as computational systems grow increasingly sophisticated, prompting researchers to reconsider fundamental assumptions about cognition itself. Some theorists argue that subjective experience cannot emerge from purely mechanistic processes, regardless of computational complexity, while others contend that consciousness may simply be an emergent property of sufficiently intricate information processing. This unresolved tension reflects a broader uncertainty within cognitive science, where empirical methods struggle to bridge the gap between observable behavior and inner experience.",
            "Economic policy decisions rarely produce outcomes that align precisely with theoretical predictions, largely because human behavior introduces variables that resist quantification. Even sophisticated models, calibrated against extensive historical data, often fail to anticipate unprecedented circumstances that emerge from shifting geopolitical dynamics or technological disruption. Consequently, policymakers must balance rigorous analysis with pragmatic flexibility, acknowledging that certainty remains elusive in complex adaptive systems, and strategies once effective may become obsolete as conditions change.",
            "Contemporary architecture increasingly grapples with the tension between aesthetic ambition and environmental responsibility, forcing designers to reconcile competing priorities within a single structure. Sustainable materials, once considered a compromise, have evolved into sophisticated alternatives capable of matching traditional construction in both durability and visual appeal. Implementing these innovations at scale requires substantial investment and a fundamental reevaluation of established building practices across the industry.",
            "Neuroscientific investigations into memory formation reveal a process far more reconstructive than previously understood, challenging the intuitive notion that recollection functions like a passive recording mechanism. Each instance of remembering appears to subtly alter the underlying neural representation, meaning that memories are perpetually reshaped by subsequent experiences. This malleability has profound implications for fields ranging from legal testimony to psychotherapy, where the reliability of recalled events carries significant consequences.",
            "The proliferation of algorithmic decision-making across critical sectors has generated substantial debate regarding accountability and transparency in automated systems. Proponents argue that data-driven processes eliminate certain forms of human bias, yet critics contend that algorithms often encode and perpetuate existing societal inequities through the very data used to train them. Reconciling these perspectives requires interdisciplinary collaboration among technologists, ethicists, and policymakers."
        ]
    };

    const LINE_HEIGHT_PX = 54;

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
    let previousValue = '';
    let totalKeystrokes = 0;
    let correctKeystrokes = 0;

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

    function buildPassage(difficulty, minWords) {
        const bank = STORY_BANKS[difficulty].slice();
        for (let i = bank.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bank[i], bank[j]] = [bank[j], bank[i]];
        }
        let combined = '';
        let idx = 0;
        let wordCount = 0;
        while (wordCount < minWords && idx < bank.length * 5) {
            combined += (combined ? '  ' : '') + bank[idx % bank.length];
            wordCount = combined.trim().split(/\s+/).length;
            idx++;
        }
        return combined.trim();
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
        const fullText = buildPassage(difficultySelect.value, wordsNeededFor(duration));
        renderText(fullText);
        setupView.classList.add('hidden');
        resultsView.classList.add('hidden');
        activeView.classList.remove('hidden');
        hiddenInput.value = '';
        previousValue = '';
        totalKeystrokes = 0;
        correctKeystrokes = 0;
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
        const newValue = e.target.value;
        const spans = textContentEl.querySelectorAll('span');

        if (newValue.length > previousValue.length && newValue.startsWith(previousValue)) {
            for (let i = previousValue.length; i < newValue.length; i++) {
                totalKeystrokes++;
                const expectedChar = spans[i] ? spans[i].innerText : null;
                if (expectedChar !== null && newValue[i] === expectedChar) correctKeystrokes++;
            }
        }
        previousValue = newValue;

        const typed = newValue.split('');
        typed.forEach((ch, i) => {
            const span = spans[i];
            if (!span) return;
            if (ch === span.innerText) { span.classList.add('text-gold'); span.classList.remove('text-error'); }
            else { span.classList.add('text-error'); span.classList.remove('text-gold'); }
        });
        spans.forEach((span, i) => { if (i >= typed.length) { span.classList.remove('text-gold', 'text-error'); } });

        const currentSpan = spans[typed.length] || spans[spans.length - 1];
        if (currentSpan) {
            const snappedTop = Math.floor(currentSpan.offsetTop / LINE_HEIGHT_PX) * LINE_HEIGHT_PX;
            textBox.scrollTop = snappedTop;
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
        let finalCorrectCount = 0;
        typed.forEach((ch, i) => { const span = spans[i]; if (span && ch === span.innerText) finalCorrectCount++; });

        const elapsedMinutes = (Date.now() - startTime) / 60000 || (1 / 60000);
        const wpm = Math.max(0, Math.round((finalCorrectCount / 5) / elapsedMinutes));
        const acc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
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
