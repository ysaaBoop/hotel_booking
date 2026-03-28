import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('Loading bookings...');

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .order('id', { ascending: false });

    if (bookingsError) {
      setMessage('Error loading bookings: ' + bookingsError.message);
      return;
    }

    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*');

    if (roomsError) {
      setMessage('Error loading rooms: ' + roomsError.message);
      return;
    }

    const bookingsWithRoomNames = (bookingsData || []).map((booking) => {
      const room = roomsData.find((room) => room.id === booking.room_id);

      return {
        ...booking,
        room_name: room ? room.name : 'Unknown Room',
      };
    });

    setBookings(bookingsWithRoomNames);
    setMessage('');
  }

  return (
    <div className="simple-page">
      <h1>Admin - All Bookings</h1>

      {message && <div className="message-box">{message}</div>}

      {bookings.length === 0 ? (
        <p className="empty-text">No bookings found.</p>
      ) : (
        <div className="list-stack">
          {bookings.map((booking) => (
            <div key={booking.id} className="history-card">
              <div className="history-header">
                {booking.room_name}
              </div>

              <div className="history-body">
                <p><strong>Check-in:</strong> {booking.check_in_date}</p>
                <p><strong>Check-out:</strong> {booking.check_out_date}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>User ID:</strong> {booking.user_id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminBookings;