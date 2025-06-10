// 📁 assets/js/mock-data.js
// Dados mockados para demonstração do Dashboard SENAI Monitoring
// 🎯 ALINHADO COM API V2.0 REAL - SEM ZONAS AUTOMÁTICAS

// ===================================
// 👥 DADOS DOS FUNCIONÁRIOS (CONFORME API REAL)
// ===================================
const MOCK_EMPLOYEES = [
    {
        id: 'EMP001',
        nome: 'João Silva',
        email: 'joao.silva@senai.com',
        setor: 'Produção',
        cargo: 'Operador de Máquinas',
        dataAdmissao: '2023-01-15',
        status: 'online',
        avatar: 'JS',
        color: 'blue',
        health: {
            heartRate: 75,
            bloodPressure: '120/80',
            temperature: 36.5,
            oxygenSaturation: 98,
            batteryLevel: 85,
            lastUpdate: new Date(Date.now() - 5 * 60000) // 5 min atrás
        },
        location: {
            // Coordenadas simples como na API V2.0 real
            latitude: -3.7319,
            longitude: -38.5267,
            setor: 'Produção',
            lastSeen: new Date(Date.now() - 2 * 60000) // 2 min atrás
        },
        communication: {
            channel: 'Via/Setor 1',
            status: 'active',
            lastMessage: new Date(Date.now() - 10 * 60000)
        }
    },
    {
        id: 'EMP002',
        nome: 'Maria Santos',
        email: 'maria.santos@senai.com',
        setor: 'Almoxarifado',
        cargo: 'Supervisora de Estoque',
        dataAdmissao: '2023-02-01',
        status: 'online',
        avatar: 'MS',
        color: 'pink',
        health: {
            heartRate: 68,
            bloodPressure: '118/75',
            temperature: 36.2,
            oxygenSaturation: 99,
            batteryLevel: 92,
            lastUpdate: new Date(Date.now() - 3 * 60000)
        },
        location: {
            latitude: -3.7330,
            longitude: -38.5280,
            setor: 'Almoxarifado',
            lastSeen: new Date(Date.now() - 1 * 60000)
        },
        communication: {
            channel: 'Via/Setor 2',
            status: 'active',
            lastMessage: new Date(Date.now() - 15 * 60000)
        }
    },
    {
        id: 'EMP003',
        nome: 'Carlos Oliveira',
        email: 'carlos.oliveira@senai.com',
        setor: 'Administrativo',
        cargo: 'Analista de Qualidade',
        dataAdmissao: '2023-01-10',
        status: 'offline',
        avatar: 'CO',
        color: 'gray',
        health: {
            heartRate: 0,
            bloodPressure: '0/0',
            temperature: 0,
            oxygenSaturation: 0,
            batteryLevel: 15,
            lastUpdate: new Date(Date.now() - 45 * 60000) // 45 min atrás
        },
        location: {
            latitude: -3.7290,
            longitude: -38.5240,
            setor: 'Administrativo',
            lastSeen: new Date(Date.now() - 45 * 60000)
        },
        communication: {
            channel: 'Via/Setor 1',
            status: 'inactive',
            lastMessage: new Date(Date.now() - 60 * 60000)
        }
    },
    {
        id: 'EMP004',
        nome: 'Ana Costa',
        email: 'ana.costa@senai.com',
        setor: 'Produção',
        cargo: 'Técnica de Segurança',
        dataAdmissao: '2023-03-01',
        status: 'online',
        avatar: 'AC',
        color: 'green',
        health: {
            heartRate: 82,
            bloodPressure: '125/82',
            temperature: 36.8,
            oxygenSaturation: 97,
            batteryLevel: 78,
            lastUpdate: new Date(Date.now() - 1 * 60000)
        },
        location: {
            latitude: -3.7315,
            longitude: -38.5265,
            setor: 'Produção',
            lastSeen: new Date(Date.now() - 30000) // 30 seg atrás
        },
        communication: {
            channel: 'Via/Setor 1',
            status: 'active',
            lastMessage: new Date(Date.now() - 5 * 60000)
        }
    },
    {
        id: 'EMP005',
        nome: 'Pedro Alves',
        email: 'pedro.alves@senai.com',
        setor: 'Manutenção',
        cargo: 'Técnico de Manutenção',
        dataAdmissao: '2023-02-15',
        status: 'warning',
        avatar: 'PA',
        color: 'yellow',
        health: {
            heartRate: 105, // Elevado
            bloodPressure: '140/90', // Elevado
            temperature: 37.2, // Febre leve
            oxygenSaturation: 95, // Baixo
            batteryLevel: 45,
            lastUpdate: new Date(Date.now() - 2 * 60000)
        },
        location: {
            latitude: -3.7350,
            longitude: -38.5300,
            setor: 'Área Externa',
            lastSeen: new Date(Date.now() - 5 * 60000)
        },
        communication: {
            channel: 'Via/Setor 2',
            status: 'priority',
            lastMessage: new Date(Date.now() - 2 * 60000)
        }
    },
    {
        id: 'EMP006',
        nome: 'Lucia Ferreira',
        email: 'lucia.ferreira@senai.com',
        setor: 'Administrativo',
        cargo: 'Coordenadora RH',
        dataAdmissao: '2022-11-20',
        status: 'online',
        avatar: 'LF',
        color: 'purple',
        health: {
            heartRate: 72,
            bloodPressure: '115/70',
            temperature: 36.4,
            oxygenSaturation: 99,
            batteryLevel: 88,
            lastUpdate: new Date(Date.now() - 4 * 60000)
        },
        location: {
            latitude: -3.7285,
            longitude: -38.5235,
            setor: 'Administrativo',
            lastSeen: new Date(Date.now() - 1 * 60000)
        },
        communication: {
            channel: 'Via/Setor 2',
            status: 'active',
            lastMessage: new Date(Date.now() - 8 * 60000)
        }
    }
];

