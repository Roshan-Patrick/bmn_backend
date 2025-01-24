const Regis = require('../models/nursing.model');

const nursingController = {
  nurseRegController: (req, res) => {
    const { name, mobile, nurseType, location, services, preferences, enquiryno } = req.body;
  
    // Call the model to insert booking data
    Regis.createBooking(name, mobile, nurseType, location, services, preferences, enquiryno, (err, results) => {
      if (err) {
        console.error('Error creating nurse booking:', err);
        return res.status(500).send('Internal Server Error!! Please check');
      }
      res.status(201).json({
        message: 'Booking created successfully!',
        data: results,
      });
    });
  },

  getAllBookings:(req,res)=>{
    Regis.getAllUsers((data) => {
      if (data.error) {
        return res.status(500).json({ error: data.error });
      }
      res.status(200).json(data);
    });
  },

  updateBooking:(req,res)=>{
    const booking = req.body;
    if (!booking.id) {
      return res.status(400).json({ error: 'Booking ID is required' });
   }
    Regis.updateBooking(booking, (result) => {
      if (result.error) {
      return res.status(500).json({ error: result.error });
    }
    res.status(200).json({ message: 'Booking updated successfully', data: result });
  });
  },
  deleteBooking: (req, res) => {
    const { id } = req.params; // Extract id from request parameters
    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }
    Regis.deleteBooking(id, (err, results) => {
      if (err) {
        console.error('Error deleting booking:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking deleted successfully!' });
    });
  },
  
};

module.exports = nursingController;
