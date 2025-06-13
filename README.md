# 🎯 Hero Band Dashboard - Sistema IoT V2.1.0

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

[![Big Hero Team](https://img.shields.io/badge/Team-Big%20Hero-2563eb.svg)](#)
[![Hero Band](https://img.shields.io/badge/Project-Hero%20Band-059669.svg)](#)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Dashboard Web Moderno para Monitoramento IoT Industrial**
*Desenvolvido pela equipe Big Hero*

Interface responsiva desenvolvida para visualização em tempo real dos dados coletados pelo sistema SENAI Monitoring API V2.0.

---

## 🎯 **Sobre o Projeto**

### **Objetivo**
Dashboard web moderno e responsivo que consome dados da API SENAI Monitoring V2.0 para apresentar informações de monitoramento industrial em tempo real, incluindo:

- **Monitoramento de Funcionários** em tempo real
- **Dados de Saúde** (frequência cardíaca, pressão arterial, temperatura)
- **Localização por Zonas** industriais
- **Sistema de Comunicação** entre equipes
- **Alertas e Notificações** críticas
- **Dashboard Analítico** com gráficos interativos

## 🦸‍♀️ **Sobre a Equipe Big Hero**

A **Big Hero** é uma equipe especializada em soluções IoT industriais, 
desenvolvendo o **Hero Band** - um sistema completo de monitoramento 
através de pulseiras inteligentes para ambientes industriais.

### **Hero Band Project**
Sistema inovador que combina:
- 🎯 Pulseiras IoT inteligentes
- 📊 Monitoramento em tempo real  
- 🚨 Alertas automáticos de segurança
- 📱 Interface web responsiva

### **Arquitetura**
```
Dashboard Web (Frontend) → SENAI Monitoring API V2.0 (Backend) → Firebase Firestore
                ↓                           ↓                         ↓
        Interface Responsiva        Endpoints Otimizados      Estrutura Hierárquica
```

---

## 🚀 **Funcionalidades Implementadas**

### **✅ Interface Principal**
- **Login Sistema** com autenticação visual
- **Sidebar Responsiva** com navegação intuitiva
- **Header Moderno** com status do sistema
- **Cards Estatísticos** atualizados em tempo real
- **Gráficos Interativos** com Chart.js

### **✅ Dashboard Principal**
- **4 Cards de Métricas** principais
- **Gráfico de Atividade** (últimas 24h)
- **Distribuição por Zonas** (doughnut chart)
- **Lista de Funcionários Online** em tempo real
- **Indicadores de Status** (online/offline/warning)

### **✅ Sistema de Navegação**
- **Localização** - Mapa e posicionamento
- **Saúde** - Monitoramento médico
- **Comunicação** - Chat entre funcionários  
- **Funcionários** - Gestão e status
- **Configurações** - Preferências do sistema

### **✅ Recursos Técnicos**
- **Responsivo** - Mobile, tablet e desktop
- **Dados Mockados** - Demonstração funcional
- **Atualizações em Tempo Real** - Simulação IoT
- **Notificações** - Sistema de alertas
- **Animações Suaves** - UX moderna

---

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **[HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)** - Estrutura semântica
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário
- **[JavaScript Vanilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript)** - Lógica e interatividade
- **[Chart.js](https://www.chartjs.org/)** - Gráficos interativos
- **[Font Awesome](https://fontawesome.com/)** - Ícones modernos

### **Recursos Avançados**
- **CSS Grid & Flexbox** - Layout responsivo
- **CSS Variables** - Tema customizável
- **Local Storage** - Persistência de dados
- **Fetch API** - Comunicação com backend
- **ES6+ Features** - JavaScript moderno

---

## ⚙️ **Instalação e Configuração**

### **Pré-requisitos**
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional)
- [SENAI Monitoring API V2.0](../senai-monitoring-api) rodando

### **1. Clonar o Repositório**
```bash
git clone https://github.com/seu-usuario/senai-dashboard-web.git
cd senai-dashboard-web
```

### **2. Executar Localmente**

#### **Opção A: Servidor HTTP simples**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (com http-server)
npx http-server -p 8000

# Acessar: http://localhost:8000
```

#### **Opção B: Abrir diretamente**
- Abrir `index.html` diretamente no navegador
- ⚠️ Algumas funcionalidades podem ter limitações

### **3. Configurar Conexão com API**

Editar `assets/js/app.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8080/api', // URL da sua API
    UPDATE_INTERVAL: 30000,                     // Intervalo de atualização
    MOCK_MODE: false                           // false para usar API real
};
```

---

## 📱 **Como Usar**

### **1. Acessar Dashboard**
```
http://localhost:8000
```

### **2. Fazer Login**
- Clique em qualquer lugar para abrir modal de login
- Use credenciais de teste (ou configure autenticação real)
- Sistema mockado: qualquer valor funciona

### **3. Navegar pelas Seções**
- **Dashboard** - Visão geral do sistema
- **Localização** - Mapa e posicionamento
- **Saúde** - Dados médicos dos funcionários
- **Comunicação** - Sistema de mensagens
- **Funcionários** - Gestão completa

### **4. Monitorar em Tempo Real**
- Dados atualizados automaticamente a cada 30 segundos
- Indicadores visuais de status
- Notificações de alertas importantes

---

## 📁 **Estrutura do Projeto**

```
senai-dashboard-web/
├── index.html                 # 📄 Página principal
├── assets/
│   ├── css/
│   │   └── custom.css        # 🎨 Estilos personalizados (futuro)
│   ├── js/
│   │   ├── app.js           # 🧠 JavaScript principal
│   │   ├── charts.js        # 📊 Configuração dos gráficos
│   │   └── mock-data.js     # 📋 Dados de demonstração
│   └── images/
│       └── logo.png         # 🖼️ Logo SENAI (futuro)
├── pages/                    # 📑 Páginas adicionais (futuro)
├── components/              # 🧩 Componentes reutilizáveis (futuro)
├── docs/
│   └── README.md           # 📖 Esta documentação
└── .gitignore              # 🚫 Arquivos ignorados
```

---

## 🎨 **Design System**

### **Cores SENAI**
```css
:root {
  --senai-primary: #1e40af;    /* Azul principal */
  --senai-secondary: #f97316;  /* Laranja */
  --senai-success: #22c55e;    /* Verde */
  --senai-warning: #eab308;    /* Amarelo */
  --senai-danger: #ef4444;     /* Vermelho */
  --senai-dark: #1f2937;       /* Cinza escuro */
  --senai-light: #f8fafc;      /* Cinza claro */
}
```

### **Tipografia**
- **Fonte Principal:** Inter (Google Fonts)
- **Tamanhos:** 12px, 14px, 16px, 18px, 24px, 32px
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### **Espaçamentos**
- **Grid:** 8px base unit
- **Componentes:** 16px, 24px, 32px
- **Seções:** 48px, 64px

---

## 📊 **Dados e API**

### **Modo Mockado (Padrão)**
```javascript
// Dados demonstrativos inclusos
MOCK_MODE: true // em assets/js/app.js
```

**Funcionalidades:**
- ✅ 6 funcionários fictícios
- ✅ 4 zonas industriais
- ✅ Dados de saúde realísticos
- ✅ Alertas simulados
- ✅ Atualizações automáticas

### **Modo API Real**
```javascript
// Conectar com SENAI Monitoring API V2.0
MOCK_MODE: false
API_BASE_URL: 'http://localhost:8080/api'
```

**Endpoints Consumidos:**
```
GET /api/employees-stats    - Estatísticas funcionários
GET /api/iot/stats         - Dados IoT V2
GET /api/iot/locations-all - Localizações tempo real
GET /api/iot/health/:id    - Dados saúde específicos
```

---

## 📱 **Responsividade**

### **Breakpoints Suportados**
```css
/* Mobile First */
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Ultra-wide */
```

### **Adaptações por Dispositivo**
- **Mobile (< 768px)**
  - Sidebar colapsível
  - Cards em coluna única
  - Botão de menu hambúrguer
  - Gráficos responsivos

- **Tablet (768px - 1024px)**
  - Sidebar visível
  - Grid 2 colunas
  - Navegação otimizada

- **Desktop (> 1024px)**
  - Layout completo
  - Sidebar fixa
  - Grid 4 colunas
  - Todas funcionalidades

---

## 🔧 **Personalização**

### **Temas**
Editar variáveis CSS em `index.html`:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                senai: {
                    primary: '#sua-cor',   // Personalizar
                    secondary: '#sua-cor'  // cores aqui
                }
            }
        }
    }
}
```

### **Configurações**
Editar `assets/js/app.js`:
```javascript
const CONFIG = {
    UPDATE_INTERVAL: 30000,      // Intervalo de atualização
    ANIMATION_DURATION: 300,     // Duração das animações
    MOCK_MODE: true             // Modo de dados
};
```

### **Dados Mockados**
Editar `assets/js/mock-data.js` para personalizar:
- Funcionários fictícios
- Zonas da empresa
- Estatísticas
- Alertas

---

## 🧪 **Testes e Debug**

### **Console Debug**
```javascript
// Ferramentas de debug disponíveis
window.senaiDebug.state()           // Ver estado da aplicação
window.senaiDebug.notification()    // Testar notificações
window.senaiDebug.section('health') // Navegar para seção

window.chartsDebug.update()         // Atualizar gráficos
window.chartsDebug.export('zones')  // Exportar gráfico
```

### **Testes Manuais**
```bash
# Testar responsividade
# Redimensionar janela do navegador

# Testar funcionalidades
# Navegar entre seções
# Verificar atualizações em tempo real
# Testar notificações
```

---

## 🚀 **Deploy e Produção**

### **GitHub Pages**
```bash
# Fazer push para branch gh-pages
git checkout -b gh-pages
git add .
git commit -m "Deploy dashboard"
git push origin gh-pages

# Acessar: https://seu-usuario.github.io/senai-dashboard-web
```

### **Netlify**
1. Conectar repositório GitHub
2. Configurar build: `None`
3. Publish directory: `./`
4. Deploy automático

### **Vercel**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Servidor Web Tradicional**
```bash
# Upload para servidor
# Configurar Apache/Nginx
# Apontar para index.html
```

---

## 📈 **Roadmap**

### **🔄 Próximas Funcionalidades**
- [ ] **Seção Localização** - Mapa interativo com funcionários
- [ ] **Seção Saúde** - Gráficos médicos detalhados
- [ ] **Seção Comunicação** - Chat em tempo real
- [ ] **Seção Funcionários** - CRUD completo
- [ ] **Configurações** - Preferências do usuário

### **🎯 Melhorias Planejadas**
- [ ] **PWA** - Progressive Web App
- [ ] **Notificações Push** - Alertas nativos
- [ ] **Modo Offline** - Cache inteligente
- [ ] **Exportação** - Relatórios PDF/Excel
- [ ] **Temas** - Dark mode
- [ ] **Idiomas** - Internacionalização

### **🔧 Otimizações**
- [ ] **Lazy Loading** - Carregamento sob demanda
- [ ] **Service Worker** - Cache avançado
- [ ] **Compressão** - Minificação automática
- [ ] **CDN** - Assets distribuídos

---

## 🤝 **Contribuição**

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### **Padrões de Código**
- **HTML:** Semântico e acessível
- **CSS:** Tailwind classes, variáveis CSS
- **JavaScript:** ES6+, comentários descritivos
- **Commits:** Conventional Commits

---

## 📝 **Changelog**

### **v1.0.0** - 2025-06-09
#### **✅ Funcionalidades Implementadas**
- ✅ Dashboard principal com 4 cards de métricas
- ✅ Gráficos interativos (atividade e distribuição)
- ✅ Sistema de navegação responsivo
- ✅ Dados mockados realísticos
- ✅ Atualizações em tempo real
- ✅ Sistema de notificações
- ✅ Design responsivo completo

#### **🎨 Design**
- ✅ Logo H-R conectado
- ✅ Paleta de cores SENAI
- ✅ Tipografia Inter
- ✅ Animações suaves
- ✅ Cards com hover effects

#### **🔧 Técnico**
- ✅ Estrutura modular JavaScript
- ✅ Configuração flexível
- ✅ Debug tools integradas
- ✅ Código documentado

---

## 📞 **Suporte**

### **Issues e Bugs**
Reporte problemas em: [GitHub Issues](https://github.com/seu-usuario/senai-dashboard-web/issues)

### **Documentação API**
Backend relacionado: [SENAI Monitoring API V2.0](../senai-monitoring-api/README.md)

### **Contato**
- 📧 Email: dev@senai.com
- 🏢 SENAI - Unidade Fortaleza
- 💬 Teams: Equipe de Desenvolvimento

---

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🏆 **Agradecimentos**

- **SENAI** - Pela oportunidade e infraestrutura
- **Equipe de Design** - Pelo protótipo e diretrizes visuais
- **Comunidade Tailwind** - Pelo framework CSS
- **Chart.js** - Pela biblioteca de gráficos

---

**Desenvolvido com ❤️ pela Big Hero Team para o SENAI**

*Hero Band V2.1.0 - Sistema de Monitoramento Industrial IoT*

**🦸‍♀️ Big Hero | 🎯 Hero Band | 🏭 SENAI**