const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'estudio2607.notify@gmail.com', // generated ethereal user
    pass: 'nnqvetruebfufgyn', // generated ethereal password
  },
});

// Esto es lo que pegamos dentro de un método para enviar mail
// await transporter.sendMail({
//   from: '"Estudio Impositivo Spallione" <estudio2607.notify@gmail.com>', // sender address
//   to: "lorenzo0895@gmail.com", // list of receivers
//   subject: "Hello ✔", // Subject line
//   text: "Hello world?", // plain text body
//   html: "<b>Hello world?</b>", // html body
// });

module.exports = transporter;