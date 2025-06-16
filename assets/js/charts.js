// 📁 assets/js/charts.js
// Gráficos e visualizações do Dashboard SENAI Monitoring

// ===================================
// 🎨 CONFIGURAÇÕES DOS GRÁFICOS
// ===================================
const CHART_CONFIG = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12,
                    family: 'Inter'
                }
            }
        }
    },
    animation: {
        duration: 750,
        easing: 'easeInOutQuart'
    }
};

// Cores do tema SENAI
const SENAI_COLORS = {
    primary: '#1e40af',
    secondary: '#f97316',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899'
};

// Gradientes
const GRADIENTS = {
    blue: ['#3b82f6', '#1e40af'],
    orange: ['#f97316', '#ea580c'],
    green: ['#22c55e', '#16a34a'],
    purple: ['#8b5cf6', '#7c3aed'],
    pink: ['#ec4899', '#db2777']
};

// ===================================
// 📊 VARIÁVEIS DOS GRÁFICOS
// ===================================
let activityChart = null;
let distributionChart = null;
let healthChart = null;
let performanceChart = null;

// ===================================
// 🚀 INICIALIZAÇÃO DOS GRÁFICOS
// ===================================
function initializeCharts() {
    console.log('📊 Inicializando gráficos V3.0...');

    setTimeout(() => {
        try {
            initActivityChart();
            initDistributionChart();
            initHealthStatusChart();     // 🆕
            initHeartRateChart();        // 🆕
            console.log('✅ Gráficos V3.0 inicializados com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar gráficos:', error);
        }
    }, 500);
}

// ===================================
// 🔄 ATUALIZAR GRÁFICOS DE SAÚDE
// ===================================
function updateHealthCharts(normal, warning, critical) {
    // Inicializar gráficos se não existirem
    if (!window.healthStatusChart) {
        initHealthStatusChart();
    }
    if (!window.heartRateChart) {
        initHeartRateChart();
    }
    
    // Atualizar após inicialização
    setTimeout(() => {
        if (window.healthStatusChart) {
            window.healthStatusChart.data.datasets[0].data = [normal, warning, critical];
            window.healthStatusChart.update('active');
        }
    }, 100);
}

