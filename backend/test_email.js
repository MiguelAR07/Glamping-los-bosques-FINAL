import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'panelglampinglosbosques@gmail.com',
    pass: 'rewy rlvo bdwi qxqf'
  }
});

transporter.sendMail({
  from: '"Sistema Glamping" <glampinglosbosques9@gmail.com>',
  to: 'panelglampinglosbosques@gmail.com',
  subject: 'Test',
  html: '<h1>Test</h1>'
}).then(console.log).catch(console.error);
