// 📁 assets/js/app.js - INTEGRAÇÃO COMPLETA COM API V2.1.0
// Dashboard Hero Band - Conexão Real com API
// 🎯 ATIVAÇÃO TOTAL DA API REAL

// ===================================
// 🔧 CONFIGURAÇÕES ATUALIZADAS - API REAL ATIVA
// ===================================
const CONFIG = {
    // ✅ API REAL ATIVADA
    API_BASE_URL: 'https://senai-monitoring-api.fly.dev',
    UPDATE_INTERVAL: 30000, // 30 segundos
    ANIMATION_DURATION: 300,

    // 🚀 MODO API REAL POR PADRÃO
    MOCK_MODE: false, // ✅ FALSE = API REAL
    ENABLE_FALLBACK: true, // Fallback só em caso de erro
    AUTO_RETRY: true, // Retry automático se API falhar

    // Configurações específicas
    DEMO_MODE: false, // Sistema real
    AUTO_LOGIN: true, // Login automático
    GITHUB_PAGES: true,

    // Performance
    CACHE_ENABLED: true,
    REALTIME_ENABLED: true,
    NOTIFICATIONS_ENABLED: true,

    // 🆕 Configurações de conexão
    CONNECTION_TIMEOUT: 10000, // 10 segundos
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000 // 2 segundos
};

// ===================================
// 🎯 ESTADO GLOBAL ATUALIZADO
// ===================================
let appState = {
    currentSection: 'dashboard',
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userData: JSON.parse(localStorage.getItem('userData') || '{}'),

    // Estado da API
    apiStatus: {
        isOnline: false,
        lastCheck: null,
        connectionAttempts: 0,
        errors: [],
        lastSuccessfulCall: null,
        responseTime: 0
    },

    // Dados em tempo real da API
    realTimeData: {},
    lastUpdate: null,

    // Performance metrics
    performance: {
        apiCalls: 0,
        cacheHits: 0,
        errors: 0,
        avgResponseTime: 0,
        successRate: 0
    }
};

// ===================================
// 🚀 INICIALIZAÇÃO COM API REAL
// ===================================
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 Hero Band Dashboard V2.1.0 + API REAL iniciando...');

    // 1. Primeiro conectar com API
    await initializeApiConnection();

    // 2. Verificar login
    if (!appState.isLoggedIn && CONFIG.AUTO_LOGIN) {
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

    console.log('✅ Dashboard + API REAL inicializado!');
});

