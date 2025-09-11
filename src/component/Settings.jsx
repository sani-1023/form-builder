import { useState } from "react";

 
/* TODO: make sure proper work of settings right now it is not changing when i click another settings icon
*/
const Settings = ({ field, onClose, onSave }) => {
  const [editedField, setEditedField] = useState({ ...field });

  const handleChange = (key, value) => {
    setEditedField((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionsChange = (value) => {
    const options = value.split("\n").filter((line) => line.trim());
    setEditedField((prev) => ({ ...prev, options }));
  };

  const handleSave = () => {
    onSave(editedField);
    onClose();
  };

  return (
   <div className="fixed right-0 top-0 h-full w-80 bg-gradient-to-br from-blue-50 to-slate-100 border-l-2 border-blue-200 shadow-2xl z-50 overflow-y-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white drop-shadow-sm">
            {editedField.type} Settings
          </h3>
          <button
            onClick={onClose}
            className="text-blue-100 hover:text-white hover:bg-blue-800 rounded-full p-1 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Label
          </label>
          <input
            type="text"
            value={editedField.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full p-2 border-1 border-slate-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 bg-white shadow-sm"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Name
          </label>
          <input
            type="text"
            value={editedField.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 border-1 border-slate-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 bg-white shadow-sm"
          />
        </div>
        
        {(editedField.type === "text" ||
          editedField.type === "email" ||
          editedField.type === "select") && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Placeholder
            </label>
            <input
              type="text"
              value={editedField.placeholder || ""}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              className="w-full p-2 border-1 border-slate-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 bg-white shadow-sm"
            />
          </div>
        )}
        
        <div className="bg-white p-3.5 rounded-lg border-2 border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={editedField.required}
              onChange={(e) => handleChange("required", e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="required" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Required Field
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Column Width
          </label>
          <select
            value={editedField.columnWidth}
            onChange={(e) => handleChange("columnWidth", e.target.value)}
            className="w-full p-2 border-1 border-slate-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 bg-white shadow-sm cursor-pointer"
          >
            <option value="33%">33% - Third Width</option>
            <option value="50%">50% - Half Width</option>
            <option value="66%">66% - Two Thirds</option>
            <option value="100%">100% - Full Width</option>
          </select>
        </div>
        
        {(editedField.type === "select" ||
          editedField.type === "checkbox" ||
          editedField.type === "radio") && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Options
            </label>
            <p className="text-xs text-slate-500 mb-2">One per line, format: Label=value</p>
            <textarea
              value={editedField.options?.join("\n") || ""}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className="w-full p-2 border-1 border-slate-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 bg-white shadow-sm h-28 resize-none"
              placeholder="Option 1=option1&#10;Option 2=option2"
            />
          </div>
        )}
        
        {editedField.type === "acceptance" && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Content
            </label>
            <textarea
              value={editedField.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full p-2 border-1 border-slate-400 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-700 bg-white shadow-sm h-28 resize-none"
              placeholder="<p>I agree to terms</p>"
            />
          </div>
        )}
        
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-300"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Save Changes</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Settings