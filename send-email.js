// netlify/functions/send-email.js

const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Parse form data from the request body
    const { name, email, number, message } = JSON.parse(event.body);

    // Validate email
    if (!validateEmail(email)) {
      return {
        statusCode: 400,
        body: 'Invalid email format',
      };
    }

    // Create a transporter object
    let transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services like 'smtp' or 'mailgun'
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Define the email options
    let mailOptions = {
      from: email,
      to: 'your-email@example.com', // Replace with your email address
      subject: `Contact Form Submission from ${name}`,
      html: `
        <html>
        <body>
          <h1>Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone Number:</strong> ${number}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: 'Thank you for contacting us!',
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Sorry, something went wrong. Please try again later.',
    };
  }
};

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
