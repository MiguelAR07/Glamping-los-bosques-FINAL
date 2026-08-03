const fetch = require('node-fetch');

async function check() {
  const cabins = await (await fetch('https://backend-landing-x76z.onrender.com/api/cabins/full')).json();
  const pkgs = await (await fetch('https://backend-landing-x76z.onrender.com/api/packages')).json();
  const types = await (await fetch('https://backend-landing-x76z.onrender.com/api/packages/types')).json();
  
  const cabanasList = cabins.cabins;
  
  const selectedCabinId = "1";
  const selectedCabin = cabanasList.find(c => String(c.cabana_id) === selectedCabinId);
  
  console.log("=== PRECIOS DE CABAÑA PALMAS ===");
  console.log("precio_noche:", selectedCabin.precio_noche);
  
  for (const pt of types.data || types) {
    let planPrice = 0;
    const match = pkgs.data.find(pkg => String(pkg.cabana_id) === selectedCabinId && String(pkg.tipo_id) === String(pt.tipo_id));
    
    if (match && match.precio > 0) {
      planPrice = Number(match.precio);
    }
    
    if (planPrice === 0 && selectedCabin) {
      planPrice = Number(selectedCabin.precio_noche || 0);
    }
    
    console.log(`Plan: ${pt.nombre} | match_found: ${!!match} | match_precio: ${match?.precio} | Final planPrice: ${planPrice}`);
  }
}

check().catch(console.error);
