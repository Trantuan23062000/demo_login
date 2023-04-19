const nodemailer = require("nodemailer");
  const sendMail=async (toMail,html)=>{
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user:'tttuan_19pm@student.agu.edu.vn',
          pass:'rfwzorlgdmbplxnj',
        },
      });
    
      var mailOptions = {
        from: 'tttuan_19pm@student.agu.edu.vn',
        to: toMail,
        subject: "Cap lai mat khau !",
        html:html
      };
    
       await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

  }
  module.exports=sendMail;