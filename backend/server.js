import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import routes from './src/routes/index.js';

app.use('/api', routes);

const PORT = 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Servidor corriendo en puerto ${PORT}`)
});