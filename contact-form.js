// api/contact-form.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, number, message } = req.body;
        
        // Validate email
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Create a transporter object
        let transporter = nodemailer.createTransport({
            service: 'gmail', // Use a different service if needed
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

        try {
            // Send email
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: 'Thank you for contacting us!' });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Sorry, something went wrong. Please try again later.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
