import bodyParser from "body-parser";
import { createClient } from '@supabase/supabase-js'
import express from 'express';
import morgan from 'morgan';

// Carica le variabili d'ambiente dal file .env
const app = express();

// using morgan for logs
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabase = createClient(
    'https://naogstaeavbglbjavpcm.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hb2dzdGFlYXZiZ2xiamF2cGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUyOTM4NTEsImV4cCI6MjAxMDg2OTg1MX0.1MYpR9_Cw01VOTXH_Ae3CKaQwwvYXRVW4GQml9K-jOM',
);


// Crea un singolo client Supabase per interagire con il tuo database
app.get("/clients/:idClient/products", async (req, res) => {
    try {
        const { idClient } = req.params
        let { data, error } = await supabase
            .from('ProductClientDay')
            .select(`
                dayOfWeek,
                Clients (
                    name
                ),
                Products (
                    name
                )
            `)
            .filter("idClient", "eq", idClient.toString())

        // Invia i dati come risposta HTTP
        res.json({ data });

    } catch (err) {
        // Gestione degli errori generici
        console.error('Errore generico:', err);
        res.status(500).json({ error: 'Errore generico' });
    }
});

app.get("/clients", async (req, res) => {
    try {
        let { data, error } = await supabase
            .from('Clients')
            .select()

        // Invia i dati come risposta HTTP
        res.json({ data });

    } catch (err) {
        // Gestione degli errori generici
        console.error('Errore generico:', err);
        res.status(500).json({ error: 'Errore generico' });
    }
});

app.get("/products", async (req, res) => {
    try {
        let { data, error } = await supabase
            .from('Products')
            .select()

        // Invia i dati come risposta HTTP
        res.json({ data });

    } catch (err) {
        // Gestione degli errori generici
        console.error('Errore generico:', err);
        res.status(500).json({ error: 'Errore generico' });
    }
});


app.listen(8080, () => {
    console.log("Running on port 8080.");
});

// Esporta l'applicazione Express
export default app;
