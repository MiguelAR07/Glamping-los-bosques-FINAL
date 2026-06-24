const fs = require('fs');
const file = 'c:/Users/migue/OneDrive/Documentos/Landing-Glamping/backend/src/controller/reservation.controller.js';
let content = fs.readFileSync(file, 'utf8');

// Function 1: createReservation
let newContent = content.replace(
  'export const createReservation = async (req, res) => {\n    try {\n        let { cliente',
  'export const createReservation = async (req, res) => {\n    const client = await pool.connect();\n    try {\n        let { cliente'
);

newContent = newContent.replace(/        const customerResult = await pool\.query/g, '        const customerResult = await client.query');
newContent = newContent.replace(/            const cabinCheck = await pool\.query/g, '            const cabinCheck = await client.query');
newContent = newContent.replace(/            const typeCheck = await pool\.query/g, '            const typeCheck = await client.query');
newContent = newContent.replace(/            const packageResult = await pool\.query/g, '            const packageResult = await client.query');
newContent = newContent.replace(/            const packageCheck = await pool\.query/g, '            const packageCheck = await client.query');
newContent = newContent.replace(/                await pool\.query\(/g, '                await client.query(');
newContent = newContent.replace(/        const reservationResult = await pool\.query/g, '        const reservationResult = await client.query');
newContent = newContent.replace(/        const invoiceResult = await pool\.query/g, '        const invoiceResult = await client.query');
newContent = newContent.replace(/        await pool\.query\("INSERT INTO notificaciones/g, '        await client.query("INSERT INTO notificaciones');

// Function 2: uploadPaymentReceipt
newContent = newContent.replace(
  'export const uploadPaymentReceipt = async (req, res) => {\n    try {\n        const { id } = req.params;',
  'export const uploadPaymentReceipt = async (req, res) => {\n    const client = await pool.connect();\n    try {\n        const { id } = req.params;'
);

newContent = newContent.replace(/        const result = await pool\.query\(reservation\.updatePaymentReceipt/g, '        const result = await client.query(reservation.updatePaymentReceipt');

// Globally replace all exact BEGIN/COMMIT/ROLLBACK using pool.query
newContent = newContent.replace(/await pool\.query\("BEGIN"\);/g, 'await client.query("BEGIN");');
newContent = newContent.replace(/await pool\.query\("COMMIT"\);/g, 'await client.query("COMMIT");');
newContent = newContent.replace(/await pool\.query\("ROLLBACK"\);/g, 'await client.query("ROLLBACK");');

// Add finally block to createReservation
newContent = newContent.replace(
  '        res.status(500).json({ \n            success: false, \n            message: error.message \n        });\n    }\n};\n\n// cargar el comprobante',
  '        res.status(500).json({ \n            success: false, \n            message: error.message \n        });\n    } finally {\n        client.release();\n    }\n};\n\n// cargar el comprobante'
);

// Add finally block to uploadPaymentReceipt
newContent = newContent.replace(
  '        res.status(500).json({\n            success: false,\n            message: error.message\n        });\n    }\n};',
  '        res.status(500).json({\n            success: false,\n            message: error.message\n        });\n    } finally {\n        client.release();\n    }\n};'
);

fs.writeFileSync(file, newContent);
console.log('Done!');
