"use client";
import React, { useState } from "react";
import Header from "@/component/Header";
import SideBar from "@/component/Sidebar";
import initialFormSchema from "@/data/InitialFormSchema";
import Settings from "@/component/Settings";
import FormPreview from "@/component/FormPreview";
import FormHeader from "@/component/FormHeader";
import FormField from "@/component/FormField";
import { FieldNames } from "@/constants/FieldConstants";

// Generate unique ID for new fields
const generateId = () => Math.random().toString(36).slice(2, 8);

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
    case FieldNames.TEXT:
    case FieldNames.EMAIL:
      return { ...baseField, placeholder: `Enter ${type}` };
    case FieldNames.SELECT:
    case FieldNames.CHECKBOX:
    case FieldNames.RADIO:
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
                    className="flex items-center justify-center h-96 border-2 border-dotted border-gray-400 rounded cursor-pointer hover:border-blue-500 transition"
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
                      className={`min-h-[50px] flex items-center justify-center p-4 transition-all duration-200`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDropIndex(formSchema.fields.length);
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
                        } else {
                          handleDrop(e, formSchema.fields.length);
                        }
                        setDropIndex(null);
                      }}
                      onDragLeave={() => {
                        setDropIndex(null);
                      }}
                    >
                      {dropIndex === formSchema.fields.length &&
                      draggedFieldIndex === null ? (
                        <div className="border-2 border-dashed border-blue-400 bg-blue-50 p-3 rounded opacity-70 w-full">
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
