export function faultCodeSlug(code: string): string {
  return `/${code.toLowerCase()}-nedir`;
}

export function brandModelSlug(brand: string, model: string, code: string): string {
  const b = brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const m = model.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return `/${b}-${m}-${code.toLowerCase()}`;
}
