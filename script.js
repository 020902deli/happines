(() => {
    const STATE_KEY = 'happiness_v2';
    const today = new Date().toISOString().slice(0, 10);

    const happinessTasks = [
        'Zâmbește cuiva necunoscut 🌸',
        'Scrie 3 lucruri pentru care ești recunoscător 📝',
        'Ascultă melodia ta preferată 💃',
        'Fă o plimbare de 10 minute 🌿',
        'Trimite un mesaj frumos cuiva ✨'
    ];

    let state = JSON.parse(localStorage.getItem(STATE_KEY)) || {
        theme: 'light',
        tasks: { date: today, list: [] },
        log: []
    };

    function init() {
        document.body.dataset.theme = state.theme;
        
        // Verifică task-urile zilei
        if (state.tasks.date !== today || state.tasks.list.length === 0) {
            const shuffled = happinessTasks.sort(() => 0.5 - Math.random());
            state.tasks.list = shuffled.slice(0, 3).map(t => ({ label: t, done: false }));
            state.tasks.date = today;
            save();
        }

        renderTasks();
        setupEvents();
    }

    function renderTasks() {
        const grid = document.getElementById('task-list');
        if (!grid) return;
        grid.innerHTML = '';
        state.tasks.list.forEach((t, i) => {
            const item = document.createElement('div');
            item.className = `task-item ${t.done ? 'done' : ''}`;
            item.innerHTML = `<span>${t.done ? '✅' : '🤍'}</span><p>${t.label}</p>`;
            item.onclick = () => {
                state.tasks.list[i].done = !state.tasks.list[i].done;
                save();
                renderTasks();
                if (state.tasks.list.every(task => task.done)) triggerConfetti();
            };
            grid.appendChild(item);
        });
        updateProgress();
    }

    function updateProgress() {
        const doneCount = state.tasks.list.filter(t => t.done).length;
        const percent = (doneCount / 3) * 100;
        const fill = document.getElementById('task-progress-fill');
        if (fill) fill.style.width = percent + '%';
        const status = document.getElementById('task-status');
        if (status) status.textContent = `${doneCount}/3 finalizate`;
    }

    function setupEvents() {
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.onclick = () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            document.body.dataset.theme = state.theme;
            save();
        };
    }
    // Am eliminat referințele la modalul jurnalului pentru a evita erorile
}

    function triggerConfetti() {
        const container = document.getElementById('confetti-container');
        for(let i=0; i<40; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; width:8px; height:8px; background:hsl(${Math.random()*360},70%,70%); top:-10px; left:${Math.random()*100}vw; z-index:9999; border-radius:50%; pointer-events:none;`;
            document.body.appendChild(c);
            c.animate([{transform: 'translateY(0)'}, {transform: `translateY(100vh) rotate(360deg)`}], {duration: 2000 + Math.random()*2000});
            setTimeout(() => c.remove(), 4000);
        }
    }

    function save() { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }
    init();
})();