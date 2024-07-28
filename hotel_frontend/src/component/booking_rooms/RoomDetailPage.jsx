import React, { useState, useEffect } from "react";
import { useParams, } from "react-router-dom";
import DatePicker from "react-datepicker";
import ApiService from "../../services/ApiService";
import Swal from "sweetalert2";
import Loader from "../Loading/Loader";
const RoomDetailPage = () => { // Access the navigate function to navigate
  const { roomId } = useParams(); // Get room ID from URL parameters
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track any errors
  const [checkInDate, setCheckInDate] = useState(null); // State variable for check-in date
  const [checkOutDate, setCheckOutDate] = useState(null); // State variable for check-out date
  const [numAdults, setNumAdults] = useState(1); // State variable for number of adults
  const [numChildren, setNumChildren] = useState(0); // State variable for number of children
  const [totalAmount, settotalAmount] = useState(0); // State variable for total booking price
  const [totalGuests, setTotalGuests] = useState(1); // State variable for total number of guests
  const [showDatePicker, setShowDatePicker] = useState(false); // State variable to control date picker visibility
  const [userId, setUserId] = useState(""); // Set user id
  const [showMessage, setShowMessage] = useState(false); // State variable to control message visibility
  const [confirmationCode, setConfirmationCode] = useState(""); // State variable for booking confirmation code
  const [errorMessage, setErrorMessage] = useState(""); // State variable for error message

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading state to true
        const response = await ApiService.getRoomById(roomId);
        console.log(response);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching or error
      }
    };
    fetchData();
  }, [roomId]); // Re-run effect when roomId changes

  const handleConfirmBooking = async () => {
    // Check if check-in and check-out dates are selected
    if (!checkInDate || !checkOutDate) {
      setErrorMessage("Hãy chọn ngày check in và check out.");
      setTimeout(() => setErrorMessage(""), 5000); // Clear error message after 5 seconds
      return;
    }

    // Check if number of adults and children are valid
    if (
      isNaN(numAdults) ||
      numAdults < 1 ||
      isNaN(numChildren) ||
      numChildren < 0
    ) {
      setErrorMessage("Hãy nhập số người .");
      setTimeout(() => setErrorMessage(""), 5000); // Clear error message after 5 seconds
      return;
    }

    // Calculate total number of days
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay));

    // Calculate total number of guests
    const totalGuests = numAdults + numChildren;

    // Calculate total price
    const roomPricePerNight = roomDetails.roomPrice;
    const totalAmount = roomPricePerNight * totalDays;

    settotalAmount(totalAmount);
    setTotalGuests(totalGuests);
  };

  const acceptBooking = async () => {
    try {
      setLoader(true);


      // Ensure checkInDate and checkOutDate are Date objects
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Log the original dates for debugging
      console.log("Original Check-in Date:", startDate);
      console.log("Original Check-out Date:", endDate);

      // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
      const formattedCheckInDate = new Date(
        startDate.getTime() - startDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];
      const formattedCheckOutDate = new Date(
        endDate.getTime() - endDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      //  Log the original dates for debugging
      console.log("Formated Check-in Date:", formattedCheckInDate);
      console.log("Formated Check-out Date:", formattedCheckOutDate);

      // Create booking object
      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren,
      };
      console.log(booking);
      console.log(checkOutDate);

      const bookingResponse = await ApiService.bookRoom(
        roomId,
        userId,
        booking,
        totalAmount
      );
      if (bookingResponse.statusCode === 200) {
        setConfirmationCode(bookingResponse.bookingConfirmationCode); // Set booking confirmation code
        setShowMessage(true); // Show message
        // Hide message and navigate to homepage after 5 seconds

      }

      // Step 1: Create PayPal payment

      const total = totalAmount;
      const currency = "USD";
      const method = "paypal";
      const intent = "sale";
      const description = "Booking payment";
      const url = new URL("http://localhost:3000/profile");
      const cancelUrl = window.location.href;

      settotalAmount(total);
      const paymentResponse = await ApiService.creatPayment(
        total,
        currency,
        method,
        intent,
        description,
        cancelUrl,
        url
      );
      console.log(paymentResponse);
      // Step 2: Redirect to PayPal for approval
      if (paymentResponse.approval_url) {
        window.location.href = paymentResponse.approval_url;
        return;
      }

      throw new Error("Error creating PayPal payment");

    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(""), 15000); // Clear error message after 5 seconds
      Swal.fire({
        title: "Lỗi",
        text: "Có lỗi xảy ra khi đặt phòng",
        icon: "error",
      });
    } finally {
      setLoader(false);
    }
  };

 

  if (isLoading) {
    return <p className="room-detail-loading">Loading...</p>;
  }

  if (error) {
    return <p className="room-detail-loading">{error}</p>;
  }

  if (!roomDetails) {
    return <p className="room-detail-loading">Room not found.</p>;
  }

  const {
    roomType,
    roomCode,
    roomPrice,
    roomPhotoUrl,
    roomDescription,
    bookings,
  } = roomDetails;

  return (
    <div className="room-details-booking">
      {showMessage && (
        <p className="booking-success-message">
          Đặt phòng thành công! mã xác nhận: {confirmationCode}. email chi tiết
          phòng được đã đặt sẽ được gửi đến bạn.
        </p>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <h2>Chi tiết phòng</h2>
      <br />
      <img src={roomPhotoUrl} alt={roomType} className="room-details-image" />
      <div className="room-details-info">
        <h3>{roomType}</h3>
        <p>Số phòng: {roomCode}</p>
        <p>Giá: ${roomPrice} / đêm</p>
        <p>{roomDescription}</p>
      </div>
      {bookings && bookings.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "10px" }}>Phòng đã đặt</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span className="booking-number">Booking {index + 1} </span>
                <span className="booking-text">
                  Checkin: {booking.checkInDate}{" "}
                </span>
                <span className="booking-text">
                  Out: {booking.checkOutDate}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="booking-info">
        <div className="booking-btn">
          <button
            className="book-now-button"
            onClick={() => setShowDatePicker(true)}
          >
            Đặt ngay
          </button>
          <button
            className="go-back-button"
            onClick={() => setShowDatePicker(false)}
          >
            Reset
          </button>
        </div>

        {showDatePicker && (
          <div className="date-picker-container">
            <DatePicker
              className="detail-search-field"
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Check-in Date"
              dateFormat="dd/MM/yyyy"
              // dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              className="detail-search-field"
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Check-out Date"
              // dateFormat="yyyy-MM-dd"
              dateFormat="dd/MM/yyyy"
            />

            <div className="guest-container">
              <div className="guest-div">
                <label>Du khách:</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value))}
                />
              </div>
              <div className="guest-div">
                <label>Trẻ em:</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value))}
                />
              </div>
              <button
                className="confirm-booking"
                onClick={handleConfirmBooking}
              >
                Xác nhận đặt phòng
              </button>
            </div>
          </div>
        )}
        {totalAmount > 0 && (
          <div className="total-price">
            <p>Tổng tiền: ${totalAmount}</p>
            <p>Số lượng khách: {totalGuests}</p>
            <button onClick={acceptBooking} className="accept-booking">
              Chấp nhận đặt
            </button>
          </div>
        )}
      </div>

      <Loader isVisible={loader} />
    </div>
  );
};

export default RoomDetailPage;
