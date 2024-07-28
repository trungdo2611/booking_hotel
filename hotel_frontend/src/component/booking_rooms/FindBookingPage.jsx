import React, {useState} from 'react';
import ApiService from '../../services/ApiService';

const FindBookingPage = () => {
    const [confirmationCode, setConfirmationCode] = useState(''); // State variable for confirmation code
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors

    const handleSearch = async () => {
        if (!confirmationCode.trim()) {
            setError("Please Enter a booking confirmation code");
            setTimeout(() => setError(''), 5000);
            return;
        }
        try {
            // Call API to get booking details
            const response = await ApiService.getBookingByConfirmationCode(confirmationCode);
            console.log(response)
            setBookingDetails(response.booking);
            setError(null); // Clear error if successful
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };
  return (
    <div className="find-booking-page">
    <h2>Tìm phòng đã đặt</h2>
    <div className="search-container">
        <input
            required
            type="text"
            className='input-confirm-code'
            placeholder="Enter your booking confirmation code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm</button>
    </div>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {bookingDetails && (
        <div className="booking-details">
            <h3>Thông tin booking</h3>
            <p>Mã xác nhận: {bookingDetails.bookingConfirmationCode}</p>
            <p>Ngày check in: {bookingDetails.checkInDate}</p>
            <p>Ngày check out: {bookingDetails.checkOutDate}</p>
            <p>Số người lớn: {bookingDetails.numOfAdults}</p>
            <p>Số trẻ em: {bookingDetails.numOfChildren}</p>

            <br />
            <hr />
            <br />
            <h3>Thông tin người đặt</h3>
            <div>
                <p> Tên: {bookingDetails.user.name}</p>
                <p> Email: {bookingDetails.user.email}</p>
                <p> Số điện thoại: {bookingDetails.user.phoneNumber}</p>
            </div>

            <br />
            <hr />
            <br />
            <h3>Chi tiết phòng</h3>
            <div>
                <p> Loại phòng: {bookingDetails.room.roomType}</p>
                <p>Mã phòng : {bookingDetails.room.roomCode}</p>
                <p>Giá phòng : $ {bookingDetails.room.roomPrice}/đêm</p>
                {bookingDetails.bills.map((item, i) => 
                    (
                        <p key={i}>Tổng tiền : $ {item.totalAmount}</p>
                    )
                )}
               
                <img style={{
                    display: 'block',
                    width: '100%'
                }} src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
            </div>
        </div>
    )}
</div>
  )
}

export default FindBookingPage