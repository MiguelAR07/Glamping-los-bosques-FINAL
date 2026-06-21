fetch('http://localhost:3000/api/reviews')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
