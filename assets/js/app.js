// 📁 assets/js/app.js - ATUALIZADO PARA API REAL V2.1.0
// Dashboard SENAI Monitoring - Integração Completa
// 🎯 CAPÍTULO 6.1: Conexão com API Real

// ===================================
// 🔧 CONFIGURAÇÕES ATUALIZADAS - API INTEGRATION
// ===================================
const CONFIG = {
    // ✅ MUDANÇA: API real por padrão
    API_BASE_URL: 'https://senai-monitoring-api.fly.dev',
    UPDATE_INTERVAL: 30000, // 30 segundos
    ANIMATION_DURATION: 300,
    
    // 🔄 MODO HÍBRIDO: API + Fallback
    MOCK_MODE: false, // ✅ Agora false para usar API real
    ENABLE_FALLBACK: true, // Fallback para mock se API falhar
    AUTO_RETRY: true, // Retry automático se API falhar
    
    // Configurações específicas
    DEMO_MODE: false, // Agora é sistema real
    AUTO_LOGIN: true, // Login automático para demo
    GITHUB_PAGES: true,
    
    // Performance
    CACHE_ENABLED: true,
    REALTIME_ENABLED: true,
    NOTIFICATIONS_ENABLED: true
};

// ===================================
// 🎯 ESTADO GLOBAL ATUALIZADO
// ===================================
let appState = {
    currentSection: 'dashboard',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userData: JSON.parse(localStorage.getItem('userData') || '{}'),
    
    // ✅ NOVO: Estado da API
    apiStatus: {
        isOnline: false,
        lastCheck: null,
        connectionAttempts: 0,
        errors: []
    },
    
    // Dados em tempo real (agora da API)
    realTimeData: {},
    lastUpdate: null,
    
    // Performance metrics
    performance: {
        apiCalls: 0,
        cacheHits: 0,
        errors: 0,
        avgResponseTime: 0
    }
};

// ===================================
// 🚀 INICIALIZAÇÃO ATUALIZADA
// ===================================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 SENAI Dashboard V2.0 + API Integration iniciando...');
    
    // 1. Verificar conexão com API
    await initializeApiConnection();
    
    // 2. Verificar login
    if (!appState.isLoggedIn && CONFIG.AUTO_LOGIN) {
        // Auto-login para demo
        performAutoLogin();
    } else if (!appState.isLoggedIn) {
        setTimeout(() => showLogin(), 1000);
    }
    
    // 3. Inicializar dashboard
    initializeDashboard();
    
    // 4. Inicializar atualizações em tempo real
    if (appState.isLoggedIn) {
        startRealTimeUpdates();
    }
    
    // 5. Inicializar gráficos
    initializeCharts();
    
    console.log('✅ Dashboard + API Integration inicializado!');
});

// ===================================
// 🔌 INICIALIZAÇÃO DA CONEXÃO COM API
// ===================================
async function initializeApiConnection() {
    console.log('🔌 Inicializando conexão com API V2.1.0...');
    
    try {
        // Verificar se API está online
        const isOnline = await senaiApi.checkConnection();
        
        if (isOnline) {
            appState.apiStatus.isOnline = true;
            appState.apiStatus.lastCheck = new Date();
            
            // Buscar informações da API
            const apiInfo = await senaiApi.getApiInfo();
            console.log('📡 API Info:', apiInfo);
            
            // Mostrar notificação de sucesso
            showNotification('✅ Conectado à API V2.1.0', 'success');
            
            // Atualizar indicador visual
            updateConnectionIndicator(true);
            
        } else {
            throw new Error('API offline');
        }
        
    } catch (error) {
        console.error('❌ Erro na conexão com API:', error);
        
        appState.apiStatus.isOnline = false;
        appState.apiStatus.errors.push({
            timestamp: new Date(),
            error: error.message
        });
        
        // Fallback para dados mockados
        if (CONFIG.ENABLE_FALLBACK) {
            console.log('🔄 Ativando fallback para dados mockados');
            showNotification('⚠️ API offline - usando dados demo', 'warning');
            CONFIG.MOCK_MODE = true; // Ativar modo mock temporariamente
        }
        
        updateConnectionIndicator(false);
    }
}

