import React, { useState } from "react";
import { FormField } from "./FormBuilder";

const FormPreview = ({ formSchema }) => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const closeModal = () => {
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <form onSubmit={handleFormSubmit} className="form-preview-container">
        <div className="flex flex-wrap -mx-2">
          {formSchema?.fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              isPreview={true}
              value={formData[field.id] || ""}
              onChange={(val) => handleInputChange(field.id, val)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {submitted && (
        <div
          className="fixed inset-0 flex items-center justify-center z-80"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.42)" }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              {formSchema?.successMessage || "Form Submitted Successfully!"}
            </h3>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Field
                  </th>
                  <th className="border px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {formSchema?.fields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 font-medium text-gray-700">
                      {field.label}
                    </td>
                    <td className="border px-4 py-2 text-gray-600">
                      {formData[field.id] || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
