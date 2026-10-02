import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import itLocale from "@fullcalendar/core/locales/it";
import type { Booking, CalendarPosition } from "./types";
import { localDate, statusLabel } from "./dates";
export default function AgendaView({
  bookings,
  range,
  select,
  position,
  remember,
}: {
  position?: CalendarPosition;
  remember: (position: CalendarPosition) => void;
  bookings: Booking[];
  range: (from: string, to: string) => void;
  select: (b: Booking) => void;
}) {
  const ref = useRef<FullCalendar>(null);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );
  const compatibleView = (view?: string) =>
    mobile
      ? view === "timeGridDay"
        ? view
        : view === "dayGridMonth"
          ? view
          : "dayGridMonth"
      : view &&
          ["timeGridDay", "timeGridWeek", "dayGridMonth", "listDay"].includes(
            view,
          )
        ? view
        : "timeGridWeek";
  const [calendarView, setCalendarView] = useState(() =>
    compatibleView(position?.view),
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const resize = () => {
      const nextMobile = media.matches;
      setMobile(nextMobile);
      const api = ref.current?.getApi();
      if (!api) return;
      const fallback = nextMobile
        ? calendarView === "timeGridDay"
          ? "timeGridDay"
          : "dayGridMonth"
        : calendarView === "dayGridMonth"
          ? "dayGridMonth"
          : "timeGridWeek";
      if (api.view.type !== fallback) api.changeView(fallback);
    };
    resize();
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, [calendarView]);
  const active = bookings.filter(
    (b) => !["cancelled", "rejected"].includes(b.status),
  );
  const perDayCount = new Map<string, number>();
  for (const booking of active) {
    const key = localDate(booking.start).toISODate()!;
    perDayCount.set(key, (perDayCount.get(key) ?? 0) + 1);
  }
  const min = Math.min(8, ...active.map((b) => localDate(b.start).hour));
  const max = Math.max(21, ...active.map((b) => localDate(b.end).hour + 1));
  return (
    <FullCalendar
      ref={ref}
      plugins={[
        timeGridPlugin,
        dayGridPlugin,
        interactionPlugin,
        luxonPlugin,
        listPlugin,
      ]}
      locale={itLocale}
      timeZone="Europe/Rome"
      firstDay={1}
      initialView={compatibleView(position?.view)}
      initialDate={
        position?.date || localDate(new Date().toISOString()).toISODate()!
      }
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: mobile ? "dayGridMonth,timeGridDay" : "timeGridDay,timeGridWeek,dayGridMonth",
      }}
      noEventsContent="Nessun appuntamento per questa giornata."
      buttonText={{
        today: "Oggi",
        listDay: "Elenco",
        timeGridDay: mobile ? "Orari" : "Giorno",
        timeGridWeek: "Settimana",
        dayGridMonth: "Mese",
      }}
      height={calendarView.startsWith("timeGrid") ? 680 : "auto"}
      eventDisplay={mobile && calendarView === "dayGridMonth" ? "none" : "auto"}
      slotDuration="00:15:00"
      slotLabelInterval="01:00:00"
      slotEventOverlap={false}
      eventMinHeight={84}
      eventShortHeight={0}
      displayEventTime={false}
      allDaySlot={false}
      nowIndicator
      editable={false}
      selectable={false}
      slotMinTime={`${String(min).padStart(2, "0")}:00:00`}
      slotMaxTime={`${Math.min(max, 24)}:00:00`}
      scrollTime="08:00:00"
      slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
      datesSet={(info) => {
        setCalendarView(info.view.type);
        range(info.startStr, info.endStr);
        const date = ref.current?.getApi().getDate() || info.view.currentStart;
        remember({
          view: info.view.type,
          date: localDate(date.toISOString()).toISODate()!,
        });
      }}
      events={active.map((b) => ({
        id: b.uid,
        start: b.start,
        end: b.end,
        title: `${b.attendeeName} · ${b.serviceName}`,
        classNames: ["ns-event-" + b.status],
        extendedProps: { booking: b },
      }))}
      eventContent={(info) => {
        const b = info.event.extendedProps.booking as Booking;
        if (info.view.type !== "listDay")
          return (
            <div
              className="ns-calendar-compact"
              title={`${localDate(b.start).toFormat("HH:mm")} – ${localDate(b.end).toFormat("HH:mm")} · ${b.attendeeName} · ${b.serviceName} · ${statusLabel(b.status)}`}
            >
              <span className="ns-calendar-time">
                {localDate(b.start).toFormat("HH:mm")}{" "}
                <span aria-hidden="true">
                  {b.status === "accepted" ? "✓" : "◷"}
                </span>
              </span>
              <strong>{b.attendeeName}</strong>
              <span>{b.serviceName}</span>
            </div>
          );
        return (
          <div className="ns-calendar-appointment">
            <span className="ns-calendar-time">
              {localDate(b.start).toFormat("HH:mm")} –{" "}
              {localDate(b.end).toFormat("HH:mm")}
            </span>
            <strong>{b.attendeeName}</strong>
            <span>{b.serviceName}</span>
            <span className="ns-calendar-status">{statusLabel(b.status)}</span>
          </div>
        );
      }}
      dateClick={(info) => {
        if (!mobile || info.view.type !== "dayGridMonth") return;
        const api = ref.current?.getApi();
        if (!api) return;
        api.changeView("timeGridDay");
        api.gotoDate(info.date);
      }}
      dayCellContent={(info) => {
        if (!mobile || info.view.type !== "dayGridMonth")
          return info.dayNumberText;
        const key = localDate(info.date.toISOString()).toISODate()!;
        const count = perDayCount.get(key) ?? 0;
        return (
          <>
            {info.dayNumberText}
            {count > 0 && (
              <span className="ns-day-count" aria-label={`${count} appuntamenti`}>
                {count}
              </span>
            )}
          </>
        );
      }}
      eventClick={(info) => select(info.event.extendedProps.booking)}
      eventDidMount={(info) => {
        info.el.setAttribute(
          "aria-label",
          `${info.event.title}, ${statusLabel(info.event.extendedProps.booking.status)}`,
        );
      }}
    />
  );
}
