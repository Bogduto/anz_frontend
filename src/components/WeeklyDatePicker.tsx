"use client";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en-gb";
import { useRouter, useSearchParams } from "next/navigation";

dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale("en-gb");

const STORE_FORMAT = "YYYY-MM-DD"; // for URL query params
const DISPLAY_FORMAT = "DD-MM-YYYY"; // for UI display

const WeeklyDatePicker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startParam = searchParams.get("start");
  // Parse using STORE_FORMAT since that's what we save in URL
  const defaultValue = startParam ? dayjs(startParam, STORE_FORMAT) : dayjs();

  const onClear = () => {
    return dayjs();
  };

  const onChange = (date) => {
    if (!date) return;

    const start = dayjs(date.format(STORE_FORMAT), STORE_FORMAT).startOf(
      "isoWeek",
    );

    const params = new URLSearchParams(searchParams.toString());
    params.set("start", start.format(STORE_FORMAT));

    router.push(`?${params.toString()}`);
  };

  return (
    <ConfigProvider locale={{ DatePicker: { lang: { locale: "en-gb" } } }}>
      <DatePicker
        className="inline-block w-[400px]"
        onChange={onChange}
        defaultValue={defaultValue}
        format={(date) => {
          const start = dayjs(date.format(STORE_FORMAT), STORE_FORMAT).startOf(
            "isoWeek",
          );
          const end = start.add(6, "day");
          return `range ${start.format(DISPLAY_FORMAT)} - ${end.format(DISPLAY_FORMAT)} choosen ${startParam}`;
        }}
      />
    </ConfigProvider>
  );
};

export default WeeklyDatePicker;
