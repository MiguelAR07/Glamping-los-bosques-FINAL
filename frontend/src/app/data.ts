/**
 * Datos centralizados de cabañas y servicios.
 * Se utiliza como una base de datos local simulada para la aplicación web.
 */
export const CABINS = [
  {
    id: "palmas",
    name: "Cabaña Palmas",
    description: "Ideal para parejas, con todas las comodidades de lujo en medio del bosque para una experiencia inolvidable.",
    images: [
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254234/DSC09553_vtda1c.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254234/DSC09548_sebpai.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254231/DSC09513_imkzjs.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777251610/DSC09492_yuxljp.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254232/DSC09531-HDR_j7ukxa.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777219404/DSC09478-HDR_2_qj3liq.jpg"
    ],
    features: ["Jacuzzi privado", "Nevera mini bar", "TV con TDT", "Wifi", "BBQ", "Maya catamaran", "Parqueadero", "Zona de fogata", "Zona verde"],
    plans: {
      occasional: 160000,
      week: 280000,
      weekend: 350000,
      sun_day: 220000
    },
    maxGuests: 4,
    additionalPersonPrice: 70000
  },
  {
    id: "bambu",
    name: "Cabaña Bambú",
    description: "Una inmersión rústica con acabados en bambú, perfecta para quienes buscan conexión profunda con la naturaleza.",
    images: [
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254839/DSC09445-HDR_mcq8gg.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254841/DSC09460-HDR_bp7kh1.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254841/DSC09457-HDR_oczwwj.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254840/DSC09463-HDR_newrcz.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254840/DSC09471_huy3bm.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777254841/DSC09543_y1t1mc.jpg"
    ],
    features: ["Jacuzzi privado", "Nevera mini bar", "TV con TDT", "Wifi", "BBQ", "Parqueadero", "Zona de fogata", "Zona verde"],
    plans: {
      occasional: 160000,
      week: 280000,
      weekend: 350000,
      sun_day: 220000
    },
    maxGuests: 3,
    additionalPersonPrice: 70000
  },
  {
    id: "roble",
    name: "Cabaña Roble",
    description: "Estructura de madera noble con vistas panorámicas, pozo de fuego y jacuzzi privado para veladas románticas.",
    images: [
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777255338/DSC09540_meuzol.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777255337/DSC09429-HDR_kiszgx.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777255337/DSC09439-HDR_v3r5e6.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777255337/DSC09539_eaec0a.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777255338/DSC09418-HDR_ztqtk5.jpg",
      "https://res.cloudinary.com/dzziwcmwd/image/upload/v1777255336/DSC09426-HDR_mcrrad.jpg"
    ],
    features: ["Jacuzzi privado", "Nevera mini bar", "TV con TDT", "Wifi", "BBQ", "Parqueadero", "Pozo de fuego", "Zona verde"],
    plans: {
      occasional: 150000,
      week: 250000,
      weekend: 290000,
      sun_day: 180000
    },
    maxGuests: 2,
    additionalPersonPrice: 0
  }
];

/**
 * Servicios adicionales que el cliente puede contratar.
 * 'price: 0' indica que se coordina externamente o es bajo pedido.
 */
export const SERVICES = [
  { id: 'cumple_sencillo', name: 'Decoración Cumpleaños (Sencilla)', price: 60000, desc: 'Letrero luminoso, bombas, luces' },
  { id: 'cumple_especial', name: 'Decoración Cumpleaños (Especial)', price: 180000, desc: 'Letrero, luces, bombas, pétalos, vino, torta' },
  { id: 'aniv_sencillo', name: 'Decoración Aniversario (Sencilla)', price: 50000, desc: 'Luces, pétalos, letrero' },
  { id: 'aniv_especial', name: 'Decoración Aniversario (Especial)', price: 180000, desc: 'Letrero, bombas, luces, vino, torta, pétalos' }
];
