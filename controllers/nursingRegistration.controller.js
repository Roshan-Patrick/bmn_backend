const Regis = require('../models/nursingRegistration.model');

// Handle user registration
const nursingController = {
 registerNurse :(req, res) => {
    const {
        name, aadhaar, mobile, email, gender, dob, education, experience,
        languages, specialization, address, base_location
      } = req.body;
      console.log('Request body:', req.body);

    // Check if file exists
    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      console.log('Uploaded file:', req.file);

  // Save file path to the images table
  Regis.insertImg(req.file.path, (err, imageId) => {
    if (err) {
      console.error('Error in insertImg:', err);
      return res.status(500).json({ success: false, message: 'Error inserting image' });
    }

    // Save registration details with the image ID
    const registrationData = {
name, aadhaar, mobile, email, gender, dob, education, experience,languages, 
specialization, address, base_location,imageId,
    };

    Regis.insertRegistration(registrationData, (err, registrationId) => {
      if (err) {
        console.error('Error in insertRegistration:', err);
        return res.status(500).json({ success: false, message: 'Error inserting registration' });
      }

      res.status(201).json({ success: true, registrationId });
    });
  });
},

// Get all registrations for admin dashboard
 fetchAllRegistrationsNurse : (req, res) => {
  Regis.getAllRegistrations((err, registrations) => {
    if (err) {
      console.error('Error in getAllRegistrations:', err);
      return res.status(500).json({ success: false, message: 'Error fetching registrations' });
    }

    res.status(200).json({ success: true, data: registrations });
  });
}};

// Export all controller functions as a single object
module.exports = nursingController;
