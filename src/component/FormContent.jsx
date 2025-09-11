import React from "react";

const FormContent = ({ children }) => {
  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        {children}
      </div>
    </main>
  );
};

export default FormContent;
