/**
 * ChemData Journey - Chart Engine
 * Renderização híbrida para gráficos (Chart.js via CDN ou SVG Fallback off-line de altíssimo polimento).
 */

(function () {
  let chartInstance = null;

  const ChartManager = {
    // Renderiza ou atualiza o gráfico de horas estudadas
    renderStudyChart(containerId, canvasId, studyLogs, dailyGoal) {
      const container = document.getElementById(containerId);
      if (!container) return;

      // Pega os últimos 7 dias de logs para o gráfico
      const sortedLogs = [...studyLogs]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7);

      // Preenche com dias fictícios se houver menos de 7 dias
      while (sortedLogs.length < 7) {
        const firstDate = sortedLogs.length > 0 ? new Date(sortedLogs[0].date) : new Date();
        const prevDate = new Date(firstDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const formattedDate = prevDate.toISOString().split('T')[0];
        sortedLogs.unshift({ date: formattedDate, hours: 0 });
      }

      // Formata as datas para exibição legível (ex: "14/Jul")
      const labels = sortedLogs.map(log => {
        const parts = log.date.split('-');
        if (parts.length === 3) {
          const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          const day = parseInt(parts[2], 10);
          const monthIndex = parseInt(parts[1], 10) - 1;
          return `${day} ${months[monthIndex]}`;
        }
        return log.date;
      });

      const dataValues = sortedLogs.map(log => log.hours);

      // Tenta renderizar usando Chart.js
      if (window.Chart) {
        this.renderWithChartJS(container, canvasId, labels, dataValues, dailyGoal);
      } else {
        this.renderWithSVGFallback(container, labels, dataValues, dailyGoal);
      }
    },

    // Renderizador oficial Chart.js (com tema personalizado inspirado em Linear/GitHub)
    renderWithChartJS(container, canvasId, labels, dataValues, dailyGoal) {
      // Destrói gráfico existente para evitar bugs de sobreposição
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }

      // Certifica-se de que o canvas existe no container
      container.innerHTML = `<canvas id="${canvasId}" style="width: 100%; height: 100%; max-height: 240px;"></canvas>`;
      const ctx = document.getElementById(canvasId).getContext('2d');

      const isDarkMode = document.body.classList.contains('theme-dark');
      const textColor = isDarkMode ? '#9ca3af' : '#475569';
      const gridColor = isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(226, 232, 240, 0.8)';
      const accentColor = '#10b981'; // Emerald
      const goalColor = '#ef4444'; // Red para meta

      // Cria a linha horizontal constante da meta diária
      const goalData = Array(labels.length).fill(dailyGoal);

      chartInstance = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Meta Diária (h)',
              data: goalData,
              type: 'line',
              borderColor: goalColor,
              borderWidth: 1.5,
              borderDash: [5, 5],
              fill: false,
              pointRadius: 0,
              order: 1
            },
            {
              label: 'Horas Estudadas',
              data: dataValues,
              backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.9)',
              borderColor: '#10b981',
              borderWidth: 1,
              borderRadius: 4,
              barPercentage: 0.6,
              order: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: textColor,
                boxWidth: 12,
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                }
              }
            },
            tooltip: {
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              titleColor: isDarkMode ? '#ffffff' : '#0f172a',
              bodyColor: isDarkMode ? '#f1f5f9' : '#334155',
              borderColor: isDarkMode ? '#334155' : '#cbd5e1',
              borderWidth: 1,
              padding: 10,
              callbacks: {
                label: function (context) {
                  return ` ${context.dataset.label}: ${context.raw}h`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: textColor,
                font: {
                  family: 'Inter, sans-serif',
                  size: 10
                }
              }
            },
            y: {
              grid: {
                color: gridColor
              },
              ticks: {
                color: textColor,
                font: {
                  family: 'Inter, sans-serif',
                  size: 10
                },
                stepSize: 1,
                callback: (value) => `${value}h`
              },
              min: 0,
              max: Math.max(Math.max(...dataValues, dailyGoal) + 1, 4)
            }
          }
        }
      });
    },

    // Renderizador SVG Offline de Alta Qualidade (caso falhe o carregamento do CDN)
    renderWithSVGFallback(container, labels, dataValues, dailyGoal) {
      if (chartInstance) {
        chartInstance = null; // Libera referência se houver
      }

      const isDarkMode = document.body.classList.contains('theme-dark');
      const textColor = isDarkMode ? '#9ca3af' : '#475569';
      const gridColor = isDarkMode ? '#1f2937' : '#e2e8f0';
      const barColor = '#10b981'; // Emerald
      const goalColor = '#ef4444'; // Red para meta

      const chartHeight = 160;
      const chartWidth = 500;
      const padding = { top: 20, right: 20, bottom: 30, left: 40 };

      const innerWidth = chartWidth - padding.left - padding.right;
      const innerHeight = chartHeight - padding.top - padding.bottom;

      const maxValue = Math.max(Math.max(...dataValues, dailyGoal) + 1, 4);

      // Gera linhas de grade do eixo Y
      let yGridLines = '';
      const gridSteps = 4;
      for (let i = 0; i <= gridSteps; i++) {
        const val = (maxValue / gridSteps) * i;
        const y = innerHeight + padding.top - (val / maxValue) * innerHeight;
        yGridLines += `
          <line x1="${padding.left}" y1="${y}" x2="${chartWidth - padding.right}" y2="${y}" stroke="${gridColor}" stroke-dasharray="2,2" stroke-width="1" />
          <text x="${padding.left - 8}" y="${y + 4}" fill="${textColor}" font-size="9" text-anchor="end" font-family="monospace">${val.toFixed(1)}h</text>
        `;
      }

      // Calcula as barras
      const barCount = dataValues.length;
      const barWidth = Math.floor(innerWidth / barCount) * 0.55;
      const groupWidth = innerWidth / barCount;

      let bars = '';
      labels.forEach((label, idx) => {
        const val = dataValues[idx];
        const h = (val / maxValue) * innerHeight;
        const x = padding.left + (idx * groupWidth) + (groupWidth - barWidth) / 2;
        const y = innerHeight + padding.top - h;

        bars += `
          <g class="svg-bar-group">
            <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${barColor}" rx="3" opacity="0.85">
              <animate attributeName="height" from="0" to="${h}" dur="0.6s" fill="freeze" />
              <animate attributeName="y" from="${innerHeight + padding.top}" to="${y}" dur="0.6s" fill="freeze" />
            </rect>
            <text x="${x + barWidth / 2}" y="${y - 4}" fill="${textColor}" font-size="9" font-weight="bold" text-anchor="middle" opacity="0" class="svg-bar-label">
              ${val}h
              <animate attributeName="opacity" to="1" begin="0.6s" dur="0.3s" fill="freeze" />
            </text>
            <text x="${padding.left + (idx * groupWidth) + groupWidth / 2}" y="${chartHeight - 8}" fill="${textColor}" font-size="9" text-anchor="middle">${label}</text>
          </g>
        `;
      });

      // Linha da meta diária
      const goalY = innerHeight + padding.top - (dailyGoal / maxValue) * innerHeight;
      const goalLine = `
        <line x1="${padding.left}" y1="${goalY}" x2="${chartWidth - padding.right}" y2="${goalY}" stroke="${goalColor}" stroke-dasharray="4,4" stroke-width="1.5" />
        <text x="${chartWidth - padding.right - 5}" y="${goalY - 6}" fill="${goalColor}" font-size="8" font-weight="bold" text-anchor="end">Meta: ${dailyGoal}h</text>
      `;

      container.innerHTML = `
        <div class="svg-chart-wrapper" style="width: 100%; height: 100%; min-height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <div style="font-size: 10px; color: #f59e0b; margin-bottom: 6px; font-family: monospace; display: flex; align-items: center; gap: 4px;">
            <span>● Modo Off-line Ativo (SVG Fallback)</span>
          </div>
          <svg viewBox="0 0 ${chartWidth} ${chartHeight}" style="width: 100%; max-height: 220px;">
            ${yGridLines}
            ${bars}
            ${goalLine}
            <line x1="${padding.left}" y1="${innerHeight + padding.top}" x2="${chartWidth - padding.right}" y2="${innerHeight + padding.top}" stroke="${textColor}" stroke-width="1" />
          </svg>
        </div>
      `;
    }
  };

  window.ChartManager = ChartManager;
})();
