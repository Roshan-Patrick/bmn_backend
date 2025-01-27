const db = require('../config/db');

const nursingRegistrationModel = {
    insertImg: (filePath, callback) => {
      db.query('INSERT INTO images (file_path) VALUES (?)', [filePath], (err, results) => {
        if (err) {
          console.error('Error inserting image:', err);
          return callback(err);
        }
        callback(null, results.insertId);
      });
    },
  
    insertRegistration: (data, callback) => {
        console.log(data);
      const { name, aadhaar, mobile, email, gender, dob, education, experience,languages, 
        specialization, address,base_location,imageId } = data;
      db.query(
        `INSERT INTO registration (name,aadhaar, mobile,email,gender,dob,education,experience,languages,specialization,
        address,base_location,image_id) 
        VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?)`,
        [name, aadhaar, mobile, email, gender, dob, education, experience,languages, 
            specialization, address, base_location,imageId],
        (err, results) => {
          if (err) {
            console.error('Error inserting registration:', err);
            return callback(err);
          }
          callback(null, results.insertId);
        }
      );
    },
  
    getAllRegistrations: (callback) => {
      db.query(
        `SELECT r.*, i.file_path FROM registration r JOIN images i ON r.image_id = i.id`,
        (err, results) => {
          if (err) {
            console.error('Error fetching registrations:', err);
            return callback(err);
          }
          console.log(results);
          callback(null, results);
        }
      );
    },
  };
  

module.exports = nursingRegistrationModel;