const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Estado global del sistema (compartido entre la Web y el Arduino)
let sistema = {
    modo: "automatico", // "automatico" o "manual"
    accionMotor: "detener", // "izquierda", "derecha", "detener"
    distancia: 0
};

// Endpoint para que el Arduino o la Web consulten el estado actual
app.get('/api/estado', (req, res) => {
    res.json(sistema);
});

// Endpoint para que la Página Web controle el motor o cambie el modo
app.post('/api/control', (req, res) => {
    const { modo, accionMotor } = req.body;
    
    if (modo) sistema.modo = modo;
    if (accionMotor) sistema.accionMotor = accionMotor;

    res.json({ mensaje: "Estado actualizado correctamente", sistema });
});

// Endpoint para que el Arduino reporte la distancia del sensor HC-SR04
app.post('/api/sensor', (req, res) => {
    const { distancia } = req.body;
    if (distancia !== undefined) {
        sistema.distancia = distancia;
    }
    res.json({ mensaje: "Distancia recibida", distancia: sistema.distancia });
});

app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});