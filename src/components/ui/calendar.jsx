import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { id as localeID } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { cn } from "../../lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = localeID,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn("p-2 font-sans select-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center pt-1 relative items-center mb-2 px-8",
        caption_label: "text-sm font-bold text-slate-800 capitalize tracking-tight",
        nav: "flex items-center justify-between absolute w-full inset-x-0 px-1 pointer-events-none",
        button_previous:
          "h-7 w-7 bg-white hover:bg-slate-100 p-0 rounded-lg text-slate-600 border border-slate-200/80 inline-flex items-center justify-center cursor-pointer transition-all shadow-xs pointer-events-auto hover:border-slate-300",
        button_next:
          "h-7 w-7 bg-white hover:bg-slate-100 p-0 rounded-lg text-slate-600 border border-slate-200/80 inline-flex items-center justify-center cursor-pointer transition-all shadow-xs pointer-events-auto hover:border-slate-300",
        month_grid: "w-full border-collapse",
        weekdays: "flex justify-between mb-1",
        weekday:
          "text-slate-400 rounded-md w-9 font-medium text-[0.75rem] text-center uppercase tracking-wider",
        weeks: "flex flex-col gap-1",
        week: "flex w-full justify-between",
        day: "h-9 w-9 text-center text-xs p-0 relative focus-within:relative focus-within:z-20",
        day_button:
          "h-9 w-9 p-0 font-medium rounded-xl transition-all flex items-center justify-center text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 cursor-pointer focus:outline-none",
        selected:
          "[&>.rdp-day_button]:!bg-emerald-600 [&>.rdp-day_button]:!text-white [&>.rdp-day_button]:font-bold [&>.rdp-day_button]:shadow-md [&>.rdp-day_button]:shadow-emerald-600/30 hover:[&>.rdp-day_button]:!bg-emerald-700",
        today:
          "[&>.rdp-day_button]:border-2 [&>.rdp-day_button]:border-emerald-500 [&>.rdp-day_button]:font-bold [&>.rdp-day_button]:text-emerald-700",
        outside:
          "[&>.rdp-day_button]:text-slate-300 [&>.rdp-day_button]:opacity-40 hover:[&>.rdp-day_button]:bg-transparent hover:[&>.rdp-day_button]:text-slate-400",
        disabled:
          "[&>.rdp-day_button]:text-slate-300 [&>.rdp-day_button]:opacity-30 [&>.rdp-day_button]:cursor-not-allowed hover:[&>.rdp-day_button]:bg-transparent",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4 text-slate-600", chevronClassName)} {...chevronProps} />;
          }
          return <ChevronRight className={cn("h-4 w-4 text-slate-600", chevronClassName)} {...chevronProps} />;
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
