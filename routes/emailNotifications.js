import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: 'skadimel@outlook.com',
      pass: 'epfbnczhqmqepbap',
    },
  });

  const mailOptions = {
    from: 'skadimel@outlook.com',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
};

export const sendRegistrationEmail = async (to, subject, text) => {
  await sendEmail(to, subject, text);
};

export const sendEventCreationEmail = async (to, subject, text) => {
    await sendEmail(to, subject, text);
  };
  
  // Function to send an email for event registration
  export const sendEventRegistrationEmail = async (to, subject, text) => {
    await sendEmail(to, subject, text);
  };
  
  // Function to send an email for credit transfer
  export const sendCreditTransferEmail = async (to, subject, text) => {
    await sendEmail(to, subject, text);
  };
