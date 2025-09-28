# MusicPINK 🎵✨

Una aplicación moderna de gestión musical que funciona tanto en **escritorio** (usando Electron) como en **navegador web** (usando Express). Diseñada con una interfaz elegante y funcionalidades CRUD completas para canciones y playlists.

## 🌟 Características Principales

- 🖥️ **Dual Platform**: Funciona perfectamente en escritorio y navegador web
- 🔐 **Sistema de Autenticación**: Login y registro con interfaz de pestañas
- 🎵 **Gestión Completa de Música**: CRUD de canciones, playlists y favoritos
- 💾 **Persistencia de Datos**: Almacenamiento automático en JSON
- 🎨 **Diseño Moderno**: Tema oscuro con paleta de colores personalizada
- 🔍 **Búsqueda y Filtrado**: Encuentra canciones y playlists fácilmente
- 📱 **Interfaz Responsiva**: Adaptable a diferentes tamaños de pantalla
- � **Iconos Font Awesome**: Iconografía profesional y consistente

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Servidor web y API REST
- **Electron**: Aplicación de escritorio multiplataforma

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con custom properties y efectos
- **JavaScript ES6+**: Lógica de aplicación vanilla
- **Font Awesome 6.4.0**: Biblioteca de iconos

### Almacenamiento

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** v14 o superior
- **npm** v6 o superior

### Pasos de Instalación

1. **Clonar o descargar** el proyecto:
   ```bash
   git clone <repository-url>
   cd MusicPINK
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

## 💻 Modos de Ejecución

### 🖥️ **Ejecutar en ESCRITORIO** (Aplicación Nativa)
```bash
npm run desktop
```
o alternativamente:
```bash
npm start
```
**Características del modo desktop:**
- Ventana dedicada de la aplicación
- Menús nativos del sistema operativo
- Funciona offline después de la primera carga
- Integración completa con el sistema

### 🌐 **Ejecutar en NAVEGADOR WEB** (Servidor Web)
```bash
npm run web
```
**Luego abre tu navegador en:** `http://localhost:3000`

**Características del modo web:**
- Acceso desde cualquier navegador moderno
- Funciona en diferentes dispositivos
- No requiere instalación adicional
- Ideal para pruebas y desarrollo

### 🔧 **Modo de Desarrollo**
```bash
npm run dev
```
Para desarrollo con recarga automática.

## 📂 Estructura del Proyecto

```
MusicPINK/
├── main.js              # Configuración principal de Electron
├── server.js            # Servidor Express para modo web
├── preload.js           # Script de seguridad de Electron
├── package.json         # Dependencias y scripts del proyecto
├── render/              # Archivos de la interfaz de usuario
│   ├── index.html       # Estructura HTML principal
│   ├── app.js          # Lógica de la aplicación
│   ├── styles.css      # Estilos CSS personalizados
│   ├── api-compat.js   # Capa de compatibilidad API
│   └── data.json       # Base de datos JSON
└── README.md           # Este archivo
```

## 🎨 Paleta de Colores Personalizada

El proyecto utiliza una paleta de colores cuidadosamente seleccionada:

- **Texto**: `#fad1f4` (Rosa claro)
- **Fondo**: `#1c0318` (Púrpura muy oscuro) 
- **Primario**: `#f084e7` (Rosa fucsia brillante)
- **Secundario**: `#9f1429` (Rojo vino)
## 🚀 Funcionalidades Principales

### 🔐 **Sistema de Autenticación**
- Registro de nuevos usuarios con validación
- Login seguro con email y contraseña
- Hash de contraseñas con SHA-256
- Interfaz de pestañas moderna
- Sesión persistente en localStorage

### 🎵 **Gestión Musical Completa**
- **Canciones**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Playlists**: Creación, edición, eliminación y vista detallada
- **Favoritos**: Marcar/desmarcar canciones favoritas
- **Búsqueda**: Filtrado en tiempo real por nombre o artista

### 💾 **Persistencia de Datos**
- Base de datos JSON ligera para desarrollo
- Guardado automático de cambios
- Sincronización entre diferentes sesiones

## 🔧 APIs y Compatibilidad

La aplicación utiliza una **capa de compatibilidad** que detecta automáticamente el entorno:

- **En Escritorio**: Usa IPC de Electron para comunicación segura
- **En Web**: Usa llamadas HTTP REST al servidor Express

### Endpoints de la API Web:
- `GET /api/data` - Obtener todos los datos
- `POST /api/data` - Guardar datos  
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

## 📱 Cuenta Demo

Para probar la aplicación rápidamente, utiliza estas credenciales:
- **Email**: `demo@demo.com`
- **Contraseña**: `secret`

## 🐛 Troubleshooting

### Problemas Comunes:

**"Error: Puerto 3000 en uso"**
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000
# Matar el proceso si es necesario
taskkill /PID <PID_NUMBER> /F
```

**"npm error ENOENT package.json"**
```bash
# Asegúrate de estar en el directorio correcto
cd MusicPINK  # (el subdirectorio, no el padre)
npm install
```

**"Electron no se ejecuta"**
```bash
# Reinstalar dependencias
npm install
npm run desktop
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado con ❤️ para la gestión moderna de música.

---
🎵 **¡Disfruta de tu música con MusicPINK!** 🎵

## Tecnologías Utilizadas 🛠️

### Frontend:
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- Responsive design
- Tema oscuro con acentos rosados

### Backend:
- **Node.js**
- **Electron** (modo escritorio)
- **Express.js** (modo web)
- **crypto** para hash de contraseñas

### Dependencias:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5", 
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "electron": "^29.0.0"
  }
}
```

## Desarrollo 👨‍💻

### Para desarrollar nuevas características:

1. **Frontend**: Edita archivos en `/render/`
2. **Backend Electron**: Edita `main.js` y `preload.js`
3. **Backend Web**: Edita `server.js`
4. **Compatibilidad**: Actualiza `render/api-compat.js` si es necesario

### Agregar nuevas funciones API:

1. Añade el endpoint en `server.js` (modo web)
2. Añade el handler IPC en `main.js` (modo escritorio)  
3. Expón la función en `preload.js` (modo escritorio)
4. Actualiza `api-compat.js` con el nuevo método
5. Úsalo en `app.js`

## Notas Técnicas 📝

- **Puerto por defecto**: 3000 (configurable con `PORT` env var)
- **Base de datos**: JSON file (fácil de migrar a DB real)
- **Seguridad**: Passwords hasheados, CORS habilitado
- **Cross-platform**: Funciona en Windows, Mac y Linux

## Troubleshooting 🔧

### Problemas comunes:

1. **Puerto ocupado**: Cambia el puerto con `PORT=3001 npm run web`
2. **Permisos de archivo**: Verifica que `render/data.json` sea escribible
3. **Dependencias**: Ejecuta `npm install` si falta algún módulo

---

¡Disfruta tu aplicación de música en cualquier plataforma! 🎵✨