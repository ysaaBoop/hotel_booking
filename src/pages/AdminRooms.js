import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      setMessage('Error loading rooms: ' + error.message);
      return;
    }

    setRooms(data || []);
  }

  function clearForm() {
    setName('');
    setDescription('');
    setPrice('');
    setCapacity('');
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    if (!name || !description || !price || !capacity) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (Number(price) <= 0 || Number(capacity) <= 0) {
      setMessage('Price and capacity must be greater than 0.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('rooms')
        .update({
          name,
          description,
          price,
          capacity,
        })
        .eq('id', editingId);

      if (error) {
        setMessage('Error updating room: ' + error.message);
        return;
      }

      setMessage('Room updated successfully.');
    } else {
      const { error } = await supabase
        .from('rooms')
        .insert([
          {
            name,
            description,
            price,
            capacity,
          },
        ]);

      if (error) {
        setMessage('Error adding room: ' + error.message);
        return;
      }

      setMessage('Room added successfully.');
    }

    clearForm();
    fetchRooms();
  }

  function handleEdit(room) {
    setName(room.name);
    setDescription(room.description);
    setPrice(room.price);
    setCapacity(room.capacity);
    setEditingId(room.id);
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting room: ' + error.message);
      return;
    }

    setMessage('Room deleted successfully.');
    fetchRooms();
  }

    return (
    <div className="simple-page">
        <h1>Admin Room Management</h1>

        <div className="form-card">
        <form className="admin-form" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />

            <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />

            <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            />

            <div className="admin-actions">
            <button className="primary-btn" type="submit">
                {editingId ? 'Update Room' : 'Add Room'}
            </button>

            {editingId && (
                <button className="secondary-btn" type="button" onClick={clearForm}>
                Cancel Edit
                </button>
            )}
            </div>
        </form>
        </div>

        {message && <div className="message-box" style={{ marginTop: '18px' }}>{message}</div>}

        <div className="list-stack">
        {rooms.map((room) => (
            <div key={room.id} className="admin-card">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <p>Price: ₱{room.price}</p>
            <p>Capacity: {room.capacity}</p>

            <div className="admin-actions">
                <button className="secondary-btn" onClick={() => handleEdit(room)}>
                Edit
                </button>
                <button className="danger-btn" onClick={() => handleDelete(room.id)}>
                Delete
                </button>
            </div>
            </div>
        ))}
        </div>
    </div>
    );
}

export default AdminRooms;