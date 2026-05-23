import { body } from 'express-validator';

export const rulesCreateReservation = [
    // validaciones para cliente
    body("cliente.nombre")
        .trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({min: 6}).withMessage("El nombre debe tener al menos 6 caracteres"),
    body("cliente.email")
        .trim()
        .notEmpty().withMessage("El correo es obligatorio")
        .isEmail().withMessage("El correo debe tener un formato válido"),
    body("cliente.contacto")
        .trim()
        .notEmpty().withMessage("El contacto es obligatorio")
        .isNumeric().withMessage("El número de contacto debe ser un número")
        .isLength({min: 7}).withMessage("El número de contacto debe tener al menos 7 dígitos"),
    body("cliente.numero_identificacion")
        .trim()
        .notEmpty().withMessage("El numero de identificación es obligatorio")
        .isLength({min: 6}).withMessage("El número de identificación debe tener al menos 6 dígitos"),

    // validaciones para reserva
    body("reserva.paquete_id")
        .custom((value, { req }) => {
            if (!value && (!req.body.paquete || Object.keys(req.body.paquete).length === 0)) {
                throw new Error("El paquete es obligatorio");
            }
            return true;
        }),
];