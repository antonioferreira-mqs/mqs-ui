// components/dashboard/HealthCard.tsx
import styles from "./card.module.css";

type Health = "excellent" | "good" | "warning" | "critical";

export function HealthCard({ health }: { health: Health }) {
  const labelMap: Record<Health, string> = {
    excellent: "Excelente",
    good: "Bom",
    warning: "Atenção",
    critical: "Crítico",
  };

  return (
    <section className={styles.card}>
      <div className={styles.title}>Health</div>
      <div className={styles.value}>{labelMap[health]}</div>
    </section>
  );
}
