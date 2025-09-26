let state = { users:[], songs:[], playlists:[], favorites:[] };
let currentUser = null;
let currentView = 'songs';


const root = document.getElementById('app');


async function loadData(){
state = await window.appAPI.readData();
currentUser = JSON.parse(localStorage.getItem('musicApp_currentUser')||'null');
if(!currentUser) return renderAuth();
renderLayout();
renderView(currentView);
}


async function saveData(){
await window.appAPI.writeData(state);
}


function renderAuth(){
root.innerHTML = `<div class="auth-container">
<div class="card auth-card">
<div class="auth-header">
<h1><i class="fas fa-music"></i> MusicPINK</h1>
<p>Tu plataforma de música favorita</p>
</div>

<div class="auth-tabs">
<button id="login-tab" class="tab-btn active">Iniciar Sesión</button>
<button id="register-tab" class="tab-btn">Crear Cuenta</button>
</div>

<div id="login-form" class="auth-form active">
<h3><i class="fas fa-unlock-alt"></i> Bienvenido de vuelta</h3>
<div class="input-group">
<input id="auth-email" class="input" placeholder="Tu email" type="email" />
<input id="auth-pass" class="input" placeholder="Tu contraseña" type="password" />
</div>
<button id="login-btn" class="btn btn-primary"><i class="fas fa-rocket"></i> Entrar</button>
</div>

<div id="register-form" class="auth-form">
<h3><i class="fas fa-user-plus"></i> ¡Empezamos!</h3>
<div class="input-group">
<input id="reg-name" class="input" placeholder="Tu nombre completo" />
<input id="reg-email" class="input" placeholder="Tu email" type="email" />
<input id="reg-pass" class="input" placeholder="Crea tu contraseña" type="password" />
</div>
<button id="reg-btn" class="btn btn-primary"><i class="fas fa-sparkles"></i> Crear cuenta</button>
</div>

<div class="demo-info">
<small><i class="fas fa-info-circle"></i> Demo: demo@demo.com / secret</small>
</div>
</div>
</div>`;

// Tab functionality
document.getElementById('login-tab').onclick = () => switchTab('login');
document.getElementById('register-tab').onclick = () => switchTab('register');

function switchTab(tab) {
// Update tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
document.getElementById(`${tab}-tab`).classList.add('active');

// Update forms
document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
document.getElementById(`${tab}-form`).classList.add('active');
}


document.getElementById('login-btn').onclick = async()=>{
const email=document.getElementById('auth-email').value;
const pass=document.getElementById('auth-pass').value;
const res= await window.appAPI.login({email,password:pass});
if(!res.ok) return alert('Credenciales inválidas');
currentUser=res.user; localStorage.setItem('musicApp_currentUser',JSON.stringify(currentUser));
loadData();
};
document.getElementById('reg-btn').onclick = async()=>{
const name=document.getElementById('reg-name').value;
const email=document.getElementById('reg-email').value;
const pass=document.getElementById('reg-pass').value;
const res= await window.appAPI.register({name,email,password:pass});
if(!res.ok) return alert('Error: '+res.error);
currentUser=res.user; localStorage.setItem('musicApp_currentUser',JSON.stringify(currentUser));
loadData();
};
}

function renderLayout(){
root.innerHTML=`
<div class="sidebar">
<div style="padding: 20px; border-bottom: 1px solid var(--border-color);">
<h2 style="color: var(--pink-primary); margin: 0;"><i class="fas fa-music"></i> MusicPINK</h2>
<small style="color: var(--text-muted);">Hola, ${currentUser.name}</small>
</div>
<button id="nav-songs"><i class="fas fa-music"></i> Canciones</button>
<button id="nav-playlists"><i class="fas fa-list"></i> Playlists</button>
<button id="nav-favorites"><i class="fas fa-star"></i> Favoritos</button>
<button id="logout"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>
</div>
<div class="main" id="view-root"></div>`;


document.getElementById('nav-songs').onclick=()=>renderView('songs');
document.getElementById('nav-playlists').onclick=()=>renderView('playlists');
document.getElementById('nav-favorites').onclick=()=>renderView('favorites');
document.getElementById('logout').onclick=()=>{ localStorage.removeItem('musicApp_currentUser'); currentUser=null; renderAuth(); };
}

