from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt  # Password hashing library
from pymongo import MongoClient
import cv2
import dlib
import base64
import numpy as np
from PIL import Image
from io import BytesIO
from imutils import face_utils
from bson import ObjectId
import traceback

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Secret key for session management
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
bcrypt = Bcrypt(app)

# Initialize dlib models
pose_predictor_68_point = dlib.shape_predictor("pretrained_model/shape_predictor_68_face_landmarks.dat")
face_encoder = dlib.face_recognition_model_v1("pretrained_model/dlib_face_recognition_resnet_model_v1.dat")
face_detector = dlib.get_frontal_face_detector()

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['face_database']
collection = db['faces']
users_collection = db['users']  # New collection for users

# User registration (signup) route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # Default role is 'user' if not specified

    if not all([username, password, role]):
        return jsonify({'status': 'error', 'message': 'Missing fields.'}), 400

    # Check if username already exists
    if users_collection.find_one({'username': username}):
        return jsonify({'status': 'error', 'message': 'Username already exists.'}), 409

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Insert new user
    users_collection.insert_one({
        'username': username,
        'password': hashed_password,
        'role': role
    })

    return jsonify({'status': 'success', 'message': 'User registered successfully.'})

# User login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({'status': 'error', 'message': 'Missing fields.'}), 400

    user = users_collection.find_one({'username': username})

    if user and bcrypt.check_password_hash(user['password'], password):
        session['username'] = username
        session['role'] = user['role']
        response = jsonify({'status': 'success', 'message': 'Login successful.', 'role': user['role']})

        # Add CORS headers explicitly
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    else:
        return jsonify({'status': 'error', 'message': 'Invalid credentials.'}), 401

# Logout route
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 'success', 'message': 'Logged out successfully.'})

