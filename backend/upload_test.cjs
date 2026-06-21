const fs = require('fs');

fs.writeFileSync('dummy.jpg', 'fake image content');

const formData = new FormData();
const fileBlob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
formData.append('comprobante', fileBlob, 'dummy.jpg');

fetch('http://localhost:3000/api/reservations/1/payment', {
  method: 'PUT',
  body: formData
}).then(r=>r.text()).then(console.log).catch(console.error);
