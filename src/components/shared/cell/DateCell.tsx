import { format } from "date-fns";

interface DateCellProps {
  date: Date | string;
  formatString: string;
}

const DateCell = ({ date, formatString }: DateCellProps) => {
  if (!date) {
    return null;
  }

  const formattedDate = format(new Date(date), formatString || "dd/MM/yyyy");

  return <span className="text-sm">{formattedDate}</span>;
};


export default DateCell;