// Paciência e uma boa prova. Que a Força esteja com você!
import { v4 as uuidv4 } from 'uuid'
import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs'
import { dataUser } from './dataUser.js'

const port = 4444;

const server = createServer((request, response) => {
    const { url, method } = request

    if (method === 'GET' && url === '/livros') {
        dataUser((err, livros) => {
            if (err) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Não é possível visualizar nenhum livro' }))
            }
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(livros))
        });
    
    } else if (method === 'GET' && url === '/editoras') {
        dataUser((err, livros) => {
            if (err) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Não é possível visualizar nenhuma editora' }))
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify(livros));
        });

    } else if (method === 'POST' && url === '/livros') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk
        });
        request.on('end', () => {
            const novoLivro = JSON.parse(body)

            dataUser((err, livros) => {
                if (err) {
                    response.writeHead(400, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Não foi possível ler o arquivo' }))
                    return;
                }
                novoLivro.id = uuidv4()

                const livroJaCadastrado = livros.find((livro) => livro.titulo === novoLivro.titulo)
                if (livroJaCadastrado) {
                    response.writeHead(400, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Título já cadastrado' }))
                    return;
                }

                livros.push(novoLivro);

                writeFile('pessoas.json', JSON.stringify(livros, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ message: 'Erro ao salvar um novo título' }))
                        return;
                    }
                    response.writeHead(201, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify(novoLivro));
                });
            });
        });
        
    } else if (method === 'POST' && url === '/autores') {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const novoAutor = JSON.parse(body)

            dataUser((err, autores) => {
                if (err) {
                    response.writeHead(400, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Não foi possível ler o arquivo' }))
                    return
                }
                novoAutor.id = uuidv4()

                const autorJaCadastrado = autores.find((autor) => autor.nome === novoAutor.nome)
                if (autorJaCadastrado) {
                    response.writeHead(400, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Autor já cadastrado' }))
                    return;
                }

                autores.push(novoAutor)

                writeFile('pessoas.json', JSON.stringify(autores, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Erro ao salvar um novo autor' }))
                        return;
                    }
                    response.writeHead(201, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify(novoAutor))
                });
            });
        });
    } else if (method === 'POST' && url === '/editoras') {
        let body = ''
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const novaEditora = JSON.parse(body)

            dataUser((err, editoras) => {
                if (err) {
                    response.writeHead(400, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Não foi possível ler o arquivo' }))
                    return;
                }
                novaEditora.id = uuidv4();

                const editoraJaCadastrada = editoras.find((editora) => editora.nome === novaEditora.nome)
                if (editoraJaCadastrada) {
                    response.writeHead(400, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Editora já cadastrada' }))
                    return;
                }

                editoras.push(novaEditora);

                writeFile('pessoas.json', JSON.stringify(editoras, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ message: 'Erro ao salvar uma nova editora' }));
                        return;
                    }
                    response.writeHead(201, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(novaEditora));
                });
            });
        });
    } else if (method === 'GET' && url.startsWith('/livros/')) {
        const id = url.split('/')[2];
        dataUser((err, livros) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Erro ao ler dados' }));
                return;
            }
            const livro = livros.find((l) => l.id === id);

            if (!livro) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'ID não encontrado' }));
                return;
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(livro));
        });
    } else if (method === 'PUT' && url.startsWith('/editoras/')) {
        const id = url.split('/')[2];
        let body = '';
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => {
            const newData = JSON.parse(body);
            dataUser((err, editoras) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Erro ao ler dados' }));
                    return;
                }
                const index = editoras.findIndex((editora) => editora.id === id);

                if (index === -1) {
                    response.writeHead(404, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Editora não encontrada' }));
                    return;
                }

                editoras[index] = { ...editoras[index], ...newData };

                writeFile('pessoas.json', JSON.stringify(editoras, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ message: 'Erro ao salvar dados' }));
                        return;
                    }
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(editoras[index]));
                });
            });
        });
    } else if (method === 'DELETE' && url.startsWith('/autores/')) {
        const id = url.split('/')[2];
        dataUser((err, livros) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'Erro ao ler dados' }));
                return;
            }
            const livro = livros.find((l) => l.id === id);

            if (!livro) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'livro nao encontrado' }));
                return;
            }

            const livroIndex = livro.autor.findIndex((autor) => autor.id === id);

            if (livroIndex === -1) {
                response.writeHead(404, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'livro nao encontrado' }));
                return;
            }

            livro.autor.splice(autorIndex, 1);

            writeFile('pessoas.json', JSON.stringify(livros, null, 2), (err) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Erro ao salvar dados' }));
                    return;
                }
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'livro deletado' }));
            });
        });
    } else {
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Rota nao encontrada' }));
    }
});

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});