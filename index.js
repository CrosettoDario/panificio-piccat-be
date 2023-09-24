import { } from 'dotenv/config';

import { createProduct, deleteProduct, getProducts, modifyProduct } from "./routes/product.js";
import { getClientProducts, getClients } from "./routes/client.js";
import { login, register } from './routes/auth.js';

import bodyParser from "body-parser";
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import morgan from 'morgan';
import { verifyToken } from './routes/middleware.js';

// Genera una chiave segreta casuale di 32 byte (256 bit)

// Carica le variabili d'ambiente dal file .env
const app = express();

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const supabase = createClient(
    'https://naogstaeavbglbjavpcm.supabase.co',
    process.env.SUPABASE_KEY,
);


// Crea un singolo client Supabase per interagire con il tuo database
app.get("/clients/:idClient/products", verifyToken, async (req, res) => {
    await getClientProducts(req, res, supabase)
});

app.get("/clients", verifyToken, async (req, res) => {
    await getClients(req, res, supabase)
});

app.get("/products", verifyToken ,async (req, res) => {
    await getProducts(req, res, supabase)
});

app.put("/products/:productId", verifyToken, async (req, res) => {
    await modifyProduct(req, res, supabase)
});

app.delete("/products/:productId", verifyToken, async (req, res) => {
    await deleteProduct(req, res, supabase)
});


app.post("/products", verifyToken, async (req, res) => {
    await createProduct(req, res, supabase)
});

app.post("/register", async (req, res) => {
    await register(req, res, supabase)
});

// Login
app.post("/login", async (req, res) => {
    await login(req, res, supabase)
});

app.listen(8080, () => {
    console.log("Running on port 8080.");
});

// Esporta l'applicazione Express
export default app;
