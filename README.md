
# Face Recognition Application

## Preview

![Alt Text](readme.gif)

---

## Software Description

This **web-based facial recognition application** is developed using **React** (frontend) and **Flask** (backend). It leverages **Dlib** and **OpenCV** for facial detection and recognition, and uses **MongoDB** to store encoded facial features and associated user information. The application allows users to upload images, detect faces, and compare them with known faces stored in the database, with all interactions taking place through a clean and modern web interface.

---

## Requirements

The following libraries and tools are required for the application:

### **Backend Requirements** (Flask):
``` 
- Flask
- opencv-python
- dlib
- numpy
- imutils
- pillow
- pymongo
```

Install them using:
```bash
pip install Flask opencv-python dlib numpy imutils pillow pymongo
```

### **Frontend Requirements** (React):
``` 
- React
- Axios
```

Install them using:
```bash
npm install react axios
```

---

## Key Features

- **Face Detection:** Detects faces in uploaded images using Flask and Dlib.
- **Face Recognition:** Matches detected faces with known faces stored in MongoDB.
- **Web Application:** User-friendly web interface built with React.
- **Database Integration:** Stores facial data and personal information in a MongoDB database.

---

## Application Functionalities

- **Upload Images:** Users can upload images through the React interface for face detection and recognition.
- **Analyze Faces:** Detected faces are matched against stored faces in MongoDB, and matching results are displayed in the frontend.
- **Known Faces Management:** Manage stored facial data, including personal details like name, ID, nationality, and more.
- **Interactive Frontend:** Built with React for dynamic rendering and a modern user experience.

---

## Usage Instructions

### **Step 1: Set Up the Backend**

1. Navigate to the backend directory and run the Flask application:
   ```bash
   python app.py
   ```
2. Ensure MongoDB is running to manage and retrieve facial data.

---

### **Step 2: Set Up the Frontend**

1. Navigate to the frontend directory and install dependencies:
   ```bash
   npm install
   ```
2. Start the React development server:
   ```bash
   npm start
   ```
3. Access the application at `http://localhost:3000`.

---

### **Step 3: Upload and Analyze Images**

1. Open the web application in your browser.
2. Use the **Upload Image** feature to select an image for analysis.
3. The application will:
   - Detect faces in the uploaded image.
   - Compare detected faces with stored known faces.
   - Display matching results, including personal information, if available.

---

## File Structure

```
face-recognition-app/
├── FaceRecog_Endpoints.py               # Flask server for face detection/recognition
├── requirements.txt 				      # Backend dependencies
├── pretrained_model/
│   ├── shape_predictor_68_face_landmarks.dat
│   ├── shape_predictor_5_face_landmarks.dat
│   └── dlib_face_recognition_resnet_model_v1.dat
├── face-recog-app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── KnownFaces.js       # Displays known faces
│   │   │   ├── InsertData.js       # Displays InsertData Formula
│   │   │   ├── Login.js       	  # Displays Login interface
│   │   │   ├── Navbar.js           # Displays Navbar 
│   │   │   ├── Signup.js           # Displays Signup interface
│   │   │   ├── Statistics.js       # Displays Statistics interface
│   │   │   ├── UploadImage.js      # Image upload interface
│   │   │   └── FaceInfo.js         # Displays recognized face details
│   │   ├── App.js                  # Main React application file
│   │   └── services/
│   │       └── api.js              # Axios requests to the Flask backend
│   ├── public/
│   │   ├── favicon.ico       		  # Icon for the Application
│   │   └── index.html              # React root template
│   └── package.json                # Frontend dependencies
│   ├── node_modules/
└── README.md
```

---

## Conclusion

This fully web-based application combines a React frontend and Flask backend to provide a powerful and user-friendly solution for facial recognition. MongoDB ensures efficient storage and management of facial data, making the system scalable and robust. Whether uploading new images for analysis or managing known faces, the application is designed to deliver a seamless experience.
