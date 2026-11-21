import type { Locale } from "@/i18n/config";
import { isMalaysianStateCode, stateByCode } from "@/content/malaysia";

/**
 * Malaysian address and contact validation.
 *
 * Kept separate from the form component so the rules can be tested without a
 * browser. Nothing here guesses a value — every field the courier needs is
 * required, because an incomplete address is the most common cause of a failed
 * delivery.
 */

export interface AddressInput {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  city: string;
  stateCode: string;
  notes: string;
}

export type AddressField = keyof AddressInput;

export type AddressErrors = Partial<Record<AddressField, string>>;

export const emptyAddress: AddressInput = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  postcode: "",
  city: "",
  stateCode: "",
  notes: "",
};

/** Malaysian mobile and landline numbers, with or without +60 / leading 0. */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+60")) return `0${digits.slice(3)}`;
  if (digits.startsWith("60") && digits.length > 10) return `0${digits.slice(2)}`;
  return digits;
}

/**
 * Accepts the formats customers actually type: 012-345 6789, +60 12 345 6789,
 * 0123456789. Malaysian mobile numbers are 9–11 digits after normalisation;
 * landlines in peninsular Malaysia are 8–9 digits with an area code.
 */
export function isValidMalaysianPhone(raw: string): boolean {
  const normalised = normalisePhone(raw);
  if (!/^0\d{8,10}$/.test(normalised)) return false;
  // Mobile prefixes start 01; landline area codes start 03–09.
  return /^0[1-9]/.test(normalised);
}

export function isValidEmail(raw: string): boolean {
  const value = raw.trim();
  if (value.length < 5 || value.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
}

/** Malaysian postcodes are exactly five digits. */
export function isValidPostcode(raw: string): boolean {
  return /^\d{5}$/.test(raw.trim());
}

/** Validation messages in the visitor's language. */
const messages: Record<Locale, Record<AddressField | "state", string>> = {
  en: {
    fullName: "Enter the full name of the person receiving the parcel.",
    phone: "Enter a Malaysian phone number, for example 012-345 6789.",
    email: "Enter an email address so we can send your order confirmation.",
    addressLine1: "Enter the street address, building and unit number.",
    addressLine2: "",
    postcode: "Enter the five-digit postcode.",
    city: "Enter the city or town.",
    stateCode: "Choose the state or federal territory.",
    notes: "",
    state: "Choose a valid state or federal territory.",
  },
  ms: {
    fullName: "Masukkan nama penuh penerima bungkusan.",
    phone: "Masukkan nombor telefon Malaysia, contohnya 012-345 6789.",
    email: "Masukkan alamat e-mel supaya kami boleh menghantar pengesahan pesanan.",
    addressLine1: "Masukkan alamat jalan, nama bangunan dan nombor unit.",
    addressLine2: "",
    postcode: "Masukkan poskod lima digit.",
    city: "Masukkan bandar atau pekan.",
    stateCode: "Pilih negeri atau wilayah persekutuan.",
    notes: "",
    state: "Pilih negeri atau wilayah persekutuan yang sah.",
  },
  zh: {
    fullName: "请填写收件人的全名。",
    phone: "请填写马来西亚电话号码，例如 012-345 6789。",
    email: "请填写电邮地址，以便我们发送订单确认。",
    addressLine1: "请填写街道地址、建筑物名称与单位编号。",
    addressLine2: "",
    postcode: "请填写五位数的邮政编码。",
    city: "请填写城市或城镇。",
    stateCode: "请选择州属或联邦直辖区。",
    notes: "",
    state: "请选择有效的州属或联邦直辖区。",
  },
};

/**
 * Validate an address. Optional fields (address line 2, delivery notes) are
 * never required; everything the courier needs is.
 */
export function validateAddress(input: AddressInput, locale: Locale): AddressErrors {
  const errors: AddressErrors = {};
  const copy = messages[locale];

  if (input.fullName.trim().length < 2) errors.fullName = copy.fullName;
  if (!isValidMalaysianPhone(input.phone)) errors.phone = copy.phone;
  if (!isValidEmail(input.email)) errors.email = copy.email;
  if (input.addressLine1.trim().length < 5) errors.addressLine1 = copy.addressLine1;
  if (!isValidPostcode(input.postcode)) errors.postcode = copy.postcode;
  if (input.city.trim().length < 2) errors.city = copy.city;
  if (!input.stateCode || !isMalaysianStateCode(input.stateCode)) {
    errors.stateCode = copy.stateCode;
  }

  return errors;
}

export function hasErrors(errors: AddressErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Human-readable label for a state code, in the visitor's language. */
export function stateLabel(code: string, locale: Locale): string {
  return stateByCode.get(code)?.name[locale] ?? "";
}

/** True when the destination is in East Malaysia, which affects delivery. */
export function isEastMalaysia(stateCode: string): boolean {
  return stateByCode.get(stateCode)?.eastMalaysia ?? false;
}

/**
 * Safe lookup used by the form and tests. Exported separately from the internal
 * map so callers do not reach into the data structure directly.
 */
export function isMalaysianStateCodeSafe(code: string): boolean {
  return isMalaysianStateCode(code);
}
