async function test() {
    try {
        console.log('Sending empty POST to Render API...');
        const res = await fetch('https://glamping-los-bosques-final1.onrender.com/api/reservations', {
            method: 'POST'
        });
        
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch (e) {
        console.error('FETCH ERROR:', e);
    }
}
test();
