import React, {useState, useEffect} from 'react';
import ApiService from '../../services/ApiService';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                // Fetch user bookings using the fetched user ID
                const userPlusBookings = await ApiService.getUserBookings(response.user.id);
                setUser(userPlusBookings.user)

            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        const params = new URLSearchParams(window.location.search);
        const paymentId = params.get('paymentId');
        const payerId = params.get("PayerID");
        console.log(paymentId, payerId);
        console.log(typeof paymentId);
        if (paymentId && payerId) {
          const executePayment = async () => {
            try {
              const executeResponse = await ApiService.executePayment(
                paymentId,
                payerId
              );
    
              console.log(executeResponse)
              if (executeResponse === "Payment successful") {
                // Make booking
                Swal.fire({
                  title: "Thành Công",
                  text: "Đã đặt phòng thành công vui lòng xem lại lịch sử đặt phòng",
                  icon: "success",
                });
                
              }
            } catch (error) {
              Swal.fire({
                title: "Lỗi",
                text: "Có lỗi xảy ra khi thực hiện thanh toán",
                icon: "error",
              });
            } finally {
            }
          };
          executePayment();
        }
        fetchUserProfile();     
    }, []);


    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page">
            {user && <h2>Welcome, {user.name}</h2>}
            <div className="profile-actions">
                <button className="edit-profile-button" onClick={handleEditProfile}>Chỉnh sửa Profile</button>
                <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <h3>Chi tiết thông tin tài khoản</h3>
                    <p><strong>Tên tài khoản:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                </div>
            )}
            <div className="bookings-section">
                <h3>Lịch sử đặt phòng</h3>
                <div className="booking-list">
                    {user && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className="booking-item">
                                <p><strong>Mã đặt phòng:</strong> {booking.bookingConfirmationCode}</p>
                                <p><strong>Ngày Check-in :</strong> {booking.checkInDate}</p>
                                <p><strong>Ngày Check-out :</strong> {booking.checkOutDate}</p>
                                <p><strong>Tổng số khách:</strong> {booking.totalNumOfGuest}</p>
                                <p><strong>Loại phòng:</strong> {booking.room.roomType}</p>
                                <p><strong>Mã phòng:</strong> {booking.room.roomCode}</p>
                                {
                                    booking.bills.map((item, i) => (
                                        <div>
                                          <p key={i}><strong>Ngày đặt phòng :</strong>{item.paymentDate}</p>
                                          <p key={i}><strong>Tổng tiền :</strong>$ {item.totalAmount}</p>
                                        </div>
                                     ))
                                } 
                                <img src={booking.room.roomPhotoUrl} alt="Room" className="room-photo" />
                            </div>
                        ))
                    ) : (
                        <p>Không tìm thấy hoặc chưa có đơn đặt phòng nào !.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage