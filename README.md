# Face recognition Application

#### Preview

![Alt Text](readme.gif)


## Software description

This project is a facial recognition application built with Python, OpenCV, Dlib, and PyQt5. It detects faces in images, encodes the facial features, and stores them in a MongoDB database. The application also provides a GUI to analyze new images and recognize faces based on the stored data.

##  Requirements
These libraries have been installed and embedded in the project:
``` 
- opencv
- dlib
- numpy
- imutils
- pillow
- PyMongo
- PyQT5
```
You can install them with the following command:
    ``` > pip install opencv-python dlib numpy imutils pillow pymongo PyQt5 ```


## Important

You can update the database with images of people you wish to detect and recognize. Make sure that the images are cropped to contain only the faces.

Images must be in ".jpg" or ".png" format.

### Application Functionalities

```
- Face detection
- Face recognition
- Desktop application with graphical user interface
- Non-relational database (No-SQL) to store known faces and associated information
```

## Usage

**Create and Populate the Database**

To load known faces into the application, enter the required information: Last name, First name, ID card number and then click on the button to insert the face into the database. 

**Using the facial recognition application**

The application will automatically load known faces from the MongoDB database, and you can then analyze an image by clicking on the “Load image for analysis” button. Select an image to analyze and the application will detect and recognize the faces in the image, comparing them with the known faces loaded from the database.

It will then save the cropped faces in the following directory:
    ``` C:\Users\ROG\Desktop\reconaissance_faciale-master\reconaissance_faciale-master\Cropped_Image```


**Launch the Application**

Run the script to create the database and insert faces:
```
> python insert_data_app.py
```

Run the facial recognition application with the following command: 
```
> python facial_recog_app.py
```

**Using the Application**

1-The application automatically loads known faces from the database.

2-Click on “Load image for analysis” to select an image for analysis.

3-The application detects and recognizes faces in the selected image, comparing them with known faces stored in the database.

**File Structure**

reconaissance_faciale-master/
├── pretrained_model/
│   ├── shape_predictor_68_face_landmarks.dat
│   ├── shape_predictor_5_face_landmarks.dat
│   └── dlib_face_recognition_resnet_model_v1.dat
├── Cropped_Image/
│   └── cropped_ahmed_elamri_0.jpg  # Example for cropped image's name
├── FaceRecog_Endpoints.py
├── insert_data_app.py
├── facial_recog_app.py
└── README.md

**Conclusion**

This guide shows you how to set up and use the facial recognition application without writing scripts. Using MongoDB Compass, you can easily create, populate and manage your database of known faces, and the application will use this data to recognize faces in new images.