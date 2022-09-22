import { useContext, createContext } from "react";
// import { useLocales } from "~/providers/LocaleProvider";
import { format } from "date-fns";
type DateProps = {
  date: Date;
  pattern?: string;
};

export const FormatDate = ({ date, pattern }: DateProps) => {
  pattern = pattern || "yyyy-MM-dd";

  const isoString = date.toISOString();
  const formattedDate = format(new Date(date), "d MMM");

  return <time dateTime={isoString}>{formattedDate}</time>;
};
