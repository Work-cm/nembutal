export default function LogoMark({ size = 30, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* two-tone capsule, rotated -45° */}
      <g transform="rotate(-45 24 24)">
        <rect x="8" y="18" width="32" height="12" rx="6" fill="#0B1D33" />
        <path d="M14 30h10V18H14a6 6 0 0 0-6 6 6 6 0 0 0 6 6z" fill="#0E9BA8" />
        <rect x="23.2" y="18" width="1.6" height="12" fill="#FFFFFF" />
      </g>
    </svg>
  );
}
