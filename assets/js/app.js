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
// 📊 BUSCAR DADOS INICIAIS + SAÚDE REAL
// ===================================
async function fetchInitialData() {
    console.log('📊 Buscando dados iniciais + saúde da API V2.1.0...');



    try {
        // 🚀 Fase 1: Buscar dados principais
        const [
            employeesStats,
            iotStats,
            currentLocations,
            systemStats,
            employeesData
        ] = await Promise.all([
            heroBandApi.getEmployeesStats(),
            heroBandApi.getIoTStats(),
            heroBandApi.getAllCurrentLocations(),
            heroBandApi.getSystemStats(),
            heroBandApi.getEmployees()
        ]);

        console.log('✅ Dados principais recebidos');

        // 🚀 Fase 2: Buscar dados de saúde para funcionários ativos
        let healthDataMap = {};

        if (currentLocations?.data && currentLocations.data.length > 0) {
            const activeEmployeeIds = currentLocations.data.map(loc => loc.employee_id);
            console.log('💓 Buscando dados de saúde para:', activeEmployeeIds);

            healthDataMap = await heroBandApi.getAllEmployeesHealthData(activeEmployeeIds);
        }

        console.log('✅ Dados completos recebidos:', {
            employeesStats: employeesStats?.success ? 'OK' : 'ERRO',
            iotStats: iotStats?.success ? 'OK' : 'ERRO',
            currentLocations: currentLocations?.success ? `OK (${currentLocations?.data?.length} localizações)` : 'ERRO',
            systemStats: systemStats?.success ? 'OK' : 'ERRO',
            employeesData: employeesData?.success ? `OK (${employeesData?.data?.length} funcionários)` : 'ERRO',
            healthData: `${Object.keys(healthDataMap).length} funcionários com dados de saúde`
        });

        // 🔗 Transformar dados com saúde real
        appState.realTimeData = transformApiDataWithRealHealth({
            employeesStats,
            iotStats,
            currentLocations,
            systemStats,
            employeesData,
            healthDataMap  // 🆕 Dados de saúde reais
        });

        // Atualizar interface
        updateDashboardInterface();

        // Atualizar performance
        appState.performance.apiCalls += 5 + Object.keys(healthDataMap).length;
        appState.performance.successRate = calculateSuccessRate();

    } catch (error) {
        console.error('❌ Erro ao buscar dados iniciais:', error);

        if (CONFIG.ENABLE_FALLBACK) {
            appState.realTimeData = generateMockData();
            updateDashboardInterface();
        }

        appState.performance.errors++;
    }
}

// ===================================
// 🔍 DEBUG DOS DADOS DE SAÚDE
// ===================================
function debugHealthData() {
    console.log('🔍 DEBUG: Estado atual dos dados');
    console.log('📊 appState.realTimeData:', appState.realTimeData);
    console.log('👥 Funcionários:', appState.realTimeData.employees);

    if (appState.realTimeData.employees) {
        appState.realTimeData.employees.forEach(emp => {
            console.log(`👤 ${emp.name} (${emp.id}):`, {
                heartRate: emp.heartRate,
                temperature: emp.temperature,
                battery: emp.battery,
                hasHealthData: emp.apiData?.hasHealthData,
                healthTimestamp: emp.apiData?.healthTimestamp
            });
        });
    }
}

// ===================================
// 🔧 TESTE MANUAL DA API DE SAÚDE
// ===================================
async function testHealthApiManual() {
    console.log('🧪 Testando API de saúde manualmente...');

    try {
        // Testar EMP001
        const health001 = await heroBandApi.getEmployeeHealthData('EMP001');
        console.log('💓 Dados de saúde EMP001:', health001);

        // Testar EMP002
        const health002 = await heroBandApi.getEmployeeHealthData('EMP002');
        console.log('💓 Dados de saúde EMP002:', health002);

        return { health001, health002 };

    } catch (error) {
        console.error('❌ Erro no teste manual:', error);
    }
}

// ===================================
// 🔄 REFAZER BUSCA COM SAÚDE FORÇADA
// ===================================
async function forceHealthDataUpdate() {
    console.log('🔄 Forçando atualização com dados de saúde...');

    try {
        // 1. Buscar funcionários ativos
        const currentLocations = await heroBandApi.getAllCurrentLocations();
        const employeesData = await heroBandApi.getEmployees();

        if (!currentLocations?.data || !employeesData?.data) {
            console.error('❌ Erro ao buscar dados básicos');
            return;
        }

        console.log('📍 Localizações:', currentLocations.data);
        console.log('👥 Funcionários:', employeesData.data);

        // 2. Buscar saúde de cada funcionário ativo
        const activeIds = currentLocations.data.map(loc => loc.employee_id);
        console.log('🎯 IDs ativos:', activeIds);

        const healthPromises = activeIds.map(async (employeeId) => {
            try {
                console.log(`💓 Buscando saúde de ${employeeId}...`);
                const healthData = await heroBandApi.getEmployeeHealthData(employeeId);
                console.log(`✅ Saúde ${employeeId}:`, healthData);
                return { employeeId, healthData };
            } catch (error) {
                console.error(`❌ Erro saúde ${employeeId}:`, error);
                return { employeeId, healthData: null, error };
            }
        });

        const healthResults = await Promise.all(healthPromises);
        console.log('📊 Resultados completos:', healthResults);

        // 3. Processar dados
        const healthMap = {};
        healthResults.forEach(result => {
            if (result.healthData?.success && result.healthData.data?.length > 0) {
                // Pegar registro mais recente (primeiro do array, ordenado por timestamp)
                const latestHealth = result.healthData.data[0];
                healthMap[result.employeeId] = latestHealth;
                console.log(`✅ ${result.employeeId} saúde mapeada:`, latestHealth);
            } else {
                console.warn(`⚠️ ${result.employeeId} sem dados de saúde válidos`);
            }
        });

        console.log('🗂️ Mapa final de saúde:', healthMap);

        // 4. Transformar funcionários com dados reais
        const updatedEmployees = transformEmployeesWithRealHealth(
            currentLocations.data,
            employeesData.data,
            healthMap
        );

        console.log('👥 Funcionários transformados:', updatedEmployees);

        // 5. Atualizar estado
        appState.realTimeData.employees = updatedEmployees;

        // 6. Atualizar interface
        updateDashboardInterface();

        console.log('✅ Atualização forçada concluída!');
        return healthMap;

    } catch (error) {
        console.error('❌ Erro na atualização forçada:', error);
    }
}

// ===================================
// 💓 VERIFICAR SE MÉTODO getAllEmployeesHealthData EXISTE
// ===================================
function checkHealthMethods() {
    console.log('🔍 Verificando métodos de saúde...');
    console.log('heroBandApi.getEmployeeHealthData:', typeof heroBandApi.getEmployeeHealthData);
    console.log('heroBandApi.getAllEmployeesHealthData:', typeof heroBandApi.getAllEmployeesHealthData);

    if (typeof heroBandApi.getEmployeeHealthData !== 'function') {
        console.error('❌ Método getEmployeeHealthData não encontrado!');
        return false;
    }

    if (typeof heroBandApi.getAllEmployeesHealthData !== 'function') {
        console.error('❌ Método getAllEmployeesHealthData não encontrado!');
        return false;
    }

    console.log('✅ Métodos de saúde disponíveis');
    return true;
}

