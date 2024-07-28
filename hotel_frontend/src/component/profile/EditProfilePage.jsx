import React, {useState, useEffect} from 'react';
import ApiService from '../../services/ApiService';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setUser(response.user);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleDeleteProfile = async () => {

        try {
            await ApiService.deleteUser(user.id);
            navigate('/signup');
        } catch (error) {
            setError(error.message);
        }

    };

    const handleAlertDeleteUser = () => {
        Swal.fire({
            title: "Xóa tài khoản ?",
            text: `Bạn có chắc muốn xóa tài khoản này không ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#ff919d",
            confirmButtonText: "Có, xóa đi!",
            cancelButtonText: "Không , chờ chút!"
          }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteProfile();
              Swal.fire({
                title: "Đã xóa!",
                text: "Tài khoản đã bị xóa.",
                icon: "success"
              });
            }
          });
    }

    return (
        <div className="edit-profile-page">
            <div><Link to='/profile' style={{
                textDecoration: 'none'
            }}  className="material-symbols-outlined">arrow_back</Link></div>
            <h2>Chỉnh Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {user && (
                <div className="profile-details">
                    <p><strong>Tên:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                    <button className="delete-profile-button" onClick={handleAlertDeleteUser}>Xóa tài khoản</button>
                </div>
            )}
        </div>
    );
}

export default EditProfilePage