export default function SearchBarInputField({
  type,
  placeholder,
  name,
  value,
  onChange,
}) {
  return (
    <div className="relative w-full md:max-w-md">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors duration-150 bg-white border-gray-300 focus:border-gray-900 placeholder:text-gray-500"
      />
    </div>
  );
}
