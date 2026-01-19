import { useState, useEffect } from 'react';
import {
  FileText, CreditCard, Users, TrendingUp, AlertCircle,
  Calendar, Activity, Image, Film, MessageCircle,
  CheckCircle, Clock, Plus, ExternalLink, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../services/dashboardService';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const stats = await dashboardService.getStats();
      setData(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (!data) return <div className="text-center p-10">Error loading dashboard data.</div>;

  const { kpi, actionRequired, pipeline, upcomingSchedule, revenue, activityFeed, contentHealth } = data;

  // --- Components ---

  const KpiCard = ({ label, value, subtext, icon: Icon, color = "text-gold-600", bg = "bg-gold-100" }) => (
    <div className="bg-white dark:bg-charcoal-800 p-4 rounded-xl shadow-sm border border-gold-100 dark:border-charcoal-700 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-montserrat font-medium text-charcoal-500 dark:text-charcoal-400 uppercase tracking-wide">{label}</p>
          <h3 className="text-2xl font-playfair font-bold text-charcoal-900 dark:text-white mt-1">{value}</h3>
          {subtext && <p className="text-xs text-charcoal-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );

  const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-gold-500" />}
      <h2 className="text-lg font-playfair font-bold text-charcoal-800 dark:text-white">{title}</h2>
    </div>
  );

  const QuickActionButton = ({ to, label, icon: Icon }) => (
    <Link to={to} className="flex flex-col items-center justify-center p-4 bg-white dark:bg-charcoal-800 rounded-lg border border-dashed border-charcoal-300 dark:border-charcoal-600 hover:border-gold-500 hover:bg-gold-50 dark:hover:bg-charcoal-700 transition-all group">
      <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-charcoal-700 flex items-center justify-center mb-2 group-hover:bg-gold-500 transition-colors">
        <Icon className="w-5 h-5 text-gold-600 group-hover:text-white transition-colors" />
      </div>
      <span className="text-xs font-medium text-charcoal-600 dark:text-charcoal-300">{label}</span>
    </Link>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-10">

      {/* 1. Header & Quick Refresh */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-charcoal-900 dark:text-white">Dashboard</h1>
          <p className="font-montserrat text-sm text-charcoal-500 dark:text-charcoal-400 mt-1">Overview of your photography business</p>
        </div>
        <button onClick={fetchDashboardData} className="flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 font-medium">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* 2. Top Summary Cards (KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KpiCard
          label="New Enquiries"
          value={kpi.newEnquiries.today}
          subtext={`${kpi.newEnquiries.week} this week`}
          icon={MessageCircle}
          color="text-blue-600" bg="bg-blue-100 dark:bg-blue-900/20"
        />
        <KpiCard
          label="Pending Orders"
          value={kpi.pendingOrders}
          subtext="Active shoots"
          icon={CameraIcon}
          color="text-purple-600" bg="bg-purple-100 dark:bg-purple-900/20"
        />
        <KpiCard
          label="Pending Quotes"
          value={kpi.pendingQuotations}
          subtext="Drafts & Sent"
          icon={FileText}
        />
        <KpiCard
          label="Unpaid Invoices"
          value={kpi.unpaidInvoices.count}
          subtext={`₹${kpi.unpaidInvoices.amount.toLocaleString()}`}
          icon={AlertCircle}
          color="text-red-500" bg="bg-red-100 dark:bg-red-900/20"
        />
        <KpiCard
          label="Upcoming Shoots"
          value={kpi.upcomingShoots}
          subtext="Next 7 days"
          icon={Calendar}
          color="text-emerald-500" bg="bg-emerald-100 dark:bg-emerald-900/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 3. Action Required & Revenue */}
        <div className="lg:col-span-2 space-y-8">

          {/* Action Required */}
          {(actionRequired.urgentEnquiries.length > 0 || actionRequired.overdueInvoices.length > 0 || actionRequired.stuckQuotations.length > 0) && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-6">
              <SectionTitle title="Needs Attention" icon={AlertCircle} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionRequired.urgentEnquiries.map(item => (
                  <Link key={item.id} to="/enquiries" className="flex items-center justify-between p-3 bg-white dark:bg-charcoal-800 rounded-lg shadow-sm hover:shadow border border-red-200 dark:border-red-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal-900 dark:text-white">Enquiry: {item.groomName} & {item.brideName}</p>
                        <p className="text-xs text-charcoal-500">Pending &gt; 24h</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-charcoal-400" />
                  </Link>
                ))}
                {actionRequired.overdueInvoices.map(item => (
                  <Link key={item.id} to={`/invoices`} className="flex items-center justify-between p-3 bg-white dark:bg-charcoal-800 rounded-lg shadow-sm hover:shadow border border-red-200 dark:border-red-900/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal-900 dark:text-white">Inv #{item.invoiceNumber}</p>
                        <p className="text-xs text-charcoal-500">Overdue ₹{Number(item.grandTotal).toLocaleString()}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-charcoal-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Snapshot */}
          <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-100 dark:border-charcoal-700">
            <SectionTitle title="Revenue Snapshot (This Month)" icon={TrendingUp} />
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-charcoal-700/50 rounded-lg">
                <p className="text-sm text-charcoal-500">Billed</p>
                <p className="text-xl font-bold text-charcoal-900 dark:text-white">₹{revenue.billedThisMonth.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">Collected</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">₹{revenue.collectedThisMonth.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gold-50 dark:bg-gold-900/10 rounded-lg">
                <p className="text-sm text-gold-700 dark:text-gold-400">Outstanding</p>
                <p className="text-xl font-bold text-gold-700 dark:text-gold-400">₹{revenue.outstanding.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Orders Pipeline */}
          <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-100 dark:border-charcoal-700">
            <SectionTitle title="Order Pipeline" icon={Activity} />
            <div className="relative pt-6 pb-2">
              <div className="flex justify-between mb-2">
                {['Pending', 'In Progress', 'Delivered', 'Cancelled'].map((status) => (
                  <div key={status} className="text-center w-1/4">
                    <div className="text-2xl font-bold text-charcoal-800 dark:text-white">{pipeline[status] || 0}</div>
                    <div className="text-xs uppercase font-medium text-charcoal-500 mt-1">{status}</div>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-100 dark:bg-charcoal-700 rounded-full overflow-hidden flex">
                <div style={{ flex: pipeline['Pending'] || 0 }} className="bg-orange-400"></div>
                <div style={{ flex: pipeline['In Progress'] || 0 }} className="bg-blue-500"></div>
                <div style={{ flex: pipeline['Delivered'] || 0 }} className="bg-green-500"></div>
                <div style={{ flex: pipeline['Cancelled'] || 0 }} className="bg-red-400"></div>
              </div>
            </div>
          </div>

          {/* Upcoming Schedule */}
          <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-100 dark:border-charcoal-700">
            <SectionTitle title="Upcoming Schedule" icon={Calendar} />
            {upcomingSchedule.length > 0 ? (
              <div className="space-y-4">
                {upcomingSchedule.map(event => (
                  <div key={event.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-charcoal-700 rounded-lg transition-colors border-l-4 border-gold-500">
                    <div className="flex-col items-center justify-center text-center min-w-[60px]">
                      <span className="block text-sm font-bold text-gold-600">{new Date(event.event_date).getDate()}</span>
                      <span className="block text-xs text-charcoal-500 uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-charcoal-900 dark:text-white">{event.event_name || event.name}</h4>
                      <p className="text-sm text-charcoal-500">{event.location} • {event.photography_type}</p>
                    </div>
                    <Link to={`/orders/${event.id}`} className="text-xs font-medium text-gold-600 px-3 py-1 bg-gold-50 dark:bg-charcoal-600 rounded-full">View</Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-charcoal-500 py-4">No upcoming shoots scheduled.</p>
            )}
          </div>

        </div>

        {/* 4. Sidebar: Quick Actions, Feed, Health */}
        <div className="space-y-8">

          {/* Quick Actions */}
          <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-100 dark:border-charcoal-700">
            <h3 className="text-sm font-bold text-charcoal-400 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton to="/orders" label="New Order" icon={Plus} />
              <QuickActionButton to="/quotations" label="New Quote" icon={FileText} />
              <QuickActionButton to="/invoices" label="New Invoice" icon={CreditCard} />
              <QuickActionButton to="/enquiries" label="Add Enquiry" icon={MessageCircle} />
            </div>
          </div>

          {/* Content Health */}
          <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-100 dark:border-charcoal-700">
            <SectionTitle title="Content Health" icon={Image} />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-charcoal-700 rounded">
                <span className="text-charcoal-600 dark:text-charcoal-300">Slider Images</span>
                <span className="font-bold text-green-600">{contentHealth.slider.active} Active</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-charcoal-700 rounded">
                <span className="text-charcoal-600 dark:text-charcoal-300">Love Stories</span>
                <span className="font-bold text-green-600">{contentHealth.loveStories.active} Pub</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-charcoal-700 rounded">
                <span className="text-charcoal-600 dark:text-charcoal-300">Testimonials</span>
                <span className="font-bold text-green-600">{contentHealth.testimonials.active} Pub</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-charcoal-700 rounded">
                <span className="text-charcoal-600 dark:text-charcoal-300">Gallery Albums</span>
                <span className="font-bold text-green-600">{contentHealth.gallery.active} Active</span>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white dark:bg-charcoal-800 p-6 rounded-xl border border-charcoal-100 dark:border-charcoal-700">
            <SectionTitle title="Recent Activity" icon={Clock} />
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activityFeed.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start pb-3 border-b border-gray-100 dark:border-charcoal-700 last:border-0 hover:bg-gray-50 dark:hover:bg-charcoal-700/30 p-2 rounded transition-colors">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${item.type === 'Order' ? 'bg-purple-500' :
                    item.type === 'Invoice' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                  <div>
                    <p className="text-sm text-charcoal-800 dark:text-gray-200">{item.message}</p>
                    <p className="text-xs text-charcoal-400 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {activityFeed.length === 0 && <p className="text-sm text-charcoal-400">No recent activity.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const CameraIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);
