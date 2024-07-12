import { readFile } from 'node:fs';

export const dataUser = (callback) => {
    readFile('pessoas.json', 'utf8', (err, data) => {
        if (err) {
            callback(err);
        } else {
            try {
                const livros = JSON.parse(data);
                callback(null, livros);
            } catch (error) {
                callback(error);
            }
        }
    });
};

export default dataUser;
