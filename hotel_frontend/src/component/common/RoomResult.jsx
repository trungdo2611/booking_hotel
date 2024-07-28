import React from 'react';
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/ApiService';
const RoomResult = ({roomSearchResults}) => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const isAdmin = ApiService.isAdmin();
  return (
    <section className="room-results">
            {roomSearchResults && roomSearchResults.length > 0 && (
                <div className="room-list">
                    {roomSearchResults.map(room => (
                        <div key={room.id} className="room-list-item">
                            <img className='room-list-item-image' src={room.roomPhotoUrl} alt={room.roomType} />
                            <div className="room-details">
                                <h3>{room.roomType}</h3>
                                <p>Số phòng: {room.roomCode}</p>
                                <p>Giá phòng: ${room.roomPrice}/ đêm</p>
                                <p>Mô tả: {room.roomDescription}</p>
                            </div>

                            <div className='book-now-div'>
                                {isAdmin ? (
                                    <button
                                        className="edit-room-button"
                                        onClick={() => navigate(`/admin/edit-room/${room.id}`)} // Navigate to edit room with room ID
                                    >
                                        Chỉnh sửa phòng
                                    </button>
                                ) : (
                                    <button
                                        className="book-now-button"
                                        onClick={() => navigate(`/room-details-book/${room.id}`)} // Navigate to book room with room ID
                                    >
                                        Xem/Đặt ngay
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </section>
  )
}

export default RoomResult