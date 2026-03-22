// ─── ADMIN MOCK DATA ─────────────────────────────────────────────────────────

const ADMIN_DATA = {
    users: [
        { id: 1, username: "ArcaneLord", email: "arcane@lexora.io", role: "Admin", level: 99, coins: 12500, avatar: "AL", joinDate: "2023-01-15" },
        { id: 2, username: "ShadowReader", email: "shadow@mail.com", role: "User +18", level: 34, coins: 4320, avatar: "SR", joinDate: "2023-05-22" },
        { id: 3, username: "LittleScribe", email: "scribe@mail.com", role: "User -18", level: 7, coins: 880, avatar: "LS", joinDate: "2024-01-03" },
        { id: 4, username: "VelvetPages", email: "velvet@mail.com", role: "User +18", level: 52, coins: 7100, avatar: "VP", joinDate: "2023-03-11" },
        { id: 5, username: "MoonlitTales", email: "moonlit@mail.com", role: "User -18", level: 12, coins: 1200, avatar: "MT", joinDate: "2024-02-18" },
        { id: 6, username: "GoldenQuill", email: "quill@mail.com", role: "User +18", level: 28, coins: 3400, avatar: "GQ", joinDate: "2023-07-30" },
        { id: 7, username: "CrimsonInk", email: "crimson@mail.com", role: "User +18", level: 61, coins: 9800, avatar: "CI", joinDate: "2023-02-05" },
        { id: 8, username: "YoungSage", email: "sage@mail.com", role: "User -18", level: 5, coins: 450, avatar: "YS", joinDate: "2024-03-01" },
    ],
    books: [
        { id: 1, title: "Throne of Midnight", author: "E. Blackwood", genre: "Fantasy", cover: "🏰", coinCost: 150, xpReward: 200, coinReward: 50, audience: "All", trending: true, description: "An epic tale of power and darkness." },
        { id: 2, title: "Crimson Desires", author: "V. Morel", genre: "Romance", cover: "🌹", coinCost: 200, xpReward: 180, coinReward: 60, audience: "+18 Only", trending: false, description: "A passionate romance for mature readers." },
        { id: 3, title: "The Whispering Stars", author: "A. Celeste", genre: "Sci-Fi", cover: "⭐", coinCost: 120, xpReward: 160, coinReward: 40, audience: "All", trending: true, description: "Explore the cosmos through young eyes." },
        { id: 4, title: "Blood & Gold", author: "M. Thorne", genre: "Historical", cover: "⚔️", coinCost: 180, xpReward: 220, coinReward: 70, audience: "+18 Only", trending: false, description: "War, betrayal, and gold in ancient times." },
        { id: 5, title: "Dragon's Lullaby", author: "S. Ember", genre: "Fantasy", cover: "🐉", coinCost: 100, xpReward: 140, coinReward: 35, audience: "All", trending: true, description: "A young dragon finds her destiny." },
        { id: 6, title: "Neon Labyrinth", author: "K. Raven", genre: "Thriller", cover: "🔮", coinCost: 160, xpReward: 190, coinReward: 55, audience: "All", trending: false, description: "A cyberpunk mystery unfolds in neon rain." },
    ],
    alerts: [
        { id: 1, icon: 'message-square', title: "Community Review", text: "5 posts awaiting admin review", time: "2m ago", color: "text-blue-400" },
        { id: 2, icon: 'book-open', title: "Unclassified Books", text: "3 uploads need age verification", time: "15m ago", color: "text-yellow-400" },
        { id: 3, icon: 'coins', title: "Economy Update", text: "Reward settings modified", time: "2h ago", color: "text-green-400" },
        { id: 4, icon: 'shield', title: "Lumo Detection", text: "7 new flags since midnight", time: "4h ago", color: "text-purple-400" },
    ],
    community: [
        { id: 1, preview: "I think the protagonist is actually a spy...", author: "MysticReader", book: "Shadows of Eldoria", type: "Spoiler", severity: "Low", suggested: "Add spoiler tag", status: "Pending" },
        { id: 2, preview: "BUY CHEAP COINS AT SCAM-LINK.COM!!!", author: "BotHunter", book: "General Chat", type: "Spam", severity: "High", suggested: "Ban user & delete", status: "Pending" },
        { id: 3, preview: "The ending was so frustrating, I hate...", author: "AngryBard", book: "The Last Dragon", type: "Offensive", severity: "Medium", suggested: "Warning", status: "Reviewed" },
        { id: 4, preview: "This book contains detailed violence...", author: "Guardia", book: "Blood & Gold", type: "Age-Sensitive", severity: "Medium", suggested: "Verify classification", status: "Approved" },
    ],
    economy: [
        { day: "01", earned: 4500, spent: 3200 },
        { day: "05", earned: 5200, spent: 3800 },
        { day: "10", earned: 4800, spent: 4100 },
        { day: "15", earned: 6100, spent: 4500 },
        { day: "20", earned: 5500, spent: 4900 },
        { day: "25", earned: 7200, spent: 5200 },
        { day: "30", earned: 6800, spent: 5800 },
    ]
};