# Helper decorator for role-based access control
from functools import wraps

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'username' not in session:
                return jsonify({'status': 'error', 'message': 'Login required.'}), 401
            if session.get('role') != role:
                return jsonify({'status': 'error', 'message': 'Unauthorized access.'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Example protected route for admin-only access
@app.route('/admin_only', methods=['GET'])
@role_required('admin')
def admin_only():
    return jsonify({'status': 'success', 'message': 'Welcome, Admin!'})

# Transform function for face coordinates
def transform(image, face_locations):
    coord_faces = []
    for face in face_locations:
        rect = face.top(), face.right(), face.bottom(), face.left()
        coord_face = max(rect[0], 0), min(rect[1], image.shape[1]), min(rect[2], image.shape[0]), max(rect[3], 0)
        coord_faces.append(coord_face)
    return coord_faces

# Encode face function
def encode_face(image):
    if len(image.shape) == 2 or image.shape[2] == 1:
        image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
    elif image.shape[2] == 4:
        image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
    elif image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    face_locations = face_detector(image, 1)
    face_encodings_list = []
    landmarks_list = []

    for face_location in face_locations:
        shape = pose_predictor_68_point(image, face_location)
        face_encodings_list.append(np.array(face_encoder.compute_face_descriptor(image, shape, num_jitters=1)))
        shape = face_utils.shape_to_np(shape)
        landmarks_list.append(shape)

    face_locations = transform(image, face_locations)
    return face_encodings_list, face_locations, landmarks_list

#detect_and_crop_face function
def detect_and_crop_face(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_detector(gray)
    cropped_faces = []
    face_coords = []

    for face in faces:
        (x, y, w, h) = (face.left(), face.top(), face.width(), face.height())
        cropped_face = image[y:y + h, x:x + w]
        cropped_faces.append(cropped_face)
        face_coords.append((x, y, w, h))  # Save face coordinates

    return cropped_faces, face_coords


# Face recognition function with score calculation
def easy_face_reco(frame, known_face_encodings, known_faces_info):
    rgb_small_frame = frame[:, :, ::-1]  # Convert BGR to RGB
    face_encodings_list, face_locations_list, landmarks_list = encode_face(rgb_small_frame)
    face_infos = []
    tolerance = 0.55  # Set tolerance for matching
    matching_scores = []  # List to store the matching scores

    for face_encoding in face_encodings_list:
        if len(face_encoding) == 0:
            return frame, []

        # Calculate distances between uploaded face and known faces
        vectors = np.linalg.norm(known_face_encodings - face_encoding, axis=1)

        match_indices = [idx for idx, vector in enumerate(vectors) if vector <= tolerance]

        for idx in match_indices:
            face_info = known_faces_info[idx]
            face_info['matching_score'] = round(vectors[idx], 3)  # Save the matching score (distance)
            face_infos.append(face_info)
            matching_scores.append(vectors[idx])  # Add matching score

        if not match_indices:
            face_infos.append(None)

    for (top, right, bottom, left), name in zip(face_locations_list, face_infos):
        # Draw rectangle around the face
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.rectangle(frame, (left, bottom - 30), (right, bottom), (0, 255, 0), cv2.FILLED)

       # Handle name being None, string, or dictionary
        if isinstance(name, dict):
            display_name = name.get('name', "Unknown")
        elif isinstance(name, str):
            display_name = name
        else:
            display_name = "Unknown"
        cv2.putText(frame, display_name, (left + 2, bottom - 2), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 0), 1)

    for shape in landmarks_list:
        for (x, y) in shape:
            cv2.circle(frame, (x, y), 1, (255, 0, 255), -1)

    return frame, face_infos



@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'status': 'error', 'message': 'No image file provided.'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected image file.'}), 400

    image_bytes = image_file.read()
    image = np.asarray(Image.open(BytesIO(image_bytes))).copy()  # Ensure the image is writable

    if image is None:
        return jsonify({'status': 'error', 'message': 'Unable to load image.'}), 400

    # Convert uploaded image to base64 string
    _, img_encoded = cv2.imencode('.jpg', image)
    uploaded_image_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')

    # Perform face recognition and process image
    cursor = collection.find({})
    known_face_encodings = []
    known_faces_info = []  # Store the IDs and additional information of the known faces

    for doc in cursor:
        image_blob = doc.get('image', None)
        if image_blob is not None:
            try:
                image_blob_bytes = base64.b64decode(image_blob)
                image_array = np.frombuffer(image_blob_bytes, np.uint8)
                image_db = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

                if image_db is None or image_db.size == 0:
                    print("Error: Image is empty or could not be decoded.")
                    continue

                encodings = encode_face(image_db)[0]
                if encodings:
                    known_face_encodings.extend(encodings)
                    known_faces_info.append({
                        'id': str(doc.get('_id')),
                        'name': doc.get('name'),
                        'family_name': doc.get('family_name'),
                        'id_card': doc.get('id_card'),
                        'passport_number': doc.get('passport_number'),
                        'nationality': doc.get('nationality'),
                        'sex': doc.get('sex'),
                        'date_of_birth': doc.get('date_of_birth'),
                        'expiration_date': doc.get('expiration_date'),
                        'country_code': doc.get('country_code'),
                        'phone_number': doc.get('phone_number'),
                        'status': doc.get('status'),
                        'notes': doc.get('notes'),
                        'image': image_blob  # Include the base64 image directly
                    })
    
            except Exception as e:
                print(f"Error processing image: {e}")
                continue

    # Perform face recognition and calculate matching scores
    image, matched_faces_info = easy_face_reco(image, np.array(known_face_encodings), known_faces_info)


    # Convert processed image to base64 string
    _, img_encoded = cv2.imencode('.jpg', image)
    processed_image_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')

    return jsonify({
        'status': 'success',
        'message': 'Image processed successfully.',
        'matched_faces_info': matched_faces_info,  # Return matched face info and matching scores
        'uploaded_image': uploaded_image_base64,
        'processed_image': processed_image_base64
    })




@app.route('/insert_data', methods=['POST'])
def insert_data():
    data = request.form
    name = data.get('name')
    family_name = data.get('family_name')
    id_card = data.get('id_card')
    passport_number = data.get('passport_number')
    nationality = data.get('nationality')
    sex = data.get('sex')
    date_of_birth = data.get('date_of_birth')
    expiration_date = data.get('expiration_date')
    phone_number = data.get('phone_number')
    country_code = data.get('country_code')
    status = data.get('status')
    notes = data.get('notes')
    image = request.files.get('image')

    if not all([name, family_name, id_card, passport_number, nationality, sex, date_of_birth, expiration_date, phone_number, country_code]):
        return jsonify({'status': 'error', 'message': 'Missing required fields.'}), 400

    # Process image
    if image:
        image_bytes = image.read()
        np_image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
        
        # Detect and crop face(s)
        cropped_faces, face_coords = detect_and_crop_face(np_image)

        if cropped_faces:
            face_encodings = []
            for cropped_face in cropped_faces:
                # Encode the cropped face
                face_encoding, _, _ = encode_face(cropped_face)
                if isinstance(face_encoding, list):
                    face_encoding = np.array(face_encoding)
                    face_encodings.append(face_encoding.tolist())
                else:
                    face_encodings.append(None)

            # Encode and save the first cropped face image
            if cropped_faces:
                _, img_encoded = cv2.imencode('.jpg', cropped_faces[0])
                image_blob = base64.b64encode(img_encoded.tobytes()).decode('utf-8')
            else:
                image_blob = None
        else:
            image_blob = None
            face_encodings = []

    else:
        image_blob = None
        face_encodings = []

    result = collection.insert_one({
        'name': name,
        'family_name': family_name,
        'id_card': id_card,
        'passport_number': passport_number,
        'nationality': nationality,
        'sex': sex,
        'date_of_birth': date_of_birth,
        'expiration_date': expiration_date,
        'phone_number': phone_number,
        'country_code': country_code,
        'status': status,
        'notes': notes,
        'image': image_blob,
        'encoding': face_encodings
    })

    return jsonify({'status': 'success', 'message': 'Data inserted successfully.', 'inserted_id': str(result.inserted_id)})



@app.route('/load_known_faces', methods=['GET'])
def load_known_faces():
    cursor = collection.find({})
    known_face_encodings = []
    known_face_names = []

    for document in cursor:
        name = document.get('name', 'Unknown')
        image_blob = document.get('image', None)
        image_base64 = None
        
        if image_blob is not None:
            # Decode the base64 string to bytes
            try:
                image_bytes = base64.b64decode(image_blob)
                image_array = np.frombuffer(image_bytes, np.uint8)
                image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

                if image is None or image.size == 0:
                    print("Error: Image is empty or could not be decoded.")
                    continue
                
                _, img_encoded = cv2.imencode('.jpg', image)
                image_base64 = base64.b64encode(img_encoded.tobytes()).decode('utf-8')

                # Extract face encodings
                face_encodings_list, _, _ = encode_face(image)
                for face_encoding in face_encodings_list:
                    known_face_encodings.append(face_encoding.tolist())

            except Exception as e:
                print(f"Error processing image: {e}")
                continue

        # Add the _id field to the response and convert ObjectId to string
        known_face_names.append({
            
            'name': name,
            'family_name': document.get('family_name', 'Unknown'),
            'id_card': document.get('id_card', 'Unknown'),
            'passport_number': document.get('passport_number', 'Unknown'),
            'nationality': document.get('nationality', 'Unknown'),
            'sex': document.get('sex', 'Unknown'),
            'date_of_birth': document.get('date_of_birth', 'Unknown'),
            'expiration_date': document.get('expiration_date', 'Unknown'),
            'country_code': document.get('country_code', 'Unknown'),
            'phone_number': document.get('phone_number', 'Unknown'),
            'status': document.get('status', 'Unknown'),
            'notes': document.get('notes', 'Unknown'),
            'image': image_base64
        })

    return jsonify({
        'status': 'success',
        'message': 'Known faces loaded successfully.',
        'face_encodings': known_face_encodings,
        'face_names': known_face_names
    })


@app.route('/get_statistics', methods=['GET'])
def get_statistics():
    try:
        # Basic counts
        user_count = users_collection.count_documents({})
        face_count = collection.count_documents({})
        
        # Additional statistics calculations
        male_count = collection.count_documents({'sex': 'male'})
        female_count = collection.count_documents({'sex': 'female'})
        
        # Status-based statistics
        status_summary = collection.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ])
        status_counts = {item["_id"]: item["count"] for item in status_summary}

        # Nationality distribution
        nationality_summary = collection.aggregate([
            {"$group": {"_id": "$nationality", "count": {"$sum": 1}}}
        ])
        nationality_counts = {item["_id"]: item["count"] for item in nationality_summary}

        # Age distribution (approximate calculation based on date of birth)

        # Construct the statistics dictionary
        statistics = {
            'total_users': user_count,
            'total_faces': face_count,
            'gender_distribution': {
                'male': male_count,
                'female': female_count,
            },
            'status_counts': status_counts,
            'nationality_counts': nationality_counts,
            'message': 'Statistics retrieved successfully.'
        }

        return jsonify({
            'status': 'success',
            'statistics': statistics
        })
    except Exception as e:
        # Print the traceback for debugging
        print("Error in /get_statistics endpoint:", e)
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/update_face_status', methods=['POST'])
def update_face_status():
    try:
        data = request.json
        id_card = data.get('id_card')  # Use id_card instead of face_id
        status = data.get('status')

        # Debugging to confirm payload
        print("Received Payload:", data)
        print("Extracted id_card:", id_card, "Status:", status)

        if not all([id_card, status]):
            print("Missing id_card or status.")  # Debug
            return jsonify({'status': 'error', 'message': 'Missing id_card or status.'}), 400

        # Ensure id_card exists in the database
        result = collection.update_one({'id_card': id_card}, {'$set': {'status': status}})
        if result.matched_count == 0:
            print("id_card not found.")  # Debug
            return jsonify({'status': 'error', 'message': 'id_card not found.'}), 404

        return jsonify({'status': 'success', 'message': 'Face status updated successfully.'})
    except Exception as e:
        print("Exception:", str(e))  # Debug
        traceback.print_exc()
        return jsonify({'status': 'error', 'message': 'Could not update face status.'}), 500




    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)
