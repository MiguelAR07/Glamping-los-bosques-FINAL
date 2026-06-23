import { Router } from "express";

import cabinRouter from './cabin.routes.js';
import packageRouter from './packages.routes.js';
import productRouter from './products.routes.js';
import serviceRouter from './services.routes.js';
import reservationRouter from './reservations.routes.js';
import invoiceRouter from './invoices.routes.js';
import reviewsRouter from './reviews.routes.js';
import promocionesRouter from './promociones.routes.js';
import availabilityRouter from './availability.routes.js';
import cuentasBancariasRouter from './cuentasBancarias.routes.js';

const router = Router();

router.use('/cabins', cabinRouter);
router.use('/packages', packageRouter);
router.use('/products', productRouter);
router.use('/services', serviceRouter);
router.use('/reservations', reservationRouter);
router.use('/invoices', invoiceRouter);
router.use('/reviews', reviewsRouter);
router.use('/promociones', promocionesRouter);
router.use('/availability', availabilityRouter);
router.use('/cuentas-bancarias', cuentasBancariasRouter);

export default router;