// ─── ADMIN STATE ─────────────────────────────────────────────────────────────

const AdminState = {
    activeSection: 'dashboard',
    sidebarOpen: true,
    showNotifications: false,
    lumoActive: true,
    users: [...ADMIN_DATA.users],
    books: [...ADMIN_DATA.books],
};

// ─── ADMIN UTILS ─────────────────────────────────────────────────────────────

const renderBadge = (label, color = 'gold') => `<span class="badge ${color}">${label}</span>`;

const getIcon = (name, size = 18) => `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;

// ─── CORE LOGIC ──────────────────────────────────────────────────────────────

function initAdmin() {
    // 1. Sidebar Toggle
    document.getElementById('toggleSidebar').addEventListener('click', () => {
        AdminState.sidebarOpen = !AdminState.sidebarOpen;
        const sidebar = document.querySelector('.admin-sidebar');
        const main = document.querySelector('.admin-main');
        if (AdminState.sidebarOpen) {
            sidebar.classList.remove('collapsed');
            main.classList.remove('expanded');
        } else {
            sidebar.classList.add('collapsed');
            main.classList.add('expanded');
        }
    });

    // 2. Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = item.dataset.section;
            if (section === 'logout') return window.location.href = 'index.html';

            // Update Active State
            AdminState.activeSection = section;
            document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');

            // Switch Sections
            document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
            document.getElementById(`${section}-section`).classList.remove('hidden');

            // Update Title
            document.getElementById('headerTitle').textContent = item.querySelector('.nav-label').textContent;

            // If dashboard, re-init charts
            if (section === 'dashboard') initCharts();
            if (section === 'lumo') initLumoCharts();
            if (section === 'rewards') initRewardsCharts();
        });
    });

    // 3. Notifications Toggle
    const bellBtn = document.getElementById('bellBtn');
    const notifDropdown = document.getElementById('notifDropdown');
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        AdminState.showNotifications = !AdminState.showNotifications;
        notifDropdown.classList.toggle('hidden', !AdminState.showNotifications);
        bellBtn.classList.toggle('active', AdminState.showNotifications);
    });

    document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !bellBtn.contains(e.target)) {
            AdminState.showNotifications = false;
            notifDropdown.classList.add('hidden');
            bellBtn.classList.remove('active');
        }
    });

    // 4. Initial Render
    renderNotifications();
    renderUserTable();
    renderBookTable();
    renderCommunityTable();
    initCharts();
    initLumoCharts();
    initRewardsCharts();

    // Lucide Icons
    lucide.createIcons();
}

function renderNotifications() {
    const list = document.getElementById('notifList');
    list.innerHTML = ADMIN_DATA.alerts.map(a => `
        <div class="notif-item">
            <div class="notif-icon ${a.color}">${getIcon(a.icon, 14)}</div>
            <div class="notif-body">
                <h6>${a.title}</h6>
                <p>${a.text}</p>
                <span class="time">${a.time}</span>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderUserTable() {
    const tbody = document.getElementById('userTbody');
    if (!tbody) return;
    tbody.innerHTML = AdminState.users.map(u => `
        <tr>
            <td><div class="avatar">${u.avatar}</div></td>
            <td style="font-weight:bold">${u.username}</td>
            <td style="color:#A08060">${u.email}</td>
            <td>${renderBadge(u.role, u.role === 'Admin' ? 'gold' : 'purple')}</td>
            <td><span style="color:#D4AF37">${getIcon('zap', 12)} ${u.level}</span></td>
            <td><span style="color:#D4AF37">${getIcon('coins', 12)} ${u.coins.toLocaleString()}</span></td>
            <td style="font-size:0.7rem;color:#7A6040">${u.joinDate}</td>
            <td>
                <div style="display:flex;gap:0.25rem">
                    <button class="admin-btn ghost">${getIcon('eye', 13)}</button>
                    <button class="admin-btn ghost">${getIcon('edit-2', 13)}</button>
                    <button class="admin-btn ghost" style="color:#EF4444">${getIcon('trash-2', 13)}</button>
                </div>
            </td>
        </tr>
    `).join('');
    lucide.createIcons();
}