// ===================================
// 🔌 CONEXÃO COM API V2.1.0 REAL
// ===================================
async function initializeApiConnection() {
    console.log('🔌 Conectando com Hero Band API V2.1.0...');

    updateConnectionIndicator(false, 'Conectando...');

    try {
        const startTime = performance.now();

        // Verificar se API está online
        const isOnline = await heroBandApi.checkConnection();

        const responseTime = performance.now() - startTime;
        appState.apiStatus.responseTime = responseTime;

        if (isOnline) {
            appState.apiStatus.isOnline = true;
            appState.apiStatus.lastCheck = new Date();
            appState.apiStatus.lastSuccessfulCall = new Date();
            appState.apiStatus.connectionAttempts = 0;

            // Buscar informações da API
            const apiInfo = await heroBandApi.getApiInfo();
            console.log('📡 API Info recebida:', apiInfo);

            // Mostrar notificação de sucesso
            showNotification(`✅ Conectado à Hero Band API V2.1.0 (${responseTime.toFixed(0)}ms)`, 'success');

            // ✅ Conectar WebSocket após API
            console.log('🔌 Iniciando conexão WebSocket...');
            updateConnectionIndicator(true, 'API V2.1.0 Online', 'connecting');

            const wsConnected = await heroBandWebSocket.connect();

            if (wsConnected) {
                console.log('⚡ WebSocket conectado - dados em tempo real ativados!');
                updateConnectionIndicator(true, 'API V2.1.0 Online', 'connected');

                // 🆕 Notificação mais sutil
                setTimeout(() => {
                    showNotification('⚡ Tempo real ativado!', 'success');
                }, 1000);

                setupWebSocketHandlers();
            } else {
                console.log('⚠️ WebSocket falhou - usando polling HTTP');
                updateConnectionIndicator(true, 'API V2.1.0 Online', 'disconnected');

                // 🆕 Notificação menos intrusiva
                setTimeout(() => {
                    showNotification('📡 API V2.1.0 ativa - dados atualizados a cada 30s', 'info');
                }, 1500);
            }


            // Fazer primeira busca de dados
            await fetchInitialData();

        } else {
            throw new Error('Health check falhou');
        }

    } catch (error) {
        console.error('❌ Erro na conexão com API:', error);

        appState.apiStatus.isOnline = false;
        appState.apiStatus.connectionAttempts++;
        appState.apiStatus.errors.push({
            timestamp: new Date(),
            error: error.message
        });

        // Ativar fallback para dados mockados
        if (CONFIG.ENABLE_FALLBACK) {
            console.log('🔄 Ativando fallback para dados mockados');
            showNotification('⚠️ Hero Band API offline - usando dados demo', 'warning');
            updateConnectionIndicator(false, 'API Offline - Demo');

            // Usar dados mockados temporariamente
            appState.realTimeData = generateMockData();
            updateDashboardInterface();
        } else {
            updateConnectionIndicator(false, 'API Offline');
            showNotification('❌ Não foi possível conectar à API', 'error');
        }
    }
}

// ===================================
// ⚡ CONFIGURAR WEBSOCKET HANDLERS
// ===================================
function setupWebSocketHandlers() {
    // Esconder notificação automática de WebSocket offline
    setTimeout(() => {
        const wsNotification = document.querySelector('[class*="WebSocket offline"]');
        if (wsNotification) wsNotification.remove();
    }, 2000);
    console.log('⚡ Configurando handlers WebSocket...');

    // Handler para dados IoT em tempo real
    heroBandWebSocket.on('iot_data', (data) => {
        console.log('📊 Dados IoT recebidos via WebSocket:', data);

        // Atualizar dados em tempo real
        if (data.employees) {
            const currentData = appState.realTimeData;
            currentData.employees = transformEmployeesFromAPI(data.employees);
            currentData.statistics.activeEmployees = data.employees.length;

            updateDashboardInterface();

            // Mostrar notificação sutil
            updateConnectionIndicator(true, `WS: ${data.employees.length} ativos`);
        }
    });

    // Handler para alertas
    heroBandWebSocket.on('alert', (alert) => {
        console.log('🚨 Alerta recebido via WebSocket:', alert);

        // Mostrar notificação de alerta
        const message = `🚨 ${alert.message} - ${alert.employeeName || 'Funcionário'}`;
        showNotification(message, alert.severity === 'critical' ? 'error' : 'warning');

        // Atualizar contador de alertas
        if (appState.realTimeData.statistics) {
            if (alert.severity === 'critical') {
                appState.realTimeData.statistics.criticalAlerts++;
            }
            updateDashboardCards();
        }
    });

    // Handler para status de funcionários
    heroBandWebSocket.on('employee_status', (data) => {
        console.log('👤 Status funcionário atualizado:', data);

        // Encontrar e atualizar funcionário específico
        if (appState.realTimeData.employees) {
            const employeeIndex = appState.realTimeData.employees.findIndex(
                emp => emp.id === data.employeeId
            );

            if (employeeIndex !== -1) {
                appState.realTimeData.employees[employeeIndex].status = data.status;
                appState.realTimeData.employees[employeeIndex].heartRate = data.heartRate;
                appState.realTimeData.employees[employeeIndex].battery = data.battery;

                updateEmployeesList();
            }
        }
    });

    // Handler para reconexão
    heroBandWebSocket.on('connected', () => {
        console.log('⚡ WebSocket reconectado!');
        updateConnectionIndicator(true, 'API V2.1.0 Online', 'connected'); // ← ADICIONAR 'connected'
        showNotification('⚡ Conexão tempo real restaurada!', 'success');
    });

    // Handler para desconexão
    heroBandWebSocket.on('disconnected', () => {
        console.log('🔌 WebSocket desconectado');
        updateConnectionIndicator(true, 'API V2.1.0 Online', 'disconnected'); // ← ADICIONAR 'disconnected'
        showNotification('⚠️ Tempo real temporariamente indisponível', 'warning');
    });

    console.log('✅ WebSocket handlers configurados');
}

