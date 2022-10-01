// import { useLocales } from "~/providers/LocaleProvider";
import { format } from "date-fns";
type DateProps = {
  date: Date;
  pattern?: string;
};

export const FormatDate = ({ date, pattern }: DateProps) => {
  pattern = pattern || "d MMM";

  const isoString = date.toISOString();
  const formattedDate = format(new Date(date), pattern);

  return <time dateTime={isoString}>{formattedDate}</time>;
};
