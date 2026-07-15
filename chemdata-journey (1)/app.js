import "./storage.js";
import "./roadmap.js";
import "./charts.js";

/**
 * ChemData Journey - Application Controller
 * Controlador principal da aplicação (SPA, Event Listeners, State Management, Renderização Dinâmica)
 */

(async function () {
  // Wait for auth to be ready
  const auth = await window.StorageEngine.initAuth();
  
  let state = await window.StorageEngine.loadState();
  if (!state) state = window.StorageEngine.getDefaultState();


  // Elementos do DOM
  const sidebarMenu = document.querySelector('.sidebar-menu');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleText = document.getElementById('theme-toggle-text');
  
  // Cache de visualizações (views)
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    courses: document.getElementById('view-courses'),
    diary: document.getElementById('view-diary'),
    settings: document.getElementById('view-settings')
  };

  // Inspirações de Diário para Químicos
  const chemInspirationPrompts = [
    "Dica de Hoje: Como a lógica do Pandas (limpeza de amostras) se assemelha ao pré-tratamento de uma curva analítica?",
    "Dica de Hoje: Escreva sobre como os Testes de Hipótese (ANOVA) ajudam a validar novos lotes de reagentes em escala industrial.",
    "Dica de Hoje: O agrupamento não supervisionado (PCA) pode ser visto como a separação cromatográfica de componentes espectrais. Reflita sobre isso.",
    "Dica de Hoje: Que problemas do seu laboratório atual poderiam ser previstos por um modelo simples de árvore de decisão?",
    "Dica de Hoje: A otimização de rendimento químico com DoE é o par perfeito para o ajuste de hiperparâmetros em Machine Learning."
  ];

  // Inicialização geral
  function init() {
    setupTheme(state.settings.theme);
    setupNavigation();
    updateUI();
    setupEventListeners();
    setupAuthUI();
    
    // Roteia para o Dashboard por padrão
    switchView('dashboard');
  }

  function setupAuthUI() {
    const authBtn = document.getElementById('auth-btn');
    const authBtnText = document.getElementById('auth-btn-text');
    if (!authBtn) return;

    const updateAuthBtn = () => {
      if (window.auth && window.auth.currentUser) {
        authBtnText.textContent = 'Sair da Conta';
        authBtn.querySelector('i').setAttribute('data-lucide', 'log-out');
      } else {
        authBtnText.textContent = 'Entrar (Sincronizar)';
        authBtn.querySelector('i').setAttribute('data-lucide', 'log-in');
      }
      if (window.lucide) window.lucide.createIcons();
    };

    updateAuthBtn();
    
    window.addEventListener('authChanged', () => {
      updateAuthBtn();
      window.location.reload(); // Recarrega para puxar dados
    });

    authBtn.addEventListener('click', async () => {
      if (window.auth && window.auth.currentUser) {
        await window.StorageEngine.logout();
      } else {
        await window.StorageEngine.login();
      }
    });
  }

  // Configurações de Tema (Light / Dark)
  function setupTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
      themeToggleText.textContent = 'Modo Escuro';
      themeToggleBtn.setAttribute('title', 'Mudar para tema escuro');
    } else {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      themeToggleText.textContent = 'Modo Claro';
      themeToggleBtn.setAttribute('title', 'Mudar para tema claro');
    }
    // Renderiza novamente o gráfico para aplicar as novas cores do tema
    if (views.dashboard.style.display !== 'none') {
      renderDashboardChart();
    }
  }

  // Configuração da Navegação SPA
  function setupNavigation() {
    sidebarMenu.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewName = item.getAttribute('data-view');
        switchView(viewName);
      });
    });
  }

  function switchView(viewName) {
    // Esconde todas as views
    Object.keys(views).forEach(key => {
      if (views[key]) views[key].style.display = 'none';
    });

    // Desativa itens do menu
    sidebarMenu.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });

    // Ativa a view correspondente
    if (views[viewName]) {
      views[viewName].style.display = 'flex';
      views[viewName].classList.add('fade-in');
      setTimeout(() => views[viewName].classList.remove('fade-in'), 350);
    }

    const activeMenuItem = sidebarMenu.querySelector(`[data-view="${viewName}"]`);
    if (activeMenuItem) activeMenuItem.classList.add('active');

    // Inicialização específica de view
    if (viewName === 'dashboard') {
      renderDashboard();
    } else if (viewName === 'courses') {
      renderCourses();
    } else if (viewName === 'diary') {
      renderDiary();
    } else if (viewName === 'settings') {
      renderSettings();
    }

    // Recria ícones lucide se carregados
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Cálculos de Progresso
  function getProgressMetrics() {
    const totalCourses = Object.keys(state.courses).length;
    const completedCourses = Object.values(state.courses).filter(status => status === 'completed').length;
    const coursesPercent = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

    const totalWeeks = 24;
    const completedWeeks = state.completedWeeks.length;
    const weeksPercent = (completedWeeks / totalWeeks) * 100;

    // Progresso combinado (Média ponderada do checklist e semanas)
    const combinedPercent = Math.round((coursesPercent + weeksPercent) / 2);

    return {
      completedCourses,
      totalCourses,
      coursesPercent,
      completedWeeks,
      totalWeeks,
      weeksPercent,
      combinedPercent
    };
  }

  // Atualiza componentes globais compartilhados (Ex: Sidebar e Profile)
  function updateUI() {
    const metrics = getProgressMetrics();
    
    // Atualiza nome e cargo nas áreas globais
    const userNameElement = document.getElementById('user-name-display');
    const userRoleElement = document.getElementById('user-role-display');
    
    if (userNameElement) userNameElement.textContent = state.settings.userName;
    if (userRoleElement) userRoleElement.textContent = state.settings.userRole;

    // Atualiza barra de progresso da Sidebar
    const fillElement = document.getElementById('sidebar-progress-fill');
    const percentElement = document.getElementById('sidebar-progress-percent');
    
    if (fillElement) fillElement.style.width = `${metrics.combinedPercent}%`;
    if (percentElement) percentElement.textContent = `${metrics.combinedPercent}%`;
  }

  // ==========================================
  // DASHBOARD VIEW
  // ==========================================
  
  function renderDashboard() {
    updateUI();
    const metrics = getProgressMetrics();

    // Injeta valores nos cards de métricas
    document.getElementById('metric-total-hours').textContent = `${calculateTotalHours()}h`;
    document.getElementById('metric-courses-completed').textContent = `${metrics.completedCourses}/${metrics.totalCourses}`;
    document.getElementById('metric-weeks-completed').textContent = `${metrics.completedWeeks}/${metrics.totalWeeks}`;
    
    // Renderiza a Timeline das 24 Semanas
    renderTimelineGrid();
    
    // Renderiza o Gráfico de Estudos
    renderDashboardChart();

    // Renderiza Próxima Tarefa Recomendada
    renderNextTaskCard();
  }

  function calculateTotalHours() {
    return state.studyLogs.reduce((acc, log) => acc + log.hours, 0);
  }

  function renderTimelineGrid() {
    const grid = document.getElementById('weeks-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    for (let w = 1; w <= 24; w++) {
      const weekBox = document.createElement('div');
      weekBox.className = `week-box ${state.completedWeeks.includes(w) ? 'completed' : ''}`;
      weekBox.setAttribute('data-week', w);
      
      weekBox.innerHTML = `
        <span class="week-number">${w}</span>
      `;

      weekBox.addEventListener('click', () => {
        showWeekDetail(w);
      });

      grid.appendChild(weekBox);
    }
  }

  function showWeekDetail(weekNumber) {
    const detailPanel = document.getElementById('week-detail-panel');
    if (!detailPanel) return;

    const weekData = window.RoadmapData.weeks.find(w => w.number === weekNumber);
    if (!weekData) return;

    const isCompleted = state.completedWeeks.includes(weekNumber);

    detailPanel.innerHTML = `
      <div class="week-detail-header">
        <h4 class="week-detail-title">${weekData.title}</h4>
        <span class="week-status-badge" style="background-color: ${isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--border-color)'}; color: ${isCompleted ? 'var(--accent)' : 'var(--text-secondary)'};">
          ${isCompleted ? 'Concluída' : 'Pendente'}
        </span>
      </div>
      <p class="week-detail-desc">${weekData.description}</p>
      <div class="week-actions">
        <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">Duração Estimada: ${weekData.estimatedHours}h</span>
        <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} btn-sm" id="btn-toggle-week-status">
          ${isCompleted ? 'Marcar como Pendente' : 'Concluir Semana'}
        </button>
      </div>
    `;

    detailPanel.style.display = 'block';

    // Event listener do botão de alternar conclusão
    document.getElementById('btn-toggle-week-status').addEventListener('click', () => {
      if (isCompleted) {
        state.completedWeeks = state.completedWeeks.filter(w => w !== weekNumber);
      } else {
        state.completedWeeks.push(weekNumber);
      }
      
      window.StorageEngine.saveState(state);
      renderDashboard();
      showWeekDetail(weekNumber); // Recarrega os detalhes atualizados
    });
  }

  function renderDashboardChart() {
    window.ChartManager.renderStudyChart(
      'chart-container',
      'study-chart',
      state.studyLogs,
      state.settings.dailyHoursGoal
    );
  }

  function renderNextTaskCard() {
    const taskContainer = document.getElementById('next-task-container');
    if (!taskContainer) return;

    // Acha o primeiro curso pendente na lista
    let nextCourse = null;
    let nextMonthName = '';

    for (const month of window.RoadmapData.months) {
      for (const course of month.courses) {
        if (state.courses[course.id] !== 'completed') {
          nextCourse = course;
          nextMonthName = month.name.split(':')[0]; // Ex: "Mês 1"
          break;
        }
      }
      if (nextCourse) break;
    }

    if (nextCourse) {
      taskContainer.innerHTML = `
        <div class="task-preview">
          <span class="task-tag">${nextMonthName}</span>
          <h4 class="task-title">${nextCourse.title}</h4>
          <p class="course-desc" style="margin-top: 4px;">${nextCourse.desc}</p>
          <span class="course-duration">Carga Estimada: ${nextCourse.hours}h</span>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-go-to-courses" style="margin-top: 12px; width: 100%;">
          Ir para Grade Curricular
        </button>
      `;

      document.getElementById('btn-go-to-courses').addEventListener('click', () => {
        switchView('courses');
      });
    } else {
      taskContainer.innerHTML = `
        <div class="task-preview" style="text-align: center; padding: 24px 12px;">
          <span class="task-tag" style="color: var(--accent);">🏆 Jornada Completa</span>
          <h4 class="task-title" style="margin-top: 8px;">Parabéns Artur!</h4>
          <p class="course-desc">Você concluiu todos os módulos de estudo do cronograma.</p>
        </div>
      `;
    }
  }

  // ==========================================
  // CURSOS VIEW
  // ==========================================

  function renderCourses() {
    const listContainer = document.getElementById('months-courses-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    window.RoadmapData.months.forEach((month) => {
      const monthId = month.id;
      
      // Filtra os cursos pertencentes a este mês
      const monthCourses = month.courses;
      const completedInMonth = monthCourses.filter(c => state.courses[c.id] === 'completed').length;
      const percentInMonth = Math.round((completedInMonth / monthCourses.length) * 100);

      const monthBlock = document.createElement('div');
      monthBlock.className = 'month-block';
      
      // Cria a estrutura do bloco do mês
      monthBlock.innerHTML = `
        <div class="month-block-header">
          <div class="month-block-title-area">
            <h3>${month.name}</h3>
            <p>${month.description}</p>
          </div>
          <div class="month-progress-container">
            <div class="month-progress-bar-bg">
              <div class="month-progress-bar-fill" style="width: ${percentInMonth}%;"></div>
            </div>
            <span class="month-progress-text">${percentInMonth}%</span>
          </div>
        </div>
        <div class="courses-grid" id="grid-courses-${monthId}"></div>
      `;

      listContainer.appendChild(monthBlock);

      // Renderiza as caixas de cursos individuais
      const coursesGrid = document.getElementById(`grid-courses-${monthId}`);
      monthCourses.forEach((course) => {
        const isCompleted = state.courses[course.id] === 'completed';
        const linkData = state.courseLinks[course.id] || { link: '', certificate: '' };

        const courseCard = document.createElement('div');
        courseCard.className = 'course-item-card';

        courseCard.innerHTML = `
          <div class="course-card-top">
            <div class="course-checkbox-wrapper">
              <button class="course-checkbox ${isCompleted ? 'checked' : ''}" data-id="${course.id}">
                ${isCompleted ? '✓' : ''}
              </button>
            </div>
            <div class="course-info">
              <h4 class="course-title" style="text-decoration: ${isCompleted ? 'line-through' : 'none'}; color: ${isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)'}">${course.title}</h4>
              <p class="course-desc">${course.desc}</p>
              <span class="course-duration">Estimado: ${course.hours}h</span>
            </div>
          </div>
          <div class="course-links-area">
            <div class="course-link-input-group">
              <span>Curso URL:</span>
              <input type="text" class="course-link-input text-link" data-id="${course.id}" data-type="link" value="${linkData.link}" placeholder="Adicionar link do curso">
            </div>
            <div class="course-link-input-group">
              <span>Certificado:</span>
              <input type="text" class="course-link-input text-cert" data-id="${course.id}" data-type="certificate" value="${linkData.certificate}" placeholder="Adicionar URL do certificado">
            </div>
          </div>
        `;

        coursesGrid.appendChild(courseCard);
      });
    });

    // Adiciona Event Listeners para os checkboxes e inputs
    setupCoursesInteractiveEvents();
  }

  function setupCoursesInteractiveEvents() {
    // Checkboxes
    document.querySelectorAll('.course-checkbox').forEach(btn => {
      btn.addEventListener('click', () => {
        const courseId = btn.getAttribute('data-id');
        const isCompleted = state.courses[courseId] === 'completed';
        
        state.courses[courseId] = isCompleted ? 'todo' : 'completed';
        window.StorageEngine.saveState(state);
        
        renderCourses();
        updateUI();
      });
    });

    // Inputs de Links
    document.querySelectorAll('.course-link-input').forEach(input => {
      input.addEventListener('input', () => {
        const courseId = input.getAttribute('data-id');
        const inputType = input.getAttribute('data-type');
        const value = input.value;

        if (!state.courseLinks[courseId]) {
          state.courseLinks[courseId] = { link: '', certificate: '' };
        }

        state.courseLinks[courseId][inputType] = value;
        
        // Debounce simples para salvar o estado no input de texto
        clearTimeout(input.saveTimeout);
        input.saveTimeout = setTimeout(() => {
          window.StorageEngine.saveState(state);
        }, 500);
      });
    });
  }

  // ==========================================
  // DIÁRIO VIEW
  // ==========================================

  let currentDiaryDate = getTodayFormattedDate();
  let autosaveTimeout = null;

  function getTodayFormattedDate() {
    return new Date().toISOString().split('T')[0];
  }

  function renderDiary() {
    const list = document.getElementById('diary-history-list');
    const editorDate = document.getElementById('diary-editor-date');
    const textarea = document.getElementById('diary-textarea');
    const inspirationText = document.getElementById('diary-inspiration-text');

    if (!list || !editorDate || !textarea) return;

    // Atualiza a lista lateral com as datas ordenadas decrescentes
    list.innerHTML = '';
    
    // Garante que o dia de hoje está no objeto de diário para poder exibir na sidebar
    if (!state.diary[currentDiaryDate]) {
      state.diary[currentDiaryDate] = '';
    }

    const sortedDates = Object.keys(state.diary).sort((a, b) => new Date(b) - new Date(a));
    
    sortedDates.forEach((date) => {
      const item = document.createElement('li');
      item.className = `diary-history-item ${date === currentDiaryDate ? 'active' : ''}`;
      
      const parsedParts = date.split('-');
      const formatted = parsedParts.length === 3 ? `${parsedParts[2]}/${parsedParts[1]}/${parsedParts[0]}` : date;
      
      item.innerHTML = `
        <span style="font-weight: 500;">📅 ${formatted}</span>
        <p style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; color: var(--text-muted); margin-top: 2px;">
          ${state.diary[date] ? state.diary[date].slice(0, 32) + '...' : 'Sem anotações ainda.'}
        </p>
      `;

      item.addEventListener('click', () => {
        // Salva imediatamente o que o usuário escreveu na data anterior antes de mudar de página
        saveCurrentDiaryEntry();
        currentDiaryDate = date;
        renderDiary();
      });

      list.appendChild(item);
    });

    // Define os valores do Editor Principal
    const parts = currentDiaryDate.split('-');
    const editorFormatted = parts.length === 3 ? `${parts[2]} de ${getMonthNameBR(parts[1])}, ${parts[0]}` : currentDiaryDate;
    
    editorDate.textContent = `Anotações de: ${editorFormatted}`;
    textarea.value = state.diary[currentDiaryDate] || '';

    // Escolhe um prompt de inspiração focado em Química de forma pseudo-aleatória baseado no dia
    const daySeed = parseInt(parts[2], 10) || 0;
    inspirationText.textContent = chemInspirationPrompts[daySeed % chemInspirationPrompts.length];
  }

  function getMonthNameBR(monthString) {
    const m = parseInt(monthString, 10);
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months[m - 1] || 'Mês';
  }

  function setupDiaryAutoSave() {
    const textarea = document.getElementById('diary-textarea');
    const indicator = document.getElementById('diary-autosave-indicator');

    if (!textarea) return;

    textarea.addEventListener('input', () => {
      if (indicator) {
        indicator.className = 'diary-autosave-indicator saving';
        indicator.textContent = '● Salvando alterações no LocalStorage...';
      }

      clearTimeout(autosaveTimeout);
      autosaveTimeout = setTimeout(() => {
        saveCurrentDiaryEntry();
        if (indicator) {
          indicator.className = 'diary-autosave-indicator saved';
          indicator.textContent = '✓ Todas as alterações salvas localmente!';
        }
        
        // Atualiza a lista do histórico lateral para refletir a alteração de texto em tempo real
        const activeSidebarItem = document.querySelector('.diary-history-item.active p');
        if (activeSidebarItem) {
          activeSidebarItem.textContent = textarea.value ? textarea.value.slice(0, 32) + '...' : 'Sem anotações ainda.';
        }
      }, 1000); // 1 Segundo após parar de digitar
    });
  }

  function saveCurrentDiaryEntry() {
    const textarea = document.getElementById('diary-textarea');
    if (textarea) {
      state.diary[currentDiaryDate] = textarea.value;
      window.StorageEngine.saveState(state);
    }
  }

  // ==========================================
  // CONFIGURAÇÕES VIEW
  // ==========================================

  function renderSettings() {
    // Inputs
    document.getElementById('cfg-user-name').value = state.settings.userName;
    document.getElementById('cfg-user-role').value = state.settings.userRole;
    document.getElementById('cfg-daily-goal').value = state.settings.dailyHoursGoal;
    
    const targetInput = document.getElementById('cfg-target-role');
    if (targetInput) targetInput.value = state.settings.targetRole || 'Data Scientist Sênior';
  }

  function handleSaveSettings(e) {
    e.preventDefault();
    
    const userName = document.getElementById('cfg-user-name').value.trim();
    const userRole = document.getElementById('cfg-user-role').value.trim();
    const dailyHoursGoal = parseFloat(document.getElementById('cfg-daily-goal').value) || 2;
    const targetRole = document.getElementById('cfg-target-role').value.trim();

    if (userName && userRole) {
      state.settings.userName = userName;
      state.settings.userRole = userRole;
      state.settings.dailyHoursGoal = dailyHoursGoal;
      state.settings.targetRole = targetRole;

      window.StorageEngine.saveState(state);
      updateUI();
      alert('Configurações salvas com sucesso!');
    } else {
      alert('Por favor, preencha o Nome e Cargo.');
    }
  }

  // Adicionar Log de Horas Estudadas
  function handleAddStudyHours(e) {
    e.preventDefault();
    const hoursInput = document.getElementById('add-hours-value');
    const hours = parseFloat(hoursInput.value);

    if (!isNaN(hours) && hours > 0) {
      const today = getTodayFormattedDate();
      
      // Verifica se já tem log de hoje, se sim acumula, senão cria um novo
      const logIndex = state.studyLogs.findIndex(log => log.date === today);
      if (logIndex !== -1) {
        state.studyLogs[logIndex].hours += hours;
      } else {
        state.studyLogs.push({ date: today, hours: hours });
      }

      window.StorageEngine.saveState(state);
      hoursInput.value = '';
      
      // Atualiza o painel
      renderDashboard();
      alert(`Adicionado ${hours} horas de estudos hoje! Continue firme.`);
    } else {
      alert('Por favor, adicione um número válido de horas maior que zero.');
    }
  }

  // Exportação JSON
  function handleExportJSON() {
    const jsonString = window.StorageEngine.exportJSON(state);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemdata_journey_progresso_${getTodayFormattedDate()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importação JSON
  async function handleImportJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (evt) {
      const contents = evt.target.result;
      const result = await window.StorageEngine.importJSON(contents);
      
      if (result.success) {
        state = result.state;
        updateUI();
        alert('Seu progresso do ChemData Journey foi importado com absoluto sucesso!');
        // Força recarregamento completo para recalcular tudo
        window.location.reload();
      } else {
        alert(`Falha na Importação: ${result.error}`);
      }
    };
    reader.readAsText(file);
  }

  // Resetar Software
  async function handleResetState() {
    if (confirm('Atenção: Isso excluirá permanentemente todo o seu histórico de horas, diários de bordo e progresso dos cursos do ChemData Journey. Deseja prosseguir?')) {
      state = await window.StorageEngine.resetState();
      updateUI();
      alert('Software redefinido para as configurações de fábrica.');
      window.location.reload();
    }
  }

  // Event Listeners Gerais
  function setupEventListeners() {
    // Alternar Tema (Light / Dark)
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
      state.settings.theme = newTheme;
      window.StorageEngine.saveState(state);
      setupTheme(newTheme);
    });

    // Form do Log de Horas Rápidas no Dashboard
    const quickLogForm = document.getElementById('form-quick-log-hours');
    if (quickLogForm) {
      quickLogForm.addEventListener('submit', handleAddStudyHours);
    }

    // Configurações Form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', handleSaveSettings);
    }

    // Botões de backup
    const exportBtn = document.getElementById('btn-export-data');
    if (exportBtn) exportBtn.addEventListener('click', handleExportJSON);

    const importInput = document.getElementById('input-import-file');
    if (importInput) importInput.addEventListener('change', handleImportJSON);

    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) resetBtn.addEventListener('click', handleResetState);

    // Auto-save do Diário
    setupDiaryAutoSave();
  }

  // Inicia a aplicação
  init();
})();
