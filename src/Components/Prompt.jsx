
const Prompt = ({ icon, title, body, buttons = [] }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[320px] max-w-[90vw] w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <span className="font-semibold text-lg text-gray-800">{title}</span>
        </div>
        <div className="mb-6 text-gray-700 text-sm">{body}</div>
        <div className="flex gap-3 justify-end">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none ${
                btn.variant === 'primary'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : btn.variant === 'danger'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : btn.variant === 'secondary'
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prompt;
