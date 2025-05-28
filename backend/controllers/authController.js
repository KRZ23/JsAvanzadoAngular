const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Función auxiliar para leer usuarios
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data).users;
    } catch (error) {
        return [];
    }
}

// Función auxiliar para guardar usuarios
async function saveUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2));
}

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await readUsers();
        // No enviar las contraseñas
        const safeUsers = users.map(({ password, ...user }) => user);
        res.json(safeUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario específico
exports.getUser = async (req, res) => {
    try {
        const users = await readUsers();
        const user = users.find(u => u.id === req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // No enviar la contraseña
        const { password, ...safeUser } = user;
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'tu_secreto_jwt',
            { expiresIn: '24h' }
        );

        const { password: _, ...safeUser } = user;
        res.json({
            token,
            user: safeUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Registro
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;
        const users = await readUsers();

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await saveUsers(users);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            'tu_secreto_jwt',
            { expiresIn: '24h' }
        );

        const { password: _, ...safeUser } = newUser;
        res.status(201).json({
            token,
            user: safeUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar contraseña
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const users = await readUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar la contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        users[userIndex].password = hashedPassword;
        users[userIndex].updatedAt = new Date().toISOString();

        await saveUsers(users);
        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};

// Verificar si la contraseña es igual a la actual
exports.checkCurrentPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const users = await readUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (newPassword) {
            // Si se proporciona una nueva contraseña, verificar si es igual a la actual
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            return res.json({ isSamePassword });
        }

        // Si no se proporciona nueva contraseña, solo verificar que el usuario existe
        res.json({ exists: true });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar la contraseña' });
    }
};