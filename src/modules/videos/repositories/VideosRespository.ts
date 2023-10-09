import { Request, Response } from 'express';
import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid';
import { verify } from 'jsonwebtoken';

class VideosRepository {
    create(request: any, response: any) {                
        const { title, description, user_id } = request.body;

        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'INSERT INTO videos (video_id, user_id, title, description, upload_date) VALUES (?,?,?,?,?)',
                [uuidv4(), user_id, title, description, new Date()],
                (err: any, results: any, fields: any) => {
                    connection.release();
                    if(err) {
                        return response.status(400).json(err);
                    }
                    response.status(200).json({ message: 'Vídeo criado com sucesso' });
                }
            );
        });
    }


    getVideos(request: Request, response: Response) {
        const { user_id } = request.params;

        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM videos WHERE user_id = ?',
                [user_id],
                (err: any, results: any) => {
                    connection.release();
                    if(err) {
                        response.status(400).json({ error: 'Erro ao buscar os vídeos' });
                    }
                    return response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results });
                }
            );
        });
    }


    getVideo(request: Request, response: Response) {
        const { video_id } = request.params;
        
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM videos WHERE video_id = ?',
                [video_id],
                (err: any, results: any) => {
                    connection.release();
                    
                    if(err) {
                        response.status(400).json({ message: 'Erro ao buscar vídeo' })
                    }

                    return response.status(200).json({ message: 'Vídeo retornado com sucesso', video: results[0] });
                }
            );
        });
    }
    

    searchVideos(request: Request, response: Response) {
        const { search } = request.query;

        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'SELECT * FROM videos WHERE title LIKE ?',
                [`%${search}%`],
                (err: any, results: any) => {
                    connection.release();
                    if(err) {
                        response.status(400).json({ error: 'Erro ao buscar os vídeos' });
                    }
                    return response.status(200).json({ message: 'Vídeos retornados com sucesso', videos: results });
                }
            );
        });
    }

    
    deleteVideo(request: Request, response: Response) {
        const { video_id } = request.params;
        
        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'DELETE FROM videos WHERE video_id = ?',
                [video_id],
                (err: any, results: any) => {
                    connection.release();

                    if(err) {
                        return response.status(400).json(err);
                    }

                    response.status(200).json({ message: 'Vídeo deletado com sucesso' });
                }
            );
        });
    }

    updateVideo(request: Request, response: Response) {
        const { video_id, title, description } = request.body;

        pool.getConnection((err: any, connection: any) => {
            connection.query(
                'UPDATE videos SET title = ?, description = ? WHERE video_id = ?',
                [title, description, video_id],
                (err: any, results: any) => {
                    connection.release();

                    if(err) {
                        return response.status(400).json(err);
                    }

                    response.status(200).json({ message: 'Vídeo editado com sucesso' });
                }
            );
        });
    };
}

export { VideosRepository };
