import React from 'react';
import './FaceInfo.css'; // Import CSS file for styling

const FaceInfoList = ({ faceInfos = [], processedImage }) => {
    return (
        <div className="face-info-list-container">
            
            {faceInfos.length > 0 ? (
                faceInfos.map((info, index) => {
                    // Check if info is not null and has the image property
                    if (info && info.image) {
                        return (
                            <div key={info._id || index} className="face-info-card">
                                <div className="face-info-image">
                                    <img
                                        src={`data:image/jpeg;base64,${info.image}`}
                                        alt="Matched Face"
                                        className="matched-face-image"
                                    />
                                </div>
                                <div className="face-info-details">
                                    <div className="details-row title-row">
                                        <span className="value title-value">
                                            {info.name || 'N/A'} {info.family_name || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Matching Score:</span>
                                        <span className="value">
                                            {info.matching_score !== undefined
                                                ? `${(100 - info.matching_score).toFixed(2)}%`
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Name:</span>
                                        <span className="value">{info.name || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Family Name:</span>
                                        <span className="value">{info.family_name || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">ID Card Number:</span>
                                        <span className="value">{info.id_card || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Passport Number:</span>
                                        <span className="value">{info.passport_number || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Nationality:</span>
                                        <span className="value">{info.nationality || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Sex:</span>
                                        <span className="value">{info.sex || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Date of Birth:</span>
                                        <span className="value">{info.date_of_birth || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Expiration Date:</span>
                                        <span className="value">{info.expiration_date || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Country Code:</span>
                                        <span className="value">{info.country_code || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Phone Number:</span>
                                        <span className="value">{info.phone_number || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Status:</span>
                                        <span className="value">{info.status || 'N/A'}</span>
                                    </div>
                                    <div className="details-row">
                                        <span className="label">Notes:</span>
                                        <span className="value">{info.notes || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={index} className="face-info-card">
                                <div className="face-info-image">
                                    <div className="no-image"></div>
                                </div>
                                <div className="face-info-details">
                                    {/* Handle missing face information gracefully */}
                                    <div className="details-row">
                                        <span className="value" >
                                            <strong>No matched faces found for the uploaded image</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })
            ) : (
                <div className="no-info-message" style={{ textAlign: "center" }}>
                    <strong>No face information available.</strong>
                </div>
            )}
        </div>
    );
};

export default FaceInfoList;
