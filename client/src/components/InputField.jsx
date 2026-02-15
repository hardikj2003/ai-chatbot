

const InputField = ({ label, name, type, value, onChange, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>
    <input
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:bg-white focus:border-blue-500 transition-all"
    />
  </div>
);

export default InputField;