// ===================================
// 🔄 TRANSFORMAR DADOS COM SAÚDE REAL
// ===================================
function transformApiDataWithRealHealth(apiData) {
    const { iotStats, employeesStats, currentLocations, systemStats, employeesData, healthDataMap } = apiData;

    console.log('🔄 Transformando dados com saúde REAL...', {
        locations: currentLocations?.data?.length || 0,
        employees: employeesData?.data?.length || 0,
        healthRecords: Object.keys(healthDataMap).length
    });

    // 📊 Estatísticas (mantém igual)
    const statistics = {
        totalEmployees: extractValue([
            employeesStats?.data?.total,
            employeesData?.data?.length,
            systemStats?.routes_count,
            4
        ]),

        activeEmployees: extractValue([
            iotStats?.data?.statistics?.active_employees,
            employeesStats?.data?.ativos,
            currentLocations?.data?.length,
            1
        ]),

        criticalAlerts: extractValue([
            iotStats?.data?.statistics?.active_alerts,
            calculateCriticalAlertsFromHealth(healthDataMap), // 🆕 Calcular da saúde real
            0
        ]),

        monitoredSectors: extractValue([
            Object.keys(iotStats?.data?.statistics?.zone_distribution || {}).length,
            Object.keys(employeesStats?.data?.distribuicao_setores || {}).length,
            5 // Atualizado para 5 setores
        ])
    };

    // 👥 Transformar funcionários com saúde real
    const employees = transformEmployeesWithRealHealth(
        currentLocations?.data || [],
        employeesData?.data || [],
        healthDataMap
    );

    // 🏭 Calcular distribuição com novos setores
    const sectors = calculateSectorDistributionReal(employees, employeesStats?.data?.distribuicao_setores);

    return {
        statistics,
        employees,
        sectors,
        activity: generateActivityData(),
        apiMetadata: {
            source: 'real_api_v2.1.0_with_health',
            version: extractValue([
                iotStats?.data?.version,
                systemStats?.version,
                'v2.1.0'
            ]),
            timestamp: new Date().toISOString(),
            performance: iotStats?.data?.performance_improvements || {},
            endpoints_used: ['iot/stats', 'employees-stats', 'iot/locations-all', 'stats', 'employees', 'iot/health/*'],
            dataQuality: calculateDataQuality(apiData),
            realData: {
                totalEmployeesRegistered: employeesData?.data?.length || 0,
                activeEmployees: iotStats?.data?.statistics?.active_employees,
                healthRecordsFound: Object.keys(healthDataMap).length,
                zoneDistribution: iotStats?.data?.statistics?.zone_distribution,
                employeesDistribution: employeesStats?.data?.distribuicao_setores,
                locationsTracked: currentLocations?.data?.length
            }
        }
    };
}

// ===================================
// 💓 TRANSFORMAR FUNCIONÁRIOS COM SAÚDE REAL
// ===================================
function transformEmployeesWithRealHealth(locationData, employeesData, healthDataMap) {
    console.log('👥 Transformando funcionários com saúde REAL:', {
        locations: locationData.length,
        employees: employeesData.length,
        healthRecords: Object.keys(healthDataMap).length
    });

    // 🗂️ Criar mapa de funcionários
    const employeesMap = {};
    employeesData.forEach(emp => {
        employeesMap[emp.id] = emp;
    });

    // 🔗 Combinar localização + cadastro + saúde
    const activeEmployees = locationData.map(locationItem => {
        const employeeId = locationItem.employee_id;
        const employeeInfo = employeesMap[employeeId];
        const healthData = healthDataMap[employeeId]; // 🆕 Dados de saúde reais

        if (!employeeInfo) {
            console.warn(`⚠️ Funcionário ${employeeId} não encontrado no cadastro`);
            return createFallbackEmployeeWithHealth(locationItem, healthData);
        }

        return createCompleteEmployeeWithRealHealth(locationItem, employeeInfo, healthData);
    });

    // 📊 Funcionários inativos (sem saúde em tempo real)
    const activeIds = new Set(locationData.map(loc => loc.employee_id));
    const inactiveEmployees = employeesData
        .filter(emp => !activeIds.has(emp.id) && emp.ativo)
        .map(emp => createInactiveEmployeeWithoutHealth(emp));

    return [...activeEmployees, ...inactiveEmployees.slice(0, 3)];
}

// ===================================
// 👤 CRIAR FUNCIONÁRIO COM SAÚDE REAL
// ===================================
function createCompleteEmployeeWithRealHealth(locationData, employeeInfo, healthData) {
    // 🎯 Usar dados de saúde REAIS se disponíveis
    const realHealthData = healthData ? {
        heartRate: healthData.heart_rate || 0,
        bloodPressure: healthData.blood_pressure || '--/--',
        temperature: healthData.body_temperature || 0,
        oxygenSaturation: healthData.oxygen_saturation || 0,
        battery: healthData.battery_level || 0,
        stressLevel: healthData.stress_level || null,
        activity: healthData.activity || null,
        signalStrength: healthData.signal_strength || null,
        lastHealthUpdate: new Date(healthData.timestamp || Date.now()),
        deviceId: healthData.device_id,
        alertLevel: healthData.alert_level
    } : generateHealthDataFromId(employeeInfo.id); // Fallback se não tiver dados

    // 🏢 Setores com mapeamento completo
    const locationSector = mapZoneToSectorDisplay(locationData.processed_zone);
    const employeeSector = mapSectorApiToDisplay(employeeInfo.setor);
    const finalSector = employeeInfo.setor_display || employeeSector || locationSector || 'Área Externa';

    return {
        // 🆔 Identificação
        id: employeeInfo.id,
        name: employeeInfo.nome,
        email: employeeInfo.email,
        deviceId: healthData?.device_id || locationData.device_id || 'N/A',

        // 🏢 Setor
        sector: finalSector,
        sectorCode: employeeInfo.setor,
        sectorColor: getSectorColor(finalSector),

        // 📍 Localização
        location: {
            lat: parseFloat(locationData.latitude) || 0,
            lon: parseFloat(locationData.longitude) || 0,
            sector: finalSector,
            zone: locationData.processed_zone || 'unknown',
            lastSeen: new Date(locationData.timestamp || locationData.created_at || Date.now()),
            processingStatus: locationData.processing_status
        },

        // 📊 Status baseado em dados reais
        status: determineStatusFromRealHealth(locationData, employeeInfo, realHealthData),

        // 💓 DADOS DE SAÚDE REAIS
        heartRate: realHealthData.heartRate,
        bloodPressure: realHealthData.bloodPressure,
        temperature: realHealthData.temperature,
        oxygenSaturation: realHealthData.oxygenSaturation,
        battery: realHealthData.battery,
        stressLevel: realHealthData.stressLevel,
        activity: realHealthData.activity,

        // 📅 Dados corporativos
        corporateData: {
            dataAdmissao: employeeInfo.data_admissao,
            tempoEmpresa: employeeInfo.tempo_empresa_anos,
            isVeterano: employeeInfo.is_veterano,
            ativo: employeeInfo.ativo,
            statusDisplay: employeeInfo.status
        },

        // 🔧 Metadados
        apiData: {
            hasLocationData: true,
            hasHealthData: !!healthData, // 🆕
            healthTimestamp: healthData?.timestamp,
            dataType: locationData.data_type,
            isProcessed: locationData.is_processed,
            alertLevel: healthData?.alert_level || locationData.alert_level,
            lastUpdate: locationData.timestamp,
            queryVersion: healthData?._query_version,
            performance: healthData?._performance
        }
    };
}

