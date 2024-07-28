import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import ApiService from '../../services/ApiService';

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error('Lỗi tải thông tin admin:', error.message);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="admin-page">
            <h1 className="welcome-message">Chào mừng, {adminName}</h1>
            <div className="admin-actions">
                <button className="admin-button" onClick={() => navigate('/admin/manage-rooms')}>
                    Quản lý phòng khách sạn
                </button>
                <button className="admin-button" onClick={() => navigate('/admin/manage-bookings')}>
                    Quản lý đặt phòng
                </button>
            </div>
        </div>
    );
}

export default AdminPage