import { Router } from 'express';
import { VideosRepository } from '../modules/videos/repositories/VideosRespository';
import { login } from '../middlewares/login';

const videosRoutes = Router();
const videosRepository = new VideosRepository();

videosRoutes.post('/create-video', login, (request, response) => {
    videosRepository.create(request, response);
});

videosRoutes.get('/get-videos/:user_id', (request, response) => {
    videosRepository.getVideos(request, response);
});

videosRoutes.get('/get-video/:video_id', (request, response) => {
    videosRepository.getVideo(request, response);
});

videosRoutes.get('/search', (request, response) => {
    videosRepository.searchVideos(request, response);
});

videosRoutes.post('/update-video', login, (request, response) => {
    videosRepository.updateVideo(request, response);
});

videosRoutes.delete('/delete/:video_id', login, (request, response) => {
    videosRepository.deleteVideo(request, response);
});

export { videosRoutes };