// ===================================
// 📊 BUSCAR DADOS INICIAIS DA API
// ===================================
async function fetchInitialData() {
    console.log('📊 Buscando dados iniciais da API...');

    try {
        // Buscar todos os dados em paralelo
        const [
            employeesStats,
            iotStats,
            currentLocations,
            systemStats
        ] = await Promise.all([
            heroBandApi.getEmployeesStats(),
            heroBandApi.getIoTStats(),
            heroBandApi.getAllCurrentLocations(),
            heroBandApi.getSystemStats()
        ]);

        console.log('✅ Dados iniciais recebidos:', {
            employeesStats,
            iotStats,
            currentLocations,
            systemStats
        });

        // Transformar dados para formato do dashboard
        appState.realTimeData = transformApiDataToDashboard({
            employeesStats,
            iotStats,
            currentLocations,
            systemStats
        });

        // Atualizar interface
        updateDashboardInterface();

        // Atualizar performance
        appState.performance.apiCalls += 4;
        appState.performance.successRate = calculateSuccessRate();

    } catch (error) {
        console.error('❌ Erro ao buscar dados iniciais:', error);

        // Se falhar, usar fallback
        if (CONFIG.ENABLE_FALLBACK) {
            appState.realTimeData = generateMockData();
            updateDashboardInterface();
        }

        appState.performance.errors++;
    }
}

// ===================================
// 📡 ATUALIZAÇÃO EM TEMPO REAL COM API
// ===================================
async function updateRealTimeData() {
    const startTime = performance.now();

    try {
        console.log('📡 Atualizando dados em tempo real...');

        if (appState.apiStatus.isOnline) {
            // ✅ USAR API REAL
            const newData = await fetchFromRealAPI();
            appState.realTimeData = newData;

            // Se API estava offline, marcar como online novamente
            if (!appState.apiStatus.isOnline) {
                appState.apiStatus.isOnline = true;
                updateConnectionIndicator(true, 'API V2.1.0 Online');
                showNotification('✅ Reconectado à API V2.1.0', 'success');
            }

        } else {
            // 🔄 TENTAR RECONECTAR
            const reconnected = await heroBandApi.checkConnection();

            if (reconnected) {
                appState.apiStatus.isOnline = true;
                updateConnectionIndicator(true, 'API V2.1.0 Online', null); // ← ADICIONAR null
                showNotification('✅ Reconectado à API V2.1.0', 'success');

                // Buscar dados da API
                const newData = await fetchFromRealAPI();
                appState.realTimeData = newData;
            } else {
                // Manter dados mockados
                appState.realTimeData = generateMockData();
            }
        }

        // Atualizar interface
        updateDashboardInterface();

        // Atualizar timestamp
        appState.lastUpdate = new Date();

        // Performance metrics
        const responseTime = performance.now() - startTime;
        updatePerformanceMetrics(responseTime, true);

        console.log(`📊 Dados atualizados em ${responseTime.toFixed(2)}ms`);

    } catch (error) {
        console.error('❌ Erro ao atualizar dados:', error);

        // Marcar API como offline
        appState.apiStatus.isOnline = false;
        updateConnectionIndicator(false, 'API Offline - Demo');

        // Performance metrics
        const responseTime = performance.now() - startTime;
        updatePerformanceMetrics(responseTime, false);

        // Usar fallback se disponível
        if (CONFIG.ENABLE_FALLBACK) {
            appState.realTimeData = generateMockData();
            updateDashboardInterface();
        }

        appState.performance.errors++;
    }
}

