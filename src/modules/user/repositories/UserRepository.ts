import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../../../mysql';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

class UserRepository {
    create(request: Request, response: Response) {
        const { name, email, password } = request.body;

        pool.getConnection((err: any, connection: any) => {
            hash(password, 10, (err, hash) => {
                if(err) {
                    return response.status(500).json(err);
                }
                
                connection.query(
                    'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
                    [uuidv4(), name, email, hash],
                    (error: any, results: any, fields: any) => {
                        connection.release();
    
                        if(error) {
                            return response.status(400).json(error);
                        }
                        response.status(200).json({ message: 'Usuário criado com sucesso' });
                    }
                );
            }); 
        });
    }


    login(request: Request, response: Response) {
        const { email, password } = request.body;
        
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (error: any, results: any, fields: any) => {
                    connection.release();

                    if(error) {
                        return response.status(400).json({ error: 'Erro na sua autenticação' });
                    }

                    try {
                        compare(password, results[0].password, (err, result) => {
                            if(err) {                            
                                return response.status(400).json({ error: 'Erro na sua autenticação' });
                            }
                            
                            if(result) {
                                const token = sign({
                                    id: results[0].user_id,
                                    email: results[0].email
                                }, process.env.SECRET as string, { expiresIn: '1d' });
    
                                return response.status(200).json({ token: token, message: 'Autenticado com sucesso' });
                            } else {
                                response.status(400).json({ message: "Erro na autenticação" });
                            }
                        });
                    } catch(err) {
                        
                    }
                }
            );
        });
    }


    getUser(request: any, response: any) {
        const decode: any = verify(request.headers.authorization, process.env.SECRET as string);

        if(decode.email) {
            pool.getConnection((err: any, connection: any) => {
                connection.query(
                    'SELECT * FROM users WHERE email = ?',
                    [decode.email],
                    (err: any, results: any) => {
                        connection.release();

                        if(err) {
                            response.status(400).send({ error: err, response: null });
                        }

                        return response.status(201).send({
                            user: {
                                name: results[0].name,
                                email: results[0].email,
                                id: results[0].user_id
                            }
                        })
                    }
                );
            });
        }
    }


    deleteUser(request: Request, response: Response) {
        const { user_id } = request.params;
        
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'DELETE users, videos FROM users INNER JOIN videos WHERE users.user_id = ? and videos.user_id = ?',
                [user_id, user_id],
                (err: any, results: any) => {
                    connection.release();

                    if(err) {
                        return response.status(400).json(err);
                    }

                    response.status(200).json({ message: 'Usuário/vídeo(s) deletado(s) com sucesso' });
                }
            );
        });
    }
}

export { UserRepository };