// ===================================
// 📊 STATUS BASEADO EM SAÚDE REAL
// ===================================
function determineStatusFromRealHealth(locationData, employeeInfo, healthData) {
    // 🚨 Alertas da API de saúde
    if (healthData.alertLevel === 'critical') return 'offline';
    if (healthData.alertLevel === 'warning') return 'warning';

    // 💓 Dados de saúde críticos (valores reais da API)
    if (healthData.heartRate > 140 || healthData.heartRate < 40) return 'warning';
    if (healthData.temperature > 38.0 || healthData.temperature < 35.0) return 'warning';
    if (healthData.oxygenSaturation < 90 && healthData.oxygenSaturation > 0) return 'warning';
    if (healthData.battery < 15) return 'warning';

    // 👤 Status corporativo
    if (!employeeInfo.ativo) return 'offline';

    // ⏰ Timestamp de saúde
    if (healthData.lastHealthUpdate) {
        const diffMinutes = (new Date() - healthData.lastHealthUpdate) / (1000 * 60);
        if (diffMinutes > 60) return 'warning'; // 1 hora sem dados de saúde
    }

    return 'online';
}

// ===================================
// 🚨 CALCULAR ALERTAS CRÍTICOS DA SAÚDE
// ===================================
function calculateCriticalAlertsFromHealth(healthDataMap) {
    let criticalCount = 0;

    Object.values(healthDataMap).forEach(health => {
        if (health.alert_level === 'critical') criticalCount++;
        else if (health.heart_rate > 150 || health.heart_rate < 40) criticalCount++;
        else if (health.body_temperature > 39.0 || health.body_temperature < 35.0) criticalCount++;
        else if (health.oxygen_saturation < 85 && health.oxygen_saturation > 0) criticalCount++;
        else if (health.battery_level < 10) criticalCount++;
    });

    return criticalCount;
}

// ===================================
// 🔄 TRANSFORMAR DADOS COMPLETOS DA API
// ===================================
function transformApiDataToDashboardComplete(apiData) {
    const { iotStats, employeesStats, currentLocations, systemStats, employeesData } = apiData;

    console.log('🔄 Transformando dados COMPLETOS da API...', apiData);

    // 📊 Usar dados reais das estatísticas
    const statistics = {
        totalEmployees: extractValue([
            employeesStats?.data?.total,
            employeesData?.data?.length,
            systemStats?.routes_count,
            4
        ]),

        activeEmployees: extractValue([
            iotStats?.data?.statistics?.active_employees,
            employeesStats?.data?.ativos,
            currentLocations?.data?.length,
            1
        ]),

        criticalAlerts: extractValue([
            iotStats?.data?.statistics?.active_alerts,
            0
        ]),

        monitoredSectors: extractValue([
            Object.keys(iotStats?.data?.statistics?.zone_distribution || {}).length,
            Object.keys(employeesStats?.data?.distribuicao_setores || {}).length,
            4
        ])
    };

    // 🆕 Transformar funcionários com dados REAIS
    const employees = transformEmployeesWithRealData(
        currentLocations?.data || [],
        employeesData?.data || []
    );

    // 🏭 Calcular distribuição com dados reais
    const sectors = calculateSectorDistributionReal(employees, employeesStats?.data?.distribuicao_setores);

    return {
        statistics,
        employees,
        sectors,
        activity: generateActivityData(),
        apiMetadata: {
            source: 'real_api_v2.1.0_complete',
            version: extractValue([
                iotStats?.data?.version,
                systemStats?.version,
                'v2.1.0'
            ]),
            timestamp: new Date().toISOString(),
            performance: iotStats?.data?.performance_improvements || {},
            endpoints_used: ['iot/stats', 'employees-stats', 'iot/locations-all', 'stats', 'employees'],
            dataQuality: calculateDataQuality(apiData),
            realData: {
                totalEmployeesRegistered: employeesData?.data?.length || 0,
                activeEmployees: iotStats?.data?.statistics?.active_employees,
                zoneDistribution: iotStats?.data?.statistics?.zone_distribution,
                employeesDistribution: employeesStats?.data?.distribuicao_setores,
                locationsTracked: currentLocations?.data?.length
            }
        }
    };
}

// ===================================
// 👥 TRANSFORMAR FUNCIONÁRIOS COM DADOS REAIS
// ===================================
function transformEmployeesWithRealData(locationData, employeesData) {
    console.log('👥 Transformando funcionários com dados reais:', {
        locations: locationData.length,
        employees: employeesData.length
    });

    // 🗂️ Criar mapa de funcionários por ID para lookup rápido
    const employeesMap = {};
    employeesData.forEach(emp => {
        employeesMap[emp.id] = emp;
    });

    // 🔗 Combinar dados de localização com dados dos funcionários
    const activeEmployees = locationData.map(locationItem => {
        const employeeId = locationItem.employee_id;
        const employeeInfo = employeesMap[employeeId];

        if (!employeeInfo) {
            console.warn(`⚠️ Funcionário ${employeeId} não encontrado no cadastro`);
            return createFallbackEmployee(locationItem);
        }

        return createCompleteEmployee(locationItem, employeeInfo);
    });

    // 📊 Adicionar funcionários cadastrados mas sem localização ativa
    const activeIds = new Set(locationData.map(loc => loc.employee_id));
    const inactiveEmployees = employeesData
        .filter(emp => !activeIds.has(emp.id) && emp.ativo)
        .map(emp => createInactiveEmployee(emp));

    // 🎯 Retornar funcionários ativos + inativos (limitado para performance)
    return [...activeEmployees, ...inactiveEmployees.slice(0, 3)];
}

