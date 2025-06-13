console.log('🔗 Hero Band API Service inicializado:', this.baseUrl);
const API_CONFIG = {
    // ✅ API V2.1.0 Online no Fly.io
    BASE_URL: 'https://senai-monitoring-api.fly.dev',
    ENDPOINTS: {
        // Sistema
        health: '/health',
        api: '/api',
        stats: '/api/stats',
        
        // Funcionários
        employees: '/api/employees',
        employeesStats: '/api/employees-stats',
        
        // IoT V2.1.0 - Dados Hierárquicos
        iotStats: '/api/iot/stats',
        iotLocationsAll: '/api/iot/locations-all',
        iotHealth: '/api/iot/health',
        iotLocation: '/api/iot/location',
        iotPerformanceTest: '/api/iot/performance-test',
        iotTest: '/api/iot/test'
    },
    
    // Configurações de request
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 segundo
    
    // Headers padrão
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// ===================================
// 🌐 CLASSE DE INTEGRAÇÃO COM API
// ===================================
class HeroBandApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.isOnline = false;
        this.lastCheck = null;
        this.cache = new Map();
        this.cacheTimeout = 30000; // 30 segundos
        
        console.log('🔗 Hero Band API Service inicializado:', this.baseUrl);
    }
    
    // ===================================
    // 🔌 VERIFICAÇÃO DE CONECTIVIDADE
    // ===================================
    async checkConnection() {
        try {
            console.log('🔍 Verificando conexão com API...');
            
            const response = await this.makeRequest('GET', API_CONFIG.ENDPOINTS.health);
            
            if (response && response.status === 'healthy') {
                this.isOnline = true;
                this.lastCheck = new Date();
                console.log('✅ API Online - Versão:', response.version);
                return true;
            }
            
            throw new Error('Health check falhou');
            
        } catch (error) {
            this.isOnline = false;
            console.error('❌ API Offline:', error.message);
            return false;
        }
    }
    
    // ===================================
    // 📡 MÉTODO DE REQUEST GENÉRICO
    // ===================================
    async makeRequest(method, endpoint, data = null, useCache = true) {
        const url = `${this.baseUrl}${endpoint}`;
        const cacheKey = `${method}:${endpoint}`;
        
        // Verificar cache para GET requests
        if (method === 'GET' && useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📋 Usando dados do cache:', endpoint);
                return cached.data;
            }
        }
        
        try {
            console.log(`📡 API Request: ${method} ${endpoint}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
            
            const options = {
                method,
                headers: API_CONFIG.HEADERS,
                signal: controller.signal
            };
            
            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            // Cache para GET requests
            if (method === 'GET' && useCache) {
                this.cache.set(cacheKey, {
                    data: result,
                    timestamp: Date.now()
                });
            }
            
            console.log(`✅ API Response: ${method} ${endpoint}`, result);
            return result;
            
        } catch (error) {
            console.error(`❌ API Error: ${method} ${endpoint}`, error);
            
            // Fallback para dados mockados se API falhar
            if (method === 'GET' && window.MOCK_DATA) {
                console.log('🔄 Fallback para dados mockados');
                return this.getMockFallback(endpoint);
            }
            
            throw error;
        }
    }
    
    // ===================================
    // 📊 MÉTODOS ESPECÍFICOS DA API V2.1.0
    // ===================================
    
    // Verificar status da API
    async getApiStatus() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.health);
    }
    
    // Informações da API
    async getApiInfo() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.api);
    }
    
    // Estatísticas do sistema
    async getSystemStats() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.stats);
    }
    
    // ===================================
    // 👥 FUNCIONÁRIOS
    // ===================================
    
    // Listar todos os funcionários
    async getEmployees() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.employees);
    }
    
    // Estatísticas dos funcionários
    async getEmployeesStats() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.employeesStats);
    }
    
    // Funcionário específico
    async getEmployee(id) {
        return await this.makeRequest('GET', `${API_CONFIG.ENDPOINTS.employees}/${id}`);
    }
    
    // ===================================
    // 📡 IOT V2.1.0 - DADOS HIERÁRQUICOS
    // ===================================
    
    // Estatísticas IoT V2.1.0
    async getIoTStats() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.iotStats);
    }
    
    // Todas as localizações atuais (Dashboard)
    async getAllCurrentLocations() {
        return await this.makeRequest('GET', API_CONFIG.ENDPOINTS.iotLocationsAll);
    }
    
    // Dados de saúde por funcionário
    async getEmployeeHealthData(employeeId) {
        return await this.makeRequest('GET', `${API_CONFIG.ENDPOINTS.iotHealth}/${employeeId}`);
    }
    
    // Localização atual de funcionário
    async getEmployeeLocation(employeeId) {
        return await this.makeRequest('GET', `${API_CONFIG.ENDPOINTS.iotLocation}/${employeeId}`);
    }
    
    // Teste de performance
    async getPerformanceTest(employeeId) {
        return await this.makeRequest('GET', `${API_CONFIG.ENDPOINTS.iotPerformanceTest}/${employeeId}`);
    }
    
    // Teste geral do sistema IoT
    async testIoTSystem() {
        return await this.makeRequest('POST', API_CONFIG.ENDPOINTS.iotTest);
    }
    
    // ===================================
    // 📨 ENVIO DE DADOS IOT
    // ===================================
    
    // Enviar dados de saúde
    async sendHealthData(healthData) {
        return await this.makeRequest('POST', API_CONFIG.ENDPOINTS.iotHealth, healthData, false);
    }
    
    // Enviar dados de localização
    async sendLocationData(locationData) {
        return await this.makeRequest('POST', API_CONFIG.ENDPOINTS.iotLocation, locationData, false);
    }
    
    // ===================================
    // 🔄 FALLBACK PARA DADOS MOCKADOS
    // ===================================
    getMockFallback(endpoint) {
        if (!window.MOCK_DATA) return null;
        
        const mockData = window.MOCK_DATA;
        
        // Mapear endpoints para dados mockados
        switch (endpoint) {
            case API_CONFIG.ENDPOINTS.employeesStats:
                return {
                    success: true,
                    data: mockData.statistics.general,
                    message: 'Dados mockados (API offline)'
                };
                
            case API_CONFIG.ENDPOINTS.iotStats:
                return {
                    success: true,
                    data: {
                        version: 'v2_mockado',
                        statistics: mockData.statistics.location,
                        zones: mockData.sectors
                    },
                    message: 'Dados IoT mockados'
                };
                
            case API_CONFIG.ENDPOINTS.iotLocationsAll:
                return {
                    success: true,
                    data: mockData.employees.filter(emp => emp.status === 'online'),
                    message: 'Localizações mockadas'
                };
                
            case API_CONFIG.ENDPOINTS.employees:
                return {
                    success: true,
                    data: mockData.employees,
                    message: 'Funcionários mockados'
                };
                
            default:
                return {
                    success: false,
                    error: 'Endpoint não encontrado no fallback',
                    message: 'Dados não disponíveis'
                };
        }
    }
    
    // ===================================
    // 🔧 UTILITÁRIOS
    // ===================================
    
    // Limpar cache
    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache da API limpo');
    }
    
    // Status da conexão
    getConnectionStatus() {
        return {
            isOnline: this.isOnline,
            lastCheck: this.lastCheck,
            baseUrl: this.baseUrl,
            cacheSize: this.cache.size
        };
    }
    
    // Estatísticas de uso
    getUsageStats() {
        return {
            cacheHits: this.cache.size,
            totalRequests: this.totalRequests || 0,
            errors: this.errorCount || 0,
            lastSuccessfulRequest: this.lastSuccess || null
        };
    }
}

// ===================================
// 🚀 INSTÂNCIA GLOBAL DO SERVIÇO
// ===================================
const heroBandApi = new HeroBandApiService();

// ===================================
// 🔍 DEBUG E DESENVOLVIMENTO
// ===================================
if (typeof window !== 'undefined') {
    window.heroBandApi = heroBandApi;
    window.apiDebug = {
        status: () => heroBandApi.getConnectionStatus(),
        cache: () => heroBandApi.cache,
        test: () => heroBandApi.checkConnection(),
        clear: () => heroBandApi.clearCache(),
        config: () => API_CONFIG
    };
    
    console.log('🔧 Hero Band API Service carregado. Debug via window.heroBandApi');
}

// ===================================
// 📤 EXPORTAR PARA USO
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeroBandApiService, heroBandApi, API_CONFIG };
}