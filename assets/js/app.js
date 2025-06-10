// 📁 assets/js/app.js
// JavaScript principal do Dashboard SENAI Monitoring

// ===================================
// 🔧 CONFIGURAÇÕES GLOBAIS - GITHUB PAGES READY
// ===================================
const CONFIG = {
    API_BASE_URL: '', // Vazio para GitHub Pages (só demo)
    UPDATE_INTERVAL: 30000, // 30 segundos
    ANIMATION_DURATION: 300,
    MOCK_MODE: true, // ✅ SEMPRE true para GitHub Pages
    
    // Configurações específicas para GitHub Pages
    DEMO_MODE: true,
    AUTO_LOGIN: false, // Usuario pode testar login
    GITHUB_PAGES: true,
    
    // URLs para GitHub Pages
    REPOSITORY_URL: 'https://github.com/SEU-USUARIO/senai-dashboard-web',
    API_DOCS_URL: 'https://github.com/SEU-USUARIO/senai-monitoring-api'
};

// ===================================
// 🎯 ESTADO GLOBAL DA APLICAÇÃO
// ===================================
let appState = {
    currentSection: 'dashboard',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userData: JSON.parse(localStorage.getItem('userData') || '{}'),
    realTimeData: {},
    lastUpdate: null
};

// ===================================
// 🚀 INICIALIZAÇÃO DA APLICAÇÃO
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SENAI Dashboard V2.0 iniciando...');
    
    // Verificar login
    if (!appState.isLoggedIn && window.location.pathname === '/') {
        setTimeout(() => showLogin(), 1000);
    }
    
    // Inicializar dashboard
    initializeDashboard();
    
    // Inicializar atualizações em tempo real
    if (appState.isLoggedIn) {
        startRealTimeUpdates();
    }
    
    // Inicializar gráficos
    initializeCharts();
    
    console.log('✅ Dashboard inicializado com sucesso!');
});

// ===================================
// 🔐 SISTEMA DE LOGIN
// ===================================
function showLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Animação de entrada
    setTimeout(() => {
        modal.querySelector('.bg-white').style.transform = 'scale(1)';
        modal.querySelector('.bg-white').style.opacity = '1';
    }, 10);
}

function closeLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function login() {
    // Simular login (em produção, fazer chamada à API)
    const userData = {
        name: 'Administrador SENAI',
        email: 'admin@senai.com',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
    };
    
    // Salvar no localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Atualizar estado
    appState.isLoggedIn = true;
    appState.userData = userData;
    
    // Fechar modal
    closeLogin();
    
    // Iniciar atualizações
    startRealTimeUpdates();
    
    // Feedback visual
    showNotification('Login realizado com sucesso!', 'success');
    
    console.log('✅ Login realizado:', userData);
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    location.reload();
}

// ===================================
// 🧭 NAVEGAÇÃO ENTRE SEÇÕES
// ===================================
function showSection(sectionName) {
    // Ocultar todas as seções
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Remover classe ativa de todos os menus
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('bg-senai-light', 'active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    // Atualizar estado
    appState.currentSection = sectionName;
    
    // Atualizar visual do menu
    updateMenuState(sectionName);
    
    console.log(`📍 Navegando para seção: ${sectionName}`);
}

function showDashboard() { showSection('dashboard'); }
function showLocation() { showSection('location'); }
function showHealth() { showSection('health'); }
function showCommunication() { showSection('communication'); }
function showEmployees() { showSection('employees'); }

function updateMenuState(activeSection) {
    // Encontrar e ativar o menu correspondente
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('onclick');
        if (href && href.includes(activeSection)) {
            item.classList.add('bg-senai-light', 'active');
        }
    });
}

// ===================================
// 📊 DADOS EM TEMPO REAL
// ===================================
function startRealTimeUpdates() {
    console.log('⚡ Iniciando atualizações em tempo real...');
    
    // Primeira atualização imediata
    updateRealTimeData();
    
    // Configurar intervalo de atualizações
    setInterval(updateRealTimeData, CONFIG.UPDATE_INTERVAL);
}

async function updateRealTimeData() {
    try {
        if (CONFIG.MOCK_MODE) {
            // Usar dados mockados
            appState.realTimeData = generateMockData();
        } else {
            // Fazer chamadas à API real
            appState.realTimeData = await fetchFromAPI();
        }
        
        // Atualizar interface
        updateDashboardCards();
        updateCharts();
        updateEmployeesList();
        
        // Atualizar timestamp
        appState.lastUpdate = new Date();
        
        console.log('📊 Dados atualizados:', appState.lastUpdate.toLocaleTimeString());
        
    } catch (error) {
        console.error('❌ Erro ao atualizar dados:', error);
        showNotification('Erro ao atualizar dados', 'error');
    }
}

