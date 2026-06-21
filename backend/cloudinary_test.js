import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'di1xs8vma',
  api_key: '988922896642611',
  api_secret: 'kXxV0xd010GemNIuNVaIF8gAIP0',
});

cloudinary.v2.uploader.upload('dummy.jpg', { folder: 'comprobantes' })
  .then(console.log)
  .catch(e => console.error('UPLOAD ERROR:', e));
