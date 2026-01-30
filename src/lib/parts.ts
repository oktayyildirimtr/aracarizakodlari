/**
 * OBD-II arıza kodlarını ilgili parça görselleriyle eşleştirir.
 * Görseller Wikimedia Commons (CC/Public Domain) kaynaklıdır.
 */

export interface PartInfo {
  name_tr: string;
  image_url: string;
  attribution?: string;
}

/** Parça tanımları (Wikimedia Commons, Public Domain/CC). */
const PARTS: Record<string, PartInfo> = {
  maf: {
    name_tr: 'Kütle hava debisi (MAF) sensörü',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/VZ_MAF.jpg/320px-VZ_MAF.jpg',
    attribution: 'VZ MAF - Wikimedia Commons',
  },
  o2_sensor: {
    name_tr: 'Oksijen sensörü (lambda)',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Lambda_sond_till_volvo240_etc.jpg/320px-Lambda_sond_till_volvo240_etc.jpg',
    attribution: 'Lambda sensor - Wikimedia Commons',
  },
  catalytic_converter: {
    name_tr: 'Katalitik konvertör',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Catalyticconverter.jpg/320px-Catalyticconverter.jpg',
    attribution: 'Catalytic converter - Wikimedia Commons',
  },
  spark_plug: {
    name_tr: 'Buji',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Spark_plug.jpg/320px-Spark_plug.jpg',
    attribution: 'Spark plug - Wikimedia Commons',
  },
  throttle: {
    name_tr: 'Gaz kelebeği / gaz pedalı sensörü',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Throttle_body.jpg/320px-Throttle_body.jpg',
    attribution: 'Throttle body - Wikimedia Commons',
  },
  egr: {
    name_tr: 'EGR valfi (egzoz gazı geri dönüşümü)',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/EGR_valve_1.jpg/320px-EGR_valve_1.jpg',
    attribution: 'EGR valve - Wikimedia Commons',
  },
  injector: {
    name_tr: 'Yakıt enjektörü',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Injector_006.jpg/320px-Injector_006.jpg',
    attribution: 'Fuel injector - Wikimedia Commons',
  },
  ignition_coil: {
    name_tr: 'Ateşleme bobini',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Spark_plug.jpg/320px-Spark_plug.jpg',
    attribution: 'Spark plug - Wikimedia Commons',
  },
  turbocharger: {
    name_tr: 'Türboşarj',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Turbocharger.jpg/320px-Turbocharger.jpg',
    attribution: 'Turbocharger - Wikimedia Commons',
  },
  transmission: {
    name_tr: 'Şanzıman',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/ZF_8HP_transmission.jpg/320px-ZF_8HP_transmission.jpg',
    attribution: 'Automatic transmission - Wikimedia Commons',
  },
};

/** description_en veya code'a göre parça eşlemesi (en spesifik önce). */
const PART_RULES: { pattern: RegExp | ((code: string, desc: string) => boolean); part_id: keyof typeof PARTS }[] = [
  { pattern: /\b(MAF|Mass or Volume Air flow|Mass Air Flow)\b/i, part_id: 'maf' },
  { pattern: /\b(O2 Sensor|Oxygen Sensor|HO2S|H02S|Lambda)\b/i, part_id: 'o2_sensor' },
  { pattern: /\b(System Too Lean|System Too Rich|Fuel Trim)\b/i, part_id: 'o2_sensor' },
  { pattern: /\b(Catalyst|Catalytic)\b/i, part_id: 'catalytic_converter' },
  { pattern: /\b(EGR|Exhaust Gas Recirculation)\b/i, part_id: 'egr' },
  { pattern: /\b(Ignition Coil|Ignition coil)\b/i, part_id: 'ignition_coil' },
  { pattern: /\b(Spark plug|Spark Plug)\b/i, part_id: 'spark_plug' },
  { pattern: /\b(Misfire)\b/i, part_id: 'spark_plug' },
  { pattern: (code) => /^P03\d{2}$/.test(code), part_id: 'spark_plug' as const },
  { pattern: /\b(Injector)\b/i, part_id: 'injector' },
  { pattern: (code) => /^P02\d{2}$/.test(code), part_id: 'injector' as const },
  { pattern: /\b(Throttle|Pedal Position)\b/i, part_id: 'throttle' },
  { pattern: /\b(Turbocharger|Turbo|Supercharger)\b/i, part_id: 'turbocharger' },
  { pattern: /\b(Transmission)\b/i, part_id: 'transmission' },
  { pattern: (code) => /^P07\d{2}$|^P08\d{2}$|^P09\d{2}$/.test(code), part_id: 'transmission' as const },
];

function matchPattern(
  rule: (typeof PART_RULES)[0],
  code: string,
  desc: string
): boolean {
  if (typeof rule.pattern === 'function') {
    return rule.pattern(code, desc);
  }
  return rule.pattern.test(desc) || rule.pattern.test(code);
}

/**
 * Arıza koduna ait parça bilgisini döndürür (görsel + ad).
 * Eşleşme yoksa null.
 */
export function getPartForFaultCode(code: string, description_en: string | null): PartInfo | null {
  const desc = description_en || '';
  for (const rule of PART_RULES) {
    if (matchPattern(rule, code, desc)) {
      const part = PARTS[rule.part_id];
      if (part) return part;
    }
  }
  return null;
}
