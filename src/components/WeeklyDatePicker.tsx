"use client";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/en-gb";
import { useRouter, useSearchParams } from "next/navigation";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.locale("en-gb");

const STORE_FORMAT = "YYYY-MM-DD";
const DISPLAY_FORMAT = "DD-MM-YYYY";

const WeeklyDatePicker = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const startParam = searchParams.get("start");
  const defaultValue = startParam ? dayjs(startParam, STORE_FORMAT) : dayjs();

  const onChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("start", date.format(STORE_FORMAT));

    router.push(`?${params.toString()}`);
  };

  return (
    <ConfigProvider locale={{ DatePicker: { lang: { locale: "en-gb" } } }}>
      <DatePicker
        className="inline-block w-[400px]"
        onChange={onChange}
        defaultValue={defaultValue}
        format={(date) => {
          const weekStart = date.startOf("isoWeek");
          const weekEnd = weekStart.add(6, "day");
          return `${weekStart.format(DISPLAY_FORMAT)} – ${weekEnd.format(DISPLAY_FORMAT)}`;
        }}
      />
    </ConfigProvider>
  );
};

export default WeeklyDatePicker;