function updateActiveNav() {
  document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`nav-${currentView}`);
  if (activeBtn) activeBtn.classList.add('active');
}

function renderView(view){
currentView=view;
updateActiveNav();
const rootView=document.getElementById('view-root');
if(view==='songs') renderSongs(rootView);
if(view==='playlists') renderPlaylists(rootView);
if(view==='favorites') renderFavorites(rootView);
}


function renderSongs(rootView){
rootView.innerHTML=`<div class="card">
<div class="view-header">
<div>
<h2><i class="fas fa-music"></i> Biblioteca Musical</h2>
<input id="filter-songs" class="input" placeholder="Buscar canciones o artistas..." />
<div id="songs-count" style="margin: 10px 0; color: var(--text-muted);"></div>
</div>
<button id="add-song-btn" class="btn btn-success"><i class="fas fa-plus"></i> Agregar Canción</button>
</div>
</div>`;
const list=document.createElement('div'); 
list.style.marginTop = '20px';
rootView.appendChild(list);

// Add song modal functionality
document.getElementById('add-song-btn').onclick = () => showAddSongModal();

function showAddSongModal() {
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
<div class="modal-content">
<div class="modal-header">
<h3><i class="fas fa-plus"></i> Agregar Nueva Canción</h3>
<button class="close-btn">&times;</button>
</div>
<div class="modal-body">
<input id="new-song-title" class="input" placeholder="Título de la canción" />
<input id="new-song-artist" class="input" placeholder="Artista" />
<input id="new-song-duration" class="input" placeholder="Duración (ej: 3:45)" />
</div>
<div class="modal-footer">
<button id="cancel-song" class="btn btn-secondary">Cancelar</button>
<button id="save-song" class="btn btn-primary">Guardar</button>
</div>
</div>
`;
document.body.appendChild(modal);

// Modal event handlers
modal.querySelector('.close-btn').onclick = () => modal.remove();
document.getElementById('cancel-song').onclick = () => modal.remove();
document.getElementById('save-song').onclick = async () => {
const title = document.getElementById('new-song-title').value.trim();
const artist = document.getElementById('new-song-artist').value.trim();
const duration = document.getElementById('new-song-duration').value.trim();

if (!title || !artist) {
alert('Por favor completa el título y artista');
return;
}

const newSong = {
id: 's' + Date.now(),
title,
artist,
duration: duration || ''
};

state.songs.push(newSong);
await saveData();
modal.remove();
redraw();
};

// Close on outside click
modal.onclick = (e) => {
if (e.target === modal) modal.remove();
};
}

function redraw(){
list.innerHTML='';
const q=document.getElementById('filter-songs').value.toLowerCase();
const filteredSongs = state.songs.filter(s=>!q||s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q));

document.getElementById('songs-count').textContent = `${filteredSongs.length} canciones encontradas`;

filteredSongs.forEach(s=>{
const fav=state.favorites.find(f=>f.songId===s.id && f.ownerId===currentUser.id);
const div=document.createElement('div'); 
div.className='list-item';
div.innerHTML=`
<div>
<b><i class="fas fa-music"></i> ${s.title}</b><br>
<small style="color: var(--text-muted);"><i class="fas fa-user"></i> ${s.artist} ${s.duration ? '• <i class="fas fa-clock"></i> ' + s.duration : ''}</small>
</div>
<div class="item-actions">
<button class="small" title="${fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}"><i class="fas ${fav?'fa-heart':'fa-heart'} ${fav?'text-danger':''}"></i></button>
<button class="small edit-btn" title="Editar canción"><i class="fas fa-edit"></i></button>
<button class="small delete-btn" title="Eliminar canción"><i class="fas fa-trash"></i></button>
</div>
`;

// Favorite toggle
div.querySelector('.small').onclick=async()=>{
if(fav) state.favorites=state.favorites.filter(f=>!(f.songId===s.id&&f.ownerId===currentUser.id));
else state.favorites.push({ ownerId:currentUser.id, songId:s.id });
await saveData(); redraw();
};

// Edit song
div.querySelector('.edit-btn').onclick = () => editSong(s);

// Delete song
div.querySelector('.delete-btn').onclick = async () => {
if(confirm(`¿Eliminar "${s.title}"?`)) {
state.songs = state.songs.filter(song => song.id !== s.id);
state.favorites = state.favorites.filter(f => f.songId !== s.id);
await saveData();
redraw();
}
};

list.appendChild(div);
});

if(filteredSongs.length === 0 && q) {
list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">🔍 No se encontraron canciones</div>';
}
}

function editSong(song) {
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
<div class="modal-content">
<div class="modal-header">
<h3><i class="fas fa-edit"></i> Editar Canción</h3>
<button class="close-btn">&times;</button>
</div>
<div class="modal-body">
<input id="edit-song-title" class="input" placeholder="Título" value="${song.title}" />
<input id="edit-song-artist" class="input" placeholder="Artista" value="${song.artist}" />
<input id="edit-song-duration" class="input" placeholder="Duración" value="${song.duration || ''}" />
</div>
<div class="modal-footer">
<button id="cancel-edit" class="btn btn-secondary">Cancelar</button>
<button id="save-edit" class="btn btn-primary">Guardar Cambios</button>
</div>
</div>
`;
document.body.appendChild(modal);

modal.querySelector('.close-btn').onclick = () => modal.remove();
document.getElementById('cancel-edit').onclick = () => modal.remove();
document.getElementById('save-edit').onclick = async () => {
const title = document.getElementById('edit-song-title').value.trim();
const artist = document.getElementById('edit-song-artist').value.trim();
const duration = document.getElementById('edit-song-duration').value.trim();

if (!title || !artist) {
alert('Por favor completa el título y artista');
return;
}

song.title = title;
song.artist = artist;
song.duration = duration;

await saveData();
modal.remove();
redraw();
};

modal.onclick = (e) => {
if (e.target === modal) modal.remove();
};
}

document.getElementById('filter-songs').oninput=redraw;
redraw();
}


