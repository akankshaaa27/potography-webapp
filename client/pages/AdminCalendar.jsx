
import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../Calendar.css'; // Import custom styles
import PageHeader from "../components/PageHeader";

// Setup the localizer
const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Mock Holidays for 2026 (Approximate for movable feasts)
const HOLIDAYS_2026 = [
    { id: 'h1', title: 'Republic Day', allDay: true, start: new Date(2026, 0, 26), end: new Date(2026, 0, 26), type: 'holiday' },
    { id: 'h2', title: 'Maha Shivaratri', allDay: true, start: new Date(2026, 1, 16), end: new Date(2026, 1, 16), type: 'holiday' },
    { id: 'h3', title: 'Holi', allDay: true, start: new Date(2026, 2, 4), end: new Date(2026, 2, 4), type: 'holiday' },
    { id: 'h4', title: 'Gudi Padwa', allDay: true, start: new Date(2026, 2, 19), end: new Date(2026, 2, 19), type: 'holiday' },
    { id: 'h5', title: 'Independence Day', allDay: true, start: new Date(2026, 7, 15), end: new Date(2026, 7, 15), type: 'holiday' },
    { id: 'h6', title: 'Ganesh Chaturthi', allDay: true, start: new Date(2026, 8, 14), end: new Date(2026, 8, 14), type: 'holiday' },
    { id: 'h7', title: 'Gandhi Jayanti', allDay: true, start: new Date(2026, 9, 2), end: new Date(2026, 9, 2), type: 'holiday' },
    { id: 'h8', title: 'Dussehra', allDay: true, start: new Date(2026, 9, 20), end: new Date(2026, 9, 20), type: 'holiday' },
    { id: 'h9', title: 'Diwali', allDay: true, start: new Date(2026, 10, 8), end: new Date(2026, 10, 8), type: 'holiday' },
    { id: 'h10', title: 'Christmas', allDay: true, start: new Date(2026, 11, 25), end: new Date(2026, 11, 25), type: 'holiday' },
];

export default function AdminCalendar() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            const res = await fetch("/api/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const events = useMemo(() => {
        // Transform orders into calendar events
        const orderEvents = orders.map(order => {
            const startDate = order.event_date ? new Date(order.event_date) : (order.date ? new Date(order.date) : null);
            if (!startDate) return null;

            // Handle multi-day events if event_end_date is present
            const endDate = order.event_end_date ? new Date(order.event_end_date) : startDate;

            return {
                id: order._id,
                title: `${order.name || order.customerName} - ${order.event_name || 'Event'}`,
                start: startDate,
                end: endDate,
                allDay: true, // Most events are all day for now or we can parse start_time/end_time
                resource: order,
                type: 'order',
                status: order.order_status || order.status || 'Pending'
            };
        }).filter(Boolean);

        return [...HOLIDAYS_2026, ...orderEvents];
    }, [orders]);

    const eventStyleGetter = (event, start, end, isSelected) => {
        let className = '';
        if (event.type === 'holiday') {
            className = 'type-holiday';
        } else if (event.type === 'order') {
            className = `type-order-${event.status.replace(/\s+/g, '')}`;
        }
        return { className };
    };

    return (
        <section className="mt-4 container mx-auto p-4 pb-20">
            <PageHeader
                title="Schedule"
                description="View bookings and holidays in a calendar view."
            />

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" style={{ height: '80vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                    defaultView={Views.MONTH}
                    popup
                    tooltipAccessor={event => `${event.title} (${event.type === 'order' ? event.status : 'Holiday'})`}
                />
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm text-slate-600">Holiday</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-slate-600">Pending Order</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-600">Delivered</span>
                </div>
            </div>
        </section>
    );
}
