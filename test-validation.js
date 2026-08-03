const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();

app.use(express.json()); // mock multer behavior by sending json

const rulesCreateReservation = [
    body("reserva.paquete_id")
        .custom((value, { req }) => {
            if (!value && (!req.body.paquete || Object.keys(req.body.paquete).length === 0)) {
                throw new Error("El paquete es obligatorio");
            }
            return true;
        })
];

app.post('/api/reservations', rulesCreateReservation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    res.json({ success: true });
});

app.listen(4005, async () => {
    try {
        const res = await fetch('http://localhost:4005/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reserva: '{ "paquete_id": "1" }'
            }) // This matches what multer gives us when we append stringified JSON
        });
        const data = await res.json();
        console.log("RESPONSE:", JSON.stringify(data, null, 2));
    } finally {
        process.exit(0);
    }
});