function renderPlaylists(rootView){
rootView.innerHTML=`<div class="card">
<div class="view-header">
<div>
<h2><i class="fas fa-list"></i> Mis Playlists</h2>
<input id="filter-pl" class="input" placeholder="Buscar playlists..." />
<div id="playlists-count" style="margin: 10px 0; color: var(--text-muted);"></div>
</div>
<button id="add-playlist-btn" class="btn btn-success"><i class="fas fa-plus"></i> Nueva Playlist</button>
</div>
</div>`;
const list=document.createElement('div');
list.style.marginTop = '20px';
rootView.appendChild(list);

// Connect add playlist button
document.getElementById('add-playlist-btn').onclick = () => showAddPlaylistModal();

function redraw(){
list.innerHTML='';
const q=document.getElementById('filter-pl').value.toLowerCase();
const filteredPlaylists = state.playlists.filter(p=>p.ownerId===currentUser.id).filter(p=>!q||p.name.toLowerCase().includes(q));

document.getElementById('playlists-count').textContent = `${filteredPlaylists.length} playlists encontradas`;

filteredPlaylists.forEach(p=>{
const songCount = p.songIds ? p.songIds.length : 0;
const div=document.createElement('div'); div.className='list-item playlist-item';
div.innerHTML=`
<div class="playlist-info" onclick="showPlaylistDetails('${p.id}')" style="cursor: pointer; flex: 1;">
<b><i class="fas fa-list"></i> ${p.name}</b><br>
<small style="color: var(--text-muted);"><i class="fas fa-music"></i> ${songCount} canciones</small>
</div>
<div class="item-actions">
<button class="small view-btn" title="Ver detalles" onclick="showPlaylistDetails('${p.id}'); event.stopPropagation();"><i class="fas fa-eye"></i></button>
<button class="small edit-btn" title="Editar nombre" onclick="editPlaylistName('${p.id}'); event.stopPropagation();"><i class="fas fa-edit"></i></button>
<button class="small delete-btn" title="Eliminar playlist" onclick="deletePlaylist('${p.id}'); event.stopPropagation();"><i class="fas fa-trash"></i></button>
</div>
`;
list.appendChild(div);
});

if(filteredPlaylists.length === 0 && q) {
list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">🔍 No se encontraron playlists</div>';
} else if(filteredPlaylists.length === 0) {
list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">📋 Aún no tienes playlists</div>';
}
}
document.getElementById('filter-pl').oninput=redraw;
redraw();
}


