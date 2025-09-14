import { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import { FieldNames } from "@/constants/FieldConstants";
import { SettingsIcon, Trash2, Copy, GripVertical } from "lucide-react";

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
  onChange,
  value,
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
      onChange: (e) => onChange?.(e.target.value),
    };

    switch (field.type) {
      case FieldNames.TEXT:
      case FieldNames.EMAIL:
      case FieldNames.DATE:
      case FieldNames.TIME:
        return <input type={field.type} {...baseProps} />;

      case FieldNames.FILE:
        return (
          <input
            type="file"
            {...baseProps}
            onChange={(e) => onChange?.(e.target.files?.[0].name)}
          />
        );

      case FieldNames.SELECT:
        return (
          <select
            {...baseProps}
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
          >
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
              const [label, val] = option.split("=");
              return (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${field.id}_${idx}`}
                    name={field.name}
                    value={val}
                    checked={Array.isArray(value) && value.includes(val)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange?.([...(value || []), val]);
                      } else {
                        onChange?.((value || []).filter((v) => v !== val));
                      }
                    }}
                    className="mr-2"
                    required={field.required && idx === 0 && !value?.length}
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
              const [label, val] = option.split("=");
              return (
                <div key={idx} className="flex items-center">
                  <input
                    type="radio"
                    id={`${field.id}_${idx}`}
                    name={field.name}
                    value={val}
                    checked={value === val}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="mr-2"
                    required={field.required}
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
              checked={!!value}
              onChange={(e) => onChange?.(e.target.checked)}
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
    onFieldDragStart?.(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    onFieldDragEnd?.();
  };

  return (
    <div
      draggable={!isPreview}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`relative p-2 border-2 border-dotted ${
        isDragging
          ? "scale-95 opacity-70 border-blue-400 bg-blue-100"
          : "border-transparent"
      } ${
        !isPreview
          ? "cursor-move hover:border-blue-300 transition-all duration-200"
          : ""
      }`}
      style={{ width: field.columnWidth }}
      onMouseEnter={() => {
        onHover?.();
        setIsHover(true);
      }}
      onMouseLeave={() => {
        onLeave?.();
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
              <GripVertical size={16} className="text-gray-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormField;
