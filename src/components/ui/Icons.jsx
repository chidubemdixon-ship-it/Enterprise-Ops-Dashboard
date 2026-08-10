/* ============================================================================
   Icons.

   Every icon in the design is a 24×24 stroked outline with no fill. Rather
   than repeat that boilerplate 30 times, one <Icon> shell holds the shared
   attributes and each named export supplies only its paths.

   `stroke="currentColor"` is the important bit: the icon inherits the text
   colour of whatever it sits inside, so a sidebar item going from muted to
   active recolours its icon for free.
   ========================================================================== */

function Icon({ size = 16, strokeWidth = 1.5, className = '', children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const LogoMark = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="18" height="18" />
    <path d="M3 9h18M9 21V9" />
  </Icon>
);

export const SearchIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);

export const CalendarIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Icon>
);

export const BellIcon = (props) => (
  <Icon {...props}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </Icon>
);

/* Four unequal rectangles — the "executive summary / overview" mark. */
export const GridIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </Icon>
);

export const BarsIcon = (props) => (
  <Icon {...props}>
    <path d="M3 21h18M6 21V9M12 21V4M18 21v-7" />
  </Icon>
);

export const ListIcon = (props) => (
  <Icon {...props}>
    <rect x="4" y="4" width="16" height="16" />
    <path d="M8 10h8M8 14h5" />
  </Icon>
);

export const WarningIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3l9 16H3z" />
    <path d="M12 10v4M12 17h.01" />
  </Icon>
);

export const TrendIcon = (props) => (
  <Icon {...props}>
    <path d="M3 17l6-6 4 4 8-8" />
  </Icon>
);

/* Two clocks: the sidebar's "workload" hand position differs from the
   notification list's, and the design is deliberate about it. */
export const ClockWorkloadIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9l6 4" />
  </Icon>
);

export const ClockIcon = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const ApprovalIcon = (props) => (
  <Icon {...props}>
    <path d="M4 4h16v16H4z" />
    <path d="M8 12l3 3 5-6" />
  </Icon>
);

export const EscalateIcon = (props) => (
  <Icon {...props}>
    <path d="M12 3v18M5 8l7-5 7 5" />
  </Icon>
);

export const SystemIcon = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="14" />
    <path d="M7 21h10" />
  </Icon>
);

export const ChevronDownIcon = (props) => (
  <Icon {...props}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

export const ChevronLeftIcon = (props) => (
  <Icon {...props}>
    <path d="M15 5l-7 7 7 7" />
  </Icon>
);

export const FilterIcon = (props) => (
  <Icon {...props}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </Icon>
);

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="M4 12l5 5L20 6" />
  </Icon>
);

/* Notification rows pick their icon by `kind`. Keeping the lookup next to the
   icons means adding a new kind is a one-line change here. */
export const NOTIFICATION_ICONS = {
  alert: WarningIcon,
  clock: ClockIcon,
  approval: ApprovalIcon,
  escalate: EscalateIcon,
  system: SystemIcon,
};
