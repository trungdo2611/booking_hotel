import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import Swal from "sweetalert2";

const Navbar = () => {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const isUser = ApiService.isUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Đăng xuất",
      text: `Bạn có chắc chắn muốn đăng xuất khỏi trang web không ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#ff919d",
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        ApiService.logout();
        navigate("/home");
        Swal.fire({
          title: "Đã đăng xuất",
          text: "Bạn đã đăng xuất thành công",
          icon: "success",
        });
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/home">TrungDo Hotel</NavLink>
      </div>
      <ul className="navbar-ul">
        <li className="navbar-ul-li-home">
          <NavLink to="home" activeclassname="active">
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink to="/rooms" activeclassname="active">
            Phòng{" "}
          </NavLink>
        </li>
        <li>
          <NavLink to="/find-booking" activeclassname="active">
            Tìm phòng đã đặt
          </NavLink>
        </li>

        {isUser && (
          <li>
            <NavLink to="/profile" activeclassname="active">
              Thông tin
            </NavLink>
          </li>
        )}
        {isAdmin && (
          <li>
            <NavLink to="/admin" activeclassname="active">
              Admin
            </NavLink>
          </li>
        )}

        {!isAuthenticated && (
          <li>
            <NavLink to="/login" activeclassname="active">
              Đăng nhập
            </NavLink>
          </li>
        )}
        {!isAuthenticated && (
          <li>
            <NavLink to="/register" activeclassname="active">
              Đăng ký
            </NavLink>
          </li>
        )}
        {isAuthenticated && (
          <li
            className="navbar-ul-li-logout"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Đăng xuất
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
