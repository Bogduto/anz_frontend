import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const minDuration = 3600000; // one hour

const formatTimeDuration = (ms: number): string => {
  if (ms <= 0) return "0 min";

  if (ms >= minDuration) {
    return `${dayjs.duration(ms).asHours().toFixed(1)} h`;
  }

  return `${Math.floor(dayjs.duration(ms).asMinutes())} min`;
};

export default formatTimeDuration;
