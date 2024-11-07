import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './InsertData.css'; // Optional CSS for adjustments

const InsertData = () => {
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    id_card: '',
    passport_number: '',
    nationality: '',
    sex: '',
    date_of_birth: '',
    expiration_date: '',
    phone_number: '',
    country_code: '',
    status: '',
    notes: ''
  });

  const [image, setImage] = useState(null);
  const [insertedData, setInsertedData] = useState(null);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Show success or error notification
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  // Submit form data to the server
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData();

    // Append all form data
    for (const key in formData) {
      form.append(key, formData[key]);
    }
    if (image) {
      form.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:8001/insert_data', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        setInsertedData(response.data); // Display the inserted data
        notifySuccess('Data inserted successfully!'); // Success notification
      } else {
        notifyError('Error occurred while inserting data.'); // Error notification
      }
    } catch (error) {
      console.error('Error:', error);
      notifyError('Error occurred while inserting data.'); // Error notification
    }
  };

  return (
    <div className="font-[sans-serif]">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Title Section */}
      <div className="text-center py-6">
        <h4 className="text-3xl font-bold text-gray-800">Insert Data Form</h4>
      </div>

      {/* Form Container */}
      <div className="mx-4 mb-4">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] sm:p-8 p-4 rounded-md"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form Fields */}
            {[
              { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter Name' },
              { label: 'Family Name', name: 'family_name', type: 'text', placeholder: 'Enter Family Name' },
              { label: 'ID Card', name: 'id_card', type: 'text', placeholder: 'Enter ID Card Number' },
              { label: 'Passport Number', name: 'passport_number', type: 'text', placeholder: 'Enter Passport Number' },
              { label: 'Nationality', name: 'nationality', type: 'text', placeholder: 'Enter Nationality' },
              { label: 'Phone Number', name: 'phone_number', type: 'text', placeholder: 'Enter Phone Number' },
              { label: 'Country Code', name: 'country_code', type: 'text', placeholder: 'Enter Country Code' },
              { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
              { label: 'Expiration Date', name: 'expiration_date', type: 'date' }
            ].map((field, index) => (
              <div key={index}>
                <label className="text-gray-800 text-sm mb-2 block">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-500 transition-all"
                />
              </div>
            ))}

            {/* Sex Field */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-500 transition-all"
              >
                <option value="">Select Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Status Field */}
            <div>
  <label className="text-gray-800 text-sm mb-2 block">Status</label>
  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-500 transition-all"
  >
    <option value="">Select Status</option>
    <option value="in_process">In Process</option>
    <option value="validated">Validated</option>
    <option value="refused">Refused</option>
    {/* Add other statuses as needed */}
  </select>
</div>

            {/* File Input */}
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Upload Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-500 transition-all"
              />
            </div>

            {/* Notes Textarea */}
            <div className="md:col-span-2">
              <label className="text-gray-800 text-sm mb-2 block">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="bg-gray-100 focus:bg-transparent w-full text-sm text-gray-800 px-4 py-3 rounded-md outline-blue-500 transition-all"
                placeholder="Additional Notes"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="py-3 px-6 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Submit Data
            </button>
          </div>
        </form>
      </div>

      {/* Inserted Data Display */}
      {insertedData && (
        <div className="mx-4 my-8 max-w-4xl mx-auto bg-white shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] p-6 rounded-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Inserted Data:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {Object.entries(insertedData).map(([key, value]) => {
              if (key === 'image') {
                return (
                  <li key={key} className="mb-2">
                    <strong>Image:</strong>
                    <img
                      src={`data:image/jpeg;base64,${value}`}
                      alt="Inserted"
                      className="w-32 h-32 object-cover mt-2 rounded-md"
                    />
                  </li>
                );
              }
              return (
                <li key={key} className="mb-2">
                  <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InsertData;
