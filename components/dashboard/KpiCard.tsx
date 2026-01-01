// components/dashboard/KpiCard.tsx
import styles from "./card.module.css";
import { TrendBadge } from "./TrendBadge";

type Trend = "up" | "down" | "stable";

export function KpiCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: number | string;
  trend: Trend;
}) {
  return (
    <section className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.value}>
        {value}
        <TrendBadge trend={trend} />
      </div>
    </section>
  );
}
