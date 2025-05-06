import React from 'react';

type ButtonSelectCameraProps = {
  onClick?: () => void;
  idCamera?: string | null;
};
export default function ButtonSelectCamera(props: ButtonSelectCameraProps) {
  const { onClick, idCamera } = props;

  return (
    <div className="w-full flex justify-between items-center">
      <button
        className="w-fit h-[48px] bg-[#FBBF24] rounded-[8px] flex items-center justify-center cursor-pointer p-[16px]"
        onClick={onClick}
      >
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-camera mr-[8px]"
          >
            <path d="M23 19V7a2 2 0 0 0-2-2h-4l-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span className="text-base font-semibold">Chọn camera</span>
        </div>
      </button>
      {idCamera && <div>ID camera: {idCamera?.substring(0, 8)}...</div>}
    </div>
  );
}
