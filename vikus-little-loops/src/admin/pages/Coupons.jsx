import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiPlus, FiCheckCircle } from "react-icons/fi";
import { createCoupon } from "@/admin/lib/adminApi";
import { PageTitle, Panel } from "@/admin/components/AdminUI";

const inp = "w-full rounded-xl border border-white/10 bg-[#15101a] px-4 py-2.5 text-sm text-white outline-none focus:border-blush-500";
const lbl = "mb-1.5 block text-xs uppercase tracking-wide text-blush-200/50";

export default function Coupons() {
  const [form, setForm] = useState({ code: "", discount_type: "percent", value: "", min_order_amount: "0", usage_limit: "" });

  const create = useMutation({ mutationFn: createCoupon });

  const submit = (e) => {
    e.preventDefault();
    create.mutate({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      value: Number(form.value),
      min_order_amount: Number(form.min_order_amount) || 0,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      is_active: true,
    }, { onSuccess: () => setForm({ code: "", discount_type: "percent", value: "", min_order_amount: "0", usage_limit: "" }) });
  };

  return (
    <>
      <PageTitle title="Coupons" subtitle="Create discount codes for your shop" />
      <Panel className="max-w-xl">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={lbl}>Code</label>
            <input className={`${inp} uppercase`} placeholder="WELCOME10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Type</label>
              <select className={inp} value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Value</label>
              <input type="number" step="0.01" className={inp} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Min order (₹)</label>
              <input type="number" className={inp} value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} />
            </div>
            <div>
              <label className={lbl}>Usage limit</label>
              <input type="number" className={inp} placeholder="∞" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} />
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blush-400 to-blush-600 py-3 text-sm font-medium uppercase tracking-wide text-white hover:shadow-lift">
            <FiPlus /> Create Coupon
          </button>
          {create.isSuccess && (
            <p className="flex items-center justify-center gap-2 text-sm text-emerald-300"><FiCheckCircle /> Coupon created!</p>
          )}
          {create.isError && <p className="text-center text-sm text-red-400">Could not create (code may exist).</p>}
        </form>
      </Panel>
    </>
  );
}
