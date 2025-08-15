document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const profileBtn = document.getElementById('profile-btn');
    const tasksBtn = document.getElementById('tasks-btn');
    const ticketsBtn = document.getElementById('tickets-btn');

    const profileSection = document.getElementById('profile-section');
    const tasksSection = document.getElementById('tasks-section');
    const ticketsSection = document.getElementById('tickets-section');

    const coinBalance = document.getElementById('coin-balance');
    const availableTickets = document.getElementById('available-tickets');
    const userTickets = document.getElementById('user-tickets');

    const buyTicketBtn = document.getElementById('buy-ticket-btn');
    const completeTaskBtns = document.querySelectorAll('.complete-task-btn');

    // --- Constants ---
    const TICKET_PRICE = 50;

    // --- Application State ---
    let state = {
        coins: 0,
        tickets: 100,
        myTickets: [],
        completedTasks: [], // Array of task indices
    };

    // --- State Management ---
    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('ticketAppState'));
        if (savedState) {
            // Merge saved state with default state to prevent errors if new properties are added
            state = { ...state, ...savedState };
        }
    }

    function saveState() {
        localStorage.setItem('ticketAppState', JSON.stringify(state));
    }

    // --- UI Update Functions ---
    function updateUI() {
        // Update profile
        coinBalance.textContent = state.coins;
        userTickets.innerHTML = '';
        state.myTickets.forEach(ticket => {
            const li = document.createElement('li');
            li.textContent = `Ticket #${ticket.id}`;
            userTickets.appendChild(li);
        });

        // Update tickets section
        availableTickets.textContent = state.tickets;
        buyTicketBtn.textContent = `Buy Ticket (${TICKET_PRICE} Coins)`;

        // Update tasks section
        completeTaskBtns.forEach((btn, index) => {
            if (state.completedTasks.includes(index)) {
                btn.disabled = true;
                btn.textContent = 'Completed';
            }
        });
    }

    // --- Navigation ---
    function showSection(section, button) {
        profileSection.classList.add('hidden');
        tasksSection.classList.add('hidden');
        ticketsSection.classList.add('hidden');

        profileBtn.classList.remove('active');
        tasksBtn.classList.remove('active');
        ticketsBtn.classList.remove('active');

        section.classList.remove('hidden');
        button.classList.add('active');
    }

    // --- Event Listeners ---
    profileBtn.addEventListener('click', () => showSection(profileSection, profileBtn));
    tasksBtn.addEventListener('click', () => showSection(tasksSection, tasksBtn));
    ticketsBtn.addEventListener('click', () => showSection(ticketsSection, ticketsBtn));

    buyTicketBtn.addEventListener('click', () => {
        if (state.tickets > 0 && state.coins >= TICKET_PRICE) {
            state.tickets--;
            state.coins -= TICKET_PRICE;
            const newTicketId = 101 - state.tickets;
            state.myTickets.push({ id: newTicketId });
            saveState();
            updateUI();
            alert('Ticket purchased successfully!');
        } else if (state.tickets <= 0) {
            alert('Sorry, no more tickets available.');
        } else {
            alert(`You do not have enough coins. You need ${TICKET_PRICE} coins.`);
        }
    });

    completeTaskBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            if (state.completedTasks.includes(index)) {
                return; // Already completed
            }

            const task = e.target.closest('.task');
            const reward = parseInt(task.dataset.reward, 10);
            state.coins += reward;
            state.completedTasks.push(index);

            saveState();
            updateUI();

            alert(`You earned ${reward} coins!`);
        });
    });

    // --- Initial Load ---
    function init() {
        loadState();
        updateUI();
        showSection(profileSection, profileBtn);
    }

    init();
});