// ===================================
// 📊 DADOS EM TEMPO REAL - API INTEGRATION
// ===================================
async function updateRealTimeData() {
    const startTime = performance.now();
    
    try {
        console.log('📡 Atualizando dados via API V2.1.0...');
        
        if (!CONFIG.MOCK_MODE && appState.apiStatus.isOnline) {
            // ✅ USAR API REAL
            appState.realTimeData = await fetchFromRealAPI();
        } else {
            // 🔄 FALLBACK: Usar dados mockados
            appState.realTimeData = generateMockData();
        }
        
        // Atualizar interface
        updateDashboardCards();
        updateCharts();
        updateEmployeesList();
        
        // Atualizar timestamp
        appState.lastUpdate = new Date();
        
        // Performance metrics
        const responseTime = performance.now() - startTime;
        updatePerformanceMetrics(responseTime, true);
        
        console.log(`📊 Dados atualizados em ${responseTime.toFixed(2)}ms`);
        
        // ✅ Re-ativar API se estava offline
        if (CONFIG.MOCK_MODE && CONFIG.ENABLE_FALLBACK) {
            CONFIG.MOCK_MODE = false;
            appState.apiStatus.isOnline = true;
            updateConnectionIndicator(true);
        }
        
    } catch (error) {
        console.error('❌ Erro ao atualizar dados:', error);
        
        // Performance metrics
        const responseTime = performance.now() - startTime;
        updatePerformanceMetrics(responseTime, false);
        
        // Ativar fallback se disponível
        if (CONFIG.ENABLE_FALLBACK && !CONFIG.MOCK_MODE) {
            console.log('🔄 Ativando fallback por erro...');
            CONFIG.MOCK_MODE = true;
            appState.apiStatus.isOnline = false;
            updateConnectionIndicator(false);
            showNotification('⚠️ Erro na API - usando dados demo', 'warning');
            
            // Tentar novamente com dados mockados
            appState.realTimeData = generateMockData();
            updateDashboardCards();
            updateCharts();
        } else {
            showNotification('❌ Erro ao atualizar dados', 'error');
        }
    }
}

