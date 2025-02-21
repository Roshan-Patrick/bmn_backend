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
      // console.log(data);
      const { name, aadhaar, mobile, email, gender, dob, education, experience, languages, 
          specialization, address, base_location,serviceopt, imageId,fromTime, toTime } = data;
  
      db.query(
          `INSERT INTO registration (name, aadhaar, mobile, email, gender, dob, education, experience, languages, specialization,
          address, base_location,serviceopt,image_id,from_time, to_time) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`,
          [name, aadhaar, mobile, email, gender, dob, education, experience, languages, 
          specialization, address, base_location,serviceopt, imageId,fromTime, toTime], // `languages` is already JSON formatted
          (err, results) => {
              if (err) {
                  console.error('Error inserting registration:', err);
                  return callback(err);
              }
              callback(null, results.insertId);
          }
      );
  },

  updateApprovalStatus: (id, status, callback) => {
    db.query('UPDATE registration SET approval_status = ? WHERE id = ?', [status, id], (err, results) => {
        if (err) {
            console.error('Error updating approval status:', err);
            return callback(err);
        }
        callback(null, results);
    });
},

// Revert Approval Status to Pending
revertApprovalStatus: (id, callback) => {
    db.query('UPDATE registration SET approval_status = "Pending" WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error reverting approval status:', err);
            return callback(err);
        }
        callback(null, results);
    });
},
updateNurse: (id, updatedData, callback) => {
    const {
      name, aadhaar, mobile, email, gender, dob, education, experience,
      languages, specialization, address, base_location,serviceopt,fromTime, toTime
    } = updatedData;

    const query = `
      UPDATE registration 
      SET name = ?, aadhaar = ?, mobile = ?, email = ?, gender = ?, dob = ?, education = ?, 
          experience = ?, languages = ?, specialization = ?, address = ?, base_location = ? ,serviceopt = ?,
          from_time = ?, to_time=?
      WHERE id = ?`;

    const values = [
      name, aadhaar, mobile, email, gender, dob, education, experience,
      languages, specialization, address, base_location, serviceopt,fromTime, toTime,id
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Error updating registration:", err);
        return callback(err);
      }
      callback(null, results);
    });
  },

  
  getAllRegistrations: (approvalStatus, callback) => {
    let query = `
       SELECT r.*, 
       JSON_UNQUOTE(r.languages) AS languages, 
       JSON_UNQUOTE(r.serviceopt) AS serviceopt, 
       i.file_path 
        FROM registration r 
        JOIN images i ON r.image_id = i.id
    `;
    let params = [];

    if (approvalStatus) {
        query += " WHERE r.approval_status = ?";
        params.push(approvalStatus);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching registrations:', err);
            return callback(err);
        }
        results = results.map(row => ({
            ...row,
            languages: row.languages ? JSON.parse(row.languages) : [],
            serviceopt: row.serviceopt ? JSON.parse(row.serviceopt) : []
        }));
        callback(null, results);
    });
}

  };
  

module.exports = nursingRegistrationModel;