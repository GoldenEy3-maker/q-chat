import dayjs from "dayjs";
import { useInView } from "react-intersection-observer";
import { cn } from "~/libs/utils";

type DateBadgeProps = {
  date: Date;
  isScrollIdle: boolean;
};

const DateBadge: React.FC<DateBadgeProps> = ({ date, isScrollIdle }) => {
  const { ref, entry } = useInView({
    threshold: [1],
  });

  return (
    <div className="sticky top-[-1px] py-3 text-center" ref={ref}>
      <span
        className={cn(
          "rounded-full bg-secondary px-3 py-1 text-sm transition-all duration-200",
          {
            "invisible opacity-0":
              isScrollIdle && entry?.intersectionRatio
                ? entry?.intersectionRatio < 1
                : false,
          },
        )}
      >
        {dayjs(date).format("D MMMM")}
      </span>
    </div>
  );
};

export default DateBadge;
