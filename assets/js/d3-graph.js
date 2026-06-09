// d3-graph.js — Grafo enriquecido NexoSport: módulos, tooltips, zoom/pan

function initD3Graph() {
  const wrapper = document.getElementById('d3-graph');
  if (!wrapper || typeof DB_MODULES === 'undefined' || typeof DB_NODES === 'undefined' || typeof DB_LINKS === 'undefined') return;

  const W = wrapper.clientWidth || 900;
  const H = 640;

  const MODULES = DB_MODULES;
  const nodes = DB_NODES;
  const links = DB_LINKS;

  // ── Mapa de color por módulo ──
  const nodeColor = d => MODULES[d.mod]?.color || '#7A7A95';

  // ── TOOLTIP HTML ──
  const tooltip = document.createElement('div');
  tooltip.className = 'd3-tooltip';
  tooltip.style.opacity = '0';
  wrapper.appendChild(tooltip);

  // ── LEYENDA ──
  const legend = document.createElement('div');
  legend.className = 'd3-graph-legend';
  legend.innerHTML = `<div class="d3-legend-title">Módulos</div>` +
    Object.entries(MODULES).map(([k, m]) =>
      `<div class="d3-legend-item"><div class="d3-legend-dot" style="background:${m.color}"></div>${m.label}</div>`
    ).join('');
  wrapper.appendChild(legend);

  // ── HINT ──
  const hint = document.createElement('div');
  hint.className = 'd3-graph-hint';
  hint.textContent = '⊕ Scroll para zoom · Arrastrá nodos · Hover para info';
  wrapper.appendChild(hint);

  // ── SVG ──
  const svg = d3.select('#d3-graph').append('svg')
    .attr('width', W).attr('height', H);

  // Gradiente de fondo del SVG
  const defs = svg.append('defs');
  defs.append('radialGradient').attr('id', 'svgBg')
    .selectAll('stop').data([
      { offset: '0%',   color: 'rgba(26,26,36,1)' },
      { offset: '100%', color: 'rgba(10,10,15,1)' },
    ]).join('stop')
    .attr('offset', d => d.offset)
    .attr('stop-color', d => d.color);

  svg.append('rect').attr('width', W).attr('height', H)
    .attr('fill', 'url(#svgBg)');

  // Grid fino dentro del SVG
  const gridG = svg.append('g').attr('opacity', 0.15);
  for (let x = 0; x < W; x += 40) {
    gridG.append('line').attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', H)
      .attr('stroke', 'rgba(232,255,0,0.25)').attr('stroke-width', 0.5);
  }
  for (let y = 0; y < H; y += 40) {
    gridG.append('line').attr('x1', 0).attr('y1', y).attr('x2', W).attr('y2', y)
      .attr('stroke', 'rgba(232,255,0,0.25)').attr('stroke-width', 0.5);
  }

  // Flecha marker
  defs.append('marker').attr('id', 'arrow-fk')
    .attr('viewBox', '0 -4 8 8').attr('refX', 20).attr('refY', 0)
    .attr('markerWidth', 4).attr('markerHeight', 4).attr('orient', 'auto')
    .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', 'rgba(0,229,255,0.4)');

  // ── Grupo zoomable ──
  const g = svg.append('g');

  svg.call(d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', e => g.attr('transform', e.transform))
  );

  // ── Simulación ──
  // Calcular grado de cada nodo
  const degree = {};
  nodes.forEach(n => { degree[n.id] = 0; });
  links.forEach(l => {
    degree[l.source] = (degree[l.source] || 0) + 1;
    degree[l.target] = (degree[l.target] || 0) + 1;
  });

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
      // Nodos hub más lejos entre sí
      const deg = (degree[d.source.id] || 0) + (degree[d.target.id] || 0);
      return 80 + deg * 4;
    }))
    .force('charge', d3.forceManyBody().strength(d => -200 - degree[d.id] * 20))
    .force('center', d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(d => nodeRadius(d) + 14));

  function nodeRadius(d) {
    return 10 + Math.min((degree[d.id] || 0) * 2.5, 20);
  }

  // ── Links ──
  const link = g.append('g').selectAll('line')
    .data(links).join('line')
    .attr('stroke', 'rgba(0,229,255,0.18)')
    .attr('stroke-width', 1.2)
    .attr('marker-end', 'url(#arrow-fk)');

  // ── Nodos ──
  const node = g.append('g').selectAll('g')
    .data(nodes).join('g')
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; d.fy = null;
      })
    );

  // El filter glow SVG se eliminó por problemas graves de rendimiento.
  // En su lugar, usamos un círculo adicional con baja opacidad para el efecto "glow" de los hubs.

  // Círculo exterior (halo de proximidad base)
  node.append('circle')
    .attr('r', d => nodeRadius(d) + 5)
    .attr('fill', 'none')
    .attr('stroke', d => nodeColor(d))
    .attr('stroke-width', 0.5)
    .attr('opacity', 0.3);

  // Pseudo-glow para hubs (reemplaza al carísimo filter SVG)
  node.filter(d => degree[d.id] > 4)
    .append('circle')
    .attr('r', d => nodeRadius(d) + 8)
    .attr('fill', d => nodeColor(d))
    .attr('opacity', 0.15);

  // Círculo principal
  node.append('circle')
    .attr('r', d => nodeRadius(d))
    .attr('fill', d => `${nodeColor(d)}18`)
    .attr('stroke', d => nodeColor(d))
    .attr('stroke-width', d => degree[d.id] > 4 ? 2 : 1.2);

  // Ícono de hub para los más conectados
  node.filter(d => degree[d.id] > 5)
    .append('text')
    .attr('text-anchor', 'middle').attr('dy', '0.35em')
    .attr('font-size', d => `${nodeRadius(d) * 0.7}px`)
    .attr('fill', d => nodeColor(d))
    .attr('pointer-events', 'none')
    .text('◈');

  // Label bajo el nodo
  node.append('text')
    .text(d => d.id)
    .attr('font-size', d => degree[d.id] > 4 ? '9px' : '7.5px')
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('fill', d => degree[d.id] > 4 ? nodeColor(d) : '#8888AA')
    .attr('text-anchor', 'middle')
    .attr('dy', d => nodeRadius(d) + 12)
    .attr('pointer-events', 'none')
    .attr('font-weight', d => degree[d.id] > 4 ? '700' : '400');

  // ── Contador de FK en el nodo ──
  node.filter(d => degree[d.id] > 1)
    .append('text')
    .attr('text-anchor', 'middle').attr('dy', d => -nodeRadius(d) - 4)
    .attr('font-size', '7px')
    .attr('font-family', "'JetBrains Mono', monospace")
    .attr('fill', d => nodeColor(d))
    .attr('opacity', 0.7)
    .attr('pointer-events', 'none')
    .text(d => `×${degree[d.id]}`);

  // ── Hover interacciones ──
  node.on('mouseenter', function(event, d) {
    const col = nodeColor(d);

    // Highlight aristas conectadas
    link
      .attr('stroke', l =>
        (l.source.id === d.id || l.target.id === d.id) ? col : 'rgba(0,229,255,0.06)'
      )
      .attr('stroke-width', l =>
        (l.source.id === d.id || l.target.id === d.id) ? 2.5 : 0.8
      );

    // Highlight nodos vecinos
    node.selectAll('circle').attr('opacity', n => {
      const isNeighbor = links.some(l =>
        (l.source.id === d.id && l.target.id === n.id) ||
        (l.target.id === d.id && l.source.id === n.id)
      );
      return n.id === d.id || isNeighbor ? 1 : 0.2;
    });

    // Tooltip
    const fks = links.filter(l => l.source.id === d.id || l.target.id === d.id)
      .map(l => l.source.id === d.id ? `→ ${l.target.id}` : `← ${l.source.id}`);

    tooltip.innerHTML = `
      <div class="d3-tooltip-name">${d.id}</div>
      <div class="d3-tooltip-module" style="color:${col}">${MODULES[d.mod]?.label || d.mod}</div>
      <div class="d3-tooltip-cols">
        ${d.cols.map(c => `<div class="d3-tooltip-col">· ${c}</div>`).join('')}
      </div>
      <div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.08);padding-top:6px;font-size:0.63rem;color:#7A7A95">
        ${fks.slice(0,5).join('<br>')}${fks.length > 5 ? `<br>+${fks.length - 5} más` : ''}
      </div>`;
    tooltip.style.opacity = '1';
  })
  .on('mousemove', function(event) {
    const rect = wrapper.getBoundingClientRect();
    let tx = event.clientX - rect.left + 14;
    let ty = event.clientY - rect.top - 10;
    if (tx + 200 > rect.width) tx = event.clientX - rect.left - 210;
    tooltip.style.left = tx + 'px';
    tooltip.style.top  = ty + 'px';
  })
  .on('mouseleave', function() {
    link.attr('stroke', 'rgba(0,229,255,0.18)').attr('stroke-width', 1.2);
    node.selectAll('circle').attr('opacity', 1);
    tooltip.style.opacity = '0';
  });

  // ── Tick ──
  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

}
