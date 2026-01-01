// components/dashboard/TrendBadge.tsx
import styles from "./trend.module.css";

type Trend = "up" | "down" | "stable";

export function TrendBadge({ trend }: { trend: Trend }) {
  const symbolMap: Record<Trend, string> = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return <span className={styles.trend}>{symbolMap[trend]}</span>;
}
