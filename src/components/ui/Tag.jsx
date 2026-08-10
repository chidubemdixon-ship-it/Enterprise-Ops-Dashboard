/* ============================================================================
   Tags and badges.

   The design uses three visually distinct label treatments. Rather than let
   each call site remember which one a given status gets, the mapping lives
   here in a lookup object. Call sites say *what* the thing is
   (`<StatusTag status="delayed" />`), never what it should look like.

   The lookup-object pattern beats a chain of ternaries: adding a status is
   one new line, and there is no way to end up with an unstyled tag.
   ========================================================================== */

import {
  ACTIVITY_STATUS_LABELS,
  DEPARTMENT_STATUS_LABELS,
  PRIORITY_LABELS,
} from '../../data/dashboardData.js';

const BASE = 'inline-flex items-center text-[11px] tracking-[0.02em] px-[10px] py-[3px] whitespace-nowrap';

const VARIANTS = {
  accent: 'bg-accent-100 text-accent-800',
  neutral: 'bg-neutral-100 text-neutral-800',
  outline: 'border border-accent text-accent',
};

export function Tag({ variant = 'neutral', className = '', children }) {
  return <span className={`${BASE} ${VARIANTS[variant]} ${className}`}>{children}</span>;
}

/* The solid, condensed, uppercase badge used for "High" and "Critical" —
   the design's loudest label. */
export function SolidBadge({ className = '', children }) {
  return (
    <span
      className={`inline-flex items-center font-heading text-[11.5px] tracking-[0.06em] uppercase bg-accent-900 text-bg px-2 py-[3px] whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

/* ---- semantic wrappers: one per kind of thing being labelled ---- */

const ACTIVITY_STATUS_VARIANT = {
  delayed: 'accent',
  'in-review': 'outline',
  'in-progress': 'outline',
  completed: 'outline',
};

export function StatusTag({ status, className = '' }) {
  return (
    <Tag variant={ACTIVITY_STATUS_VARIANT[status]} className={className}>
      {ACTIVITY_STATUS_LABELS[status]}
    </Tag>
  );
}

export function PriorityTag({ priority, className = '' }) {
  /* High priority is the one case that escalates to the solid badge.
     Conditional rendering: two different elements from one branch. */
  if (priority === 'high') {
    return <SolidBadge className={className}>{PRIORITY_LABELS[priority]}</SolidBadge>;
  }
  return (
    <Tag variant="neutral" className={className}>
      {PRIORITY_LABELS[priority]}
    </Tag>
  );
}

export function DepartmentStatusTag({ status, className = '' }) {
  if (status === 'critical') {
    return <SolidBadge className={className}>{DEPARTMENT_STATUS_LABELS.critical}</SolidBadge>;
  }
  return (
    <Tag variant={status === 'at-risk' ? 'accent' : 'outline'} className={className}>
      {DEPARTMENT_STATUS_LABELS[status]}
    </Tag>
  );
}
