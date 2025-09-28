// Implementación de visualización de estadísticas de canciones (compatible web/desktop)

window.renderSongStats = function(container, songs) {
  if (!container) return;
  container.innerHTML = ''; // limpiar

  function parseDurationToSeconds(d) {
    if (!d) return 0;
    const parts = d.split(':').map(p => parseInt(p||'0', 10));
    if (parts.length === 1) return parts[0] || 0;
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }

  const list = songs || [];


  const totalSongs = list.length;
  const totalSeconds = list.reduce((acc, s) => acc + parseDurationToSeconds(s.duration), 0);
  const totalDurationFormatted = (() => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2,'0')}`;
  })();

  // Top artists by song count
  const artistCounts = {};
  list.forEach(s => {
    const artist = (s && s.artist ? s.artist : 'Desconocido').trim();
    artistCounts[artist] = (artistCounts[artist] || 0) + 1;
  });
  const artistArray = Object.keys(artistCounts).map(a => ({ artist: a, count: artistCounts[a] }));
  artistArray.sort((a,b) => b.count - a.count);
  const topArtists = artistArray.slice(0, 10);

  // Contenedor resumen
  const summaryDiv = document.createElement('div');
  summaryDiv.style.display = 'flex';
  summaryDiv.style.gap = '16px';
  summaryDiv.style.flexWrap = 'wrap';
  summaryDiv.innerHTML = `
    <div style="min-width:160px; padding:12px; border-radius:6px; background:var(--card-bg);">
      <div style="font-size:13px; color:var(--text-muted)">Total canciones</div>
      <div style="font-size:20px; font-weight:600">${totalSongs}</div>
    </div>
    <div style="min-width:160px; padding:12px; border-radius:6px; background:var(--card-bg);">
      <div style="font-size:13px; color:var(--text-muted)">Duración total</div>
      <div style="font-size:20px; font-weight:600">${totalDurationFormatted}</div>
    </div>
  `;
  container.appendChild(summaryDiv);

  if (totalSongs === 0) {
    const empty = document.createElement('div');
    empty.style.marginTop = '20px';
    empty.style.color = 'var(--text-muted)';
    empty.textContent = 'Aún no hay canciones para mostrar estadísticas.';
    container.appendChild(empty);
    return;
  }

  // Gráfico de barras: top artistas
  const chartWrapper = document.createElement('div');
  chartWrapper.style.marginTop = '18px';
  chartWrapper.innerHTML = `<h4 style="margin:6px 0;"><i class="fas fa-user-music"></i> Top artistas</h4>`;

  const chart = document.createElement('div');
  chart.style.display = 'flex';
  chart.style.flexDirection = 'column';
  chart.style.gap = '8px';
  chart.style.maxWidth = '720px';
  chart.style.marginTop = '8px';

  const maxCount = topArtists[0] ? topArtists[0].count : 1;
  topArtists.forEach(item => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '12px';

    const label = document.createElement('div');
    label.style.width = '200px';
    label.style.fontSize = '14px';
    label.style.color = 'var(--text-muted)';
    label.textContent = `${item.artist}`;

    const barContainer = document.createElement('div');
    barContainer.style.flex = '1';
    barContainer.style.background = 'rgba(0,0,0,0.06)';
    barContainer.style.borderRadius = '6px';
    barContainer.style.overflow = 'hidden';
    barContainer.style.height = '18px';

    const bar = document.createElement('div');
    const pct = Math.round((item.count / maxCount) * 100);
    bar.style.width = pct + '%';
    bar.style.height = '100%';
    bar.style.background = 'linear-gradient(90deg,var(--pink-primary), #ff7ab6)';
    bar.title = `${item.count} canciones`;
    barContainer.appendChild(bar);

    const countBadge = document.createElement('div');
    countBadge.style.width = '48px';
    countBadge.style.textAlign = 'right';
    countBadge.style.fontSize = '13px';
    countBadge.style.color = 'var(--text-muted)';
    countBadge.textContent = item.count;

    row.appendChild(label);
    row.appendChild(barContainer);
    row.appendChild(countBadge);

    chart.appendChild(row);
  });

  chartWrapper.appendChild(chart);
  container.appendChild(chartWrapper);

  // Lista: canciones más largas
  const longest = list.slice().filter(s=>s.duration).sort((a,b)=> parseDurationToSeconds(b.duration) - parseDurationToSeconds(a.duration)).slice(0,10);
  if (longest.length > 0) {
    const listWrapper = document.createElement('div');
    listWrapper.style.marginTop = '20px';
    listWrapper.innerHTML = `<h4 style="margin:6px 0;"><i class="fas fa-clock"></i> Canciones más largas</h4>`;
    const ul = document.createElement('div');
    ul.style.display = 'grid';
    ul.style.gridTemplateColumns = '1fr';
    ul.style.gap = '8px';
    longest.forEach((s, idx) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.padding = '8px';
      item.style.background = 'var(--card-bg)';
      item.style.borderRadius = '6px';
      item.innerHTML = `<div style="font-weight:600">${idx+1}. ${s.title} <span style="color:var(--text-muted); font-weight:400">— ${s.artist || 'Desconocido'}</span></div><div style="color:var(--text-muted)">${s.duration || '0:00'}</div>`;
      ul.appendChild(item);
    });
    listWrapper.appendChild(ul);
    container.appendChild(listWrapper);
  }
};