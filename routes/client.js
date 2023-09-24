export const getClientProducts = async (req, res, supabase) => {
    try {
        const { idClient } = req.params
        let { data, error } = await supabase
            .from('ProductClientDay')
            .select(`
                dayOfWeek,
                qnt,
                Clients (
                    id,
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
}

export const getClients = async (req, res, supabase) => {
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
}