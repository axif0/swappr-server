const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Use your SMTP host
      port: 465, // Use your SMTP port
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: '"Swappr" <swappr@example.com>', // Sender address
      to,
      subject,
      text,
    });

    console.log('Email sent: %s', info.messageId);
    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email.' });
  }
};

module.exports = { sendEmail };
