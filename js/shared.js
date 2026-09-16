/**
 * Saliim Platform - Shared Utilities & Helpers
 * Dr. Ahmed Elkhateeb (Saliim)
 */

// Google Sheets Unified Webhook URL
window.GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxVYE6T2lYH87A7R8Yuzcl_PfE1920BA9pHC9zB0GHu-RuxEXC_PgWQhtgkBA_8pCtnyQ/exec";

// ==========================================================
// 1. LEGAL MODALS CONTROLS (Privacy, Terms, Medical, Refund)
// ==========================================================
window.openLegalModal = function(type) {
  const modal = document.getElementById('legal-modal');
  const types = ['privacy', 'terms', 'medical', 'refund'];
  types.forEach(t => {
    const el = document.getElementById('legal-content-' + t);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById('legal-content-' + type);
  if (target) target.classList.remove('hidden');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  if (window.lucide) lucide.createIcons();
};

window.closeLegalModal = function() {
  const modal = document.getElementById('legal-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
};

// ==========================================================
// 2. COUNTRY CODE & PHONE INLINE VALIDATION HELPERS
// ==========================================================
window.updatePhonePlaceholder = function(context) {
  const codeSelect = document.getElementById('phone_country_code');
  const phoneInput = document.getElementById('client_phone');
  if (!codeSelect || !phoneInput) return;
  const code = codeSelect.value;
  if (code === '+966') phoneInput.placeholder = '50 123 4567';
  else if (code === '+20') phoneInput.placeholder = '10 1234 5678';
  else if (code === '+971') phoneInput.placeholder = '50 123 4567';
  else if (code === '+965') phoneInput.placeholder = '50 123 456';
  else if (code === '+1') phoneInput.placeholder = '202 555 0123';
  else phoneInput.placeholder = '123456789';
  window.clearPhoneError();
};

window.showPhoneError = function(msg) {
  const input = document.getElementById('client_phone');
  const errBox = document.getElementById('phone-error-msg');
  const errText = document.getElementById('phone-error-text');
  if (input) {
    input.classList.remove('border-slate-700', 'focus:border-[#18746F]', 'focus:border-[#07C1BE]');
    input.classList.add('border-rose-500', 'bg-rose-950/20');
    input.focus();
  }
  if (errBox) {
    errBox.classList.remove('hidden');
    if (errText) errText.innerText = msg;
  }
  if (window.lucide) lucide.createIcons();
};

window.clearPhoneError = function() {
  const input = document.getElementById('client_phone');
  const errBox = document.getElementById('phone-error-msg');
  if (input) {
    input.classList.remove('border-rose-500', 'bg-rose-950/20');
    input.classList.add('border-slate-700');
  }
  if (errBox) {
    errBox.classList.add('hidden');
  }
};

window.getFormattedFullPhone = function() {
  const codeSelect = document.getElementById('phone_country_code');
  const phoneInput = document.getElementById('client_phone');
  if (!phoneInput) return '';
  let raw = phoneInput.value.trim().replace(/[^\d+]/g, '');
  if (!raw) return '';

  // If user pasted a number with country code
  if (raw.startsWith('+')) {
    return raw;
  }

  // Remove leading zeros e.g. 050 -> 50
  raw = raw.replace(/^0+/, '');
  const code = codeSelect ? codeSelect.value : '+966';
  return (code === '+' ? '+' : code) + raw;
};

window.setPhoneAndCountryCode = function(fullNumber) {
  if (!fullNumber) return;
  const codeSelect = document.getElementById('phone_country_code');
  const phoneInput = document.getElementById('client_phone');
  if (!codeSelect || !phoneInput) return;

  let clean = fullNumber.trim().replace(/[^\d+]/g, '');
  const knownCodes = [
    "+966", "+971", "+965", "+974", "+968", "+973", "+962", "+964", "+961",
    "+212", "+213", "+216", "+218", "+249", "+967", "+20", "+44", "+49", "+90", "+1"
  ];
  
  let matchedCode = '+966';
  for (const c of knownCodes) {
    if (clean.startsWith(c)) {
      matchedCode = c;
      clean = clean.substring(c.length);
      break;
    }
  }
  codeSelect.value = matchedCode;
  phoneInput.value = clean.replace(/^0+/, '');
};

// Global DOM setup for phone inputs
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('client_phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', window.clearPhoneError);
  }
  if (window.lucide) {
    lucide.createIcons();
  }
});