function renderFavorites(rootView){
rootView.innerHTML=`<div class="card">
<h2><i class="fas fa-star"></i> Mis Favoritos</h2>
<input id="filter-fav" class="input" placeholder="Buscar en favoritos..." />
<div id="favorites-count" style="margin: 10px 0; color: var(--text-muted);"></div>
</div>`;
const list=document.createElement('div');
list.style.marginTop = '20px';
rootView.appendChild(list);


function redraw(){
list.innerHTML='';
const q=document.getElementById('filter-fav').value.toLowerCase();
const favoriteSongs = [];

state.favorites.filter(f=>f.ownerId===currentUser.id).forEach(f=>{
const s=state.songs.find(s=>s.id===f.songId);
if(!s) return;
if(q && !s.title.toLowerCase().includes(q) && !s.artist.toLowerCase().includes(q)) return;
favoriteSongs.push(s);
});

document.getElementById('favorites-count').textContent = `${favoriteSongs.length} canciones favoritas`;

favoriteSongs.forEach(s=>{
const div=document.createElement('div'); div.className='list-item';
div.innerHTML=`
<div>
<b><i class="fas fa-heart text-danger"></i> ${s.title}</b><br>
<small style="color: var(--text-muted);"><i class="fas fa-user"></i> ${s.artist} ${s.duration ? '• <i class="fas fa-clock"></i> ' + s.duration : ''}</small>
</div>`;
list.appendChild(div);
});

if(favoriteSongs.length === 0 && q) {
list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">🔍 No se encontraron favoritos</div>';
} else if(favoriteSongs.length === 0) {
list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted);">⭐ Aún no tienes canciones favoritas</div>';
}
}
document.getElementById('filter-fav').oninput=redraw;
redraw();
}


