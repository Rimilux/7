document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const profileBtn = document.getElementById('profile-btn');
    const tasksBtn = document.getElementById('tasks-btn');
    const ticketsBtn = document.getElementById('tickets-btn');

    const profileSection = document.getElementById('profile-section');
    const tasksSection = document.getElementById('tasks-section');
    const ticketsSection = document.getElementById('tickets-section');

    const coinBalance = document.getElementById('coin-balance');
    const userTickets = document.getElementById('user-tickets');
    const ticketGrid = document.getElementById('ticket-grid');
    const ticketPriceDisplay = document.getElementById('ticket-price-display');

    const completeTaskBtns = document.querySelectorAll('.complete-task-btn');

    // --- Constants ---
    const TICKET_PRICE = 50;
    const TOTAL_TICKETS = 100;

    // --- Application State ---
    let state = {
        coins: 0,
        myTickets: [],
        completedTasks: [],
        tickets: [], // Array of ticket objects { id, isSold }
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

    // --- Helper Functions ---
    function formatTicketId(id) {
        return id.toString().padStart(3, '0');
    }

    // --- UI Update Functions ---
    function updateUI() {
        // Update profile
        coinBalance.textContent = state.coins;
        userTickets.innerHTML = '';
        state.myTickets.sort((a, b) => a.id - b.id).forEach(ticket => {
            const li = document.createElement('li');
            li.textContent = `Ticket #${formatTicketId(ticket.id)}`;
            userTickets.appendChild(li);
        });

        // Update tickets section
        ticketPriceDisplay.textContent = TICKET_PRICE;
        document.querySelectorAll('.ticket').forEach(ticketEl => {
            const ticketId = parseInt(ticketEl.dataset.ticketId, 10);
            const ticketData = state.tickets.find(t => t.id === ticketId);
            if (ticketData && ticketData.isSold) {
                ticketEl.classList.add('sold');
                // Check if the user owns this ticket
                if (state.myTickets.some(myTicket => myTicket.id === ticketId)) {
                    ticketEl.classList.add('owned');
                }
            }
        });

        // Update tasks section
        completeTaskBtns.forEach((btn, index) => {
            if (state.completedTasks.includes(index)) {
                btn.disabled = true;
                btn.textContent = 'Completed';
            }
        });
    }

    // --- Ticket Generation ---
    function renderTickets() {
        ticketGrid.innerHTML = ''; // Clear existing tickets
        for (let i = 1; i <= TOTAL_TICKETS; i++) {
            const ticketEl = document.createElement('div');
            ticketEl.classList.add('ticket');
            ticketEl.dataset.ticketId = i;

            const numberEl = document.createElement('div');
            numberEl.classList.add('ticket-number');
            numberEl.textContent = formatTicketId(i);

            const barcodeEl = document.createElement('div');
            barcodeEl.classList.add('ticket-barcode');

            ticketEl.appendChild(numberEl);
            ticketEl.appendChild(barcodeEl);
            ticketGrid.appendChild(ticketEl);
        }
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

    ticketGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('ticket') && !e.target.classList.contains('sold')) {
            const ticketId = parseInt(e.target.dataset.ticketId, 10);
            const ticketData = state.tickets.find(t => t.id === ticketId);

            if (state.coins < TICKET_PRICE) {
                alert(`You do not have enough coins. You need ${TICKET_PRICE} coins.`);
                return;
            }

            // Purchase logic
            state.coins -= TICKET_PRICE;
            ticketData.isSold = true;
            state.myTickets.push({ id: ticketId });

            saveState();
            updateUI();

            alert(`You successfully purchased Ticket #${formatTicketId(ticketId)}!`);
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

        // Initialize tickets if they don't exist in state
        if (!state.tickets || state.tickets.length !== TOTAL_TICKETS) {
            state.tickets = [];
            for (let i = 1; i <= TOTAL_TICKETS; i++) {
                state.tickets.push({ id: i, isSold: false });
            }
        }

        renderTickets();
        updateUI();
        showSection(profileSection, profileBtn);
    }

    init();
});
