import React from "react";
import viwImg from "./assets/viwe.png";
const WelcomeScreen = ({ handeltoggleMenu }) => {
  return (
    <div className=" bg-[#222E35] p-2 w-full h-screen flex items-center flex-col justify-center  text-[#D1D6D8]">
      <div className="max-w-[560px] flex items-center justify-center flex-col text-[#D1D6D8] text-center">
        <div className="flex items-center justify-center">
          <img className="h-full w-full" src={viwImg} alt="" />
        </div>
        <h2 className="text-[32px] mt-[38px] ">
          Windows تنزيل واتساب لانظمة تشغيل
        </h2>
        <p className="mt-[24px]">
          {" "}
          يمكنك اجراء محادثه وارسال ايموجى تم انشاء المشروع بواسطه React &
          Firebase
        </p>{" "}
        <button className="bg-[#05bb8e] text-[#111B21] font-medium rounded-full px-[24px] py-[10px] mt-[24px]">
          {" "}
          Microsoft احصل على التطبيق من متجر
        </button>
      </div>
      <p
        onClick={() => handeltoggleMenu()}
        className="cursor-pointer mt-[50px] text-[#8d8d8d]"
      >
        {" "}
        اختر مستخدم لتبدء محادثه
      </p>{" "}
      <a
        target="_blank"
        href="https://www.linkedin.com/in/gerges-ghaly-9455b3224/" // تأكد من إضافة مسار الرابط المناسب في "to"
        className="cursor-pointer text-[10px] mt-[50px] text-[#8d8d8d]"
      >
        Gerges Ghaly ❤️
      </a>{" "}
    </div>
  );
};

export default WelcomeScreen;
