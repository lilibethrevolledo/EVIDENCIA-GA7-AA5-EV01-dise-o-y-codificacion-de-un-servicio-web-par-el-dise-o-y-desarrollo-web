// Importamos el framework Express
const express = require("express");

// Creamos la aplicación
const app = express();

// Permite recibir información en formato JSON
app.use(express.json());

/*
 * Arreglo temporal para almacenar los usuarios.
 * Para este ejercicio académico se utilizará como
 * almacenamiento de datos.
 */
const usuarios = [];

// =====================================================
// RUTA PRINCIPAL
// =====================================================
app.get("/", (req, res) => {
    res.send("API de autenticación funcionando correctamente");
});

// =====================================================
// REGISTRO DE USUARIO
// POST /api/auth/registro
// Body: { "usuario": "lili", "contrasena": "1234" }
// =====================================================
app.post("/api/auth/registro", (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validamos que lleguen los dos datos
    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: "Usuario y contraseña son obligatorios"
        });
    }

    // Verificamos que el usuario no exista
    const existe = usuarios.find(u => u.usuario === usuario);
    if (existe) {
        return res.status(409).json({
            mensaje: "El usuario ya está registrado"
        });
    }

    // Guardamos el usuario en el arreglo
    usuarios.push({ usuario, contrasena });

    res.status(201).json({
        mensaje: "Usuario registrado correctamente"
    });
});

// =====================================================
// INICIO DE SESIÓN
// POST /api/auth/login
// Body: { "usuario": "lili", "contrasena": "1234" }
// =====================================================
app.post("/api/auth/login", (req, res) => {
    const { usuario, contrasena } = req.body;

    // Validamos que lleguen los dos datos
    if (!usuario || !contrasena) {
        return res.status(400).json({
            mensaje: "Usuario y contraseña son obligatorios"
        });
    }

    // Buscamos un usuario que coincida con ambos datos
    const encontrado = usuarios.find(
        u => u.usuario === usuario && u.contrasena === contrasena
    );

    if (encontrado) {
        // Autenticación correcta
        res.status(200).json({
            mensaje: "Autenticación satisfactoria"
        });
    } else {
        // Autenticación incorrecta
        res.status(401).json({
            mensaje: "Error en la autenticación"
        });
    }
});

// =====================================================
// (Opcional) LISTAR USUARIOS - útil para comprobar en Postman
// =====================================================
app.get("/api/auth/usuarios", (req, res) => {
    res.json(usuarios);
});
// =====================================================
// ACTUALIZAR USUARIO
// PUT /api/auth/usuarios/:usuario
// Body: { "contrasena": "nueva1234" }
// =====================================================
app.put("/api/auth/usuarios/:usuario", (req, res) => {
    const { contrasena } = req.body;

    // Validamos que llegue la nueva contraseña
    if (!contrasena) {
        return res.status(400).json({
            mensaje: "La nueva contraseña es obligatoria"
        });
    }

    // Buscamos el usuario por el nombre que viene en la URL
    const encontrado = usuarios.find(u => u.usuario === req.params.usuario);

    if (!encontrado) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Actualizamos la contraseña
    encontrado.contrasena = contrasena;

    res.json({ mensaje: "Usuario actualizado correctamente" });
});

// =====================================================
// ELIMINAR USUARIO
// DELETE /api/auth/usuarios/:usuario
// =====================================================
app.delete("/api/auth/usuarios/:usuario", (req, res) => {
    const indice = usuarios.findIndex(u => u.usuario === req.params.usuario);

    if (indice === -1) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuarios.splice(indice, 1);
    res.json({ mensaje: "Usuario eliminado correctamente" });
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});