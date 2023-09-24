
export const getProducts = async (req, res, supabase) => {
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
}

export const modifyProduct = async (req, res, supabase) => {
    try {
        const productId = req.params.productId;
        const { name } = req.body;

        // Verifica se productId è un numero valido
        if (isNaN(productId)) {
            return res.status(400).json({ error: "L'ID del prodotto non è valido" });
        }

        // Verifica se il campo 'name' è presente nella richiesta
        if (!name) {
            return res.status(400).json({ error: "Il campo 'name' è obbligatorio" });
        }

        // Aggiorna il prodotto nel database Supabase
        const { data, error } = await supabase
            .from('Products')
            .update({ name })
            .eq('id', productId);

        if (error) {
            console.error("Errore durante l'aggiornamento del prodotto:", error);
            return res.status(500).json({ error: "Errore durante l'aggiornamento del prodotto" });
        }

        // Verifica se il prodotto è stato effettivamente aggiornato
        if (data && data.length === 0) {
            return res.status(404).json({ error: 'Prodotto non trovato' });
        }

        // Restituisci i dati aggiornati come risposta
        res.status(200).json({ data });

    } catch (err) {
        // Gestione degli errori generici
        console.error('Errore generico:', err);
        res.status(500).json({ error: 'Errore generico' });
    }
}

export const deleteProduct = async (req, res, supabase) => {
    try {
        const productId = req.params.productId;

        // Verifica se productId è un numero valido
        if (isNaN(productId)) {
            return res.status(400).json({ error: "L'ID del prodotto non è valido" });
        }

        // Aggiorna il campo 'isDeleted' del prodotto nel database Supabase
        const { data, error } = await supabase
            .from('Products')
            .update({ isDeleted: true })
            .eq('id', productId);

        if (error) {
            console.error('Errore durante la cancellazione del prodotto:', error);
            return res.status(500).json({ error: 'Errore durante la cancellazione del prodotto' });
        }

        // Verifica se il prodotto è stato effettivamente cancellato
        if (data && data.length === 0) {
            return res.status(404).json({ error: 'Prodotto non trovato' });
        }

        // Restituisci una risposta di successo
        res.status(200).json({ message: 'Prodotto cancellato con successo' });

    } catch (err) {
        // Gestione degli errori generici
        console.error('Errore generico:', err);
        res.status(500).json({ error: 'Errore generico' });
    }
}


export const createProduct = async (req, res, supabase) => {
    try {
        const { name } = req.body;

        // Verifica se il campo 'name' è presente nella richiesta
        if (!name) {
            return res.status(400).json({ error: "Il campo 'name' è obbligatorio" });
        }

        // Inserisci il nuovo prodotto nel database Supabase
        const { data, error } = await supabase
            .from('Products')
            .insert([{ name }]);

        if (error) {
            console.error("Errore durante l'inserimento del prodotto:", error);
            return res.status(500).json({ error: "Errore durante l'inserimento del prodotto" });
        }

        // Invia i dati del nuovo prodotto come risposta HTTP
        res.status(201).json({ data });

    } catch (err) {
        // Gestione degli errori generici
        console.error('Errore generico:', err);
        res.status(500).json({ error: 'Errore generico' });
    }
};