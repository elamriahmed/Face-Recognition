import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; // Framer Motion for animations
import FaceInfoList from './FaceInfo'; // Import the FaceInfoList component
import './UploadImage.css'; // Optional for custom CSS

const UploadImage = () => {
    const [faceInfos, setFaceInfos] = useState([]);
    const [processedImage, setProcessedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        // Show preview of uploaded image
        setPreviewImage(URL.createObjectURL(file));
        setErrorMessage('');
        setLoading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:8001/upload_image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setFaceInfos(data.matched_faces_info || []);
                setProcessedImage(data.processed_image || null);

                if (!data.matched_faces_info || data.matched_faces_info.length === 0) {
                    setErrorMessage('No matches found for the uploaded image.');
                }
            } else {
                setErrorMessage('Failed to upload image.');
            }
        } catch (error) {
            setErrorMessage('Error uploading image: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center" style={{ textAlign: "center" }}>
                    Upload Your Image
                </h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                        setPreviewImage(null); // Clear preview when selecting a new file
                        handleFileUpload(event);
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />

                {/* Image Preview */}
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <h4 className="text-lg font-medium text-gray-700 mb-2" style={{ textAlign: "center" }}>Uploaded Image Preview</h4>
                        <img src={previewImage} alt="Uploaded preview" className="rounded-lg shadow-md" />
                    </motion.div>
                )}

                {/* Loading Indicator */}
                {loading && (
                    <motion.div
                        className="flex items-center justify-center mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <svg
                            className="animate-spin h-8 w-8 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                        <p className="ml-4 text-blue-500">Processing image, please wait...</p>
                    </motion.div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 mt-4"
                    >
                        {errorMessage}
                    </motion.p>
                )}

                {/* Display Matched Faces Info */}
                <div className="mt-6">
                    <FaceInfoList faceInfos={faceInfos} processedImage={processedImage} />
                </div>
            </motion.div>
        </div>
    );
};

export default UploadImage;