// ===================================
// 📡 BUSCAR DADOS DA API REAL - MELHORADO
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
            heroBandApi.getIoTStats(),
            heroBandApi.getEmployeesStats(),
            heroBandApi.getAllCurrentLocations(),
            heroBandApi.getSystemStats()
        ]);

        console.log('✅ Resposta da API V2.1.0:', {
            iotStats: iotStats?.success ? 'OK' : 'ERRO',
            employeesStats: employeesStats?.success ? 'OK' : 'ERRO',
            currentLocations: currentLocations?.success ? 'OK' : 'ERRO',
            systemStats: systemStats?.success ? 'OK' : 'ERRO'
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
// 🔄 TRANSFORMAR DADOS DA API - MELHORADO
// ===================================
function transformApiDataToDashboard(apiData) {
    const { iotStats, employeesStats, currentLocations, systemStats } = apiData;

    console.log('🔄 Transformando dados da API...', apiData);

    // Extrair estatísticas com múltiplos fallbacks
    const statistics = {
        totalEmployees: extractValue([
            employeesStats?.data?.total,
            systemStats?.data?.endpoints?.employees,
            iotStats?.data?.total_employees,
            127 // fallback
        ]),

        activeEmployees: extractValue([
            currentLocations?.data?.length,
            iotStats?.data?.active_employees,
            systemStats?.data?.active_employees,
            Math.floor(Math.random() * 20) + 80 // fallback dinâmico
        ]),

        criticalAlerts: extractValue([
            iotStats?.data?.critical_alerts,
            systemStats?.data?.alerts,
            Math.floor(Math.random() * 5) // fallback
        ]),

        monitoredSectors: extractValue([
            iotStats?.data?.monitored_sectors,
            systemStats?.data?.monitored_zones,
            4 // fallback
        ])
    };

    // Transformar funcionários da API
    const employees = transformEmployeesFromAPI(currentLocations?.data || []);

    // Calcular distribuição por setores
    const sectors = calculateSectorDistribution(employees);

    return {
        statistics,
        employees,
        sectors,
        activity: generateActivityData(), // Ainda mockado
        apiMetadata: {
            source: 'real_api_v2.1.0',
            version: extractValue([
                iotStats?.data?.version,
                systemStats?.data?.version,
                'v2.1.0'
            ]),
            timestamp: new Date().toISOString(),
            performance: iotStats?.data?.performance || {},
            endpoints_used: ['iot/stats', 'employees-stats', 'iot/locations-all', 'stats'],
            dataQuality: calculateDataQuality(apiData)
        }
    };
}

// ===================================
// 👥 TRANSFORMAR FUNCIONÁRIOS DA API
// ===================================
function transformEmployeesFromAPI(apiEmployees) {
    if (!Array.isArray(apiEmployees)) {
        console.warn('⚠️ API não retornou array de funcionários');
        return [];
    }

    return apiEmployees.map(emp => ({
        id: emp.employee_id || emp.id || `EMP${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        name: emp.employee_name || emp.name || emp.employee_id || 'Funcionário',
        sector: determineSectorFromAPI(emp),
        status: determineStatusFromAPI(emp),
        heartRate: extractValue([emp.heart_rate, Math.floor(Math.random() * 30) + 70]),
        bloodPressure: emp.blood_pressure || '120/80',
        location: {
            sector: determineSectorFromAPI(emp),
            lat: parseFloat(emp.latitude) || 0,
            lon: parseFloat(emp.longitude) || 0,
            lastSeen: new Date(emp.timestamp || emp.last_update || Date.now())
        },
        battery: extractValue([emp.battery_level, Math.floor(Math.random() * 80) + 20]),
        temperature: extractValue([emp.body_temperature, (Math.random() * 1.5 + 36.0).toFixed(1)])
    }));
}

// ===================================
// 🏗️ FUNÇÕES AUXILIARES
// ===================================
function extractValue(values) {
    for (const value of values) {
        if (value !== undefined && value !== null && value !== '') {
            return value;
        }
    }
    return values[values.length - 1]; // último é sempre fallback
}

function determineSectorFromAPI(emp) {
    // Mapear zona da API para setor
    const zoneMap = {
        'setor_producao': 'Produção',
        'producao': 'Produção',
        'almoxarifado': 'Almoxarifado',
        'administrativo': 'Administrativo',
        'area_externa': 'Área Externa',
        'outros': 'Outros'
    };

    const zone = emp.processed_zone || emp.zone || emp.sector || 'area_externa';
    return zoneMap[zone.toLowerCase()] || 'Área Externa';
}

function determineStatusFromAPI(emp) {
    // Determinar status baseado nos dados
    if (emp.battery_level && emp.battery_level < 20) return 'warning';
    if (emp.heart_rate && (emp.heart_rate > 100 || emp.heart_rate < 60)) return 'warning';
    if (emp.timestamp) {
        const lastUpdate = new Date(emp.timestamp);
        const now = new Date();
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        if (diffMinutes > 30) return 'offline';
    }
    return 'online';
}

function calculateSectorDistribution(employees) {
    const distribution = {};

    employees.forEach(emp => {
        const sector = emp.sector;
        distribution[sector] = (distribution[sector] || 0) + 1;
    });

    // Se não há dados, usar distribuição padrão
    if (Object.keys(distribution).length === 0) {
        return {
            'Produção': 45,
            'Almoxarifado': 23,
            'Administrativo': 18,
            'Área Externa': 14
        };
    }

    return distribution;
}

function calculateDataQuality(apiData) {
    let score = 0;
    let total = 0;

    // Verificar qualidade de cada endpoint
    if (apiData.iotStats) { score += apiData.iotStats.success ? 1 : 0; total++; }
    if (apiData.employeesStats) { score += apiData.employeesStats.success ? 1 : 0; total++; }
    if (apiData.currentLocations) { score += apiData.currentLocations.success ? 1 : 0; total++; }
    if (apiData.systemStats) { score += apiData.systemStats.success ? 1 : 0; total++; }

    return total > 0 ? Math.round((score / total) * 100) : 0;
}

function calculateSuccessRate() {
    const total = appState.performance.apiCalls;
    const errors = appState.performance.errors;

    if (total === 0) return 100;
    return Math.round(((total - errors) / total) * 100);
}

// ===================================
// 🎨 ATUALIZAÇÃO DA INTERFACE
// ===================================
function updateDashboardInterface() {
    updateDashboardCards();
    updateCharts();
    updateEmployeesList();
    updateDataSourceIndicators();
    updateHeaderMetrics(appState.realTimeData);
    updatePerformanceDisplay();
}

function updateDataSourceIndicators() {
    const isApiMode = appState.apiStatus.isOnline;
    const quality = appState.realTimeData.apiMetadata?.dataQuality || 0;

    const indicators = [
        'employeesSource',
        'activeSource',
        'alertsSource',
        'sectorsSource',
        'activityDataSource',
        'sectorsDataSource',
        'employeesDataSource'
    ];

    indicators.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (isApiMode) {
                element.textContent = `API V2.1.0 (${quality}%)`;
                element.className = 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-700';
            } else {
                element.textContent = 'Demo';
                element.className = 'text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700';
            }
        }
    });
}

function updatePerformanceDisplay() {
    // Atualizar métricas no sidebar
    const avgResponseElement = document.getElementById('avgResponseTime');
    const totalCallsElement = document.getElementById('totalApiCalls');
    const successRateElement = document.getElementById('successRate');

    if (avgResponseElement) {
        avgResponseElement.textContent = appState.performance.avgResponseTime.toFixed(0);
    }

    if (totalCallsElement) {
        totalCallsElement.textContent = appState.performance.apiCalls;
    }

    if (successRateElement) {
        successRateElement.textContent = `${appState.performance.successRate}%`;
    }
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

        appState.apiStatus.lastSuccessfulCall = new Date();
    } else {
        appState.performance.errors++;
    }

    appState.performance.successRate = calculateSuccessRate();
}

// ===================================
// 🔄 ATUALIZAÇÃO EM TEMPO REAL
// ===================================
function startRealTimeUpdates() {
    console.log('⚡ Iniciando atualizações em tempo real com API V2.1.0...');

    // Primeira atualização imediata
    updateRealTimeData();

    // Intervalo principal de atualizações
    setInterval(updateRealTimeData, CONFIG.UPDATE_INTERVAL);

    // Health check da API a cada 2 minutos
    setInterval(async () => {
        if (!appState.apiStatus.isOnline && CONFIG.AUTO_RETRY) {
            console.log('🔄 Tentando reconectar à API...');
            const reconnected = await heroBandApi.checkConnection();

            if (reconnected) {
                appState.apiStatus.isOnline = true;
                updateConnectionIndicator(true, 'API V2.1.0 Online', null);
                showNotification('✅ Reconectado à API V2.1.0', 'success');
            }
        }
    }, 120000); // 2 minutos
}

// ===================================
// 🎨 ATUALIZAÇÃO VISUAL MELHORADA
// ===================================
function updateConnectionIndicator(isOnline, statusText, wsStatus = null) {
    // Elementos do indicador
    const apiDot = document.getElementById('apiStatusDot');
    const wsDot = document.getElementById('wsStatusDot');
    const statusTextElement = document.getElementById('apiStatusText');
    const versionText = document.getElementById('apiVersionText');
    const wsText = document.getElementById('wsStatusText');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Atualizar indicador principal (API)
    if (apiDot) {
        apiDot.className = isOnline ?
            'w-3 h-3 status-online rounded-full pulse-realtime' :
            'w-3 h-3 status-offline rounded-full';
    }

    // 🆕 Atualizar indicador WebSocket
    if (wsDot && wsText) {
        if (wsStatus === 'connected') {
            wsDot.className = 'w-2 h-2 bg-green-400 rounded-full absolute -top-1 -right-1 pulse-realtime';
            wsText.className = 'text-xs text-green-600';
            wsText.textContent = '+ WS';
        } else if (wsStatus === 'connecting') {
            wsDot.className = 'w-2 h-2 bg-yellow-400 rounded-full absolute -top-1 -right-1';
            wsText.className = 'text-xs text-yellow-600';
            wsText.textContent = '⚡ WS...';
        } else {
            wsDot.className = 'w-2 h-2 bg-red-400 rounded-full absolute -top-1 -right-1 hidden';
            wsText.className = 'text-xs text-gray-400 hidden';
        }
    }

    // Atualizar textos
    if (statusTextElement) {
        if (statusText) {
            statusTextElement.textContent = statusText;
        } else {
            statusTextElement.textContent = isOnline ? 'API V2.1.0 Online' : 'API Offline - Demo';
        }
    }

    if (versionText) {
        const responseTime = appState.apiStatus.responseTime;
        versionText.textContent = isOnline ? `Fly.io (${responseTime.toFixed(0)}ms)` : 'Fallback';
    }

    // Esconder loading
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}
// ===================================
// 🔧 MANTER FUNÇÕES EXISTENTES
// ===================================

// Auto-login
function performAutoLogin() {
    const userData = {
        name: 'Admin Big Hero',
        email: 'admin@bighero.com',
        role: 'admin',
        permissions: ['read', 'write', 'admin']
    };

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));

    appState.isLoggedIn = true;
    appState.userData = userData;

    console.log('✅ Auto-login realizado para sistema real');
}

// Navegação
function showSection(sectionName) {
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('bg-gray-100', 'active');
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
        name: 'Admin Big Hero',
        email: 'admin@bighero.com',
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

// Outras funções (cards, notificações, etc.)
function updateMenuState(activeSection) {
    document.querySelectorAll('.menu-item').forEach(item => {
        const href = item.getAttribute('onclick');
        if (href && href.includes(activeSection)) {
            item.classList.add('bg-gray-100', 'active');
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
    const employees = appState.realTimeData.employees;
    if (employees && Array.isArray(employees)) {
        updateEmployeesGrid(employees);
    }
}

function updateHeaderMetrics(data) {
    if (data && data.statistics) {
        const employeeCount = document.getElementById('headerEmployeeCount');
        const onlineCount = document.getElementById('headerOnlineCount');

        if (employeeCount) employeeCount.textContent = data.statistics.totalEmployees || '--';
        if (onlineCount) onlineCount.textContent = data.statistics.activeEmployees || '--';
    }
}

function updateEmployeesGrid(employees) {
    const grid = document.getElementById('employeesGrid');
    if (!grid || !employees) return;

    if (employees.length === 0) {
        grid.innerHTML = `
            <div class="flex items-center justify-center p-8 col-span-full">
                <i class="fas fa-users text-gray-400 text-3xl mr-3"></i>
                <span class="text-gray-500">Nenhum funcionário online</span>
            </div>
        `;
        return;
    }

    const employeeCards = employees.slice(0, 6).map(emp => `
        <div class="flex items-center space-x-3 p-3 border rounded-lg hover:shadow-md transition-smooth">
            <div class="w-10 h-10 bg-gradient-to-r ${getEmployeeGradient(emp.id)} rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">${getInitials(emp.name || emp.id)}</span>
            </div>
            <div class="flex-1">
                <p class="font-medium text-gray-800">${emp.name || emp.id}</p>
                <p class="text-sm text-gray-500">${emp.sector || emp.location?.sector || 'N/A'}</p>
                <div class="flex items-center space-x-2 mt-1">
                    <i class="fas fa-heartbeat text-red-500 text-xs"></i>
                    <span class="text-xs text-gray-500">${emp.heartRate || '--'} BPM</span>
                    ${emp.battery ? `<span class="text-xs text-gray-400">🔋${emp.battery}%</span>` : ''}
                </div>
            </div>
            <div class="w-3 h-3 ${getStatusClass(emp.status)} rounded-full"></div>
        </div>
    `).join('');

    grid.innerHTML = employeeCards;
}

// Utilitários para funcionários
function getInitials(name) {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function getEmployeeGradient(id) {
    const gradients = [
        'from-blue-500 to-blue-600',
        'from-pink-500 to-pink-600',
        'from-green-500 to-green-600',
        'from-purple-500 to-purple-600',
        'from-yellow-500 to-yellow-600',
        'from-red-500 to-red-600'
    ];
    const index = id.charCodeAt(id.length - 1) % gradients.length;
    return gradients[index];
}

function getStatusClass(status) {
    switch (status) {
        case 'online': return 'status-online';
        case 'warning': return 'status-warning';
        case 'offline': return 'status-offline';
        default: return 'bg-gray-400';
    }
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

// Dados mockados (fallback)
function generateMockData() {
    return {
        statistics: {
            totalEmployees: 127,
            activeEmployees: Math.floor(Math.random() * 20) + 80,
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
                battery: Math.floor(Math.random() * 80) + 20,
                temperature: (Math.random() * 1.5 + 36.0).toFixed(1),
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
                battery: Math.floor(Math.random() * 80) + 20,
                temperature: (Math.random() * 1.5 + 36.0).toFixed(1),
                location: {
                    sector: 'Almoxarifado',
                    lat: -3.7330,
                    lon: -38.5280
                }
            },
            {
                id: 'EMP003',
                name: 'Carlos Oliveira',
                sector: 'Administrativo',
                status: 'warning',
                heartRate: 105, // Elevado
                bloodPressure: '140/90',
                battery: 15, // Baixa
                temperature: '37.2', // Febre
                location: {
                    sector: 'Administrativo',
                    lat: -3.7290,
                    lon: -38.5240
                }
            }
        ],
        sectors: {
            'Produção': 2,
            'Almoxarifado': 1,
            'Administrativo': 1,
            'Área Externa': 0
        },
        activity: generateActivityData(),
        apiMetadata: {
            source: 'mock_fallback',
            version: 'demo',
            timestamp: new Date().toISOString(),
            dataQuality: 85
        }
    };
}

function generateActivityData() {
    const hours = [];
    const data = [];

    for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        hours.push(hour.getHours().toString().padStart(2, '0') + ':00');

        // Simular padrão de atividade baseado no horário
        const currentHour = hour.getHours();
        let baseActivity = 30;

        if (currentHour >= 8 && currentHour <= 18) {
            baseActivity = Math.floor(Math.random() * 40) + 80; // Horário comercial
        } else if (currentHour >= 19 && currentHour <= 22) {
            baseActivity = Math.floor(Math.random() * 20) + 40; // Noite
        }

        data.push(baseActivity);
    }

    return { hours, data };
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
    console.log('🎯 Inicializando dashboard com API real...');

    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);

    showDashboard();

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
window.heroDebug = {
    state: () => console.log('🎯 Estado da aplicação:', appState),
    config: () => console.log('⚙️ Configurações:', CONFIG),
    apiStatus: () => console.log('📡 Status da API:', appState.apiStatus),
    performance: () => console.log('📈 Performance:', appState.performance),
    realTimeData: () => console.log('📊 Dados em tempo real:', appState.realTimeData),

    // Controles da API
    forceApiMode: () => {
        console.log('🚀 Forçando modo API...');
        appState.apiStatus.isOnline = true;
        updateRealTimeData();
    },
    forceMockMode: () => {
        console.log('🔄 Forçando modo mock...');
        appState.apiStatus.isOnline = false;
        appState.realTimeData = generateMockData();
        updateDashboardInterface();
    },
    testConnection: async () => {
        console.log('🧪 Testando conexão...');
        const result = await heroBandApi.checkConnection();
        console.log('Resultado:', result);
        return result;
    },
    refreshData: () => {
        console.log('🔄 Atualizando dados...');
        updateRealTimeData();
    },

    // Helpers para desenvolvimento
    simulateApiError: () => {
        appState.apiStatus.isOnline = false;
        updateConnectionIndicator(false, 'Erro simulado');
        showNotification('❌ Erro simulado na API', 'error');
    },
    showApiData: async () => {
        try {
            const data = await fetchFromRealAPI();
            console.log('📡 Dados brutos da API:', data);
            return data;
        } catch (error) {
            console.error('❌ Erro ao buscar dados:', error);
        }
    },

    // Controles de interface
    notification: (msg, type) => showNotification(msg, type),
    section: (name) => showSection(name),
    cards: () => updateDashboardCards(),
    charts: () => updateCharts(),

    // WebSocket controls
    ws: {
        status: () => heroBandWebSocket.isConnected,
        connect: () => heroBandWebSocket.connect(),
        disconnect: () => heroBandWebSocket.disconnect(),
        send: (type, data) => heroBandWebSocket.send(type, data),
        callbacks: () => heroBandWebSocket.callbacks
    },
};

console.log('🔧 Debug atualizado disponível via window.heroDebug');
console.log('📡 Sistema configurado para usar API REAL V2.1.0');
console.log('🎯 URL da API:', CONFIG.API_BASE_URL);