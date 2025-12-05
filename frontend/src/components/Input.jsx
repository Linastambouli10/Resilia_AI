// src/components/Input.jsx
import React from "react";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete = "off"
}) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="text-sm mb-1 font-medium text-ink">{label}</label>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-tealsoft w-full"
        required
      />
    </div>
  );
}
