// Store-wide settings. Update payment details here if they ever change.
export const BRAND_NAME = "Viku's Little Loops";
export const UPI_ID = "varnika.agarwal@ptyes";

// Razorpay payment page (razorpay.me). No API keys required for this flow.
export const RAZORPAY_URL = "https://razorpay.me/@varnikaagarwal";

// razorpay.me does NOT accept an amount in the URL path (that 404s with
// NOT_FOUND), so we link to the page itself and ask the customer to enter
// the order total, which we display next to the button.
export function razorpayLink() {
  return RAZORPAY_URL;
}

// Builds a UPI deep link (opens GPay/PhonePe/Paytm etc. on mobile).
export function upiLink({ amount, note }) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: BRAND_NAME,
    am: String(amount),
    cu: "INR",
    tn: note || "",
  });
  return `upi://pay?${params.toString()}`;
}