// ===================================
// 📡 BUSCAR DADOS DA API REAL
// ===================================
async function fetchFromRealAPI() {
    console.log('📡 Buscando dados da API V2.1.0...');
    
    try {
        // Fazer todas as chamadas em paralelo para performance
        const [
            iotStats,
            employeesStats,
            currentLocations,
            systemStats
        ] = await Promise.all([
            senaiApi.getIoTStats(),
            senaiApi.getEmployeesStats(),
            senaiApi.getAllCurrentLocations(),
            senaiApi.getSystemStats()
        ]);
        
        console.log('✅ Dados da API recebidos:', {
            iotStats,
            employeesStats,
            currentLocations,
            systemStats
        });
        
        // Transformar dados da API para formato do dashboard
        return transformApiDataToDashboard({
            iotStats,
            employeesStats,
            currentLocations,
            systemStats
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar dados da API:', error);
        throw error;
    }
}

// ===================================
// 🔄 TRANSFORMAR DADOS DA API
// ===================================
function transformApiDataToDashboard(apiData) {
    const { iotStats, employeesStats, currentLocations, systemStats } = apiData;
    
    // Extrair estatísticas principais
    const statistics = {
        totalEmployees: employeesStats?.data?.total || 127,
        activeEmployees: currentLocations?.data?.length || 0,
        criticalAlerts: iotStats?.data?.alerts?.critical || 0,
        monitoredSectors: iotStats?.data?.zones_active || 4
    };
    
    // Transformar localizações para formato de funcionários
    const employees = currentLocations?.data?.map(location => ({
        id: location.employee_id,
        name: location.employee_id, // API pode não ter nome
        sector: location.processed_zone || 'Desconhecido',
        status: 'online',
        heartRate: Math.floor(Math.random() * 30) + 70,
        bloodPressure: '120/80',
        location: {
            sector: location.processed_zone || 'Área Externa',
            lat: parseFloat(location.latitude) || 0,
            lon: parseFloat(location.longitude) || 0
        }
    })) || [];
    
    // Distribuição por setores (da API real)
    const sectors = {};
    employees.forEach(emp => {
        const sector = emp.location.sector;
        sectors[sector] = (sectors[sector] || 0) + 1;
    });
    
    return {
        statistics,
        employees,
        sectors,
        activity: generateActivityData(), // Ainda mockado
        apiMetadata: {
            source: 'real_api',
            version: iotStats?.data?.version || 'v2.1.0',
            timestamp: new Date().toISOString(),
            performance: iotStats?.data?.performance || {}
        }
    };
}

// ===================================
// 🎨 ATUALIZAÇÃO VISUAL DA CONEXÃO APRIMORADA
// ===================================
function updateConnectionIndicator(isOnline) {
    // Atualizar indicador principal no header
    const indicator = document.querySelector('#apiIndicator .w-3');
    const statusText = document.getElementById('apiStatusText');
    const versionText = document.getElementById('apiVersionText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const apiIndicator = document.getElementById('apiIndicator');
    
    if (indicator) {
        indicator.className = isOnline ? 
            'w-3 h-3 status-online rounded-full pulse-realtime' :
            'w-3 h-3 status-offline rounded-full';
    }
    
    if (statusText) {
        statusText.textContent = isOnline ? 
            'API V2.1.0 Online' : 
            'API Offline - Demo';
    }
    
    if (versionText) {
        versionText.textContent = isOnline ? 'Fly.io' : 'Fallback';
    }
    
    // Esconder loading spinner após conexão
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    // Atualizar classe do indicador
    if (apiIndicator) {
        apiIndicator.className = isOnline ? 
            'flex items-center space-x-2 api-indicator online' :
            'flex items-center space-x-2 api-indicator offline';
    }
    
    // Atualizar sidebar
    const sidebarStatus = document.getElementById('sidebarApiStatus');
    if (sidebarStatus) {
        sidebarStatus.textContent = isOnline ? 
            'Conectado ao Fly.io' : 
            'Modo demonstração';
    }
    
    // Atualizar modal de login
    const loginIndicator = document.getElementById('loginApiIndicator');
    const loginStatus = document.getElementById('loginApiStatus');
    
    if (loginIndicator) {
        loginIndicator.className = isOnline ?
            'w-2 h-2 rounded-full bg-green-500' :
            'w-2 h-2 rounded-full bg-red-500';
    }
    
    if (loginStatus) {
        loginStatus.textContent = isOnline ?
            'API V2.1.0 Online' :
            'API Offline - Modo Demo';
    }
    
    // Mostrar banner de status se necessário
    if (isOnline) {
        showApiBanner('success', 'API Conectada', 'Dados em tempo real da API V2.1.0');
        setTimeout(hideBanner, 3000); // Auto-hide após 3s
    }
}

// ===================================
// 🔄 ATUALIZAÇÃO DE INTERFACE APRIMORADA
// ===================================
function updateDashboardCards() {
    const data = appState.realTimeData;
    if (!data.statistics) return;
    
    // Atualizar cards com animação
    updateCardValue('.total-employees', data.statistics.totalEmployees);
    updateCardValue('.active-employees', data.statistics.activeEmployees);
    updateCardValue('.critical-alerts', data.statistics.criticalAlerts);
    updateCardValue('.monitored-zones', data.statistics.monitoredSectors);
    
    // Atualizar métricas no header
    updateHeaderMetrics(data);
    
    // Atualizar indicadores de fonte de dados
    updateDataSourceIndicators(!CONFIG.MOCK_MODE);
    
    // Atualizar contador de notificações
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        const alerts = data.statistics.criticalAlerts || 0;
        notificationCount.textContent = alerts;
        notificationCount.style.display = alerts > 0 ? 'flex' : 'none';
    }
    
    // Atualizar métricas de performance no sidebar
    updateSidebarMetrics();
}

function updateSidebarMetrics() {
    const avgResponseElement = document.getElementById('avgResponseTime');
    const totalCallsElement = document.getElementById('totalApiCalls');
    
    if (avgResponseElement) {
        avgResponseElement.textContent = 
            appState.performance.avgResponseTime.toFixed(0);
    }
    
    if (totalCallsElement) {
        totalCallsElement.textContent = appState.performance.apiCalls;
    }
}

function updateEmployeesList() {
    const employees = appState.realTimeData.employees;
    if (employees && Array.isArray(employees)) {
        updateEmployeesGrid(employees);
    }
}

// ===================================
// 📈 MÉTRICAS DE PERFORMANCE APRIMORADAS
// ===================================
function updatePerformanceMetrics(responseTime, success) {
    appState.performance.apiCalls++;
    
    if (success) {
        // Calcular média móvel do tempo de resposta
        const currentAvg = appState.performance.avgResponseTime;
        const calls = appState.performance.apiCalls;
        appState.performance.avgResponseTime = 
            ((currentAvg * (calls - 1)) + responseTime) / calls;
    } else {
        appState.performance.errors++;
    }
    
    // Atualizar sidebar em tempo real
    updateSidebarMetrics();
}

// ===================================
// 🔄 TRANSFORMAR DADOS DA API APRIMORADO
// ===================================
function transformApiDataToDashboard(apiData) {
    const { iotStats, employeesStats, currentLocations, systemStats } = apiData;
    
    console.log('🔄 Transformando dados da API:', apiData);
    
    // Extrair estatísticas principais com fallbacks
    const statistics = {
        totalEmployees: employeesStats?.data?.total || 
                       systemStats?.data?.total_employees || 127,
        activeEmployees: currentLocations?.data?.length || 
                        iotStats?.data?.active_employees || 0,
        criticalAlerts: iotStats?.data?.critical_alerts || 
                       systemStats?.data?.critical_alerts || 0,
        monitoredSectors: iotStats?.data?.monitored_sectors || 
                         systemStats?.data?.monitored_zones || 4
    };
    
    // Transformar localizações para formato de funcionários
    const employees = [];
    
    if (currentLocations?.data && Array.isArray(currentLocations.data)) {
        currentLocations.data.forEach(location => {
            employees.push({
                id: location.employee_id,
                name: location.employee_name || location.employee_id,
                sector: location.processed_zone || location.zone || 'Desconhecido',
                status: 'online',
                heartRate: Math.floor(Math.random() * 30) + 70,
                bloodPressure: '120/80',
                location: {
                    sector: location.processed_zone || location.zone || 'Área Externa',
                    lat: parseFloat(location.latitude) || 0,
                    lon: parseFloat(location.longitude) || 0
                }
            });
        });
    }
    
    // Distribuição por setores (da API real)
    const sectors = {};
    employees.forEach(emp => {
        const sector = emp.location.sector;
        sectors[sector] = (sectors[sector] || 0) + 1;
    });
    
    // Se não temos setores da API, usar dados dos funcionários
    if (Object.keys(sectors).length === 0) {
        sectors['Produção'] = Math.floor(employees.length * 0.4);
        sectors['Almoxarifado'] = Math.floor(employees.length * 0.25);
        sectors['Administrativo'] = Math.floor(employees.length * 0.25);
        sectors['Outros'] = employees.length - sectors['Produção'] - sectors['Almoxarifado'] - sectors['Administrativo'];
    }
    
    return {
        statistics,
        employees,
        sectors,
        activity: generateActivityData(), // Ainda mockado por enquanto
        apiMetadata: {
            source: 'real_api',
            version: iotStats?.data?.version || systemStats?.api?.version || 'v2.1.0',
            timestamp: new Date().toISOString(),
            performance: iotStats?.data?.performance || {},
            endpoints_used: ['iot/stats', 'employees-stats', 'iot/locations-all', 'stats']
        }
    };
}

// ===================================
// 📈 MÉTRICAS DE PERFORMANCE
// ===================================
function updatePerformanceMetrics(responseTime, success) {
    appState.performance.apiCalls++;
    
    if (success) {
        // Calcular média móvel do tempo de resposta
        const currentAvg = appState.performance.avgResponseTime;
        const calls = appState.performance.apiCalls;
        appState.performance.avgResponseTime = 
            ((currentAvg * (calls - 1)) + responseTime) / calls;
    } else {
        appState.performance.errors++;
    }
}

// ===================================
// 🔐 AUTO-LOGIN PARA DEMO
// ===================================
function performAutoLogin() {
    const userData = {
        name: 'Admin Sistema',
        email: 'admin@senai.com',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    appState.isLoggedIn = true;
    appState.userData = userData;
    
    console.log('✅ Auto-login realizado para demo');
}

// ===================================
// 🔄 FUNÇÃO DE RETRY AUTOMÁTICO
// ===================================
async function retryApiConnection() {
    if (!CONFIG.AUTO_RETRY) return;
    
    console.log('🔄 Tentando reconectar à API...');
    
    try {
        const isOnline = await senaiApi.checkConnection();
        
        if (isOnline) {
            CONFIG.MOCK_MODE = false;
            appState.apiStatus.isOnline = true;
            updateConnectionIndicator(true);
            showNotification('✅ Reconectado à API V2.1.0', 'success');
            
            // Atualizar dados imediatamente
            updateRealTimeData();
        }
    } catch (error) {
        console.log('🔄 Retry falhou, mantendo fallback');
    }
}

// ===================================
// ⚡ INICIALIZAÇÃO TEMPO REAL ATUALIZADA
// ===================================
function startRealTimeUpdates() {
    console.log('⚡ Iniciando atualizações em tempo real (API + Fallback)...');
    
    // Primeira atualização imediata
    updateRealTimeData();
    
    // Intervalo principal de atualizações
    setInterval(updateRealTimeData, CONFIG.UPDATE_INTERVAL);
    
    // Retry de conexão a cada 2 minutos se offline
    setInterval(() => {
        if (!appState.apiStatus.isOnline && CONFIG.AUTO_RETRY) {
            retryApiConnection();
        }
    }, 120000); // 2 minutos
}

// ===================================
// 🔧 MANTER FUNÇÕES EXISTENTES
// ===================================
// (Manter todas as outras funções do app.js original)

// Navegação
function showSection(sectionName) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('bg-senai-light', 'active');
    });
    
    const targetSection = document.getElementById(sectionName + 'Section');
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    appState.currentSection = sectionName;
    updateMenuState(sectionName);
    
    console.log(`📍 Navegando para seção: ${sectionName}`);
}

