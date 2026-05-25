export default function AdminPageHeader({ title, subtitle, description, action }) {
  const ActionIcon = action?.icon;
  const supportingText = subtitle || description;

  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-royal-navy">{title}</h1>
        {supportingText && <p className="mt-2 text-sm text-slate-500">{supportingText}</p>}
      </div>
      {action?.label ? (
        <button type="button" className="btn-primary" onClick={action.onClick}>
          {ActionIcon && <ActionIcon size={18} />}
          {action.label}
        </button>
      ) : (
        action
      )}
    </div>
  );
}
