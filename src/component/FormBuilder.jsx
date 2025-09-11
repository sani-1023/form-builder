"use client";
import React, { useState, useRef } from "react";
import {
  SettingsIcon,
  Trash2,
  Copy,
  Eye,
  Edit3,
  ListPlusIcon,
  GripVertical,
  Plus,
} from "lucide-react";
import Header from "@/component/Header";
import SideBar from "@/component/Sidebar";
import initialFormSchema from "@/data/InitialFormSchema";
import Settings from "@/component/Settings";

/* TODO: make code more modular and simple*/

// Generate unique ID for new fields
const generateId = () => Math.random().toString(36).substr(2, 8);

const getDefaultField = (type) => {
  const baseField = {
    id: generateId(),
    type: type,
    label: `New ${type} field`,
    name: `field_${generateId()}`,
    required: false,
    columnWidth: "100%",
  };

  switch (type) {
    case "text":
    case "email":
      return { ...baseField, placeholder: `Enter ${type}` };
    case "select":
    case "checkbox":
    case "radio":
      return {
        ...baseField,
        options: ["Option 1=option1", "Option 2=option2"],
      };
    case "acceptance":
      return { ...baseField, content: "<p>I agree to the terms</p>" };
    default:
      return baseField;
  }
};

const FormField = ({
  field,
  index,
  isPreview,
  onHover,
  onLeave,
  showActions,
  onAction,
  onFieldDragStart,
  onFieldDragEnd,
  isDragging,
}) => {
  const renderInput = () => {
    const baseProps = {
      id: field.id,
      name: field.name,
      className:
        "w-full p-2 bg-white border-1 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      placeholder: field.placeholder || "",
      required: field.required,
    };

    switch (field.type) {
      case "text":
      case "email":
        return <input type={field.type} {...baseProps} />;

      case "date":
      case "time":
        return <input type={field.type} {...baseProps} />;

      case "file":
        return <input type="file" {...baseProps} />;

      case "select":
        return (
          <select {...baseProps}>
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, idx) => {
              const [label, value] = option.split("=");
              return (
                <option key={idx} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => {
              const [label, value] = option.split("=");
              return (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.id}_${idx}`}
                    name={field.name}
                    value={value}
                    className="mr-2"
                  />
                  <label htmlFor={`${field.id}_${idx}`}>{label}</label>
                </div>
              );
            })}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => {
              const [label, value] = option.split("=");
              return (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}_${idx}`}
                    name={field.name}
                    value={value}
                    className="mr-2"
                  />
                  <label htmlFor={`${field.id}_${idx}`}>{label}</label>
                </div>
              );
            })}
          </div>
        );

      case "acceptance":
        return (
          <div className="flex items-start">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              className="mt-1 mr-2"
              required={field.required}
            />
            <label
              htmlFor={field.id}
              dangerouslySetInnerHTML={{ __html: field.content }}
            />
          </div>
        );

      default:
        return <input type="text" {...baseProps} />;
    }
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    onFieldDragStart(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    onFieldDragEnd();
  };

  return (
    <div
      className={`relative p-2 border-2 border-dashed border-transparent hover:border-blue-300 transition-all duration-200 ${
        !isPreview ? "cursor-pointer" : ""
      }`}
      style={{ width: field.columnWidth }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {showActions && !isPreview && (
        <div className="absolute top-2 right-2 flex space-x-1 bg-white shadow-lg rounded p-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("settings");
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Settings"
          >
            <SettingsIcon size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("duplicate");
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction("delete");
            }}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Drag handle for reordering */}
      {!isPreview && (
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-move opacity-0 hover:opacity-100 transition-opacity z-10 bg-white rounded p-1 shadow-sm border"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical
            size={16}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {renderInput()}
      </div>
    </div>
  );
};

const FormBuilder = () => {
  const [formSchema, setFormSchema] = useState(initialFormSchema);
  const [isPreview, setIsPreview] = useState(false);
  const [hoveredField, setHoveredField] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [draggedFieldType, setDraggedFieldType] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [dropIndex, setDropIndex] = useState(null);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);
  const [reorderDropIndex, setReorderDropIndex] = useState(null);

  const handleFieldAction = (fieldId, action) => {
    const fieldIndex = formSchema.fields.findIndex((f) => f.id === fieldId);
    const field = formSchema.fields[fieldIndex];

    switch (action) {
      case "settings":
        /*TODO: complete settings */
        setSelectedField(field);
        break;
      case "duplicate":
        const duplicatedField = {
          ...field,
          id: generateId(),
          name: `${field.name}_copy`,
        };
        const newFields = [...formSchema.fields];
        newFields.splice(fieldIndex + 1, 0, duplicatedField);
        setFormSchema((prev) => ({ ...prev, fields: newFields }));
        break;
      case "delete":
        setFormSchema((prev) => ({
          ...prev,
          fields: prev.fields.filter((f) => f.id !== fieldId),
        }));
        break;
    }
  };

  const handleDragStart = (fieldType) => {
    setDraggedFieldType(fieldType);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!draggedFieldType) return;

    const newField = getDefaultField(draggedFieldType);

    setFormSchema((prev) => {
      const updatedFields = [...prev.fields];
      updatedFields.splice(index, 0, newField);
      return { ...prev, fields: updatedFields };
    });

    setDraggedFieldType(null);
    setDropIndex(null);
  };

  /* TODO : need to handle form data submit*/
  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = {};

    setFormData(data);
    setSubmitted(true);
  };

  const handleFieldSave = (updatedField) => {
    setFormSchema((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === updatedField.id ? updatedField : f
      ),
    }));
  };

  const handleFieldReorder = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    setFormSchema((prev) => {
      const newFields = [...prev.fields];
      const [draggedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, draggedField);
      return { ...prev, fields: newFields };
    });
  };

  const handleFieldDragStart = (index) => {
    setDraggedFieldIndex(index);
  };

  const handleFieldDragEnd = () => {
    setDraggedFieldIndex(null);
    setReorderDropIndex(null);
  };
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {!isPreview && <SideBar handleDragStart={handleDragStart} />}

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">{formSchema?.name}</h1>
            <div className="flex items-center space-x-4">
              <button
                disabled={formSchema.fields.length === 0}
                onClick={() => {
                  setIsPreview(!isPreview);
                  setSubmitted(false);
                }}
                className={`flex items-center px-4 py-2 ${
                  formSchema.fields.length === 0
                    ? `text-gray-500
                        opacity-50 
                        cursor-not-allowed 
                        bg-blue-500
                       `
                    : `bg-blue-600 hover:bg-blue-700`
                }  text-white rounded `}
              >
                {isPreview ? (
                  <Edit3 size={16} className="mr-1" />
                ) : (
                  <Eye size={16} className="mr-1" />
                )}
                {isPreview ? "Edit" : "Preview"}
              </button>

              {!isPreview && (
                <button
                  onClick={() =>
                    setFormSchema((prev) => {
                      return { ...prev, fields: [] };
                    })
                  }
                  className={`flex items-center px-4 py-2 ${
                    formSchema.fields.length === 0
                      ? `text-gray-500
                        opacity-50 
                        cursor-not-allowed 
                        bg-red-500
                       `
                      : `bg-red-600 hover:bg-red-700`
                  }  text-white rounded `}
                >
                  <Trash2 size={16} className="mr-1" /> Clear Canvas
                </button>
              )}
            </div>
          </header>

          {/* Form Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            {isPreview ? (
              <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="form-preview-container">
                  <div className="flex flex-wrap -mx-2">
                    {formSchema?.fields.map((field) => (
                      <FormField
                        key={field.id}
                        field={field}
                        isPreview={true}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleFormSubmit}
                    className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>

                {submitted && (
                  <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
                    <h3 className="font-semibold text-green-800">
                      {formSchema?.successMessage}
                    </h3>
                    <div className="mt-2">
                      <h4 className="font-medium">Submitted Data:</h4>
                      <pre className="mt-1 text-sm bg-gray-100 p-2 rounded">
                        {JSON.stringify(formData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-slate-100 rounded-lg shadow p-6 min-h-96">
                {formSchema.fields.length === 0 ? (
                  <div
                    className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400 transition"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDropIndex(0);
                    }}
                    onDrop={(e) => handleDrop(e, 0)}
                    onDragLeave={(e) => {
                      setDropIndex(null);
                    }}
                  >
                    {dropIndex === 0 ? (
                      <div className="border-2 border-dashed border-blue-400 bg-blue-50 p-3 rounded opacity-70">
                        <FormField
                          field={getDefaultField(draggedFieldType)}
                          isPreview={true}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Drag fields from the left palette to get started
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 relative">
                    {formSchema.fields.map((field, index) => (
                      <div key={field.id} className="w-full relative">
                        <div
                          className="h-6 bg-transparent hover:bg-blue-100 rounded cursor-pointer transition relative flex items-center justify-center"
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedFieldIndex !== null) {
                              setReorderDropIndex(index);
                            } else {
                              setDropIndex(index);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedFieldIndex !== null) {
                              handleFieldReorder(draggedFieldIndex, index);
                            } else {
                              handleDrop(e, index);
                            }
                          }}
                          onDragLeave={(e) => {
                            if (draggedFieldIndex !== null) {
                              setReorderDropIndex(null);
                              return;
                            }
                            const related = e.relatedTarget;
                            if (
                              !related ||
                              !e.currentTarget.contains(related)
                            ) {
                              // do not clear immediately → keep last dropIndex until new one is set
                              setTimeout(() => {
                                setDropIndex((prev) =>
                                  prev === index ? null : prev
                                );
                              }, 500);
                            }
                          }}
                        >
                          {dropIndex === index &&
                            draggedFieldIndex === null && (
                              <div className="border-2 border-dashed border-blue-400 bg-blue-50 p-3 rounded opacity-70">
                                <FormField
                                  field={getDefaultField(draggedFieldType)}
                                  isPreview={true}
                                />
                              </div>
                            )}
                        </div>

                        <FormField
                          field={field}
                          index={index}
                          isPreview={false}
                          onHover={() => setHoveredField(field.id)}
                          onLeave={() => setHoveredField(null)}
                          showActions={hoveredField === field.id}
                          onAction={(action) =>
                            handleFieldAction(field.id, action)
                          }
                          onFieldDragStart={handleFieldDragStart}
                          onFieldDragEnd={handleFieldDragEnd}
                          isDragging={draggedFieldIndex === index}
                        />
                      </div>
                    ))}

                    <div
                      className="h-6 bg-transparent hover:bg-blue-100 rounded cursor-pointer transition relative flex items-center justify-center"
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedFieldIndex !== null) {
                          setReorderDropIndex(index);
                          return;
                        }
                        setDropIndex(index);
                      }}
                      onDragEnd={(e) => {
                        e.preventDefault();
                        if (draggedFieldIndex !== null) {
                          setReorderDropIndex(null);
                          return;
                        }
                        setDropIndex(null);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedFieldIndex !== null) {
                          handleFieldReorder(
                            draggedFieldIndex,
                            formSchema.fields.length
                          );
                          return;
                        }
                        handleDrop(e, formSchema.fields.length);
                      }}
                      onDragLeave={() => {
                        if (draggedFieldIndex !== null) {
                          setReorderDropIndex(null);
                          return;
                        }
                        setDropIndex(null);
                      }}
                    >
                      {dropIndex === formSchema.fields.length &&
                        draggedFieldIndex === null && (
                          <div className="border-2 border-dashed border-blue-400 bg-blue-50 p-3 rounded opacity-70">
                            <FormField
                              field={getDefaultField(draggedFieldType)}
                              isPreview={true}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedField && (
              <Settings
                field={selectedField}
                onClose={() => setSelectedField(null)}
                onSave={handleFieldSave}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
