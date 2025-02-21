require("dotenv").config();

const Regis = require('../models/nursingRegistration.model');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// Handle user registration
const nursingController = {
  registerNurse: (req, res) => {
    const {
      name, aadhaar, mobile, email, gender, dob, education, experience,
      languages, specialization, address, base_location,serviceopt,fromTime, toTime
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('Received Data:', req.body);
    console.log('Uploaded File:', req.file);
    // Convert languages from JSON string to array
    const parsedLanguages = languages ? JSON.parse(languages) : [];
    const parsedServiceopt = serviceopt ? JSON.parse(serviceopt) : [];

    // Save file path to the images table
    Regis.insertImg(req.file.path, (err, imageId) => {
      if (err) {
        console.error('Error in insertImg:', err);
        return res.status(500).json({ success: false, message: 'Error inserting image' });
      }

      // Save registration details with the image ID
      const registrationData = {
        name, aadhaar, mobile, email, gender, dob, education, experience,
        languages: JSON.stringify(parsedLanguages), // Store as JSON string
        specialization, address, base_location, imageId, serviceopt: JSON.stringify(parsedServiceopt),fromTime, toTime
      };

      Regis.insertRegistration(registrationData, (err, registrationId) => {
        if (err) {
          console.error('Error in insertRegistration:', err);
          return res.status(500).json({ success: false, message: 'Error inserting registration' });
        }

        const mailOptions = {
          from: '"ResQ Consultants" <ak@resq.sg>',
          to: email,
          subject: "Nurse Registration Acknowledgment - BookMyNurse",
          html: `<p>Dear Sir/Madam,</p>
                 <p><b>Greetings from BookMyNurse.Com</b></p>
                 <p>Thanks for registering with <b>BookMyNurse.Com</b>. Our operations team will get back to you shortly for verification.</p>
                 <p>In the meantime, please download our <b>BookMyNurse</b> mobile app to stay connected with us.</p>
                 <p><b>URL:</b> <a href="https://drive.google.com/file/d/1jnbBn6TMOeyZ2WScG5Ikg3Dm84mretrk/view?usp=sharing" target="_blank">Download App</a></p>
                 <p><b>QR Code:</b></p>
                 <p><img src="cid:qrcode" alt="QR Code" style="width:150px; height:150px;"></p>
                 <p>Regards,</p>
                 <p><b>Team BookMyNurse.Com</b></p>`,
          attachments: [
            {
              filename: 'bmn-app-qr.png',
              path: 'assets/img/bmn-app-qr.png',
              cid: 'qrcode' // This CID is used in the email body
            }
          ]
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error("Error sending email:", err);
          } else {
            console.log("Acknowledgment Email Sent:", info.response);
          }
        });

        res.status(201).json({ success: true, registrationId });
      });
    });
  },



  // Get all registrations for admin dashboard
  fetchAllRegistrationsNurse: (req, res) => {
    const approvalStatus = req.query.approval_status || null;
     Regis.getAllRegistrations(approvalStatus,(err, registrations) => { 
       if (err) {
         console.error('Error in getAllRegistrations:', err);
         return res.status(500).json({ success: false, message: 'Error fetching registrations' });
       }
 
       res.status(200).json({ success: true, data: registrations });
     });
  },

  updateApprovalStatus: (req, res) => {
    const { id, status } = req.body; // Get user ID and new status

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid approval status' });
    }

    Regis.updateApprovalStatus(id, status, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error updating approval status' });
        }
        res.status(200).json({ success: true, message: `Registration ${result} successfully` });
    });
},

// Revert Approval Status to Pending
revertApprovalStatus: (req, res) => {
    const { id } = req.body; // Get user ID

    Regis.revertApprovalStatus(id, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reverting approval status' });
        }
        res.status(200).json({ success: true, message: `${result} Approval status reverted to pending` });
    });
},
editNurse: (req, res) => {
  const { id } = req.params; // Get nurse ID from URL
  const {
    name, aadhaar, mobile, email, gender, dob, education, experience,
    languages, specialization, address, base_location,serviceopt,fromTime, toTime
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Nurse ID is required for updating." });
  }

  // Convert languages to JSON string before saving
  const parsedLanguages = Array.isArray(languages) ? JSON.stringify(languages) : languages;
  const parsedServiceopt = Array.isArray(serviceopt) ? JSON.stringify(serviceopt) : serviceopt;

  // Call model function to update nurse
  Regis.updateNurse(id, { 
    name, aadhaar, mobile, email, gender, dob, education, experience,
    languages: parsedLanguages, specialization, address, base_location,serviceopt:parsedServiceopt,fromTime, toTime
  }, (err, result) => {
    if (err) {
      console.error("Error updating nurse details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json({ success: true, message: "Nurse details updated successfully!" });
  });
},

  
};

// Export all controller functions as a single object
module.exports = nursingController;
