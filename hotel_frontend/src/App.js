import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './component/common/Navbar';
import Footer from './component/common/Footer';
import HomePage from './component/home/HomePage';
import AllRoomsPage from './component/booking_rooms/AllRoomsPage';
import FindBookingPage from './component/booking_rooms/FindBookingPage';
import RoomDetailPage from './component/booking_rooms/RoomDetailPage';
import {ProtectedRoute, AdminRoute } from './services/guard'
import LoginPage from './component/auth/LoginPage';
import RegisterPage from './component/auth/RegisterPage';
import ProfilePage from './component/profile/ProfilePage';
import EditProfilePage from './component/profile/EditProfilePage';
import AdminPage from './component/admin/AdminPage';
import ManageRoomPage from './component/admin/ManageRoomPage';
import EditRoom from './component/admin/EditRoom';
import AddRoom from './component/admin/AddRoom';
import EditBooking from './component/admin/EditBooking';
import ManageBookingPage from './component/admin/ManageBookingPage';
import Chatbot from './component/ChatBot/Chatbot';
import HandlePaypal from './component/paypal/HandlePaypal';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='App'>
          <Navbar/>
          <div className='content'>
            <Routes>
            <Route exact path='/home' element={<HomePage/>}/>
            <Route path="/success" element={<HandlePaypal/>} />
            <Route exact path='/rooms' element={<AllRoomsPage/>}/>
            <Route path="/find-booking" element={<FindBookingPage />} />
            <Route exact path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />

              {/* Protected Routes */}
              <Route path="/room-details-book/:roomId"
              element={<ProtectedRoute element={<RoomDetailPage/>} />}
            />
             <Route path="/profile"
              element={<ProtectedRoute element={<ProfilePage/>} />}
            />
            <Route path="/edit-profile"
              element={<ProtectedRoute element={<EditProfilePage/>} />}
            />

            {/* Admin Routes */}
            <Route path="/admin"
              element={<AdminRoute element={<AdminPage/>} />}
            />
            <Route path="/admin/manage-rooms"
              element={<AdminRoute element={<ManageRoomPage/>} />}
            />
            <Route path="/admin/edit-room/:roomId"
              element={<AdminRoute element={<EditRoom/>} />}
            />
            <Route path="/admin/add-room"
              element={<AdminRoute element={<AddRoom/>} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingPage/>} />}
            />
            <Route path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBooking/>} />}
            />


            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </div>
         
         
          <Chatbot/>   
          <Footer/>
          
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
