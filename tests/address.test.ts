/**
 * Malaysian address and contact validation tests.
 *
 * Run with: npm test
 *
 * These rules exist so a parcel is not dispatched to an incomplete or
 * unroutable address, so each rejection case matters commercially.
 */
import {
  emptyAddress,
  isEastMalaysia,
  isMalaysianStateCodeSafe,
  isValidEmail,
  isValidMalaysianPhone,
  isValidPostcode,
  normalisePhone,
  validateAddress,
  type AddressInput,
} from "@/lib/address";
import { malaysianStates } from "@/content/malaysia";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
}

/* -------------------------------- Phone ---------------------------------- */

const validPhones = [
  "012-345 6789",
  "+60 12 345 6789",
  "0123456789",
  "60123456789",
  "03-1234 5678",
  "+60312345678",
];
for (const phone of validPhones) {
  check(`valid phone accepted: ${phone}`, isValidMalaysianPhone(phone));
}

const invalidPhones = ["12345", "", "abc", "0123", "+1 555 0100", "000"];
for (const phone of invalidPhones) {
  check(`invalid phone rejected: ${JSON.stringify(phone)}`, !isValidMalaysianPhone(phone));
}

check("normalise +60 to leading 0", normalisePhone("+60 12 345 6789") === "0123456789");
check("normalise 60 prefix", normalisePhone("60123456789") === "0123456789");

/* -------------------------------- Email ---------------------------------- */

check("valid email accepted", isValidEmail("buyer@example.com"));
check("email with plus accepted", isValidEmail("buyer+shop@example.com"));
check("email with subdomain accepted", isValidEmail("a@mail.example.com.my"));
check("email without domain rejected", !isValidEmail("buyer@"));
check("email without TLD rejected", !isValidEmail("buyer@example"));
check("email with space rejected", !isValidEmail("buy er@example.com"));

/* ------------------------------- Postcode -------------------------------- */

check("5-digit postcode accepted", isValidPostcode("50450"));
check("4-digit postcode rejected", !isValidPostcode("5045"));
check("6-digit postcode rejected", !isValidPostcode("504500"));
check("letters rejected", !isValidPostcode("5045A"));

/* ------------------------------ Full address ----------------------------- */

const validAddress: AddressInput = {
  ...emptyAddress,
  fullName: "Aisyah binti Rahman",
  phone: "012-345 6789",
  email: "aisyah@example.com",
  addressLine1: "12 Jalan Ampang, Unit 8-3",
  postcode: "50450",
  city: "Kuala Lumpur",
  stateCode: "KUL",
};

const okErrors = validateAddress(validAddress, "en");
check("complete address passes validation", Object.keys(okErrors).length === 0, JSON.stringify(okErrors));

const emptyErrors = validateAddress(emptyAddress, "en");
check("empty address fails all required fields", Object.keys(emptyErrors).length >= 7);
check("optional fields are never required", !emptyErrors.addressLine2 && !emptyErrors.notes);

const badState = validateAddress({ ...validAddress, stateCode: "XXX" }, "en");
check("unknown state code rejected", !!badState.stateCode);

const shortName = validateAddress({ ...validAddress, fullName: "A" }, "en");
check("one-character name rejected", !!shortName.fullName);

const shortAddress = validateAddress({ ...validAddress, addressLine1: "12" }, "en");
check("too-short street address rejected", !!shortAddress.addressLine1);

/* --------------------------- Localized messages -------------------------- */

for (const locale of ["en", "ms", "zh"] as const) {
  const errs = validateAddress(emptyAddress, locale);
  check(`${locale} produces localized messages`, !!errs.phone && errs.phone.length > 5);
}
const enMsg = validateAddress(emptyAddress, "en").phone;
const msMsg = validateAddress(emptyAddress, "ms").phone;
const zhMsg = validateAddress(emptyAddress, "zh").phone;
check("messages differ per language", enMsg !== msMsg && msMsg !== zhMsg);

/* ------------------------------- Geography ------------------------------- */

check("16 states/territories registered", malaysianStates.length === 16, String(malaysianStates.length));
check("exactly 3 federal territories", malaysianStates.filter((s) => s.federalTerritory).length === 3);
check("Labuan is East Malaysia", isEastMalaysia("LBN"));
check("Sabah is East Malaysia", isEastMalaysia("SBH"));
check("Sarawak is East Malaysia", isEastMalaysia("SWK"));
check("Selangor is not East Malaysia", !isEastMalaysia("SGR"));
check("Kuala Lumpur is not East Malaysia", !isEastMalaysia("KUL"));

check("every state has all three language names", malaysianStates.every(
  (state) => state.name.en && state.name.ms && state.name.zh,
));
check("every state code is unique",
  new Set(malaysianStates.map((s) => s.code)).size === malaysianStates.length);
check("state code validation works", isMalaysianStateCodeSafe("JHR") && !isMalaysianStateCodeSafe("ZZZ"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
