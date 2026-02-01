import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";
import { LogOut, ChevronDown, ChevronRight, LayoutDashboard, Globe, MessageSquare, Settings } from "lucide-react";

const navSections = [
  {
    title: "Operations & Management",
    icon: LayoutDashboard,
    items: [
      { to: "/admin-dashboard", label: "Dashboard" },
      { to: "/admin-calendar", label: "Calendar" },
      { to: "/admin-quotations", label: "Quotations" },
      { to: "/admin-orders", label: "Orders" },
      { to: "/admin-invoices", label: "Invoices" },
      { to: "/admin-clients", label: "Clients" },
    ]
  },
  {
    title: "Website Content",
    icon: Globe,
    items: [
      { to: "/admin-gallery", label: "Portfolio" },
      { to: "/admin-films", label: "Films" },
      { to: "/admin-love-stories", label: "Love Stories" },
      { to: "/admin-slider", label: "Slider" },
      { to: "/admin-popup", label: "Popup Manager" },
      { to: "/admin-testimonials", label: "Testimonials" },
      { to: "/admin-team", label: "Team Management" },
    ]
  },
  {
    title: "Incoming Interactions",
    icon: MessageSquare,
    items: [
      { to: "/admin-enquiries", label: "Enquiries" },
      { to: "/admin-contact-messages", label: "Contact Messages" },
    ]
  },
  {
    title: "System Administration",
    icon: Settings,
    items: [
      { to: "/admin-users", label: "Users" },
      { to: "/admin-accessories", label: "Accessories" },
      { to: "/admin-common-types", label: "Common Types" },
      { to: "/admin-settings", label: "Global Settings" },
      // { to: "/admin-profile", label: "Profile" },
      // { to: "/admin-register", label: "Admin Register" },
    ]
  }
];

export default function Navigation({ isMobileOpen = false, isOpen = true, onClose = () => { }, onLogout }) {
  return (
    <>
      <aside
        aria-label="Main navigation"
        className="hidden flex-shrink-0 lg:flex h-screen sticky top-0 transition-all duration-300 ease-in-out"
        style={{ width: isOpen ? 260 : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="flex flex-col h-full border-r border-gold-200 bg-white dark:border-charcoal-800 dark:bg-charcoal-900 overflow-hidden">
          <div className="p-4"><BrandHeader /></div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 pb-4">
            <NavList />
          </div>
          {/* Logout Section at the bottom */}
          <div className="p-4 border-t border-gray-100 dark:border-charcoal-800">
            <button
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 transition rounded hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 dark:bg-charcoal-900 lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col border-r border-gold-200 dark:border-charcoal-800 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-charcoal-800 flex-shrink-0">
            <BrandHeader compact />
            <button
              type="button"
              aria-label="Close navigation"
              className="rounded-md border border-slate-200 px-3 py-1 text-sm font-semibold text-charcoal-700 hover:bg-slate-100 dark:border-charcoal-700 dark:text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col">
            <NavList onNavigate={onClose} />
            <div className="pt-4 mt-auto border-t border-gray-100 dark:border-charcoal-800">
              <button
                onClick={() => {
                  onClose();
                  if (onLogout) onLogout();
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 transition rounded hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function BrandHeader({ compact = false }) {
  const { data: settings } = useSettings();
  const businessName = settings?.businessName || "The Patil Photography";

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "mb-2"}`}>
      {settings?.primaryLogo ? (
        <img src={settings.primaryLogo} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 p-1" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600">
          <span className="font-playfair text-lg font-bold text-white">P</span>
        </div>
      )}
      <div>
        <h1 className="font-playfair text-sm font-bold text-charcoal-900 dark:text-white leading-tight">{businessName}</h1>
      </div>
    </div>
  );
}

function NavList({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {navSections.map((section, idx) => (
        <NavGroup key={section.title} section={section} onNavigate={onNavigate} defaultOpen={idx === 0} />
      ))}
    </nav>
  );
}

function NavGroup({ section, onNavigate, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const location = useLocation();
  const isActiveGroup = section.items.some(item => location.pathname.startsWith(item.to));

  // Auto-open if a child is active
  useEffect(() => {
    if (isActiveGroup) {
      setIsOpen(true);
    }
  }, [isActiveGroup]);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200
          ${isActiveGroup ? 'bg-gold-50 text-gold-700 dark:bg-charcoal-800 dark:text-gold-400' : 'text-charcoal-600 hover:bg-slate-50 dark:text-charcoal-300 dark:hover:bg-charcoal-800'}
        `}
      >
        <div className="flex items-center gap-2.5">
          <section.icon className={`w-4 h-4 ${isActiveGroup ? 'text-gold-600' : 'text-slate-400'}`} />
          <span>{section.title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 opacity-50" />
        ) : (
          <ChevronRight className="w-4 h-4 opacity-50" />
        )}
      </button>

      {isOpen && (
        <div className="mt-1 ml-4 border-l border-slate-200 dark:border-charcoal-700 space-y-0.5">
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block pl-4 pr-3 py-2 text-sm font-medium border-l-2 -ml-[1px] transition-all
                ${isActive
                  ? "border-gold-500 text-gold-600 bg-gradient-to-r from-gold-50/50 to-transparent dark:from-gold-900/10"
                  : "border-transparent text-slate-600 hover:text-charcoal-900 hover:border-slate-300 dark:text-charcoal-400 dark:hover:text-charcoal-200"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