// Modal and CRUD Functions
function showAddPlaylistModal() {
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
<div class="modal-content">
<div class="modal-header">
<h3><i class="fas fa-plus"></i> Crear Nueva Playlist</h3>
<button class="close-btn">&times;</button>
</div>
<div class="modal-body">
<input id="new-playlist-name" class="input" placeholder="Nombre de la playlist" />
<label style="color: var(--text-muted); display: block; margin: 15px 0 10px 0;">Seleccionar canciones:</label>
<div id="song-selection" class="song-list"></div>
</div>
<div class="modal-footer">
<button id="cancel-playlist" class="btn btn-secondary">Cancelar</button>
<button id="save-playlist" class="btn btn-primary">Crear Playlist</button>
</div>
</div>
`;
document.body.appendChild(modal);

// Populate song selection
const songSelection = document.getElementById('song-selection');
state.songs.forEach(song => {
const div = document.createElement('div');
div.className = 'song-checkbox';
div.innerHTML = `
<label>
<input type="checkbox" value="${song.id}" />
<span><i class="fas fa-music"></i> ${song.title} - ${song.artist}</span>
</label>
`;
songSelection.appendChild(div);
});

// Modal event handlers
modal.querySelector('.close-btn').onclick = () => modal.remove();
document.getElementById('cancel-playlist').onclick = () => modal.remove();
document.getElementById('save-playlist').onclick = async () => {
const name = document.getElementById('new-playlist-name').value.trim();
const selectedSongs = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

if (!name) {
alert('Por favor ingresa un nombre para la playlist');
return;
}

const newPlaylist = {
id: 'p' + Date.now(),
name,
ownerId: currentUser.id,
songIds: selectedSongs
};

state.playlists.push(newPlaylist);
await saveData();
modal.remove();
// Trigger redraw if in playlists view
if (currentView === 'playlists') {
renderView('playlists');
}
};

modal.onclick = (e) => {
if (e.target === modal) modal.remove();
};
}

// Enhanced Playlist Management Functions
window.showPlaylistDetails = function(playlistId) {
const playlist = state.playlists.find(p => p.id === playlistId);
if (!playlist) return;

const playlistSongs = playlist.songIds ? playlist.songIds.map(id => state.songs.find(s => s.id === id)).filter(s => s) : [];

const modal = document.createElement('div');
modal.className = 'modal playlist-detail-modal';
modal.innerHTML = `
<div class="modal-content large">
<div class="modal-header">
<h3><i class="fas fa-list"></i> ${playlist.name}</h3>
<button class="close-btn">&times;</button>
</div>
<div class="modal-body">
<div class="playlist-stats">
<div class="stat-item">
<i class="fas fa-music"></i>
<span>${playlistSongs.length} Canciones</span>
</div>
<div class="stat-item">
<i class="fas fa-clock"></i>
<span>Duración Total: ${calculateTotalDuration(playlistSongs)}</span>
</div>
</div>
<div class="playlist-actions">
<button class="btn btn-success" onclick="addSongsToPlaylist('${playlist.id}')">
<i class="fas fa-plus"></i> Agregar Canciones
</button>
<button class="btn btn-warning" onclick="editPlaylistName('${playlist.id}')">
<i class="fas fa-edit"></i> Editar Nombre
</button>
</div>
<div class="playlist-songs-container">
<h4><i class="fas fa-headphones"></i> Canciones en la Playlist</h4>
<div class="playlist-songs-list" id="playlist-songs-${playlist.id}">
${playlistSongs.length === 0 ? 
'<div class="empty-playlist"><i class="fas fa-music"></i><p>Esta playlist está vacía</p><small>Agrega canciones para comenzar</small></div>' :
playlistSongs.map((song, index) => `
<div class="playlist-song-item" data-song-id="${song.id}">
<div class="song-number">${index + 1}</div>
<div class="song-info">
<div class="song-title"><i class="fas fa-music"></i> ${song.title}</div>
<div class="song-artist"><i class="fas fa-user"></i> ${song.artist}</div>
</div>
<div class="song-duration">
<i class="fas fa-clock"></i> ${song.duration || '0:00'}
</div>
<div class="song-actions">
<button class="small move-up-btn" title="Subir" onclick="moveSongInPlaylist('${playlist.id}', ${index}, -1)" ${index === 0 ? 'disabled' : ''}>
<i class="fas fa-arrow-up"></i>
</button>
<button class="small move-down-btn" title="Bajar" onclick="moveSongInPlaylist('${playlist.id}', ${index}, 1)" ${index === playlistSongs.length - 1 ? 'disabled' : ''}>
<i class="fas fa-arrow-down"></i>
</button>
<button class="small delete-btn" title="Quitar de playlist" onclick="removeSongFromPlaylist('${playlist.id}', '${song.id}')">
<i class="fas fa-times"></i>
</button>
</div>
</div>
`).join('')}
</div>
</div>
</div>
<div class="modal-footer">
<button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cerrar</button>
</div>
</div>
`;
document.body.appendChild(modal);

modal.querySelector('.close-btn').onclick = () => modal.remove();
modal.onclick = (e) => {
if (e.target === modal) modal.remove();
};
};

window.editPlaylistName = function(playlistId) {
const playlist = state.playlists.find(p => p.id === playlistId);
if (!playlist) return;

const newName = prompt('Nuevo nombre para la playlist:', playlist.name);
if (!newName || newName.trim() === '' || newName === playlist.name) return;

playlist.name = newName.trim();
saveData().then(() => {
if (currentView === 'playlists') {
renderView('playlists');
}
// Update any open detail modal
const detailModal = document.querySelector('.playlist-detail-modal');
if (detailModal) {
detailModal.querySelector('h3').innerHTML = `<i class="fas fa-list"></i> ${playlist.name}`;
}
});
};

window.deletePlaylist = function(playlistId) {
const playlist = state.playlists.find(p => p.id === playlistId);
if (!playlist) return;

if (!confirm(`¿Eliminar la playlist "${playlist.name}"?\\nEsta acción no se puede deshacer.`)) return;

state.playlists = state.playlists.filter(p => p.id !== playlistId);
saveData().then(() => {
if (currentView === 'playlists') {
renderView('playlists');
}
// Close any open detail modal for this playlist
const detailModal = document.querySelector('.playlist-detail-modal');
if (detailModal) {
detailModal.remove();
}
});
};

window.addSongsToPlaylist = function(playlistId) {
const playlist = state.playlists.find(p => p.id === playlistId);
if (!playlist) return;

const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
<div class="modal-content">
<div class="modal-header">
<h3><i class="fas fa-plus"></i> Agregar Canciones a "${playlist.name}"</h3>
<button class="close-btn">&times;</button>
</div>
<div class="modal-body">
<div class="search-section">
<input id="song-search" class="input" placeholder="Buscar canciones..." />
</div>
<div class="available-songs" id="available-songs-list"></div>
</div>
<div class="modal-footer">
<button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancelar</button>
<button class="btn btn-primary" id="add-selected-songs">Agregar Seleccionadas</button>
</div>
</div>
`;
document.body.appendChild(modal);

// Populate available songs
function updateAvailableSongs(searchTerm = '') {
const availableList = document.getElementById('available-songs-list');
const availableSongs = state.songs.filter(song => {
const inPlaylist = playlist.songIds && playlist.songIds.includes(song.id);
const matchesSearch = !searchTerm || 
song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
song.artist.toLowerCase().includes(searchTerm.toLowerCase());
return !inPlaylist && matchesSearch;
});

availableList.innerHTML = availableSongs.map(song => `
<div class="song-checkbox">
<label>
<input type="checkbox" value="${song.id}" />
<div class="song-checkbox-info">
<div class="song-title"><i class="fas fa-music"></i> ${song.title}</div>
<div class="song-artist"><i class="fas fa-user"></i> ${song.artist}</div>
<div class="song-duration"><i class="fas fa-clock"></i> ${song.duration || '0:00'}</div>
</div>
</label>
</div>
`).join('');

if (availableSongs.length === 0) {
availableList.innerHTML = searchTerm ? 
'<div class="empty-search"><i class="fas fa-search"></i><p>No se encontraron canciones</p></div>' :
'<div class="empty-search"><i class="fas fa-check-circle"></i><p>Todas las canciones ya están en la playlist</p></div>';
}
}

updateAvailableSongs();

// Search functionality
document.getElementById('song-search').oninput = (e) => {
updateAvailableSongs(e.target.value);
};

// Add selected songs
document.getElementById('add-selected-songs').onclick = () => {
const selectedSongs = Array.from(modal.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
if (selectedSongs.length === 0) {
alert('Por favor selecciona al menos una canción');
return;
}

if (!playlist.songIds) playlist.songIds = [];
playlist.songIds.push(...selectedSongs);

saveData().then(() => {
modal.remove();
// Refresh playlist details if open
const detailModal = document.querySelector('.playlist-detail-modal');
if (detailModal) {
detailModal.remove();
showPlaylistDetails(playlistId);
}
});
};

modal.querySelector('.close-btn').onclick = () => modal.remove();
modal.onclick = (e) => {
if (e.target === modal) modal.remove();
};
};

window.removeSongFromPlaylist = function(playlistId, songId) {
const playlist = state.playlists.find(p => p.id === playlistId);
if (!playlist || !playlist.songIds) return;

const song = state.songs.find(s => s.id === songId);
if (!confirm(`¿Quitar "${song?.title || 'esta canción'}" de la playlist?`)) return;

playlist.songIds = playlist.songIds.filter(id => id !== songId);

saveData().then(() => {
// Refresh playlist details
showPlaylistDetails(playlistId);
});
};

window.moveSongInPlaylist = function(playlistId, currentIndex, direction) {
const playlist = state.playlists.find(p => p.id === playlistId);
if (!playlist || !playlist.songIds) return;

const newIndex = currentIndex + direction;
if (newIndex < 0 || newIndex >= playlist.songIds.length) return;

// Swap songs
const temp = playlist.songIds[currentIndex];
playlist.songIds[currentIndex] = playlist.songIds[newIndex];
playlist.songIds[newIndex] = temp;

saveData().then(() => {
// Refresh playlist details
showPlaylistDetails(playlistId);
});
};

function calculateTotalDuration(songs) {
if (songs.length === 0) return '0:00';

let totalSeconds = 0;
songs.forEach(song => {
if (song.duration) {
const parts = song.duration.split(':');
totalSeconds += parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
}
});

const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;
return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


loadData();