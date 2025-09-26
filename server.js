const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'render')));

// Data file path
const dataFile = path.join(__dirname, 'render', 'data.json');

// Utility functions
function readData() {
    try {
        return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
    } catch (e) {
        return { users: [], songs: [], playlists: [], favorites: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// API Routes
app.get('/api/data', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error reading data' });
    }
});

app.post('/api/data', (req, res) => {
    try {
        writeData(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error writing data' });
    }
});

app.post('/api/auth/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = readData();
        
        if (data.users.find(u => u.email === email)) {
            return res.json({ ok: false, error: 'EMAIL_EXISTS' });
        }
        
        const id = 'u_' + Math.random().toString(36).slice(2, 9);
        const user = { id, name, email, passwordHash: hashPassword(password) };
        data.users.push(user);
        writeData(data);
        
        res.json({ ok: true, user: { id, name, email } });
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Server error' });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const data = readData();
        const user = data.users.find(u => 
            u.email === email && u.passwordHash === hashPassword(password)
        );
        
        if (user) {
            res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.json({ ok: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ ok: false, error: 'Server error' });
    }
});

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'render', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 MusicPINK server running at:`);
    console.log(`🌐 Web: http://localhost:${PORT}`);
    console.log(`💻 Desktop: Run 'npm run desktop' in another terminal`);
});