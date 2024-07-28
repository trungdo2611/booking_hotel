import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../services/ApiService';

const RoomSearch = ({handleSearchResult}) => {
    const [startDate,setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [roomType, setRoomType] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [error, setError] = useState('');

    useEffect(()=> {
        const fetchRoomsTypes = async () => {     
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch(err) {
                console.error('Error fetching room types:', error.message);
            }
        }
       fetchRoomsTypes()

    }, [])

    const showError = (message, timeOut = 5000) => {
        setError(message);
        setTimeout(() => {
            setError('');
        }, timeOut)
    };

    const handleInternalSearch = async () => {
        if(!startDate || !endDate || !roomType) {
            showError("Hãy chọn đầy đủ các thông tin");
            return false;
        }

        try {
            // Convert startDate to the desired format
         const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
         const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;
   
         const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate,roomType);
         console.log(response);
         if(response.statusCode === 200) {
           if(response.roomList.length  === 0) {
               showError('Phòng hiện không còn trống trong khoảng thời gian này');
               return;
           }
           handleSearchResult(response.roomList);
           setError('');
         }
       } catch(err) {
           showError(err.response.data.message)
       }
    }

  
  return (
    <section>
      <div className="search-container">
        <div className='search-container__box'>
        <div className="search-field">
          <label>Check-in Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-in Date"
          />
        </div>
        <div className="search-field">
          <label>Check-out Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-out Date"
          />
        </div>

        <div className="search-field">
          <label>Room Type</label>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="">
              Chọn loại phòng
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </select>
        </div>
        </div>
        <button className="home-search-button" onClick={handleInternalSearch}>
          Tìm phòng
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </section>
  )
}

export default RoomSearch