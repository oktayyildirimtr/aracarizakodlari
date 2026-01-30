/**
 * En çok aranan OBD-II arıza kodları (araştırma bazlı, FIXD/Capital One/obd-codes kaynaklı).
 * Sadece bu kodlar şimdilik sayfada gösterilir; diğerleri DB'de kalır.
 */
export const TOP_30_CODES = [
  'P0171', // System too lean Bank 1
  'P0172', // System too rich Bank 1
  'P0174', // System too lean Bank 2
  'P0175', // System too rich Bank 2
  'P0300', // Random/multiple misfire
  'P0301', // Cylinder 1 misfire
  'P0302', // Cylinder 2 misfire
  'P0303', // Cylinder 3 misfire
  'P0304', // Cylinder 4 misfire
  'P0420', // Catalyst efficiency Bank 1
  'P0430', // Catalyst efficiency Bank 2
  'P0455', // EVAP leak large
  'P0440', // EVAP system malfunction
  'P0442', // EVAP leak small
  'P0449', // EVAP vent control
  'P0128', // Coolant thermostat
  'P0101', // MAF range/performance
  'P0102', // MAF circuit low
  'P0120', // Throttle position sensor
  'P0122', // TPS circuit low
  'P0135', // O2 heater Bank 1 Sensor 1
  'P0141', // O2 heater Bank 1 Sensor 2
  'P0325', // Knock sensor
  'P0335', // Crankshaft position
  'P0340', // Camshaft position
  'P0400', // EGR flow
  'P0401', // EGR insufficient flow
  'P0507', // Idle RPM high
  'P0700', // Transmission control
  'P0715', // Transmission input speed
];