// ===================================
// 🏭 SETORES BÁSICOS (SEM DETECÇÃO AUTOMÁTICA)
// ===================================
const MOCK_SECTORS = {
    producao: {
        id: 'producao',
        name: 'Produção',
        description: 'Área principal de produção industrial',
        // Coordenadas de referência (não automáticas)
        referenceLocation: { lat: -3.7319, lon: -38.5267 },
        capacity: 50,
        currentEmployees: 2,
        equipment: [
            'Máquina CNC 001',
            'Máquina CNC 002',
            'Esteira Transportadora A',
            'Sistema de Ventilação'
        ]
    },
    almoxarifado: {
        id: 'almoxarifado',
        name: 'Almoxarifado',
        description: 'Área de armazenamento e controle de estoque',
        referenceLocation: { lat: -3.7330, lon: -38.5280 },
        capacity: 20,
        currentEmployees: 1,
        equipment: [
            'Empilhadeira 001',
            'Sistema de Código de Barras',
            'Balanças Industriais'
        ]
    },
    administrativo: {
        id: 'administrativo',
        name: 'Administrativo',
        description: 'Escritórios e salas administrativas',
        referenceLocation: { lat: -3.7290, lon: -38.5240 },
        capacity: 30,
        currentEmployees: 1,
        equipment: [
            'Computadores',
            'Sistema de Telefonia',
            'Ar Condicionado Central'
        ]
    },
    outros: {
        id: 'outros',
        name: 'Outros',
        description: 'Outras áreas e atividades externas',
        referenceLocation: { lat: -3.7350, lon: -38.5300 },
        capacity: 100,
        currentEmployees: 1,
        equipment: [
            'Câmeras de Segurança',
            'Portões Automáticos',
            'Iluminação Externa'
        ]
    }
};

// ===================================
// 📊 ESTATÍSTICAS GERAIS (SIMPLIFICADAS)
// ===================================
const MOCK_STATISTICS = {
    general: {
        totalEmployees: 127,
        activeEmployees: 89,
        offlineEmployees: 38,
        criticalAlerts: 3,
        warningAlerts: 7,
        monitoredSectors: 4, // Mudou de "zonas" para "setores"
        systemUptime: '99.8%',
        lastUpdate: new Date()
    },
    health: {
        normal: 78,
        attention: 12,
        critical: 3,
        averageHeartRate: 76,
        averageTemperature: 36.4,
        batteryLow: 5
    },
    location: {
        // Distribuição por setores (sem detecção automática)
        bySector: {
            'producao': 45,
            'almoxarifado': 23,
            'administrativo': 18,
            'outros': 14
        },
        movementToday: 234,
        emergencyExits: 0
    },
    communication: {
        activeChannels: 2,
        messagesTotal: 156,
        messagesLast24h: 34,
        emergencyCalls: 0
    }
};

