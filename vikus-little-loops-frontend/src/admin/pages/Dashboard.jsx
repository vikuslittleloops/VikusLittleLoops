import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import {
  FiBox, FiShoppingBag, FiUsers, FiTag, FiDollarSign, FiAlertTriangle, FiHeart,
} from "react-icons/fi";
import { getStats } from "@/admin/lib/adminApi";
import { PageTitle, Panel, Spinner, StatusPill } from "@/admin/components/AdminUI";

const PIE_COLORS = ["#DC6B86", "#E88BA1", "#94A06F", "#C5A6E0", "#F2B0BF", "#7d6fa0"];

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <Panel className="flex items-center gap-4">
      <span className={`grid h-12 w-12 place-items-center rounded-xl ${accent}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-[0.7rem] uppercase tracking-wider text-blush-200/40">{label}</p>
        <p className="mt-0.5 font-display text-2xl font-semibold text-white">{value}</p>
      </div>
    </Panel>
  );
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-stats"], queryFn: getStats });

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <Panel className="text-center text-blush-200/60">
        Couldn't load stats. Is the API running and seeded?
      </Panel>
    );

  const c = data.cards;
  const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Your little boutique at a glance" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={FiDollarSign} label="Revenue" value={inr(c.revenue)} accent="bg-emerald-500/15 text-emerald-300" />
        <StatCard icon={FiShoppingBag} label="Orders" value={c.orders} accent="bg-sky-500/15 text-sky-300" />
        <StatCard icon={FiBox} label="Products" value={c.products} accent="bg-blush-500/15 text-blush-300" />
        <StatCard icon={FiUsers} label="Customers" value={c.customers} accent="bg-violet-500/15 text-violet-300" />
        <StatCard icon={FiTag} label="Categories" value={c.categories} accent="bg-amber-500/15 text-amber-300" />
        <StatCard icon={FiBox} label="Published" value={c.published_products} accent="bg-teal-500/15 text-teal-300" />
        <StatCard icon={FiAlertTriangle} label="Low Stock" value={c.low_stock} accent="bg-red-500/15 text-red-300" />
        <StatCard icon={FiHeart} label="New Custom" value={c.new_custom_orders} accent="bg-pink-500/15 text-pink-300" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Revenue area chart */}
        <Panel>
          <h3 className="mb-4 font-display text-lg text-white">Revenue · Last 7 days</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.revenue_series}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC6B86" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#DC6B86" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" vertical={false} />
              <XAxis dataKey="date" stroke="#ffffff44" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#ffffff44" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#1c1522", border: "1px solid #ffffff1a", borderRadius: 12, color: "#fff" }}
                formatter={(v) => [inr(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#DC6B86" strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        {/* Order status donut */}
        <Panel>
          <h3 className="mb-4 font-display text-lg text-white">Orders by Status</h3>
          {data.status_breakdown.length === 0 ? (
            <div className="grid h-[280px] place-items-center text-center text-blush-200/40">
              <span>No orders yet 🌷</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.status_breakdown}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {data.status_breakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1c1522", border: "1px solid #ffffff1a", borderRadius: 12, color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>

      {/* Recent activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <h3 className="mb-4 font-display text-lg text-white">Recent Orders</h3>
          {data.recent_orders.length === 0 ? (
            <p className="py-8 text-center text-blush-200/40">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.recent_orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-blush-100">{o.order_number}</span>
                  <span className="text-white">{inr(o.total)}</span>
                  <StatusPill status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel>
          <h3 className="mb-4 font-display text-lg text-white">Recent Custom Orders</h3>
          {data.recent_custom_orders.length === 0 ? (
            <p className="py-8 text-center text-blush-200/40">No custom requests yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {data.recent_custom_orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-blush-100">{o.name}</span>
                  <StatusPill status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
