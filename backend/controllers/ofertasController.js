const fs = require('fs');
const path = require('path');

const ofertasFilePath = path.join(__dirname, '../data/ofertas.json');

// Helper function to read ofertas from file
function readOfertas() {
    try {
        const data = fs.readFileSync(ofertasFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper function to write ofertas to file
function writeOfertas(ofertas) {
    fs.writeFileSync(ofertasFilePath, JSON.stringify(ofertas, null, 2));
}

exports.getOfertas = (req, res) => {
    const ofertas = readOfertas();
    res.json(ofertas);
};

exports.addOferta = (req, res) => {
    const ofertas = readOfertas();
    const newOferta = req.body;
    newOferta.id = Date.now().toString();
    ofertas.push(newOferta);
    writeOfertas(ofertas);
    res.status(201).json(newOferta);
};

exports.updateOferta = (req, res) => {
    const ofertas = readOfertas();
    const ofertaId = req.params.id;
    const index = ofertas.findIndex(o => o.id === ofertaId);
    if (index === -1) {
        return res.status(404).json({ message: 'Oferta no encontrada' });
    }
    ofertas[index] = { ...ofertas[index], ...req.body };
    writeOfertas(ofertas);
    res.json(ofertas[index]);
};

exports.deleteOferta = (req, res) => {
    let ofertas = readOfertas();
    const ofertaId = req.params.id;
    const initialLength = ofertas.length;
    ofertas = ofertas.filter(o => o.id !== ofertaId);
    if (ofertas.length === initialLength) {
        return res.status(404).json({ message: 'Oferta no encontrada' });
    }
    writeOfertas(ofertas);
    res.json({ message: 'Oferta eliminada correctamente' });
};
