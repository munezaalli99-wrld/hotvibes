const showLoginButton = document.getElementById('show-login');
const showRegisterButton = document.getElementById('show-register');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const messageBox = document.getElementById('message');
const dashboard = document.getElementById('dashboard');
const logoutBtn = document.getElementById('logout-btn');

const defaultUsers = [
    { name: 'Hot Vibes Guest', email: 'demo@hotvibes.com', password: 'Vibe2026' }
];

function loadUsers() {
    const saved = localStorage.getItem('hotVibesUsers');
    if (!saved) {
        localStorage.setItem('hotVibesUsers', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    try {
        return JSON.parse(saved) || defaultUsers;
    } catch (error) {
        localStorage.setItem('hotVibesUsers', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

function saveUsers(users) {
    localStorage.setItem('hotVibesUsers', JSON.stringify(users));
}

function setActiveForm(isLogin) {
    showLoginButton.classList.toggle('active', isLogin);
    showRegisterButton.classList.toggle('active', !isLogin);
    loginForm.classList.toggle('active', isLogin);
    registerForm.classList.toggle('active', !isLogin);
    messageBox.textContent = '';
}

function showMessage(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.style.color = type === 'error' ? '#ff9c9c' : '#ffd6a6';
}

function showDashboard(userName) {
    dashboard.classList.remove('hidden');
    loginForm.closest('.auth-panel').classList.add('hidden');
    const headerTitle = document.querySelector('.dashboard-header h2');
    if (headerTitle) {
        headerTitle.textContent = 'Hot Vibes Bar Dashboard';
    }
    const subtitle = document.querySelector('.dashboard-header .dashboard-subtitle');
    if (subtitle) {
        subtitle.remove();
    }
    const welcome = document.querySelector('.welcome-note');
    if (welcome) {
        welcome.remove();
    }
    if (userName) {
        const note = document.createElement('p');
        note.className = 'welcome-note';
        note.textContent = `Logged in as ${userName}. Enjoy the night's energy.`;
        document.querySelector('.dashboard-header').appendChild(note);
    }
}

function hideDashboard() {
    dashboard.classList.add('hidden');
    document.querySelector('.auth-panel').classList.remove('hidden');
    const welcome = document.querySelector('.welcome-note');
    if (welcome) welcome.remove();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const users = loadUsers();
    const user = users.find((entry) => entry.email === email && entry.password === password);

    if (!user) {
        showMessage('Invalid email or password. Try again or register a new account.', 'error');
        return;
    }

    localStorage.setItem('hotVibesCurrent', JSON.stringify(user));
    showDashboard(user.name);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const users = loadUsers();

    if (users.some((entry) => entry.email === email)) {
        showMessage('Email already registered. Please login or use a different address.', 'error');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    saveUsers(users);
    showMessage('Registration complete! You may now log in.', 'info');
    setActiveForm(true);
    loginForm.querySelector('#login-email').value = email;
    loginForm.querySelector('#login-password').value = '';
}

function restoreSession() {
    const current = localStorage.getItem('hotVibesCurrent');
    if (!current) return false;
    try {
        const user = JSON.parse(current);
        if (user?.email) {
            showDashboard(user.name || 'Guest');
            return true;
        }
    } catch {
        return false;
    }
    return false;
}

showLoginButton.addEventListener('click', () => setActiveForm(true));
showRegisterButton.addEventListener('click', () => setActiveForm(false));
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('hotVibesCurrent');
    hideDashboard();
    setActiveForm(true);
    showMessage('Logged out successfully.', 'info');
});

window.addEventListener('DOMContentLoaded', () => {
    setActiveForm(true);
    document.addEventListener('mousemove', (event) => {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });
    if (restoreSession()) {
        document.querySelector('.auth-panel').classList.add('hidden');
    }
});
