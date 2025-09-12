import { Edit3Icon, EyeIcon, Trash2Icon } from "lucide-react";
import React from "react";

const FormHeader = ({
  formName,
  isPreview,
  setIsPreview,
  setSubmitted,
  setFormSchema,
  isFormEmpty,
}) => {
  return (
    <>
      <header className="bg-white border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{formName}</h1>
        <div className="flex items-center space-x-4">
          <button
            disabled={isFormEmpty}
            onClick={() => {
              setIsPreview(!isPreview);
              setSubmitted(false);
            }}
            className={`flex items-center px-4 py-2 ${
              isFormEmpty
                ? `text-gray-500
                        opacity-50 
                        cursor-not-allowed 
                        bg-blue-500
                       `
                : `bg-blue-600 hover:bg-blue-700`
            }  text-white rounded `}
          >
            {isPreview ? (
              <Edit3Icon size={16} className="mr-1" />
            ) : (
              <EyeIcon size={16} className="mr-1" />
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
                isFormEmpty
                  ? `text-gray-500
                        opacity-50 
                        cursor-not-allowed 
                        bg-red-500
                       `
                  : `bg-red-600 hover:bg-red-700`
              }  text-white rounded `}
            >
              <Trash2Icon size={16} className="mr-1" /> Clear Canvas
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default FormHeader;
