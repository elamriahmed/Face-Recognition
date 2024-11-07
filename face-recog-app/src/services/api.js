import axios from 'axios';

const API_URL = 'http://localhost:8001';

export const uploadImage = (image) => {
    const formData = new FormData();
    formData.append('image', image);

    return axios.post(`${API_URL}/upload_image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const loadKnownFaces = () => {
    return axios.get(`${API_URL}/load_known_faces`);
};