// ===================================
// 🚨 ALERTAS ATIVOS (SIMPLIFICADOS)
// ===================================
const MOCK_ALERTS = [
    {
        id: 'ALERT001',
        type: 'health',
        severity: 'critical',
        employeeId: 'EMP005',
        employeeName: 'Pedro Alves',
        message: 'Frequência cardíaca elevada: 105 BPM',
        timestamp: new Date(Date.now() - 10 * 60000),
        sector: 'Área Externa',
        status: 'active',
        actions: [
            'Contatar funcionário',
            'Enviar equipe médica',
            'Evacuação de emergência'
        ]
    },
    {
        id: 'ALERT002',
        type: 'location',
        severity: 'warning',
        employeeId: 'EMP003',
        employeeName: 'Carlos Oliveira',
        message: 'Funcionário offline há mais de 30 minutos',
        timestamp: new Date(Date.now() - 45 * 60000),
        sector: 'Administrativo',
        status: 'acknowledged',
        actions: [
            'Verificar último local conhecido',
            'Contatar por telefone',
            'Enviar supervisor'
        ]
    },
    {
        id: 'ALERT003',
        type: 'equipment',
        severity: 'warning',
        message: 'Bateria baixa em 5 dispositivos',
        timestamp: new Date(Date.now() - 20 * 60000),
        sector: 'multiple',
        status: 'active',
        affectedDevices: ['DEVICE_001', 'DEVICE_003', 'DEVICE_007'],
        actions: [
            'Trocar baterias',
            'Verificar carregadores',
            'Manutenção preventiva'
        ]
    }
];

// ===================================
// 💬 COMUNICAÇÕES ATIVAS
// ===================================
const MOCK_COMMUNICATIONS = [
    {
        id: 'COMM001',
        channel: 'Via/Setor 1',
        participants: ['EMP001', 'EMP004'],
        messages: [
            {
                from: 'EMP001',
                message: 'Máquina CNC 002 apresentando ruído anormal',
                timestamp: new Date(Date.now() - 5 * 60000),
                priority: 'normal'
            },
            {
                from: 'EMP004',
                message: 'Vou verificar agora. Pode parar a operação?',
                timestamp: new Date(Date.now() - 3 * 60000),
                priority: 'normal'
            }
        ],
        status: 'active'
    },
    {
        id: 'COMM002',
        channel: 'Via/Setor 2',
        participants: ['EMP002', 'EMP005'],
        messages: [
            {
                from: 'EMP005',
                message: 'Preciso de peças para manutenção da bomba externa',
                timestamp: new Date(Date.now() - 15 * 60000),
                priority: 'high'
            },
            {
                from: 'EMP002',
                message: 'Verificando estoque. Aguarde confirmação.',
                timestamp: new Date(Date.now() - 10 * 60000),
                priority: 'normal'
            }
        ],
        status: 'active'
    }
];

// ===================================
// 📈 DADOS DE PERFORMANCE
// ===================================
const MOCK_PERFORMANCE = {
    daily: {
        productivity: 87,
        safety: 94,
        quality: 91,
        efficiency: 89,
        collaboration: 93
    },
    weekly: {
        productivity: [85, 87, 89, 88, 87, 90, 91],
        safety: [92, 94, 93, 95, 94, 96, 94],
        incidents: [0, 1, 0, 0, 1, 0, 0]
    },
    monthly: {
        trends: {
            improvement: ['safety', 'collaboration'],
            stable: ['productivity', 'quality'],
            needsAttention: ['efficiency']
        }
    }
};

