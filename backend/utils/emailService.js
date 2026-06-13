import nodemailer from 'nodemailer';

const getTransporter = () =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

export const sendOTP = async (email, otp) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This OTP expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendPasswordResetOTP = async (email, otp) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Code - AI Career Launchpad',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>Your reset code is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Password reset email failed:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to AI Career Launchpad',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome, ${name}!</h2>
          <p>Thank you for joining AI Career Launchpad.</p>
          <p>Start building your career today with our AI-powered tools.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
