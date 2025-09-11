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
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg z-50 overflow-y-auto">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{editedField.type} Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Label
          </label>
          <input
            type="text"
            value={editedField.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full p-2 border rounded text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={editedField.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {(editedField.type === "text" ||
          editedField.type === "email" ||
          editedField.type === "select") && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={editedField.placeholder || ""}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={editedField.required}
            onChange={(e) => handleChange("required", e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="required" className="text-sm font-medium">
            Required
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Column Width</label>
          <select
            value={editedField.columnWidth}
            onChange={(e) => handleChange("columnWidth", e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="33%">33%</option>
            <option value="50%">50%</option>
            <option value="66%">66%</option>
            <option value="100%">100%</option>
          </select>
        </div>

        {(editedField.type === "select" ||
          editedField.type === "checkbox" ||
          editedField.type === "radio") && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Options (one per line, format: Label=value)
            </label>
            <textarea
              value={editedField.options?.join("\n") || ""}
              onChange={(e) => handleOptionsChange(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Option 1=option1&#10;Option 2=option2"
            />
          </div>
        )}

        {editedField.type === "acceptance" && (
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={editedField.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="<p>I agree to terms</p>"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings