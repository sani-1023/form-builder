import React from "react";
import {fieldTypes} from "@/constants/FieldTypes";

const Sidebar = ({ handleDragStart }) => {

  return (
    <aside className="w-64 bg-white border-r shadow-md flex flex-col">
      <div className="p-4 space-y-3 overflow-y-auto">
        {fieldTypes.map((fieldType) => (
          <div
            key={fieldType.id}
            draggable
            onDragStart={() => handleDragStart(fieldType.type)}
            className="p-3 bg-blue-50 rounded cursor-move hover:bg-blue-100 flex items-center shadow-sm transition"
          >
             {React.cloneElement(fieldType.icon, {
              className: "text-blue-600 w-5 h-5",
            })}
            <span className="ml-2 text-gray-800 font-medium">
              {fieldType.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