function showDashboard() { showSection('dashboard'); }
function showLocation() { showSection('location'); }
function showHealth() { showSection('health'); }
function showCommunication() { showSection('communication'); }
function showEmployees() { showSection('employees'); }

// Login/Logout
function showLogin() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
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
    const userData = {
        name: 'Administrador SENAI',
        email: 'admin@senai.com',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    appState.isLoggedIn = true;
    appState.userData = userData;
    
    closeLogin();
    startRealTimeUpdates();
    showNotification('Login realizado com sucesso!', 'success');
    
    console.log('✅ Login realizado:', userData);
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    location.reload();
}

// Utilitários existentes
function updateMenuState(activeSection) {
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('onclick');
        if (href && href.includes(activeSection)) {
            item.classList.add('bg-senai-light', 'active');
        }
    });
}

function updateDashboardCards() {
    const data = appState.realTimeData;
    if (!data.statistics) return;
    
    updateCardValue('.total-employees', data.statistics.totalEmployees);
    updateCardValue('.active-employees', data.statistics.activeEmployees);
    updateCardValue('.critical-alerts', data.statistics.criticalAlerts);
    updateCardValue('.monitored-zones', data.statistics.monitoredSectors);
}

function updateCardValue(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const currentValue = parseInt(element.textContent) || 0;
    
    if (currentValue !== newValue) {
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
    // Implementar se necessário
}

function generateMockData() {
    // Manter função de fallback
    return {
        statistics: {
            totalEmployees: 127,
            activeEmployees: Math.floor(Math.random() * 20) + 85,
            criticalAlerts: Math.floor(Math.random() * 5),
            monitoredSectors: 4
        },
        employees: [
            {
                id: 'EMP001',
                name: 'João Silva',
                sector: 'Produção',
                status: 'online',
                heartRate: Math.floor(Math.random() * 30) + 70,
                bloodPressure: '120/80',
                location: { 
                    sector: 'Produção', 
                    lat: -3.7319, 
                    lon: -38.5267 
                }
            },
            {
                id: 'EMP002',
                name: 'Maria Santos',
                sector: 'Almoxarifado',
                status: 'online',
                heartRate: Math.floor(Math.random() * 25) + 75,
                bloodPressure: '118/75',
                location: { 
                    sector: 'Almoxarifado', 
                    lat: -3.7330, 
                    lon: -38.5280 
                }
            }
        ],
        sectors: {
            'Produção': 2,
            'Almoxarifado': 1,
            'Administrativo': 1,
            'Área Externa': 1
        },
        activity: generateActivityData(),
        mockMode: true
    };
}

function generateActivityData() {
    const hours = [];
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        hours.push(hour.getHours() + ':00');
        data.push(Math.floor(Math.random() * 40) + 60);
    }
    
    return { hours, data };
}

