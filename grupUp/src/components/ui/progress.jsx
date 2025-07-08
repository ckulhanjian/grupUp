export function Progress({ value, className }) {
  return (
    <div className={`w-full h-2 bg-gray-200 rounded ${className}`}>
      <div
        className="bg-blue-500 h-2 rounded"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}