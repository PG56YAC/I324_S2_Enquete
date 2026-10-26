// Base de données de test dans le dossier temporaire du système (Windows, macOS, Linux)
const os = require('os');
const path = require('path');

process.env.NODE_ENV = 'test';
process.env.SQLITE_DB_LOCATION = path.join(os.tmpdir(), 'i324-todo-test.db');
