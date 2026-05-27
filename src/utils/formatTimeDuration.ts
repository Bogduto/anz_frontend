import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const minDuration = 3600000; // one hour


const formatTimeDuration = (duration: number): string => {
    if (duration >= minDuration) {
        return `${dayjs.duration(duration).asHours().toFixed(1)} hours`;
    }

    return `${Math.floor(dayjs.duration(duration).asMinutes()).toFixed(1)} minutes`;
};

export default formatTimeDuration;