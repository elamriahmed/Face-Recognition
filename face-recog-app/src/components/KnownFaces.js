import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEye, FaTimes } from 'react-icons/fa';

const KnownFaces = () => {
  const [knownFaces, setKnownFaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNationality, setFilterNationality] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFace, setSelectedFace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const facesPerPage = 3;

  useEffect(() => {
    axios
      .get('http://localhost:8001/load_known_faces')
      .then((response) => {
        if (response.data.status === 'success') {
          setKnownFaces(response.data.face_names);
        } else {
          console.error('Error loading known faces:', response.data.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading known faces:', error);
        setIsLoading(false);
      });
  }, []);

  const filteredFaces = knownFaces.filter((face) =>
    face.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterNationality === '' || face.nationality === filterNationality)
  );

  const indexOfLastFace = currentPage * facesPerPage;
  const indexOfFirstFace = indexOfLastFace - facesPerPage;
  const currentFaces = filteredFaces.slice(indexOfFirstFace, indexOfLastFace);
  const totalPages = Math.ceil(filteredFaces.length / facesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const openModal = (face) => {
    setSelectedFace(face);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      <center>
        <h2 className="text-3xl font-semibold text-indigo-600 mb-6">
          Known Faces
        </h2>
      </center>

      {/* Filters and Search */}
      <div className="mb-6 flex justify-between">
        <select
          className="border p-2 rounded-lg w-64"
          value={filterNationality}
          onChange={(e) => setFilterNationality(e.target.value)}
        >
          <option value="">All Nationalities</option>
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
        </select>

        <input
          type="text"
          placeholder="Search by name"
          className="border p-2 rounded-lg w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {filteredFaces.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {currentFaces.map((face, index) => (
                  <div
                    key={index}
                    className="relative rounded overflow-hidden shadow-lg flex flex-col items-center transition-transform duration-300 hover:scale-105"
                  >
                    <FaEye
                      className="absolute top-2 left-2 text-white bg-indigo-600 p-1 rounded-full cursor-pointer hover:bg-indigo-700 transition-all"
                      size={24}
                      onClick={() => openModal(face)}
                    />

                    <div className="mx-auto mt-4 w-36 h-36 rounded-full overflow-hidden shadow-md flex items-center justify-center">
                      <img
                        src={
                          face.image
                            ? `data:image/jpeg;base64,${face.image}`
                            : 'https://via.placeholder.com/500'
                        }
                        alt="Face"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="px-6 py-4">
                      <h3 className="text-lg font-medium text-indigo-600 mb-2">
                        {face.name} {face.family_name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-l hover:bg-indigo-700 disabled:bg-gray-300"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-100 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-r hover:bg-indigo-700 disabled:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No known faces available.</p>
          )}
        </>
      )}

      {/* Enhanced Modal */}
      {isModalOpen && selectedFace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
          <div className="modal-content bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-all"
            >
              <FaTimes size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
                <img
                  src={
                    selectedFace.image
                      ? `data:image/jpeg;base64,${selectedFace.image}`
                      : 'https://via.placeholder.com/100'
                  }
                  alt="Face"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-indigo-600">
                  {selectedFace.name} {selectedFace.family_name}
                </h2>
                <p className="text-gray-500">{selectedFace.nationality}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p><strong>ID:</strong> {selectedFace.id_card}</p>
              <p><strong>Passport:</strong> {selectedFace.passport_number}</p>
              <p><strong>Sex:</strong> {selectedFace.sex}</p>
              <p><strong>Date of Birth:</strong> {selectedFace.date_of_birth}</p>
              <p><strong>Expiration:</strong> {selectedFace.expiration_date}</p>
              <p><strong>Status:</strong> {selectedFace.status}</p>
              <p><strong>Phone:</strong> {selectedFace.phone_number}</p>
              {selectedFace.notes && <p><strong>Notes:</strong> {selectedFace.notes}</p>}
              {selectedFace.score && (
                <p><strong>Matching Score:</strong> {(selectedFace.score * 100).toFixed(2)}%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnownFaces;
