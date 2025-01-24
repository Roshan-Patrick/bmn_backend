const db = require('../config/db');

const nursingModel = {
  createBooking: (name, mobile, nurseType, location, services, preferences, enquiryno, callback) => {
    const query = `
      INSERT INTO bookings (name, mobile, nurseType, location, services, preferences, enquiryno)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [name, mobile, nurseType, location, services, preferences, enquiryno], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },  

  getAllUsers: (callback) => {
    db.query('SELECT * FROM bookings', (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return callback({ error: 'Database query failed' });
      }
      callback(results);
    });
},

  updateBooking:(booking, callback)=>{
    const { id, enquiryno, name, mobile, nurseType, location, services, preferences } = booking;
    const query = `
      UPDATE bookings 
      SET enquiryno = ?, name = ?, mobile = ?, nurseType = ?, location = ?, services = ?, preferences = ? 
      WHERE id = ?`;
  db.query(query, [enquiryno, name, mobile, nurseType, location, services, preferences, id], (err, results) => {
    if (err) {
      console.error('Database update error:', err);
      return callback({ error: 'Failed to update booking' });
    }
    callback(results);
  });
  },

  deleteBooking: (id, callback) => {
    const query = `DELETE FROM bookings WHERE id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },
};

module.exports = nursingModel;
