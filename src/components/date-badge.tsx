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

  console.log(date.toDateString(), entry?.intersectionRatio);

  return (
    <div
      className={cn("sticky top-[-1px] pb-3 pt-[4.5rem] text-center", {
        "pt-3": entry?.intersectionRatio === 1,
      })}
      ref={ref}
    >
      <span
        className={cn(
          "rounded-full bg-[hsl(var(--secondary)_/_85%)] px-3 py-1 text-sm backdrop-blur-md transition-all duration-200",
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