function generateMockData() {
    return {
        statistics: {
            totalEmployees: 127,
            activeEmployees: Math.floor(Math.random() * 20) + 85, // 85-105
            criticalAlerts: Math.floor(Math.random() * 5), // 0-4
            monitoredZones: 4
        },
        employees: [
            {
                id: 'EMP001',
                name: 'João Silva',
                sector: 'Produção',
                status: 'online',
                heartRate: Math.floor(Math.random() * 30) + 70, // 70-100
                bloodPressure: '120/80',
                location: { zone: 'setor_producao', lat: -3.7319, lon: -38.5267 }
            },
            {
                id: 'EMP002',
                name: 'Maria Santos',
                sector: 'Almoxarifado',
                status: 'online',
                heartRate: Math.floor(Math.random() * 25) + 75, // 75-100
                bloodPressure: '118/75',
                location: { zone: 'almoxarifado', lat: -3.7330, lon: -38.5280 }
            },
            {
                id: 'EMP003',
                name: 'Carlos Oliveira',
                sector: 'Administrativo',
                status: 'offline',
                heartRate: 0,
                bloodPressure: '0/0',
                location: { zone: 'administrativo', lat: -3.7290, lon: -38.5240 }
            },
            {
                id: 'EMP004',
                name: 'Ana Costa',
                sector: 'Produção',
                status: 'online',
                heartRate: Math.floor(Math.random() * 20) + 80, // 80-100
                bloodPressure: '125/82',
                location: { zone: 'setor_producao', lat: -3.7315, lon: -38.5265 }
            },
            {
                id: 'EMP005',
                name: 'Pedro Alves',
                sector: 'Manutenção',
                status: 'warning',
                heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
                bloodPressure: '140/90',
                location: { zone: 'area_externa', lat: -3.7350, lon: -38.5300 }
            }
        ],
        zones: {
            'setor_producao': 2,
            'almoxarifado': 1,
            'administrativo': 1,
            'area_externa': 1
        },
        activity: generateActivityData()
    };
}

function generateActivityData() {
    const hours = [];
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        hours.push(hour.getHours() + ':00');
        data.push(Math.floor(Math.random() * 40) + 60); // 60-100 funcionários ativos
    }
    
    return { hours, data };
}

async function fetchFromAPI() {
    // Em produção, fazer chamadas reais à API
    const endpoints = [
        `${CONFIG.API_BASE_URL}/employees-stats`,
        `${CONFIG.API_BASE_URL}/iot/stats`,
        `${CONFIG.API_BASE_URL}/iot/locations-all`
    ];
    
    const responses = await Promise.all(
        endpoints.map(url => fetch(url).then(res => res.json()))
    );
    
    return {
        employees: responses[0],
        iotStats: responses[1],
        locations: responses[2]
    };
}

// ===================================
// 🎨 ATUALIZAÇÃO DA INTERFACE
// ===================================
function updateDashboardCards() {
    const data = appState.realTimeData;
    
    if (!data.statistics) return;
    
    // Atualizar cards com animação
    updateCardValue('.total-employees', data.statistics.totalEmployees);
    updateCardValue('.active-employees', data.statistics.activeEmployees);
    updateCardValue('.critical-alerts', data.statistics.criticalAlerts);
    updateCardValue('.monitored-zones', data.statistics.monitoredZones);
}

function updateCardValue(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== newValue) {
        // Animação de mudança
        element.style.transform = 'scale(1.1)';
        element.style.color = '#3b82f6';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    }
}

function updateEmployeesList() {
    const employees = appState.realTimeData.employees;
    if (!employees) return;
    
    // Atualizar lista de funcionários online no dashboard
    // (implementar conforme necessário)
}

// ===================================
// 📈 SISTEMA DE NOTIFICAÇÕES
// ===================================
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${getNotificationClass(type)}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:opacity-70">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationClass(type) {
    const classes = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    return classes[type] || classes.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===================================
// 🔧 CONFIGURAÇÕES E PREFERÊNCIAS
// ===================================
function showSettings() {
    // Implementar modal de configurações
    showNotification('Configurações em desenvolvimento', 'info');
}

function showReports() {
    // Implementar seção de relatórios
    showNotification('Relatórios em desenvolvimento', 'info');
}

// ===================================
// 📱 RESPONSIVIDADE E MOBILE
// ===================================
function toggleSidebar() {
    const sidebar = document.querySelector('aside');
    const main = document.querySelector('main');
    
    sidebar.classList.toggle('-translate-x-full');
    main.classList.toggle('ml-0');
    main.classList.toggle('ml-64');
}

// Detectar dispositivos móveis
function isMobile() {
    return window.innerWidth < 768;
}

// Ajustar layout para mobile
function adjustForMobile() {
    if (isMobile()) {
        const sidebar = document.querySelector('aside');
        const main = document.querySelector('main');
        
        sidebar.classList.add('-translate-x-full');
        main.classList.remove('ml-64');
        main.classList.add('ml-0');
        
        // Adicionar botão de menu mobile
        addMobileMenuButton();
    }
}

function addMobileMenuButton() {
    const header = document.querySelector('header .flex');
    const existingButton = document.getElementById('mobileMenuBtn');
    
    if (!existingButton) {
        const button = document.createElement('button');
        button.id = 'mobileMenuBtn';
        button.className = 'md:hidden text-gray-600 hover:text-gray-800';
        button.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        button.onclick = toggleSidebar;
        
        header.insertBefore(button, header.firstChild);
    }
}

// ===================================
// 🎯 INICIALIZAÇÃO DO DASHBOARD
// ===================================
function initializeDashboard() {
    console.log('🎯 Inicializando dashboard...');
    
    // Ajustar para dispositivos móveis
    adjustForMobile();
    
    // Configurar eventos de redimensionamento
    window.addEventListener('resize', adjustForMobile);
    
    // Configurar seção inicial
    showDashboard();
    
    // Configurar valores iniciais dos cards
    if (CONFIG.MOCK_MODE) {
        updateRealTimeData();
    }
    
    console.log('✅ Dashboard inicializado');
}

// ===================================
// 🚀 UTILITÁRIOS GLOBAIS
// ===================================
function formatNumber(num) {
    return new Intl.NumberFormat('pt-BR').format(num);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

// ===================================
// 🔍 DEBUG E DESENVOLVIMENTO
// ===================================
window.senaiDebug = {
    state: () => console.log(appState),
    config: () => console.log(CONFIG),
    mockData: () => console.log(generateMockData()),
    notification: (msg, type) => showNotification(msg, type),
    section: (name) => showSection(name)
};

console.log('🔧 Debug disponível via window.senaiDebug');