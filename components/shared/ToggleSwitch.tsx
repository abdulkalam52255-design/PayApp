export function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button 
      onClick={() => onChange(!enabled)}
      className={`relative h-5 w-9 rounded-full transition-colors focus:outline-none ${enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  );
}