// ===================================
// 👤 CRIAR FUNCIONÁRIO COMPLETO
// ===================================
function createCompleteEmployee(locationData, employeeInfo) {
    // 💓 Gerar dados de saúde consistentes baseados no ID
    const healthData = generateHealthDataFromId(employeeInfo.id);

    // 📍 Mapear zona para setor display
    const locationSector = mapZoneToSectorDisplay(locationData.processed_zone);
    const employeeSector = employeeInfo.setor_display || employeeInfo.setor;

    // 🎯 Usar setor do cadastro como principal
    const finalSector = employeeSector || locationSector || 'Área Externa';

    return {
        // 🆔 Identificação REAL
        id: employeeInfo.id,
        name: employeeInfo.nome,  // 🎯 NOME REAL da API
        email: employeeInfo.email,
        deviceId: locationData.device_id || 'N/A',

        // 🏢 Setor REAL  
        sector: finalSector,
        sectorCode: employeeInfo.setor,

        // 📍 Localização (dados IoT reais)
        location: {
            lat: parseFloat(locationData.latitude) || 0,
            lon: parseFloat(locationData.longitude) || 0,
            sector: finalSector,
            zone: locationData.processed_zone || 'unknown',
            lastSeen: new Date(locationData.timestamp || locationData.created_at || Date.now()),
            processingStatus: locationData.processing_status
        },

        // 📊 Status baseado em dados reais
        status: determineEmployeeStatus(locationData, employeeInfo, healthData),

        // 💓 Dados de saúde (simulados consistentes)
        heartRate: healthData.heartRate,
        bloodPressure: healthData.bloodPressure,
        temperature: healthData.temperature,
        battery: healthData.battery,

        // 📅 Dados corporativos REAIS
        corporateData: {
            dataAdmissao: employeeInfo.data_admissao,
            tempoEmpresa: employeeInfo.tempo_empresa_anos,
            isVeterano: employeeInfo.is_veterano,
            ativo: employeeInfo.ativo,
            statusDisplay: employeeInfo.status
        },

        // 🔧 Metadados
        apiData: {
            hasLocationData: true,
            dataType: locationData.data_type,
            isProcessed: locationData.is_processed,
            alertLevel: locationData.alert_level,
            lastUpdate: locationData.timestamp
        }
    };
}

// ===================================
// 👤 CRIAR FUNCIONÁRIO INATIVO
// ===================================
function createInactiveEmployee(employeeInfo) {
    const healthData = generateHealthDataFromId(employeeInfo.id);

    return {
        id: employeeInfo.id,
        name: employeeInfo.nome,
        email: employeeInfo.email,
        sector: employeeInfo.setor_display || employeeInfo.setor,
        sectorCode: employeeInfo.setor,

        location: {
            lat: 0,
            lon: 0,
            sector: employeeInfo.setor_display || 'Desconhecido',
            zone: 'offline',
            lastSeen: new Date(Date.now() - 60 * 60 * 1000), // 1h atrás
            processingStatus: 'offline'
        },

        status: 'offline',

        // Dados de saúde vazios (offline)
        heartRate: 0,
        bloodPressure: '--/--',
        temperature: 0,
        battery: 0,

        corporateData: {
            dataAdmissao: employeeInfo.data_admissao,
            tempoEmpresa: employeeInfo.tempo_empresa_anos,
            isVeterano: employeeInfo.is_veterano,
            ativo: employeeInfo.ativo,
            statusDisplay: employeeInfo.status
        },

        apiData: {
            hasLocationData: false,
            dataType: 'employee_only',
            isProcessed: false,
            alertLevel: null,
            lastUpdate: null
        }
    };
}

// ===================================
// 👤 FUNCIONÁRIO FALLBACK (caso não encontre no cadastro)
// ===================================
function createFallbackEmployee(locationData) {
    const healthData = generateHealthDataFromId(locationData.employee_id);

    return {
        id: locationData.employee_id,
        name: `Funcionário ${locationData.employee_id}`,
        email: 'nao.cadastrado@senai.com',
        sector: 'Área Externa',

        location: {
            lat: parseFloat(locationData.latitude) || 0,
            lon: parseFloat(locationData.longitude) || 0,
            sector: 'Área Externa',
            zone: locationData.processed_zone || 'unknown',
            lastSeen: new Date(locationData.timestamp || Date.now()),
            processingStatus: locationData.processing_status
        },

        status: 'warning', // Warning porque não está no cadastro

        heartRate: healthData.heartRate,
        bloodPressure: healthData.bloodPressure,
        temperature: healthData.temperature,
        battery: healthData.battery,

        corporateData: {
            dataAdmissao: null,
            tempoEmpresa: 0,
            isVeterano: false,
            ativo: false,
            statusDisplay: '⚠️ Não cadastrado'
        },

        apiData: {
            hasLocationData: true,
            dataType: locationData.data_type,
            isProcessed: locationData.is_processed,
            alertLevel: 'warning',
            lastUpdate: locationData.timestamp
        }
    };
}

// ===================================
// 🏢 MAPEAMENTO COMPLETO DE SETORES
// ===================================
function mapZoneToSectorDisplay(processedZone) {
    const zoneMap = {
        'setor_producao': 'Produção',
        'setor_almoxarifado': 'Almoxarifado',
        'setor_administrativo': 'Administrativo',
        'setor_manutencao': 'Manutenção',
        'setor_qualidade': 'Qualidade',      // 🆕
        'setor_seguranca': 'Segurança',      // 🆕
        'area_externa': 'Área Externa',
        'unknown': 'Área Externa',
        null: null
    };

    return zoneMap[processedZone];
}

// 🆕 Mapeamento de setores da API para display
function mapSectorApiToDisplay(sectorCode) {
    const sectorMap = {
        'producao': 'Produção',
        'produção': 'Produção',
        'manutencao': 'Manutenção',
        'manutenção': 'Manutenção',
        'qualidade': 'Qualidade',
        'administrativo': 'Administrativo',
        'seguranca': 'Segurança',
        'segurança': 'Segurança',
        'almoxarifado': 'Almoxarifado'
    };

    return sectorMap[sectorCode?.toLowerCase()] || sectorCode || 'Outros';
}

// 🆕 Cores por setor para interface
function getSectorColor(sector) {
    const colorMap = {
        'Produção': '#2563EB',      // Azul
        'Manutenção': '#F59E0B',    // Amarelo
        'Qualidade': '#10B981',     // Verde
        'Administrativo': '#8B5CF6', // Roxo
        'Segurança': '#EF4444',     // Vermelho
        'Almoxarifado': '#6B7280',  // Cinza
        'Área Externa': '#94A3B8'   // Cinza claro
    };

    return colorMap[sector] || '#6B7280';
}

// ===================================
// 📊 STATUS INTELIGENTE DO FUNCIONÁRIO
// ===================================
function determineEmployeeStatus(locationData, employeeInfo, healthData) {
    // 🚨 Prioridade 1: Alertas da API
    if (locationData.alert_level === 'critical') return 'offline';
    if (locationData.alert_level === 'warning') return 'warning';

    // 👤 Prioridade 2: Status corporativo
    if (!employeeInfo.ativo) return 'offline';

    // 💓 Prioridade 3: Dados de saúde
    if (healthData.heartRate > 120 || healthData.heartRate < 50) return 'warning';
    if (healthData.battery < 20) return 'warning';
    if (healthData.temperature > 37.5 || healthData.temperature < 36.0) return 'warning';

    // ⏰ Prioridade 4: Timestamp
    if (locationData.timestamp) {
        const lastUpdate = new Date(locationData.timestamp);
        const now = new Date();
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        if (diffMinutes > 30) return 'offline';
    }

    // ✅ Online por padrão
    return 'online';
}

