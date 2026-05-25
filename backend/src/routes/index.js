import { Router } from "express";

import cabinRouter from './cabin.routes.js';
import packageRouter from './packages.routes.js';
import productRouter from './products.routes.js';
import serviceRouter from './services.routes.js';
import reservationRouter from './reservations.routes.js';
import invoiceRouter from './invoices.routes.js';
import reviewsRouter from './reviews.routes.js';

const router = Router();

router.use('/cabins', cabinRouter);
router.use('/packages', packageRouter);
router.use('/products', productRouter);
router.use('/services', serviceRouter);
router.use('/reservations', reservationRouter);
router.use('/invoices', invoiceRouter);
router.use('/reviews', reviewsRouter);

export default router;