// ===================================
// 🏥 DADOS MÉDICOS DETALHADOS
// ===================================
const MOCK_HEALTH_DETAILS = {
    ranges: {
        heartRate: { min: 60, max: 100, unit: 'BPM' },
        bloodPressure: { 
            systolic: { min: 90, max: 140 },
            diastolic: { min: 60, max: 90 },
            unit: 'mmHg'
        },
        temperature: { min: 36.0, max: 37.5, unit: '°C' },
        oxygenSaturation: { min: 95, max: 100, unit: '%' }
    },
    alerts: {
        critical: {
            heartRate: { below: 50, above: 120 },
            temperature: { below: 35.0, above: 38.0 },
            oxygenSaturation: { below: 90 }
        },
        warning: {
            heartRate: { below: 60, above: 100 },
            temperature: { below: 36.0, above: 37.5 },
            oxygenSaturation: { below: 95 }
        }
    }
};

// ===================================
// 🔧 FUNÇÕES UTILITÁRIAS PARA MOCK
// ===================================
function getRandomEmployee() {
    return MOCK_EMPLOYEES[Math.floor(Math.random() * MOCK_EMPLOYEES.length)];
}

function getEmployeesByStatus(status) {
    return MOCK_EMPLOYEES.filter(emp => emp.status === status);
}

function getEmployeesBySector(sector) {
    return MOCK_EMPLOYEES.filter(emp => emp.location.setor === sector);
}

function generateRandomHealthData() {
    return {
        heartRate: Math.floor(Math.random() * 40) + 60, // 60-100
        bloodPressure: `${Math.floor(Math.random() * 30) + 110}/${Math.floor(Math.random() * 20) + 70}`,
        temperature: (Math.random() * 1.5 + 36.0).toFixed(1), // 36.0-37.5
        oxygenSaturation: Math.floor(Math.random() * 6) + 95, // 95-100
        batteryLevel: Math.floor(Math.random() * 80) + 20 // 20-100
    };
}

function updateMockDataRealTime() {
    // Atualizar dados de saúde aleatoriamente
    MOCK_EMPLOYEES.forEach(employee => {
        if (employee.status === 'online') {
            const newHealth = generateRandomHealthData();
            employee.health = { ...employee.health, ...newHealth, lastUpdate: new Date() };
        }
    });
    
    // Atualizar estatísticas
    MOCK_STATISTICS.general.lastUpdate = new Date();
    MOCK_STATISTICS.general.activeEmployees = getEmployeesByStatus('online').length;
    
    return {
        employees: MOCK_EMPLOYEES,
        statistics: MOCK_STATISTICS,
        sectors: MOCK_SECTORS,
        alerts: MOCK_ALERTS
    };
}

// ===================================
// 📱 DADOS PARA MOBILE
// ===================================
const MOCK_MOBILE_CONFIG = {
    refreshRate: 30000, // 30 segundos
    offlineMode: true,
    pushNotifications: true,
    locationTracking: true,
    emergencyContacts: [
        { name: 'Segurança', phone: '(85) 9999-0001' },
        { name: 'Enfermaria', phone: '(85) 9999-0002' },
        { name: 'Supervisão', phone: '(85) 9999-0003' }
    ]
};

// ===================================
// 🌐 EXPORTAÇÕES
// ===================================
if (typeof window !== 'undefined') {
    window.MOCK_DATA = {
        employees: MOCK_EMPLOYEES,
        sectors: MOCK_SECTORS,
        statistics: MOCK_STATISTICS,
        alerts: MOCK_ALERTS,
        communications: MOCK_COMMUNICATIONS,
        performance: MOCK_PERFORMANCE,
        healthDetails: MOCK_HEALTH_DETAILS,
        mobileConfig: MOCK_MOBILE_CONFIG,
        
        // Funções utilitárias
        getRandomEmployee,
        getEmployeesByStatus,
        getEmployeesBySector,
        generateRandomHealthData,
        updateMockDataRealTime
    };
    
    console.log('📊 Mock data carregado. Acesse via window.MOCK_DATA');
}

// Para uso em Node.js (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MOCK_EMPLOYEES,
        MOCK_SECTORS,
        MOCK_STATISTICS,
        MOCK_ALERTS,
        MOCK_COMMUNICATIONS,
        MOCK_PERFORMANCE,
        MOCK_HEALTH_DETAILS,
        MOCK_MOBILE_CONFIG,
        getRandomEmployee,
        getEmployeesByStatus,
        getEmployeesBySector,
        generateRandomHealthData,
        updateMockDataRealTime
    };
}