function renderBookTable() {
    const tbody = document.getElementById('bookTbody');
    if (!tbody) return;
    tbody.innerHTML = AdminState.books.map(b => `
        <tr>
            <td style="font-size:1.5rem">${b.cover}</td>
            <td style="font-weight:bold">${b.title}</td>
            <td style="color:#A08060">${b.author}</td>
            <td>${renderBadge(b.genre, 'blue')}</td>
            <td><span style="color:#D4AF37">${getIcon('coins', 12)} ${b.coinCost}</span></td>
            <td style="font-size:0.7rem;color:#A08060">+${b.xpReward}xp / +${b.coinReward}🪙</td>
            <td>${renderBadge(b.audience === 'All' ? 'All Ages' : '+18 Only', b.audience === 'All' ? 'green' : 'red')}</td>
            <td>${b.trending ? renderBadge('HOT', 'orange') : '—'}</td>
            <td>
                <div style="display:flex;gap:0.25rem">
                    <button class="admin-btn ghost">${getIcon('eye', 13)}</button>
                    <button class="admin-btn ghost">${getIcon('edit-2', 13)}</button>
                    <button class="admin-btn ghost" style="color:#EF4444">${getIcon('trash-2', 13)}</button>
                </div>
            </td>
        </tr>
    `).join('');
    lucide.createIcons();
}

function renderCommunityTable() {
    const tbody = document.getElementById('communityTbody');
    if (!tbody) return;
    tbody.innerHTML = ADMIN_DATA.community.map(f => `
        <tr>
            <td style="max-width:160px"><p class="text-xs truncate italic" style="color:var(--admin-text-muted)">"${f.preview}"</p></td>
            <td>${f.author}</td>
            <td style="font-size:0.75rem;color:var(--admin-text-dim)">${f.book}</td>
            <td>${renderBadge(f.type, getSectionBadgeColor(f.type))}</td>
            <td>${renderBadge(f.severity, f.severity === 'High' ? 'red' : f.severity === 'Medium' ? 'orange' : 'blue')}</td>
            <td style="font-size:0.75rem;color:var(--admin-text-muted)">${f.suggested}</td>
            <td>${renderBadge(f.status, f.status === 'Approved' ? 'green' : f.status === 'Pending' ? 'gold' : 'blue')}</td>
            <td>
                <div style="display:flex;gap:0.25rem">
                    <button class="admin-btn ghost" style="color:#22C55E">${getIcon('check', 13)}</button>
                    <button class="admin-btn ghost" style="color:#EF4444">${getIcon('x', 13)}</button>
                    <button class="admin-btn ghost">${getIcon('eye', 13)}</button>
                </div>
            </td>
        </tr>
    `).join('');
    lucide.createIcons();
}

function getSectionBadgeColor(type) {
    switch (type) {
        case 'Spoiler': return 'gold';
        case 'Spam': return 'red';
        case 'Offensive': return 'purple';
        case 'Age-Sensitive': return 'orange';
        default: return 'blue';
    }
}

// ─── CHARTS (Chart.js) ───────────────────────────────────────────────────────

function initCharts() {
    // Kingdom Growth
    const ctxGrowth = document.getElementById('growthChart').getContext('2d');
    new Chart(ctxGrowth, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Users',
                data: [4000, 4500, 5200, 5800, 6500, 8241],
                borderColor: '#D4AF37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(74, 42, 16, 0.3)' }, ticks: { color: '#7A6040', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#7A6040', font: { size: 10 } } }
            }
        }
    });

    // Genre Engagement
    const ctxGenre = document.getElementById('genreChart').getContext('2d');
    new Chart(ctxGenre, {
        type: 'bar',
        data: {
            labels: ['Fantasy', 'Sci-Fi', 'Romance', 'Thriller', 'Historical'],
            datasets: [{
                data: [38, 24, 18, 12, 8],
                backgroundColor: '#8B7322',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(74, 42, 16, 0.3)' }, ticks: { color: '#7A6040', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#7A6040', font: { size: 10 } } }
            }
        }
    });
}

function initLumoCharts() {
    const ctxLumo = document.getElementById('lumoPieChart').getContext('2d');
    new Chart(ctxLumo, {
        type: 'doughnut',
        data: {
            labels: ['Spam', 'Spoiler', 'Offensive', 'Other'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: ['#EF4444', '#D4AF37', '#6B1A2A', '#A855F7'],
                borderColor: 'transparent'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: { legend: { display: false } }
        }
    });

    const ctxLumoLine = document.getElementById('lumoLineChart').getContext('2d');
    new Chart(ctxLumoLine, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Incidents',
                data: [12, 19, 15, 8, 22, 30, 23],
                borderColor: '#A78BFA',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7A6040', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#7A6040', font: { size: 10 } } }
            }
        }
    });
}

function initRewardsCharts() {
    const ctxEconomy = document.getElementById('economyLineChart').getContext('2d');
    new Chart(ctxEconomy, {
        type: 'line',
        data: {
            labels: ['01', '05', '10', '15', '20', '25', '30'],
            datasets: [
                { label: 'Earned', data: [4500, 5200, 4800, 6100, 5500, 7200, 6800], borderColor: '#D4AF37', tension: 0.3 },
                { label: 'Spent', data: [3200, 3800, 4100, 4500, 4900, 5200, 5800], borderColor: '#EF4444', tension: 0.3 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(74, 42, 16, 0.3)' }, ticks: { color: '#7A6040', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#7A6040', font: { size: 10 } } }
            }
        }
    });
}

// ─── INIT ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', initAdmin);