// ===================================
// 📈 GRÁFICO DE ATIVIDADE DOS FUNCIONÁRIOS
// ===================================
function initActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) {
        console.warn('⚠️ Canvas activityChart não encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Dados mockados para demonstração
    const mockData = generateActivityMockData();

    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.hours,
            datasets: [{
                label: 'Funcionários Ativos',
                data: mockData.data,
                borderColor: SENAI_COLORS.primary,
                backgroundColor: createGradient(ctx, GRADIENTS.blue),
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: SENAI_COLORS.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }, {
                label: 'Funcionários Offline',
                data: mockData.offlineData,
                borderColor: SENAI_COLORS.danger,
                backgroundColor: createGradient(ctx, ['#ef4444', '#dc2626'], 0.3),
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: SENAI_COLORS.danger,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            ...CHART_CONFIG,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 150,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        font: {
                            size: 11,
                            family: 'Inter'
                        },
                        color: '#6b7280'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11,
                            family: 'Inter'
                        },
                        color: '#6b7280'
                    }
                }
            },
            plugins: {
                ...CHART_CONFIG.plugins,
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: SENAI_COLORS.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        title: function (context) {
                            return `Horário: ${context[0].label}`;
                        },
                        label: function (context) {
                            return `${context.dataset.label}: ${context.raw} funcionários`;
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 🗺️ GRÁFICO DE DISTRIBUIÇÃO POR SETORES (ALINHADO COM API REAL)
// ===================================
function initDistributionChart() {
    const canvas = document.getElementById('zonesChart');
    if (!canvas) {
        console.warn('⚠️ Canvas zonesChart não encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Dados dos setores (conforme API V2.0 real - sem zonas automáticas)
    const sectorsData = {
        labels: ['Produção', 'Almoxarifado', 'Administrativo', 'Outros'],
        data: [45, 23, 19, 0], // Dados simples baseados em setores
        colors: [SENAI_COLORS.primary, SENAI_COLORS.secondary, SENAI_COLORS.success, SENAI_COLORS.warning]
    };

    distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sectorsData.labels,
            datasets: [{
                data: sectorsData.data,
                backgroundColor: sectorsData.colors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff'
            }]
        },
        options: {
            ...CHART_CONFIG,
            cutout: '65%',
            plugins: {
                ...CHART_CONFIG.plugins,
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: SENAI_COLORS.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} funcionários (${percentage}%)`;
                        }
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Inter'
                        },
                        generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const value = dataset.data[i];
                                    const percentage = ((value / total) * 100).toFixed(1);

                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.backgroundColor[i],
                                        lineWidth: 2,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 💓 GRÁFICO DE STATUS DE SAÚDE
// ===================================
function initHealthStatusChart() {
    const canvas = document.getElementById('healthStatusChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    window.healthStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Normal', 'Atenção', 'Crítico'],
            datasets: [{
                data: [78, 12, 3],
                backgroundColor: [
                    SENAI_COLORS.success,
                    SENAI_COLORS.warning,
                    SENAI_COLORS.danger
                ],
                borderColor: '#ffffff',
                borderWidth: 3
            }]
        },
        options: {
            ...CHART_CONFIG,
            cutout: '60%',
            plugins: {
                ...CHART_CONFIG.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} funcionários (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 💗 GRÁFICO FREQUÊNCIA CARDÍACA
// ===================================
function initHeartRateChart() {
    const canvas = document.getElementById('heartRateChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Gerar dados das últimas 24h
    const hours = [];
    const heartRateData = [];
    
    for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        hours.push(hour.getHours().toString().padStart(2, '0') + ':00');
        
        // Simular frequência cardíaca média (70-85 BPM)
        const baseRate = 75;
        const variation = Math.random() * 15 - 7.5; // -7.5 a +7.5
        heartRateData.push(Math.round(baseRate + variation));
    }

    window.heartRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Frequência Cardíaca Média',
                data: heartRateData,
                borderColor: SENAI_COLORS.danger,
                backgroundColor: createGradient(ctx, ['#ef4444', '#dc2626'], 0.2),
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: SENAI_COLORS.danger,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            ...CHART_CONFIG,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    grid: {
                        color: '#f3f4f6'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' BPM';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                ...CHART_CONFIG.plugins,
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw} BPM`;
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 💓 GRÁFICO DE SAÚDE (para seção de saúde)
// ===================================
function initHealthChart() {
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    healthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Normal', 'Atenção', 'Crítico'],
            datasets: [{
                label: 'Funcionários por Status de Saúde',
                data: [78, 12, 3],
                backgroundColor: [
                    SENAI_COLORS.success,
                    SENAI_COLORS.warning,
                    SENAI_COLORS.danger
                ],
                borderColor: [
                    SENAI_COLORS.success,
                    SENAI_COLORS.warning,
                    SENAI_COLORS.danger
                ],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            ...CHART_CONFIG,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#f3f4f6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ===================================
// ⚡ GRÁFICO DE PERFORMANCE (para relatórios)
// ===================================
function initPerformanceChart() {
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    performanceChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Produtividade', 'Segurança', 'Qualidade', 'Eficiência', 'Colaboração'],
            datasets: [{
                label: 'Performance Atual',
                data: [85, 92, 78, 88, 90],
                borderColor: SENAI_COLORS.primary,
                backgroundColor: createGradient(ctx, GRADIENTS.blue, 0.2),
                borderWidth: 2,
                pointBackgroundColor: SENAI_COLORS.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        },
        options: {
            ...CHART_CONFIG,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#f3f4f6'
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                }
            }
        }
    });
}

// ===================================
// 🔄 ATUALIZAÇÃO DOS GRÁFICOS
// ===================================
function updateCharts() {
    if (!appState.realTimeData) return;

    // Atualizar gráfico de atividade
    if (activityChart && appState.realTimeData.activity) {
        updateActivityChart();
    } else if (activityChart) {
        // 🆕 Usar dados padrão se não tiver dados reais
        const defaultActivity = generateActivityMockData();
        activityChart.data.labels = defaultActivity.hours;
        activityChart.data.datasets[0].data = defaultActivity.data;
        activityChart.update('active');
    }

    // Atualizar gráfico de distribuição
    if (distributionChart && appState.realTimeData.sectors) {
        updateDistributionChart();
    } else if (distributionChart) {
        // 🆕 Usar dados padrão se não tiver dados reais
        const defaultSectors = { 'Produção': 2, 'Almoxarifado': 1, 'Administrativo': 1, 'Área Externa': 0 };
        distributionChart.data.datasets[0].data = Object.values(defaultSectors);
        distributionChart.update('active');
    }
}

function updateActivityChart() {
    const newData = appState.realTimeData.activity;

    if (activityChart && newData) {
        activityChart.data.labels = newData.hours;
        activityChart.data.datasets[0].data = newData.data;
        activityChart.update('active');
    }
}

function updateDistributionChart() {
    const sectorsData = appState.realTimeData.sectors;

    if (distributionChart && sectorsData) {
        const values = Object.values(sectorsData);
        distributionChart.data.datasets[0].data = values;
        distributionChart.update('active');
    }
}

// ===================================
// 🎨 UTILITÁRIOS PARA GRÁFICOS
// ===================================
function createGradient(ctx, colors, opacity = 0.6) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `${colors[0]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${colors[1]}20`);
    return gradient;
}

function generateActivityMockData() {
    const hours = [];
    const data = [];
    const offlineData = [];

    // Gerar dados das últimas 24 horas
    for (let i = 23; i >= 0; i--) {
        const hour = new Date();
        hour.setHours(hour.getHours() - i);
        hours.push(hour.getHours().toString().padStart(2, '0') + ':00');

        // Simular padrão de atividade (mais ativo durante horário comercial)
        const currentHour = hour.getHours();
        let baseActivity = 30; // Atividade base

        if (currentHour >= 8 && currentHour <= 18) {
            baseActivity = 80; // Horário comercial
        } else if (currentHour >= 19 && currentHour <= 22) {
            baseActivity = 50; // Noite
        }

        // Adicionar variação aleatória
        const activity = baseActivity + Math.floor(Math.random() * 20) - 10;
        const offline = Math.floor(Math.random() * 15) + 5;

        data.push(Math.max(0, activity));
        offlineData.push(offline);
    }

    return { hours, data, offlineData };
}

// ===================================
// 🔧 CONTROLES DOS GRÁFICOS
// ===================================
function toggleChartAnimation() {
    const charts = [activityChart, distributionChart, healthChart, performanceChart];
    charts.forEach(chart => {
        if (chart) {
            chart.options.animation.duration = chart.options.animation.duration > 0 ? 0 : 750;
            chart.update();
        }
    });
}

function exportChart(chartName) {
    let chart;
    switch (chartName) {
        case 'activity': chart = activityChart; break;
        case 'distribution': chart = distributionChart; break;
        case 'health': chart = healthChart; break;
        case 'performance': chart = performanceChart; break;
    }

    if (chart) {
        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = `senai-${chartName}-chart.png`;
        link.href = url;
        link.click();
    }
}

function resetChartZoom(chartName) {
    let chart;
    switch (chartName) {
        case 'activity': chart = activityChart; break;
        case 'distribution': chart = distributionChart; break;
        case 'health': chart = healthChart; break;
        case 'performance': chart = performanceChart; break;
    }

    if (chart && chart.resetZoom) {
        chart.resetZoom();
    }
}

// ===================================
// 🎯 CLEANUP E DESTRUIÇÃO
// ===================================
function destroyCharts() {
    const charts = [activityChart, distributionChart, healthChart, performanceChart];
    charts.forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });

    // Reset das variáveis
    activityChart = null;
    distributionChart = null;
    healthChart = null;
    performanceChart = null;
}

// ===================================
// 🔍 DEBUG DOS GRÁFICOS
// ===================================
window.chartsDebug = {
    activity: () => activityChart,
    distribution: () => distributionChart,
    health: () => healthChart,
    performance: () => performanceChart,
    update: () => updateCharts(),
    destroy: () => destroyCharts(),
    export: (name) => exportChart(name),
    toggleAnimation: () => toggleChartAnimation()
};

console.log('📊 Charts debug disponível via window.chartsDebug');