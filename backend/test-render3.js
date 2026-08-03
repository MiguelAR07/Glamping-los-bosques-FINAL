async function test() {
    try {
        console.log('Sending OPTIONS to Render API...');
        const res = await fetch('https://glamping-los-bosques-final1.onrender.com/api/reservations', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://panel.glampinglosbosques.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'authorization,content-type'
            }
        });
        
        const text = await res.text();
        console.log('STATUS:', res.status);
        console.log('RESPONSE:', text);
    } catch (e) {
        console.error('FETCH ERROR:', e);
    }
}
test();
