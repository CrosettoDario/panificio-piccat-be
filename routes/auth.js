import { } from "dotenv"
import { } from 'dotenv/config';

import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';

export const register = async (req, res, supabase) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Query Supabase per verificare se l'utente esiste già
        const { data: existingUser, error } = await supabase
            .from('Users')
            .select('id')
            .eq('email', email);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Errore nel controllo dell\'utente esistente' });
        }

        if (existingUser && existingUser.length > 0) {
            return res.status(409).json({ error: 'L\'utente esiste già. Effettua il login.' });
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const { data, error: registrationError } = await supabase
            .from('Users')
            .insert([{ email, password: encryptedPassword }]);

        if (registrationError) {
            console.error(registrationError);
            return res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
        }

        const { data: newUser, error: fetchUserError } = await supabase
            .from('Users')
            .select()
            .eq('email', email);

        if (fetchUserError) {
            console.error(fetchUserError);
            return res.status(500).json({ error: 'Errore durante la fetch dell\'utente' });
        }


        console.log(newUser)

        // Create token
        const token = jwt.sign(
            { user_id: newUser.id, email },
            process.env.JWT_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        // return new user
        res.status(201).json({
            email: email,
            token: token,
            id: newUser.id
        });
    } catch (err) {
        console.log(err);
    }
}

export const login = async (req, res, supabase) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const { data: user, error } = await supabase
            .from('Users')
            .select('id, password')
            .eq('email', email);

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Errore nel controllo dell\'utente esistente' });
        }
        
        if (user && (await bcrypt.compare(password, user[0].password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.JWT_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json({
                email: email,
                token: token,
                id: user.id
            });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
}