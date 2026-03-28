import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingHistory from './pages/BookingHistory';
import AdminRooms from './pages/AdminRooms';
import AdminBookings from './pages/AdminBookings';
import './App.css';

import logo from './assets/Logo.png';
import background from './assets/background.png';

// Divine Room
import divine1 from './assets/Divine1.png';
import divine2 from './assets/Divine2.png';
import divine3 from './assets/Divine3.png';
import divine4 from './assets/Divine4.png';

// Premier Room
import premier1 from './assets/Premier1.png';
import premier2 from './assets/Premier2.png';
import premier3 from './assets/Premier3.png';
import premier4 from './assets/Premier4.png';

// Superior Room
import superior1 from './assets/Superior1.png';
import superior2 from './assets/Superior2.png';
import superior3 from './assets/Superior3.png';
import superior4 from './assets/Superior4.png';

function Home({ user, handleLogout, isAdmin }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message, setMessage] = useState('');

 const roomImages = {
    'Holiday Suite Divine': [divine1, divine2, divine3, divine4],
    'Premier Room': [premier1, premier2, premier3, premier4],
    'Superior Room': [superior1, superior2, superior3, superior4],
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    const { data, error } = await supabase.from('rooms').select('*');

    if (error) {
      setMessage('Error fetching rooms: ' + error.message);
      return;
    }

    setRooms(data || []);
  }

  async function handleBooking(e) {
    e.preventDefault();
    setMessage('');

    if (!user) {
      setMessage('You must log in first before booking.');
      return;
    }

    if (!selectedRoom) {
      setMessage('Please select a room.');
      return;
    }

    if (!checkIn || !checkOut) {
      setMessage('Please select dates.');
      return;
    }

    if (checkOut <= checkIn) {
      setMessage('Check-out must be after check-in.');
      return;
    }

    const { data: existingBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_id', selectedRoom.id)
      .eq('status', 'confirmed');

    if (bookingError) {
      setMessage('Error checking bookings: ' + bookingError.message);
      return;
    }

    const bookingsList = existingBookings || [];

    const hasConflict = bookingsList.some((booking) => {
      return (
        checkIn < booking.check_out_date &&
        checkOut > booking.check_in_date
      );
    });

    if (hasConflict) {
      setMessage('Room already booked for selected dates.');
      return;
    }

    const { error: insertError } = await supabase.from('bookings').insert([
      {
        user_id: user.id,
        room_id: selectedRoom.id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        status: 'confirmed',
      },
    ]);

    if (insertError) {
      setMessage('Error saving booking: ' + insertError.message);
      return;
    }

    setMessage('Booking successful!');
    setSelectedRoom(null);
    setCheckIn('');
    setCheckOut('');
  }

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="hero-overlay">
          <header className="navbar">
            <div className="navbar-inner">
              <div className="brand-area">
                <img src={logo} alt="Hotel logo" className="brand-logo" />

                <div className="brand-text">
                  <span className="brand-main">Holiday Inn</span>
                  <span className="brand-sub">by IHG</span>
                  <span className="brand-location">Makati</span>
                </div>
              </div>

              <div className="nav-links">
                {!user ? (
                  <>
                    <Link className="nav-link" to="/login">Login</Link>
                    <Link className="nav-link" to="/register">Register</Link>
                  </>
                ) : (
                  <>
                    <p className="user-badge">{user.email}</p>
                    <Link className="nav-link" to="/history">History</Link>

                    {isAdmin && (
                      <>
                        <Link className="nav-link" to="/admin/rooms">Rooms</Link>
                        <Link className="nav-link" to="/admin/bookings">Bookings</Link>
                      </>
                    )}

                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="hero-content">
            <div className="hero-content-inner">
              <div className="hero-card">
                <p className="hero-kicker">Luxury Stay</p>
                <h2 className="hero-title">
                  Experience comfort and elegance in the heart of Makati
                </h2>
                <p className="hero-subtitle">
                  Discover refined spaces, modern amenities, and a seamless booking
                  experience inspired by premium hotel design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="content">
        <h2 className="section-title">Our Rooms</h2>
        <p className="section-subtitle">
          Select your preferred room and continue to the booking form below.
        </p>

        {message && <div className="message-box">{message}</div>}

        {rooms.length === 0 ? (
          <p className="empty-text">No rooms found.</p>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-slider">
                <div className="room-track">
                  {(roomImages[room.name] || [background, background, background, background]).map(
                    (image, index) => (
                      <div key={index} className="room-slide">
                        <img src={image} alt={`${room.name} ${index + 1}`} />
                      </div>
                    )
                  )}
                </div>
              </div>

                <div className="room-body">
                  <h3 className="room-title">{room.name}</h3>
                  <p className="room-desc">{room.description}</p>

                  <div className="room-meta">
                    <span>Price: ₱{room.price}</span>
                    <span>Capacity: {room.capacity}</span>
                  </div>

                  <button
                    className="primary-btn"
                    onClick={() => setSelectedRoom(room)}
                  >
                    Select Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedRoom && (
          <div className="booking-panel">
            <h3>Booking: {selectedRoom.name}</h3>

            <form onSubmit={handleBooking}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="primary-btn" type="submit">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isAdmin = user?.email === 'hans.anonuevo3@gmail.com';

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user || null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            user={user}
            handleLogout={handleLogout}
            isAdmin={isAdmin}
          />
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/history" element={<BookingHistory user={user} />} />
      <Route
        path="/admin/rooms"
        element={isAdmin ? <AdminRooms /> : <p>Access denied</p>}
      />
      <Route
        path="/admin/bookings"
        element={isAdmin ? <AdminBookings /> : <p>Access denied</p>}
      />
    </Routes>
  );
}

export default App;