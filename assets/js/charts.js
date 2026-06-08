// charts.js — Visualizaciones Chart.js con datos reales de la BD NexoSport

function initCharts() {
  Chart.defaults.color = '#7A7A95';
  Chart.defaults.font.family = "'JetBrains Mono', monospace";

  // --- 1. Doughnut: Distribución de tablas por módulo ---
  const ctxModulos = document.getElementById('chart-modulos');
  if (ctxModulos) {
    new Chart(ctxModulos, {
      type: 'doughnut',
      data: {
        labels: ['Usuarios & Roles', 'Catálogo', 'Inventario', 'Pedidos & Pagos', 'Logística', 'Mayoristas'],
        datasets: [{
          data: [3, 4, 2, 5, 3, 4],
          backgroundColor: [
            'rgba(232,255,0,0.8)',
            'rgba(0,229,255,0.8)',
            'rgba(255,179,71,0.8)',
            'rgba(0,224,150,0.8)',
            'rgba(255,77,109,0.8)',
            'rgba(180,120,255,0.8)',
          ],
          borderColor: '#0A0A0F',
          borderWidth: 3,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { size: 11 }, color: '#7A7A95' }
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.label}: ${ctx.raw} tablas`
            }
          }
        },
        animation: { animateRotate: true, duration: 1200, easing: 'easeInOutQuart' }
      }
    });
  }

  // --- 2. Bar: Stock actual por categoría (datos reales del INSERT) ---
  const ctxStock = document.getElementById('chart-stock');
  if (ctxStock) {
    new Chart(ctxStock, {
      type: 'bar',
      data: {
        labels: ['Fútbol', 'Running', 'Ciclismo', 'Natación', 'Fitness', 'Outdoor'],
        datasets: [{
          label: 'Stock (unidades)',
          data: [245, 180, 120, 95, 310, 75],
          backgroundColor: ctx => {
            const val = ctx.raw;
            if (val < 100) return 'rgba(255,77,109,0.7)';
            if (val < 200) return 'rgba(255,179,71,0.7)';
            return 'rgba(0,224,150,0.7)';
          },
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#7A7A95' } },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#7A7A95' },
            beginAtZero: true
          }
        },
        animation: { delay: (ctx) => ctx.dataIndex * 100 }
      }
    });
  }

  // --- 3. Line: Pedidos por estado (simula historial) ---
  const ctxEstados = document.getElementById('chart-estados');
  if (ctxEstados) {
    new Chart(ctxEstados, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Confirmados',
            data: [12, 19, 15, 28, 22, 31],
            borderColor: 'rgba(232,255,0,0.9)',
            backgroundColor: 'rgba(232,255,0,0.05)',
            fill: true,
            tension: 0.4, pointRadius: 4, pointBackgroundColor: 'rgba(232,255,0,0.9)'
          },
          {
            label: 'Entregados',
            data: [8, 14, 11, 20, 18, 25],
            borderColor: 'rgba(0,224,150,0.9)',
            backgroundColor: 'rgba(0,224,150,0.05)',
            fill: true,
            tension: 0.4, pointRadius: 4, pointBackgroundColor: 'rgba(0,224,150,0.9)'
          },
          {
            label: 'Cancelados',
            data: [2, 3, 1, 4, 2, 1],
            borderColor: 'rgba(255,77,109,0.9)',
            backgroundColor: 'rgba(255,77,109,0.05)',
            fill: true,
            tension: 0.4, pointRadius: 4, pointBackgroundColor: 'rgba(255,77,109,0.9)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top', labels: { color: '#7A7A95', padding: 20 } }
        },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7A7A95' } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#7A7A95' }, beginAtZero: true }
        }
      }
    });
  }
}
