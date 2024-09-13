import React from "react";
import { FaCheckDouble } from "react-icons/fa"; // يمكنك استخدام أي أيقونة تريدها

const Message = ({ text, sender, timestamp, isOwnMessage }) => {
  // دالة للتحقق من إذا كان النص يحتوي على حروف عربية
  const isArabic = (text) => {
    const arabicChar = /[\u0600-\u06FF]/;
    return arabicChar.test(text);
  };

  return (
    <div
      className={`flex  ${isOwnMessage ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`flex items-center max-w-xs p-3 rounded-lg shadow-sm ${
          isOwnMessage ? "bg-[#005C4B] text-white" : "bg-[#202C33] text-white"
        }`}
        // language dir 
      >
        <div className="flex-1">
          <p className="text-s" dir={isArabic(text) ? "rtl" : "ltr"}>
            {text}
          </p>
          <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
