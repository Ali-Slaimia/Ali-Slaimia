export function WorldBackdrop() {
  return (
    <div className="world" aria-hidden>
      <div className="sun" />
      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />
      <div className="cloud cloud-c" />
      <svg className="hills" viewBox="0 0 1200 280" preserveAspectRatio="none">
        <path d="M0 180 C180 120 280 200 420 150 C560 100 640 190 820 140 C980 100 1080 170 1200 130 L1200 280 L0 280 Z" fill="#2f9e73" />
        <path d="M0 210 C160 170 300 230 480 190 C680 140 780 230 980 180 C1100 150 1160 200 1200 190 L1200 280 L0 280 Z" fill="#1f7a58" />
      </svg>
    </div>
  );
}
