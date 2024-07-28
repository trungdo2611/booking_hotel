import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import Swal from "sweetalert2";

const EditBooking = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null); // State variable for booking details
    const [error, setError] = useState(null); // Track any errors
    const [success, setSuccessMessage] = useState(null); // Track any errors



    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);


    const acheiveBooking = async (bookingId) => {
        
        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("The boking was Successfully Acheived")               
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 2000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleAlertDeleteBooking = (bookingId) => {
        Swal.fire({
            title: "Xóa",
            text: `Bạn có chắc muốn xóa đơn đặt phòng này không ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#ff919d",
            confirmButtonText: "Có, xóa đi!",
            cancelButtonText: "Không , chờ chút!"
          }).then((result) => {
            if (result.isConfirmed) {
                acheiveBooking(bookingId);
              Swal.fire({
                title: "Đã xóa!",
                text: "Đơn đặt phòng này đã bị xóa.",
                icon: "success"
              });
            }
          });
    }

    return (
        <div className="find-booking-page">
            <h2>Thông tin đặt phòng</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            {bookingDetails && (
                <div className="booking-details">
                    <h3>Chi tiết đơn</h3>
                    <p>Mã đơn đặt phòng: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Ngày Check-in: {bookingDetails.checkInDate}</p>
                    <p>Ngày Check-out: {bookingDetails.checkOutDate}</p>
                    <p>Số người lớn: {bookingDetails.numOfAdults}</p>
                    <p>Số trẻ em: {bookingDetails.numOfChildren}</p>
                    <p>Email người đặt: {bookingDetails.guestEmail}</p>
                    {
                        bookingDetails.bills.map((item,i) => (
                            <div key={item.id}>
                            <p>Ngày đặt phòng: {item.paymentDate}</p>
                            <p>Tổng tiền:${item.totalAmount}</p>
                           </div>
                        ))
                    }
                    <br />
                    <hr />
                    <br />
                    <h3>Chi tiết người đặt</h3>
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
                        <p> Giá phòng: ${bookingDetails.room.roomPrice}</p>
                        <p> Mô tả: {bookingDetails.room.roomDescription}</p>
                        <img style={{
                            width: "400px",
                            height: "auto"
                        }} src={bookingDetails.room.roomPhotoUrl} alt="" sizes="" srcSet="" />
                    </div>
                    <button
                        className="acheive-booking"
                        onClick={() => handleAlertDeleteBooking(bookingDetails.id)}>Xóa đơn đặt phòng
                    </button>
                </div>
            )}
        </div>
    );
}

export default EditBooking