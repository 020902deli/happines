(() => {
    const STATE_KEY = 'happiness_v3';
    const today = new Date().toISOString().slice(0, 10);

    const happinessTasks = [
        'Send a kind message to someone ✨',
        'Write down 3 things you are grateful for 📝',
        'Listen to your favorite song 💃'
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
    if (status) status.textContent = `${doneCount}/3 completed`; // Tradus din 'finalizate'
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

        const slider = document.getElementById('mood-slider');
        const moodFill = document.getElementById('mood-fill');
        const moodText = document.getElementById('mood-value');

        if (slider) {
    slider.oninput = function () {
        const val = this.value;
        moodFill.style.width = val + '%';

        if (val < 30) moodText.textContent = "Tomorrow will be a better day! ✨";
        else if (val < 70) moodText.textContent = "A balanced and peaceful day. 🌸";
        else moodText.textContent = "You are full of positive energy! ☀️";
    };
}
    }

    function triggerConfetti() {
        const emojis = ['😊', '✨', '💖', '🌸', '☀️'];
        for (let i = 0; i < 30; i++) {
            const c = document.createElement('div');
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            c.textContent = randomEmoji;
            c.style.cssText = `
            position: fixed; 
            font-size: ${20 + Math.random() * 20}px; 
            top: -50px; 
            left: ${Math.random() * 100}vw; 
            z-index: 9999; 
            pointer-events: none;
            user-select: none;
        `;
            document.body.appendChild(c);

            c.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(110vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 2000 + Math.random() * 2000,
                easing: 'cubic-bezier(.37,0,.63,1)'
            });

            setTimeout(() => c.remove(), 4000);
        }
    }

    function save() { 
        localStorage.setItem(STATE_KEY, JSON.stringify(state)); 
    }

    // Inițializarea pornește aici
    init();
})();

