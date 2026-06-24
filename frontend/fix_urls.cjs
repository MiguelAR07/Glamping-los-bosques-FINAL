const fs = require('fs');

function applyFix(file, target, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
}

applyFix(
  'c:/Users/migue/OneDrive/Documentos/Landing-Glamping/frontend/src/app/api.ts',
  'const baseEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "https://backend-landing-x76z.onrender.com";',
  'let baseEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "https://backend-landing-x76z.onrender.com";\nif (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && baseEnv.includes("localhost")) {\n  baseEnv = "https://backend-landing-x76z.onrender.com";\n}'
);

applyFix(
  'c:/Users/migue/OneDrive/Documentos/Landing-Glamping/frontend/src/app/components/BookingConfirmation.tsx',
  "const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';",
  "let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';\n      if (typeof window !== \"undefined\" && window.location.hostname !== \"localhost\" && window.location.hostname !== \"127.0.0.1\" && API_BASE_URL.includes(\"localhost\")) {\n        API_BASE_URL = \"https://backend-landing-x76z.onrender.com\";\n      }"
);

applyFix(
  'c:/Users/migue/OneDrive/Documentos/Landing-Glamping/frontend/src/app/components/PromotionsSection.tsx',
  "const res = await fetch(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com'}/api/promociones`);",
  "let baseEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';\n        if (typeof window !== \"undefined\" && window.location.hostname !== \"localhost\" && window.location.hostname !== \"127.0.0.1\" && baseEnv.includes(\"localhost\")) baseEnv = \"https://backend-landing-x76z.onrender.com\";\n        const res = await fetch(`${baseEnv}/api/promociones`);"
);

applyFix(
  'c:/Users/migue/OneDrive/Documentos/Landing-Glamping/frontend/src/app/components/BookingSection.tsx',
  "const resPromos = await fetch(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com'}/api/promociones`)",
  "let baseEnv = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';\n          if (typeof window !== \"undefined\" && window.location.hostname !== \"localhost\" && window.location.hostname !== \"127.0.0.1\" && baseEnv.includes(\"localhost\")) baseEnv = \"https://backend-landing-x76z.onrender.com\";\n          const resPromos = await fetch(`${baseEnv}/api/promociones`)"
);

applyFix(
  'c:/Users/migue/OneDrive/Documentos/Landing-Glamping/frontend/src/app/components/ChatBot.tsx',
  "const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';",
  "let API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://backend-landing-x76z.onrender.com';\n        if (typeof window !== \"undefined\" && window.location.hostname !== \"localhost\" && window.location.hostname !== \"127.0.0.1\" && API_BASE_URL.includes(\"localhost\")) API_BASE_URL = \"https://backend-landing-x76z.onrender.com\";"
);

console.log('Fixed overrides!');
