/* ============================================================================
   <NewActivityDialog> — controlled form inputs.

   A "controlled" input is one whose displayed value comes from React state
   and whose every keystroke goes back into that state:

       value={form.title}  onChange={(e) => update('title', e.target.value)}

   React is then the single source of truth for what the form holds. That is
   what lets the Create button disable itself while the title is empty — the
   component can *see* the field, instead of having to ask the DOM.

   Note `onSubmit` on the <form> rather than onClick on the button: it gives
   you Enter-to-submit and native validation for free. `preventDefault()`
   stops the browser's own full-page form submission.
   ========================================================================== */

import { useState } from 'react';
import { Dialog } from '../ui/Dialog.jsx';
import { Button } from '../ui/Button.jsx';
import { DEPARTMENTS, PRIORITY_LABELS } from '../../data/dashboardData.js';

const EMPTY_FORM = {
  title: '',
  owner: '',
  departmentId: DEPARTMENTS[0].id,
  priority: 'medium',
  dueDate: '2026-08-31',
};

const FIELD = 'w-full border border-divider bg-surface px-2.5 py-1.5 text-[14px] outline-none focus:border-accent';
const LABEL = 'mb-1 block text-xs text-ink/70';

export function NewActivityDialog({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);

  /* One updater for every field. The computed key `[field]` picks which
     property to overwrite; the spread copies the rest unchanged, because
     state must be replaced, never mutated. */
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const isValid = form.title.trim() !== '' && form.owner.trim() !== '';

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;
    onCreate(form);
    onClose();
  };

  return (
    <Dialog title="New activity" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={LABEL} htmlFor="activity-title">
            Activity
          </label>
          <input
            id="activity-title"
            className={FIELD}
            value={form.title}
            onChange={(event) => update('title', event.target.value)}
            placeholder="What needs doing?"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL} htmlFor="activity-owner">
              Owner
            </label>
            <input
              id="activity-owner"
              className={FIELD}
              value={form.owner}
              onChange={(event) => update('owner', event.target.value)}
              placeholder="e.g. K. Bello"
            />
          </div>

          <div>
            <label className={LABEL} htmlFor="activity-due">
              Due date
            </label>
            <input
              id="activity-due"
              type="date"
              className={FIELD}
              value={form.dueDate}
              onChange={(event) => update('dueDate', event.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL} htmlFor="activity-department">
              Department
            </label>
            <select
              id="activity-department"
              className={FIELD}
              value={form.departmentId}
              onChange={(event) => update('departmentId', event.target.value)}
            >
              {DEPARTMENTS.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={LABEL} htmlFor="activity-priority">
              Priority
            </label>
            <select
              id="activity-priority"
              className={FIELD}
              value={form.priority}
              onChange={(event) => update('priority', event.target.value)}
            >
              {/* Object.entries turns { high: 'High' } into [['high','High']],
                  which maps to <option>s the same way an array of objects would. */}
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button size="md" onClick={onClose}>
            Cancel
          </Button>
          {/* type="submit" is what routes this click into onSubmit above. */}
          <Button type="submit" variant="solid" size="md" disabled={!isValid}>
            Create activity
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
