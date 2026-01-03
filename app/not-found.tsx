export default function NotFound() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.title}>404</div>
        <div style={styles.subtitle}>That page doesn’t exist.</div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: "48px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--background)",
    color: "var(--foreground)",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    border: "1px solid rgba(127,127,127,0.25)",
    borderRadius: 14,
    padding: 18,
  },
  title: {
    fontSize: 14,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.7,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: "28px",
  },
};