// ===================================
// 🏭 DISTRIBUIÇÃO POR SETORES - DADOS REAIS
// ===================================
function calculateSectorDistributionReal(employees, apiSectorData) {
    // 🎯 Usar dados da API primeiro
    if (apiSectorData && Object.keys(apiSectorData).length > 0) {
        const distribution = {};

        Object.entries(apiSectorData).forEach(([sector, count]) => {
            // Mapear nomes para display
            const displayMap = {
                'Manutenção': 'Manutenção',
                'Producao': 'Produção',
                'Almoxarifado': 'Almoxarifado',
                'Administrativo': 'Administrativo'
            };

            const displayName = displayMap[sector] || sector;
            distribution[displayName] = count;
        });

        return distribution;
    }

    // 🔄 Fallback: calcular dos funcionários ativos
    const distribution = {};
    employees.forEach(emp => {
        const sector = emp.sector;
        distribution[sector] = (distribution[sector] || 0) + 1;
    });

    return Object.keys(distribution).length > 0 ? distribution : {
        'Produção': 2,
        'Manutenção': 1,
        'Administrativo': 0,
        'Área Externa': 0
    };
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
// 📡 BUSCAR DADOS DA API REAL - VERSÃO COMPLETA
// ===================================
async function fetchFromRealAPI() {
    console.log('📡 Buscando dados da API V2.1.0 (completos)...');

    try {
        // 🚀 Buscar dados essenciais + funcionários (cache inteligente)
        const [
            iotStats,
            employeesStats,
            currentLocations,
            systemStats,
            employeesData  // 🆕 Incluir sempre os funcionários
        ] = await Promise.all([
            heroBandApi.getIoTStats(),
            heroBandApi.getEmployeesStats(),
            heroBandApi.getAllCurrentLocations(),
            heroBandApi.getSystemStats(),
            heroBandApi.getEmployees()  // 🆕 Dados completos sempre
        ]);

        console.log('✅ Resposta da API V2.1.0 (completa):', {
            iotStats: iotStats?.success ? 'OK' : 'ERRO',
            employeesStats: employeesStats?.success ? 'OK' : 'ERRO',
            currentLocations: currentLocations?.success ? 'OK' : 'ERRO',
            systemStats: systemStats?.success ? 'OK' : 'ERRO',
            employeesData: employeesData?.success ? `OK (${employeesData?.data?.length} funcionários)` : 'ERRO'
        });

        // 🚀 Fase 2: Buscar dados de saúde
        let healthDataMap = {};
        if (currentLocations?.data && currentLocations.data.length > 0) {
            const activeEmployeeIds = currentLocations.data.map(loc => loc.employee_id);
            console.log('💓 Buscando dados de saúde para:', activeEmployeeIds);
            healthDataMap = await heroBandApi.getAllEmployeesHealthData(activeEmployeeIds);
        }

        // 🔗 Transformar dados com informações completas
        return transformApiDataWithRealHealth({
            iotStats,
            employeesStats,
            currentLocations,
            systemStats,
            employeesData,
            healthDataMap  // 🆕
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
// ===================================
// 👥 TRANSFORMAR FUNCIONÁRIOS DA API - CORRIGIDO
// ===================================
function transformEmployeesFromAPI(apiEmployees) {
    if (!Array.isArray(apiEmployees)) {
        console.warn('⚠️ API não retornou array de funcionários');
        return [];
    }

    console.log('📊 Dados brutos da API:', apiEmployees);

    return apiEmployees.map(emp => {
        // 🆕 Mapear employee_id para nome amigável
        const friendlyName = mapEmployeeIdToName(emp.employee_id);

        // 🆕 Determinar setor a partir da zone ou usar fallback
        const sector = mapZoneToSector(emp.processed_zone) || 'Área Externa';

        // 🆕 Simular dados de saúde baseados no ID (para demonstração)
        const healthData = generateHealthDataFromId(emp.employee_id);

        // 🆕 Determinar status baseado nos dados disponíveis
        const status = determineStatusFromApiData(emp, healthData);

        return {
            // Identificação
            id: emp.employee_id || `EMP${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
            name: friendlyName,
            deviceId: emp.device_id || 'N/A',

            // Localização (dados reais da API)
            location: {
                lat: parseFloat(emp.latitude) || 0,
                lon: parseFloat(emp.longitude) || 0,
                sector: sector,
                lastSeen: new Date(emp.timestamp || emp.created_at || Date.now()),
                zone: emp.processed_zone || 'unknown',
                processingStatus: emp.processing_status || 'unknown'
            },

            // Setor (baseado na zona processada)
            sector: sector,

            // Status (baseado em dados disponíveis)
            status: status,

            // Dados de saúde (simulados de forma inteligente)
            heartRate: healthData.heartRate,
            bloodPressure: healthData.bloodPressure,
            temperature: healthData.temperature,
            battery: healthData.battery,

            // Metadados da API
            apiData: {
                dataType: emp.data_type,
                isProcessed: emp.is_processed,
                alertLevel: emp.alert_level,
                lastUpdate: emp.timestamp,
                dashboardOptimized: emp._dashboard_optimized
            }
        };
    });
}

// ===================================
// 🆔 MAPEAR ID PARA NOME AMIGÁVEL
// ===================================
function mapEmployeeIdToName(employeeId) {
    // 🎯 Base de dados local para demonstração
    const employeeDatabase = {
        'EMP001': 'João Silva',
        'EMP002': 'Maria Santos',
        'EMP003': 'Carlos Oliveira',
        'EMP004': 'Ana Costa',
        'EMP005': 'Pedro Alves',
        'EMP006': 'Lucia Ferreira',
        'EMP007': 'Roberto Lima',
        'EMP008': 'Fernanda Torres',
        'EMP009': 'Diego Souza',
        'EMP010': 'Camila Rocha'
    };

    return employeeDatabase[employeeId] || `Funcionário ${employeeId}`;
}

// ===================================
// 🏗️ MAPEAR ZONA PARA SETOR
// ===================================
function mapZoneToSector(processedZone) {
    // 🎯 Mapeamento baseado nos dados reais da API
    const zoneToSectorMap = {
        'setor_producao': 'Produção',
        'setor_almoxarifado': 'Almoxarifado',
        'setor_administrativo': 'Administrativo',
        'setor_manutencao': 'Manutenção',
        'area_externa': 'Área Externa',
        'unknown': 'Área Externa',
        null: 'Área Externa'
    };

    return zoneToSectorMap[processedZone] || zoneToSectorMap['unknown'];
}

// ===================================
// 💓 GERAR DADOS DE SAÚDE INTELIGENTES
// ===================================
function generateHealthDataFromId(employeeId) {
    // 🎯 Usar hash do ID para gerar dados consistentes mas variados
    const hash = simpleHash(employeeId);

    // Base para funcionário "saudável"
    const baseHeartRate = 70;
    const heartRateVariation = (hash % 30) - 15; // -15 a +15
    const heartRate = Math.max(50, Math.min(110, baseHeartRate + heartRateVariation));

    // Simular alguns funcionários com problemas baseado no hash
    const hasHealthIssue = (hash % 7) === 0; // ~14% têm problemas
    const finalHeartRate = hasHealthIssue ? Math.min(140, heartRate + 40) : heartRate;

    // Bateria baseada no hash (alguns dispositivos com bateria baixa)
    const baseBattery = 80;
    const batteryVariation = (hash % 60) - 30; // -30 a +30
    const battery = Math.max(5, Math.min(100, baseBattery + batteryVariation));

    // Temperatura corporal
    const baseTemp = 36.5;
    const tempVariation = ((hash % 20) - 10) / 10; // -1.0 a +1.0
    const temperature = (baseTemp + tempVariation).toFixed(1);

    // Pressão arterial baseada na freq. cardíaca
    const systolic = Math.min(180, 110 + (finalHeartRate - 70));
    const diastolic = Math.min(110, 70 + Math.floor((finalHeartRate - 70) / 2));

    return {
        heartRate: finalHeartRate,
        bloodPressure: `${systolic}/${diastolic}`,
        temperature: parseFloat(temperature),
        battery: battery
    };
}

// ===================================
// 📊 DETERMINAR STATUS DO FUNCIONÁRIO
// ===================================
function determineStatusFromApiData(apiData, healthData) {
    // 🚨 Verificar alertas da API
    if (apiData.alert_level === 'critical') return 'offline';
    if (apiData.alert_level === 'warning') return 'warning';

    // 💓 Verificar dados de saúde simulados
    if (healthData.heartRate > 120 || healthData.heartRate < 50) return 'warning';
    if (healthData.battery < 20) return 'warning';
    if (healthData.temperature > 37.5 || healthData.temperature < 36.0) return 'warning';

    // ⏰ Verificar timestamp (offline se muito antigo)
    if (apiData.timestamp) {
        const lastUpdate = new Date(apiData.timestamp);
        const now = new Date();
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        if (diffMinutes > 30) return 'offline';
    }

    // ✅ Online por padrão
    return 'online';
}

// ===================================
// 🔧 UTILITÁRIOS
// ===================================
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// ===================================
// 📊 TRANSFORMAR DADOS DA API - ATUALIZADO
// ===================================
function transformApiDataToDashboard(apiData) {
    const { iotStats, employeesStats, currentLocations, systemStats } = apiData;

    console.log('🔄 Transformando dados da API V2.1.0...', apiData);

    // 📊 Usar dados reais das estatísticas
    const statistics = {
        // 👥 Dados de funcionários (employeesStats)
        totalEmployees: extractValue([
            employeesStats?.data?.total,
            systemStats?.routes_count, // fallback criativo
            4 // fallback final
        ]),

        // ⚡ Funcionários ativos (múltiplas fontes)
        activeEmployees: extractValue([
            iotStats?.data?.statistics?.active_employees,
            employeesStats?.data?.ativos,
            currentLocations?.data?.length,
            1 // fallback
        ]),

        // 🚨 Alertas críticos
        criticalAlerts: extractValue([
            iotStats?.data?.statistics?.active_alerts,
            0 // API V2 retorna 0 alerts atualmente
        ]),

        // 🏭 Setores monitorados
        monitoredSectors: extractValue([
            Object.keys(iotStats?.data?.statistics?.zone_distribution || {}).length,
            Object.keys(employeesStats?.data?.distribuicao_setores || {}).length,
            4 // fallback
        ])
    };

    // 👥 Transformar funcionários com dados corrigidos
    const employees = transformEmployeesFromAPI(currentLocations?.data || []);

    // 🏭 Calcular distribuição por setores (dados reais)
    const sectors = calculateSectorDistribution(employees, employeesStats?.data?.distribuicao_setores);

    return {
        statistics,
        employees,
        sectors,
        activity: generateActivityData(),
        apiMetadata: {
            source: 'real_api_v2.1.0_corrected',
            version: extractValue([
                iotStats?.data?.version,
                systemStats?.version,
                'v2.1.0'
            ]),
            timestamp: new Date().toISOString(),
            performance: iotStats?.data?.performance_improvements || {},
            endpoints_used: ['iot/stats', 'employees-stats', 'iot/locations-all', 'stats'],
            dataQuality: calculateDataQuality(apiData),
            // 🆕 Metadados específicos da API real
            realData: {
                activeEmployees: iotStats?.data?.statistics?.active_employees,
                zoneDistribution: iotStats?.data?.statistics?.zone_distribution,
                employeesDistribution: employeesStats?.data?.distribuicao_setores,
                totalDevices: currentLocations?.data?.length
            }
        }
    };
}

// ===================================
// 🏭 CALCULAR DISTRIBUIÇÃO POR SETORES - MELHORADO
// ===================================
function calculateSectorDistribution(employees, apiSectorData) {
    const distribution = {};

    // 🎯 Primeiro usar dados da API se disponíveis
    if (apiSectorData && Object.keys(apiSectorData).length > 0) {
        // Mapear nomes da API para nomes do dashboard
        const apiToDisplayMap = {
            'Manutenção': 'Manutenção',
            'Producao': 'Produção',
            'Almoxarifado': 'Almoxarifado',
            'Administrativo': 'Administrativo'
        };

        Object.entries(apiSectorData).forEach(([sector, count]) => {
            const displayName = apiToDisplayMap[sector] || sector;
            distribution[displayName] = count;
        });
    }

    // 🔄 Complementar com dados dos funcionários ativos
    employees.forEach(emp => {
        const sector = emp.sector;
        if (!distribution[sector]) {
            distribution[sector] = 0;
        }
        // Não duplicar se já temos da API
    });

    // 📊 Se não há dados, usar distribuição padrão
    if (Object.keys(distribution).length === 0) {
        return {
            'Produção': 45,
            'Manutenção': 23,
            'Administrativo': 18,
            'Área Externa': 14
        };
    }

    return distribution;
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

// ===================================
// 🔍 SISTEMA DE FILTROS AVANÇADOS
// ===================================

let filtersState = {
    sector: '',
    status: '',
    period: '24h',
    metric: 'general',
    heartRateMin: 60,
    heartRateMax: 100,
    battery: '',
    search: '',
    isActive: false
};

let filteredData = {
    employees: [],
    statistics: {},
    lastUpdate: null
};

// ===================================
// 🚀 INICIALIZAÇÃO DOS FILTROS
// ===================================
function initializeFilters() {
    console.log('🔍 Inicializando sistema de filtros avançados...');

    // Event listeners para todos os filtros
    setupFilterListeners();

    // Aplicar filtros iniciais
    applyFilters();

    console.log('✅ Sistema de filtros inicializado');
}

function setupFilterListeners() {
    // Filtros principais
    document.getElementById('sectorFilter')?.addEventListener('change', onFilterChange);
    document.getElementById('statusFilter')?.addEventListener('change', onFilterChange);
    document.getElementById('periodFilter')?.addEventListener('change', onFilterChange);
    document.getElementById('metricFilter')?.addEventListener('change', onFilterChange);

    // Filtros avançados
    document.getElementById('heartRateMin')?.addEventListener('input', onFilterChange);
    document.getElementById('heartRateMax')?.addEventListener('input', onFilterChange);
    document.getElementById('batteryFilter')?.addEventListener('change', onFilterChange);

    // Busca com debounce
    let searchTimeout;
    document.getElementById('employeeSearch')?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filtersState.search = e.target.value.toLowerCase();
            onFilterChange();
        }, 300);
    });
}

// ===================================
// 🔄 APLICAÇÃO DOS FILTROS
// ===================================
function onFilterChange() {
    // Atualizar estado dos filtros
    updateFiltersState();

    // Aplicar filtros nos dados
    applyFilters();

    // Atualizar interface
    updateFilteredInterface();

    console.log('🔍 Filtros aplicados:', filtersState);
}

function updateFiltersState() {
    filtersState = {
        sector: document.getElementById('sectorFilter')?.value || '',
        status: document.getElementById('statusFilter')?.value || '',
        period: document.getElementById('periodFilter')?.value || '24h',
        metric: document.getElementById('metricFilter')?.value || 'general',
        heartRateMin: parseInt(document.getElementById('heartRateMin')?.value) || 60,
        heartRateMax: parseInt(document.getElementById('heartRateMax')?.value) || 100,
        battery: document.getElementById('batteryFilter')?.value || '',
        search: document.getElementById('employeeSearch')?.value.toLowerCase() || '',
        isActive: hasActiveFilters()
    };
}

function hasActiveFilters() {
    return !!(
        filtersState.sector ||
        filtersState.status ||
        filtersState.period !== '24h' ||
        filtersState.metric !== 'general' ||
        filtersState.heartRateMin !== 60 ||
        filtersState.heartRateMax !== 100 ||
        filtersState.battery ||
        filtersState.search
    );
}

function applyFilters() {
    const sourceData = appState.realTimeData;

    if (!sourceData?.employees) {
        filteredData = { employees: [], statistics: {}, lastUpdate: null };
        return;
    }

    // Aplicar todos os filtros
    let filtered = sourceData.employees.filter(employee => {
        return (
            filterBySector(employee) &&
            filterByStatus(employee) &&
            filterByHeartRate(employee) &&
            filterByBattery(employee) &&
            filterBySearch(employee)
        );
    });

    // Aplicar filtro por período (simulado)
    filtered = filterByPeriod(filtered);

    // Calcular estatísticas filtradas
    const filteredStats = calculateFilteredStatistics(filtered);

    filteredData = {
        employees: filtered,
        statistics: filteredStats,
        lastUpdate: new Date()
    };
}

// ===================================
// 🎯 FILTROS ESPECÍFICOS
// ===================================
function filterBySector(employee) {
    if (!filtersState.sector) return true;
    return employee.sector === filtersState.sector ||
        employee.location?.sector === filtersState.sector;
}

function filterByStatus(employee) {
    if (!filtersState.status) return true;
    return employee.status === filtersState.status;
}

function filterByHeartRate(employee) {
    if (!employee.heartRate) return true;
    const hr = parseInt(employee.heartRate);
    return hr >= filtersState.heartRateMin && hr <= filtersState.heartRateMax;
}

function filterByBattery(employee) {
    if (!filtersState.battery || !employee.battery) return true;

    const battery = parseInt(employee.battery);

    switch (filtersState.battery) {
        case 'high': return battery > 70;
        case 'medium': return battery >= 30 && battery <= 70;
        case 'low': return battery < 30;
        case 'critical': return battery < 15;
        default: return true;
    }
}

function filterBySearch(employee) {
    if (!filtersState.search) return true;

    const searchTerm = filtersState.search;
    return (
        employee.name?.toLowerCase().includes(searchTerm) ||
        employee.id?.toLowerCase().includes(searchTerm) ||
        employee.sector?.toLowerCase().includes(searchTerm)
    );
}

function filterByPeriod(employees) {
    // Por enquanto retorna todos - no futuro pode filtrar por timestamp
    return employees;
}

// ===================================
// 📊 ESTATÍSTICAS FILTRADAS
// ===================================
function calculateFilteredStatistics(employees) {
    const total = employees.length;
    const online = employees.filter(emp => emp.status === 'online').length;
    const warning = employees.filter(emp => emp.status === 'warning').length;
    const offline = employees.filter(emp => emp.status === 'offline').length;

    // Distribuição por setor
    const sectorDistribution = {};
    employees.forEach(emp => {
        const sector = emp.sector || 'Outros';
        sectorDistribution[sector] = (sectorDistribution[sector] || 0) + 1;
    });

    // Estatísticas de saúde
    const heartRates = employees.map(emp => emp.heartRate).filter(hr => hr);
    const avgHeartRate = heartRates.length > 0 ?
        Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : 0;

    const batteries = employees.map(emp => emp.battery).filter(b => b);
    const avgBattery = batteries.length > 0 ?
        Math.round(batteries.reduce((a, b) => a + b, 0) / batteries.length) : 0;

    return {
        total,
        online,
        warning,
        offline,
        sectorDistribution,
        avgHeartRate,
        avgBattery,
        criticalAlerts: warning + offline
    };
}

// ===================================
// 🎨 ATUALIZAÇÃO DA INTERFACE
// ===================================
function updateFilteredInterface() {
    // Atualizar contador de resultados
    updateFilterResults();

    // Atualizar cards com dados filtrados
    updateDashboardCardsFiltered();

    // Atualizar lista de funcionários
    updateEmployeesGridFiltered();

    // Atualizar gráficos
    updateChartsFiltered();

    // Atualizar indicador de filtros ativos
    updateActiveFiltersIndicator();
}

function updateFilterResults() {
    const countElement = document.getElementById('filteredCount');
    const totalCount = filteredData.employees.length;

    if (countElement) {
        countElement.textContent = totalCount;

        // Animação no número
        countElement.style.transform = 'scale(1.1)';
        countElement.style.color = '#2563EB';

        setTimeout(() => {
            countElement.style.transform = 'scale(1)';
            countElement.style.color = '';
        }, 200);
    }
}

function updateDashboardCardsFiltered() {
    const stats = filteredData.statistics;

    if (filtersState.isActive) {
        // Usar dados filtrados
        updateCardValue('.total-employees', stats.total || 0);
        updateCardValue('.active-employees', stats.online || 0);
        updateCardValue('.critical-alerts', stats.criticalAlerts || 0);

        // Atualizar indicadores de fonte
        updateDataSourceIndicators(true, 'Filtrado');
    } else {
        // Usar dados originais
        updateDashboardCards();
        updateDataSourceIndicators();
    }
}

function updateEmployeesGridFiltered() {
    const employees = filtersState.isActive ?
        filteredData.employees :
        appState.realTimeData.employees;

    if (employees) {
        updateEmployeesGrid(employees.slice(0, 6));
    }
}

function updateChartsFiltered() {
    if (filtersState.isActive && filteredData.employees.length > 0) {
        // Atualizar gráfico de distribuição por setores
        updateDistributionChartFiltered();
    } else {
        // Usar dados originais
        updateCharts();
    }
}

function updateDistributionChartFiltered() {
    if (!distributionChart) return;

    const distribution = filteredData.statistics.sectorDistribution;
    const labels = Object.keys(distribution);
    const data = Object.values(distribution);

    distributionChart.data.labels = labels;
    distributionChart.data.datasets[0].data = data;
    distributionChart.update('active');
}

function updateActiveFiltersIndicator() {
    const infoElement = document.getElementById('filterActiveInfo');
    const countElement = document.getElementById('activeFiltersCount');

    if (infoElement && countElement) {
        if (filtersState.isActive) {
            const activeCount = countActiveFilters();
            countElement.textContent = activeCount;
            infoElement.classList.remove('hidden');
        } else {
            infoElement.classList.add('hidden');
        }
    }
}

function countActiveFilters() {
    let count = 0;
    if (filtersState.sector) count++;
    if (filtersState.status) count++;
    if (filtersState.period !== '24h') count++;
    if (filtersState.metric !== 'general') count++;
    if (filtersState.heartRateMin !== 60 || filtersState.heartRateMax !== 100) count++;
    if (filtersState.battery) count++;
    if (filtersState.search) count++;
    return count;
}

// ===================================
// 🔄 CONTROLES DOS FILTROS
// ===================================
function resetFilters() {
    // Limpar todos os campos
    document.getElementById('sectorFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('periodFilter').value = '24h';
    document.getElementById('metricFilter').value = 'general';
    document.getElementById('heartRateMin').value = '60';
    document.getElementById('heartRateMax').value = '100';
    document.getElementById('batteryFilter').value = '';
    document.getElementById('employeeSearch').value = '';

    // Resetar estado
    filtersState = {
        sector: '',
        status: '',
        period: '24h',
        metric: 'general',
        heartRateMin: 60,
        heartRateMax: 100,
        battery: '',
        search: '',
        isActive: false
    };

    // Aplicar filtros (que agora estão limpos)
    applyFilters();
    updateFilteredInterface();

    showNotification('🔄 Filtros limpos', 'info');
    console.log('🔄 Filtros resetados');
}

function toggleFiltersSection() {
    const content = document.getElementById('filtersContent');
    const toggle = document.getElementById('filtersToggle');

    if (content && toggle) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
        } else {
            content.style.display = 'none';
            toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        }
    }
}

function exportFilteredData() {
    const data = filtersState.isActive ? filteredData : appState.realTimeData;

    const csvContent = generateCSV(data.employees);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `hero-band-funcionarios-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
    showNotification('📄 Dados exportados em CSV', 'success');
}

function generateCSV(employees) {
    const headers = ['ID', 'Nome', 'Setor', 'Status', 'Freq. Cardíaca', 'Bateria', 'Temperatura'];
    const rows = employees.map(emp => [
        emp.id || '',
        emp.name || '',
        emp.sector || '',
        emp.status || '',
        emp.heartRate || '',
        emp.battery || '',
        emp.temperature || ''
    ]);

    const csvArray = [headers, ...rows];
    return csvArray.map(row => row.join(',')).join('\n');
}

function saveFilterPreset() {
    const presetName = prompt('Nome do preset de filtros:');
    if (presetName) {
        const presets = JSON.parse(localStorage.getItem('heroBandFilterPresets') || '{}');
        presets[presetName] = { ...filtersState };
        localStorage.setItem('heroBandFilterPresets', JSON.stringify(presets));

        showNotification(`💾 Preset "${presetName}" salvo`, 'success');
    }
}

// ===================================
// 🔧 INTEGRAÇÃO COM SISTEMA EXISTENTE
// ===================================

// Override da função updateDashboardInterface para incluir filtros
const originalUpdateDashboardInterface = updateDashboardInterface;
updateDashboardInterface = function () {
    originalUpdateDashboardInterface();

    // Se filtros estão ativos, aplicar novamente
    if (filtersState.isActive) {
        applyFilters();
        updateFilteredInterface();
    }
};

// Inicializar filtros quando o sistema carregar
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initializeFilters();
    }, 1000);
});

// ===================================
// 🔍 DEBUG DOS FILTROS
// ===================================
window.filtersDebug = {
    state: () => filtersState,
    data: () => filteredData,
    apply: () => applyFilters(),
    reset: () => resetFilters(),
    export: () => exportFilteredData()
};

console.log('🔍 Sistema de filtros avançados carregado. Debug via window.filtersDebug');

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
// 🏭 CALCULAR DISTRIBUIÇÃO COMPLETA DOS SETORES
// ===================================
function calculateSectorDistributionComplete(employees, apiSectorData) {
    // 🎯 Usar dados da API primeiro
    if (apiSectorData && Object.keys(apiSectorData).length > 0) {
        const distribution = {};

        Object.entries(apiSectorData).forEach(([sector, count]) => {
            // Mapear nomes para display
            const displayMap = {
                'Manutenção': 'Manutenção',
                'Producao': 'Produção',
                'Almoxarifado': 'Almoxarifado',
                'Administrativo': 'Administrativo',
                'Qualidade': 'Qualidade',
                'Segurança': 'Segurança'
            };

            const displayName = displayMap[sector] || sector;
            distribution[displayName] = count;
        });

        return distribution;
    }

    // 🔄 Fallback: calcular dos funcionários ativos
    const distribution = {};
    employees.forEach(emp => {
        const sector = emp.sector;
        distribution[sector] = (distribution[sector] || 0) + 1;
    });

    return Object.keys(distribution).length > 0 ? distribution : {
        'Produção': 2,
        'Manutenção': 1,
        'Administrativo': 0,
        'Área Externa': 0
    };
}

// ===================================
// 👤 CRIAR FUNCIONÁRIO FALLBACK COM SAÚDE
// ===================================
function createFallbackEmployeeWithHealth(locationData, healthData) {
    const realHealthData = healthData ? {
        heartRate: healthData.heart_rate || 0,
        temperature: healthData.body_temperature || 0,
        battery: healthData.battery_level || 0
    } : generateHealthDataFromId(locationData.employee_id);

    return {
        id: locationData.employee_id,
        name: `Funcionário ${locationData.employee_id}`,
        email: 'nao.cadastrado@senai.com',
        sector: 'Área Externa',
        status: 'warning',
        heartRate: realHealthData.heartRate,
        temperature: realHealthData.temperature,
        battery: realHealthData.battery,
        corporateData: {
            ativo: false,
            statusDisplay: '⚠️ Não cadastrado'
        },
        apiData: {
            hasHealthData: !!healthData
        }
    };
}

// ===================================
// 👤 CRIAR FUNCIONÁRIO INATIVO SEM SAÚDE
// ===================================
function createInactiveEmployeeWithoutHealth(employeeInfo) {
    return {
        id: employeeInfo.id,
        name: employeeInfo.nome,
        email: employeeInfo.email,
        sector: employeeInfo.setor_display || employeeInfo.setor,
        status: 'offline',
        heartRate: 0,
        temperature: 0,
        battery: 0,
        corporateData: {
            dataAdmissao: employeeInfo.data_admissao,
            tempoEmpresa: employeeInfo.tempo_empresa_anos,
            ativo: employeeInfo.ativo
        },
        apiData: {
            hasHealthData: false
        }
    };
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

    health: {
        debug: () => debugHealthData(),
        test: () => testHealthApiManual(),
        force: () => forceHealthDataUpdate(),
        check: () => checkHealthMethods()
    },

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