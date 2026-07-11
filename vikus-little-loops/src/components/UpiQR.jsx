import { QRCodeSVG } from "qrcode.react";
import { upiLink } from "@/lib/shopConfig";
import { inr } from "@/lib/format";

// Renders a UPI QR encoding the exact amount + order note.
// Scanning it in any UPI app opens payment with the amount pre-filled.
export default function UpiQR({ amount, note, size = 180 }) {
  const value = upiLink({ amount, note });
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl border border-blush-200/60 bg-white p-3 shadow-soft">
        <QRCodeSVG value={value} size={size} level="M" fgColor="#3D2A2E" bgColor="#ffffff" />
      </div>
      <p className="mt-2 text-xs text-warmgray">Scan to pay {inr(amount)} via any UPI app</p>
    </div>
  );
}
