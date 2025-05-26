import { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const { backendURL, aToken } = useContext(AdminContext);

  const fetchEvents = async (start, end) => {
    try {
      const response = await axios.get(backendURL + "/api/admin/calendar", {
        headers: { aToken },
        params: {
          start: moment(start).toISOString(), // Gửi ngày bắt đầu
          end: moment(end).toISOString(), // Gửi ngày kết thúc
        },
      });

      if (response.data.success) {
        setEvents(
          response.data.event.map((evt) => ({
            ...evt,
            start: new Date(evt.start),
            end: new Date(evt.end),
          }))
        );
        console.log("Fetched events:", response.data.event);
      } else {
        console.error("Failed to fetch events:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  // Gọi fetchEvents khi component mount và khi view thay đổi
  useEffect(() => {
    const defaultRange = {
      start: moment().startOf("month").toDate(),
      end: moment().endOf("month").toDate(),
    };
    fetchEvents(defaultRange.start, defaultRange.end);
  }, [aToken]);

  // Xử lý khi người dùng thay đổi view (month, week, day) hoặc điều hướng
  const handleRangeChange = (range) => {
    let start, end;
    if (Array.isArray(range)) {
      // View là month
      start = range[0];
      end = range[range.length - 1];
    } else {
      // View là week hoặc day
      start = range.start;
      end = range.end;
    }
    fetchEvents(start, end);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lịch hẹn bác sĩ</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onRangeChange={handleRangeChange} // Thêm sự kiện onRangeChange
        components={{
          event: ({ event }) => (
            <div title={event.title}>
              👨‍⚕️ {event.title}
            </div>
          ),
        }}
        tooltipAccessor={(event) => `Lịch: ${event.title}`}
      />
    </div>
  );
};

export default Schedule;