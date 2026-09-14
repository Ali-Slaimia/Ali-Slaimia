export function IconHome({ active }: { active?: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill={active ? "currentColor" : "none"}
        opacity={active ? 0.9 : 1}
      />
    </svg>
  );
}

export function IconDumbbell() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 8v8M17 8v8M4 10v4M20 10v4M7 12h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconMedal() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="14" r="5.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 4h8l-2.2 6H10.2L8 4Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconUser() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.4-3.2 3.8-5 7-5s5.6 1.8 7 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconFlame() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2s4 4.2 4 8.2c0 2.4-1.2 4-3 5.2 1.4-.2 3.8-1.6 5-4.2 0 4.8-3.2 8.8-8 8.8S4 16 4 11.2C4 7.4 8 4 12 2Z" />
    </svg>
  );
}

export function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z" />
    </svg>
  );
}

export function IconGem() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 9 8 3h8l5 6-9 12L3 9Zm5.2 0h7.6L12 19.2 8.2 9Z" />
    </svg>
  );
}

export function IconHeart({ broken }: { broken?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      {broken ? (
        <path d="M12.1 20.3 10 18.2c-3.5-3.2-7-6.2-7-10A4.5 4.5 0 0 1 11 5.1L8 9.5l4 3-3 5 3.1 2.8ZM12.1 20.3 21 8.2A4.5 4.5 0 0 0 13 5.1l-.9.9 2.4 3.6-3.5 2.6 2.8 4.4-1.7 3.7Z" />
      ) : (
        <path d="M12.1 20.3 10 18.2C6.5 15 3 12 3 8.2A4.5 4.5 0 0 1 12 5.1a4.5 4.5 0 0 1 9 3.1c0 3.8-3.5 6.8-7 10.1l-1.9 2.1Z" />
      )}
    </svg>
  );
}
