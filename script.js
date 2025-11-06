document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const petTitle = document.getElementById('pet-title'); // Changed from petDisplay
    const petStatus = document.getElementById('pet-status');
    const timerDisplay = document.getElementById('timer-display');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const todoInput = document.getElementById('todo-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const scratchpad = document.getElementById('scratchpad');

    // === STATE VARIABLES ===
    let countdown;
    let timeInSeconds = 1500;
    let currentMode = 'pomodoro';
    
    // === PET LOGIC (UPDATED) ===
    const petStates = {
        neutral: {msg:'Ready to be productive!' },
        happy:   {msg: 'Great job!' },
        studying:{msg: 'Focusing...' },
        break:   {msg: 'Taking a well-deserved break!'}
    };

    let petStateTimeout;
    function updatePet(state) {
        clearTimeout(petStateTimeout);
        petTitle.textContent = petStates[state].emoji; // Change the emoji text
        petStatus.textContent = petStates[state].msg;
        
        petTitle.style.transform = 'scale(1)';
        if (state === 'happy') {
            petTitle.style.transform = 'scale(1.2)'; // Make emoji pop when happy
            petStateTimeout = setTimeout(() => {
                updatePet('neutral');
            }, 2000);
        }
    }

    // === POMODORO TIMER LOGIC ===
    function setTimerMode(mode, seconds) {
        currentMode = mode;
        timeInSeconds = seconds;
        updateDisplay();
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.time == seconds);
        });
    }

    function updateDisplay() {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function startTimer() {
        clearInterval(countdown);
        updatePet(currentMode === 'pomodoro' ? 'studying' : 'break');
        const now = Date.now();
        const then = now + timeInSeconds * 1000;

        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);
            if (secondsLeft < 0) {
                clearInterval(countdown);
                alert("Time's up!");
                updatePet('happy');
                resetTimer();
                return;
            }
            timeInSeconds = secondsLeft;
            updateDisplay();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(countdown);
        updatePet('neutral');
    }

    function resetTimer() {
        clearInterval(countdown);
        const activeModeBtn = document.querySelector('.mode-btn.active');
        timeInSeconds = parseInt(activeModeBtn.dataset.time, 10);
        updateDisplay();
        updatePet('neutral');
    }

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            resetTimer();
            setTimerMode(button.textContent.toLowerCase().replace(' ', ''), parseInt(button.dataset.time, 10));
        });
    });

    // === TO-DO LIST LOGIC ===
    function updateProgress() {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.completed').length;
        progressText.textContent = `${completedTasks}/${totalTasks} Tasks Completed`;
        const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('focusFlowTasks', JSON.stringify(tasks));
    }

    function addTask(taskData, fromLoad = false) {
        const taskText = fromLoad ? taskData.text : todoInput.value.trim();
        if (!fromLoad && taskText === '') return;

        const listItem = document.createElement('li');
        if (fromLoad && taskData.completed) {
            listItem.classList.add('completed');
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = taskText;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = '✔';
        completeBtn.addEventListener('click', () => {
            listItem.classList.toggle('completed');
            if (listItem.classList.contains('completed')) {
                updatePet('happy');
            }
            updateProgress();
            saveTasks();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '✖';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(listItem);
            updateProgress();
            saveTasks();
        });

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        listItem.appendChild(textSpan);
        listItem.appendChild(actionsDiv);
        taskList.appendChild(listItem);
        
        if (!fromLoad) {
            todoInput.value = '';
            updateProgress();
            saveTasks();
        }
    }
    
    function loadTasks() {
        const savedTasks = localStorage.getItem('focusFlowTasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(taskData => addTask(taskData, true));
        }
        updateProgress();
    }
    
    // === SCRATCHPAD LOGIC ===
    function saveScratchpad() {
        localStorage.setItem('focusFlowScratchpad', scratchpad.value);
    }

    function loadScratchpad() {
        const savedText = localStorage.getItem('focusFlowScratchpad');
        if (savedText) {
            scratchpad.value = savedText;
        }
    }


    // --- INITIALIZE APP ---
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    addTaskBtn.addEventListener('click', () => addTask(null, false));
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask(null, false);
        }
    });
    scratchpad.addEventListener('input', saveScratchpad);
    
    setTimerMode('pomodoro', 1500);
    loadTasks();
    loadScratchpad();
    updatePet('neutral');
});