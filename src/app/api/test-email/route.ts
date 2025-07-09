import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Create transporter for Gmail with app password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arvaradodotcom@gmail.com',
        pass: 'iwar xzav utnb bxyw',
      },
      secure: false,
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test email content
    const emailContent = `
      <h2>Test Email</h2>
      <p>This is a test email to verify the email configuration is working.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Email options
    const mailOptions = {
      from: 'arvaradodotcom@gmail.com',
      to: 'mehdito2001@outlook.com',
      subject: 'Test Email - Checkout System',
      html: emailContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: error.message,
        suggestion: 'Check Gmail settings or try using an App Password'
      },
      { status: 500 }
    );
  }
} 