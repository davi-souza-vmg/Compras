export default function Modal({ titulo, onClose, children }) {
  return (<div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
    <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-xl bg-white p-4 sm:max-w-lg sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
      <div className="mb-3 flex justify-between"><h2 className="font-semibold">{titulo}</h2><button onClick={onClose}>✕</button></div>{children}</div></div>)
}
