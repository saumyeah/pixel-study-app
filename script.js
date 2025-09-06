document.addEventListener('DOMContentLoaded', () => {
    // Pomodoro Timer Logic
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    let countdown;
    let timeInSeconds = 1500; // 25 minutes

    function updateDisplay() {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function startTimer() {
        clearInterval(countdown); // Clear any existing timers
        countdown = setInterval(() => {
            timeInSeconds--;
            updateDisplay();
            if (timeInSeconds <= 0) {
                clearInterval(countdown);
                alert("Time's up! Take a break.");
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(countdown);
    }

    function resetTimer() {
        clearInterval(countdown);
        timeInSeconds = 1500;
        updateDisplay();
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // To-Do List Logic
    const todoInput = document.getElementById('todo-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }

        const listItem = document.createElement('li');
        listItem.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(listItem);
        });

        listItem.appendChild(deleteBtn);
        taskList.appendChild(listItem);
        todoInput.value = ''; // Clear input field
    }

    addTaskBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Initialize display
    updateDisplay();
});