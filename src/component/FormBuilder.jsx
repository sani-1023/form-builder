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
import DOMPurify from "isomorphic-dompurify";
import { FieldNames } from "@/constants/FieldConstants";
import FormPreview from "@/component/FormPreview";
import FormHeader from "@/component/FormHeader";

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
      return {
        ...baseField,
        content: "<p><strong>I agree to the terms</strong></p>",
      };
    default:
      return baseField;
  }
};

export const FormField = ({
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
  const [isHover, setIsHover] = useState(false);

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
      case FieldNames.TEXT:
      case FieldNames.EMAIL:
        return <input type={field.type} {...baseProps} />;

      case FieldNames.DATE:
      case FieldNames.TIME:
        return <input type={field.type} {...baseProps} />;

      case FieldNames.FILE:
        return <input type="file" {...baseProps} />;

      case FieldNames.SELECT:
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

      case FieldNames.CHECKBOX:
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

      case FieldNames.RADIO:
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

      case FieldNames.ACCEPTANCE:
        return (
          <div className="flex items-start">
            <input
              type="checkbox"
              id={field.id}
              name={field.name}
              className="mt-1 mr-2"
              required={field.required}
            />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(field.content || ""),
              }}
            />
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
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
      draggable={!isPreview}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`relative p-2 border-2 border-dotted ${
        isDragging ? "scale-95 opacity-70 border-blue-400 bg-blue-100" : "border-transparent"
      } hover:border-blue-300 transition-all duration-200 cursor-move`}
      style={{ width: field.columnWidth }}

  
      onMouseEnter={() => {
        onHover();
        setIsHover(true);
      }}
      onMouseLeave={() => {
        onLeave();
        setIsHover(false);
      }}
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

      <div className="space-y-2 relative">
        <label className="block text-sm font-semibold text-gray-900">
          {field.type === "acceptance" ? " " : field.label}
          {field.required && field.type !== "acceptance" && (
            <span className="text-red-500 ml-0.5">*</span>
          )}
        </label>
        <div className="flex items-center">
          <div className="flex-1">{renderInput()}</div>
          {!isPreview && (
            <div
              className={`ml-2 w-6 flex justify-center transition-opacity ${
                isHover ? "opacity-100" : "opacity-0"
              }`}
            >
              <GripVertical
                size={16}
                className="text-gray-700"
              />
            </div>
          )}
        </div>
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
  const [dropIndex, setDropIndex] = useState(null);
  const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);

  const handleFieldAction = (fieldId, action) => {
    const fieldIndex = formSchema.fields.findIndex((f) => f.id === fieldId);
    const field = formSchema.fields[fieldIndex];

    switch (action) {
      case "settings":
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

  const handleFieldSave = (updatedField) => {
    setFormSchema((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === updatedField.id ? updatedField : f
      ),
    }));
  };

  const handleFieldReorder = (fromIndex, toIndex) => {
    if (toIndex - fromIndex === 0 || toIndex - fromIndex === 1) return;

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
  };
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {!isPreview && <SideBar handleDragStart={handleDragStart} />}

        <div className="flex-1 flex flex-col">
          <FormHeader
            formName={formSchema?.name}
            isPreview={isPreview}
            setFormSchema={setFormSchema}
            setIsPreview={setIsPreview}
            isFormEmpty={formSchema.fields.length === 0}
          />
          {/* Form Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            {isPreview ? (
              <FormPreview formSchema={formSchema} />
            ) : (
              <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-100 to-white rounded-lg shadow p-6 min-h-96">
                {formSchema.fields.length === 0 ? (
                  <div
                    className="flex items-center justify-center h-96 border-2 border-dashed border-gray-400 rounded cursor-pointer hover:border-blue-500 transition"
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
                      <div className="border-1 border-dashed border-blue-400 bg-blue-50 p-3 rounded opacity-60">
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
                            if (draggedFieldIndex === null) {
                              setDropIndex(index);
                              return;
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedFieldIndex !== null) {
                              handleFieldReorder(draggedFieldIndex, index);
                              return;
                            }
                            handleDrop(e, index);
                          }}
                          onDragLeave={() => {
                            setDropIndex(null);
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
                      className={`min-h-[50px] flex items-center justify-center p-4 transition-all duration-200 ${
                        dropIndex === formSchema.fields.length &&
                        draggedFieldIndex === null
                          ? "border-2 border-dashed border-blue-400 bg-blue-50"
                          : "border-2 border-dashed border-transparent hover:border-gray-300"
                      } rounded cursor-pointer`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (
                          draggedFieldIndex !== null &&
                          draggedFieldIndex === formSchema.fields.length
                        ) {
                          setDropIndex(formSchema.fields.length);
                          return;
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedFieldIndex !== null) {
                          handleFieldReorder(
                            draggedFieldIndex,
                            formSchema.fields.length
                          );
                          setDraggedFieldIndex(null);
                          return;
                        }
                        handleDrop(e, formSchema.fields.length);
                      }}
                      onDragLeave={(e) => {
                        setDropIndex(null);
                      }}
                    >
                      {dropIndex === formSchema.fields.length &&
                      draggedFieldIndex === null ? (
                        <div className="p-3 opacity-70">
                          <FormField
                            field={getDefaultField(draggedFieldType)}
                            isPreview={true}
                          />
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          Drag and drop fields here
                        </p>
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