// Notificações
function showNotification(message, type = 'info') {
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
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

// Configurações e outros
function showSettings() {
    showNotification('Configurações em desenvolvimento', 'info');
}

function showReports() {
    showNotification('Relatórios em desenvolvimento', 'info');
}

function toggleSidebar() {
    const sidebar = document.querySelector('aside');
    const main = document.querySelector('main');
    
    sidebar.classList.toggle('-translate-x-full');
    main.classList.toggle('ml-0');
    main.classList.toggle('ml-64');
}

function isMobile() {
    return window.innerWidth < 768;
}

function adjustForMobile() {
    if (isMobile()) {
        const sidebar = document.querySelector('aside');
        const main = document.querySelector('main');
        
        sidebar.classList.add('-translate-x-full');
        main.classList.remove('ml-64');
        main.classList.add('ml-0');
        
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

function initializeDashboard() {
    console.log('🎯 Inicializando dashboard...');
    
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
    
    showDashboard();
    
    if (CONFIG.MOCK_MODE || CONFIG.ENABLE_FALLBACK) {
        updateRealTimeData();
    }
    
    console.log('✅ Dashboard inicializado');
}

// Utilitários
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
// 🔍 DEBUG E DESENVOLVIMENTO ATUALIZADO
// ===================================
window.senaiDebug = {
    state: () => console.log(appState),
    config: () => console.log(CONFIG),
    mockData: () => console.log(generateMockData()),
    notification: (msg, type) => showNotification(msg, type),
    section: (name) => showSection(name),
    // Novos debugs para API
    apiStatus: () => console.log(appState.apiStatus),
    performance: () => console.log(appState.performance),
    forceApi: () => {
        CONFIG.MOCK_MODE = false;
        updateRealTimeData();
    },
    forceMock: () => {
        CONFIG.MOCK_MODE = true;
        updateRealTimeData();
    },
    testConnection: () => senaiApi.checkConnection()
};

console.log('🔧 Debug atualizado disponível via window.senaiDebug');