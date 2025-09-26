// Web API compatibility layer
class WebAPI {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async readData() {
        try {
            const response = await fetch(`${this.baseURL}/api/data`);
            return await response.json();
        } catch (error) {
            console.error('Error reading data:', error);
            return { users: [], songs: [], playlists: [], favorites: [] };
        }
    }

    async writeData(data) {
        try {
            const response = await fetch(`${this.baseURL}/api/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error writing data:', error);
            return { success: false };
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error registering:', error);
            return { ok: false, error: 'Network error' };
        }
    }

    async login(credentials) {
        try {
            const response = await fetch(`${this.baseURL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            return await response.json();
        } catch (error) {
            console.error('Error logging in:', error);
            return { ok: false, error: 'Network error' };
        }
    }
}

// Environment detection and API initialization
function initializeAPI() {
    // Check if running in Electron
    if (typeof window !== 'undefined' && window.api) {
        console.log('🖥️  Running in Electron (Desktop mode)');
        return window.api;
    } else {
        console.log('🌐 Running in Web Browser (Web mode)');
        return new WebAPI();
    }
}

// Initialize the API
window.appAPI = initializeAPI();