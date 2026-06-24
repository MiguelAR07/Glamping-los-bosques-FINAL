fetch("https://backend-landing-x76z.onrender.com/api/reservations/test-email")
.then(res => res.json())
.then(console.log)
.catch(console.error);
