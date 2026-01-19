
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Users,
  Image,
  Film,
  MessageSquare,
  Calendar,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Plus,
  TrendingUp,
  Clock
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-charcoal-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-500">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <p>Error loading dashboard: {error}</p>
      </div>
    );
  }

  const {
    kpi,
    actionRequired,
    pipeline,
    schedule,
    revenue,
    activityFeed,
    ordersByType,
    contentHealth
  } = data;

  // Derive specialized stats
  const totalPipelineValue = "₹" + (revenue.totalOutstanding / 100000).toFixed(1) + "L";
  const collectedThisMonth = "₹" + (revenue.thisMonthCollected / 100000).toFixed(1) + "L";

  return (
    <div className="relative min-h-screen bg-slate-50 text-charcoal-900 pb-20">

      {/* Header & Quick Actions */}
      <header className="mb-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-charcoal-900">Studio Oversight</h1>
            <p className="text-slate-500">Welcome back. Here's what's happening today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <QuickAction to="/orders" label="New Order" icon={Plus} />
            <QuickAction to="/quotations" label="Create Quote" icon={Plus} />
            <QuickAction to="/invoices" label="New Invoice" icon={Plus} />
            <QuickAction to="/enquiries" label="Add Enquiry" icon={Plus} />
          </div>
        </div>

        {/* Action Required Section */}
        {(actionRequired.enquiriesNoReply.length > 0 || actionRequired.overdueInvoices.length > 0) && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
            <div className="mb-3 flex items-center gap-2 text-rose-700">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">Action Required</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {actionRequired.enquiriesNoReply.map(e => (
                <Link key={e._id} to="/enquiries" className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-rose-100 transition hover:ring-rose-200">
                  <span className="truncate font-medium text-charcoal-900">Reply to {e.groomName}</span>
                  <span className="text-xs text-rose-500">Overdue</span>
                </Link>
              ))}
              {actionRequired.overdueInvoices.map(i => (
                <Link key={i._id} to="/invoices" className="flex items-center justify-between rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-rose-100 transition hover:ring-rose-200">
                  <span className="truncate font-medium text-charcoal-900">INV {i.invoiceNumber} Due</span>
                  <span className="text-xs text-rose-500">₹{i.grandTotal}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <KpiCard label="New Enquiries" value={kpi.newEnquiriesWeek} sub={`+${kpi.newEnquiriesToday} today`} icon={MessageSquare} />
        <KpiCard label="Active Orders" value={kpi.newOrdersCount} sub="This month" icon={Calendar} />
        <KpiCard label="Pending Quotes" value={kpi.pendingQuotations} sub="Drafts & Sent" icon={Users} />
        <KpiCard label="Unpaid Invoices" value={kpi.unpaidInvoicesCount} sub={`Total ₹${(kpi.unpaidInvoicesAmount / 1000).toFixed(0)}k`} icon={CreditCard} accent />
        <KpiCard label="Shoots This Week" value={kpi.upcomingShootsCount} sub="Next 7 days" icon={Film} />
        <KpiCard label="Unread Messages" value={kpi.unreadMessages} sub="Contact forms" icon={MessageSquare} />
        <KpiCard label="Testimonials" value={kpi.pendingTestimonials} sub="Pending review" icon={CheckCircle} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">

        {/* Main Content Column */}
        <div className="space-y-8">

          {/* Upcoming Schedule */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-charcoal-900">Upcoming Schedule</h2>
              <Link to="/orders" className="flex items-center text-sm font-medium text-gold-600 hover:text-gold-700">
                View Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {schedule.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-500">No upcoming shoots scheduled.</p>
              ) : (
                schedule.map((evt) => (
                  <div key={evt._id} className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50">
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <span className="text-xs font-bold uppercase">{format(new Date(evt.event_date), 'dd MMM')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate font-medium text-charcoal-900">{evt.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{evt.event_name || 'Event'}</span>
                        <span>•</span>
                        <span>{evt.location || 'Location TBD'}</span>
                      </div>
                    </div>
                    <span className="hidden sm:inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {evt.order_status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Pipeline & Revenue Split */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-charcoal-900">Pipeline Status</h2>
              <div className="space-y-4">
                {pipeline.map((status) => (
                  <div key={status._id} className="group">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">{status._id}</span>
                      <span className="text-slate-500">{status.count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-charcoal-900 transition-all duration-500" style={{ width: `${(status.count / Math.max(...pipeline.map(p => p.count), 1)) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {pipeline.length === 0 && <p className="text-sm text-slate-400">No active orders</p>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-charcoal-900">Revenue Month</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-500">Collected</p>
                  <p className="text-2xl font-bold text-emerald-600">{collectedThisMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Billed</p>
                  <p className="text-2xl font-bold text-charcoal-900">{"₹" + (revenue.thisMonthBilled / 100000).toFixed(1) + "L"}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Outstanding</span>
                    <span className="font-medium text-rose-600">{totalPipelineValue}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* Quick Health Stats */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-charcoal-900">Content Health</h3>
            <div className="space-y-3">
              <HealthRow label="Gallery Queued" value={kpi.galleryQueue} />
              <HealthRow label="Active Slider" value={contentHealth.sliderActive} />
              <HealthRow label="Stories Live" value={contentHealth.storiesPublished} />
              <HealthRow label="Testimonials" value={contentHealth.testimonialsPublished} />
            </div>
          </section>

          {/* Activity Feed */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-charcoal-900">Recent Activity</h3>
            <div className="relative space-y-6 pl-4 before:absolute before:left-1.5 before:top-2 before:h-full before:w-px before:bg-slate-200">
              {activityFeed.map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-white ${item.type === 'Enquiry' ? 'bg-blue-500' :
                      item.type === 'Order' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  <p className="text-sm font-medium text-charcoal-900">{item.text}</p>
                  <p className="text-xs text-slate-400">{format(new Date(item.date), 'MMM dd, HH:mm')}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className={`rounded-2xl border p-5 transition hover:-translate-y-1 hover:shadow-md ${accent ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 bg-white'
      }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-charcoal-900">{value}</p>
        </div>
        <div className={`rounded-xl p-2.5 ${accent ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {sub && <p className="mt-2 text-xs font-medium text-slate-400">{sub}</p>}
    </div>
  );
}

function QuickAction({ to, label, icon: Icon }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 rounded-xl bg-charcoal-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal-800">
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function HealthRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="font-bold text-charcoal-900">{value}</span>
    </div>
  );
}
