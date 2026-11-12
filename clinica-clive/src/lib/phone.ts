/** Aplica a máscara (XX) XXXXX-XXXX enquanto o usuário digita. */
export function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

/** Celular brasileiro: DDD válido (11–99) + 9 + 8 dígitos. */
export function isValidBrMobile(value: string) {
  return /^[1-9][1-9]9\d{8}$/.test(onlyDigits(value));
}

export function formatPhone(digits: string) {
  return maskPhone(digits);
}
