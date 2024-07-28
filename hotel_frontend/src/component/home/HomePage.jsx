import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [roomSearchResults, setRoomSearchResults] = useState([]);

    // // Function to handle search results
    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };
  return (
        <div className="home">
            {/* HEADER / BANNER ROOM SECTION */}
            <section>
                <header className="header-banner">
                    <img src="./assets/images/hotel.webp" alt="Phegon Hotel" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Chào mừng đến với <span className="phegon-color">TrungDo Hotel</span>
                        </h1><br />
                        <h3>Bước vào thiên đường nghỉ dưỡng và trải nghiệm dịch vụ chăm sóc chu đáo</h3>
                    </div>
                </header>
            </section>

            {/* SEARCH/FIND AVAILABLE ROOM SECTION */}
            <RoomSearch handleSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={roomSearchResults} />

            <h4><Link className="view-rooms-home" to="/rooms">Xem tất cả phòng</Link></h4>

            <h2 className="home-services">Services at <span className="phegon-color">TrungDo Hotel</span></h2>

            {/* SERVICES SECTION */}
            <section className="service-section"><div className="service-card">
                <img src="./assets/images/ac.png" alt="Air Conditioning" />
                <div className="service-details">
                    <h3 className="service-title">Hệ thống điều hòa</h3>
                    <p className="service-description">Giữ cho bạn luôn mát mẻ và thoải mái trong suốt thời gian lưu trú với hệ thống điều hòa không khí riêng biệt trong phòng của chúng tôi</p>
                </div>
            </div>
                <div className="service-card">
                    <img src="./assets/images/mini-bar.png" alt="Mini Bar" />
                    <div className="service-details">
                        <h3 className="service-title">Mini Bar</h3>
                        <p className="service-description">Hãy thưởng thức các loại đồ uống và đồ ăn nhẹ được sắp xếp tiện lợi trong minibar phòng bạn mà không phát sinh thêm chi phí</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/parking.png" alt="Parking" />
                    <div className="service-details">
                        <h3 className="service-title">Bãi đậu xe</h3>
                        <p className="service-description">Chúng tôi cung cấp bãi đậu xe ngay tại chỗ để tiện lợi cho bạn. Vui lòng hỏi về các lựa chọn đậu xe valet nếu có sẵn..</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/wifi.png" alt="WiFi" />
                    <div className="service-details">
                        <h3 className="service-title">WiFi</h3>
                        <p className="service-description">Giữ liên lạc suốt thời gian lưu trú với dịch vụ Wi-Fi tốc độ cao miễn phí, có sẵn tại tất cả các phòng khách và khu vực công cộng.</p>
                    </div>
                </div>

            </section>
            {/* AVAILABLE ROOMS SECTION */}
            <section>

            </section>
        </div>
  )
}

export default HomePage