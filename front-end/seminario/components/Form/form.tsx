import React from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!onSubmit) {
      return;
    }

    if ((e.target as any)[0].value === "") {
      return;
    }

    onSubmit(e);

    (e.target as any)[0].value = "";
  };

  const keyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const form = e.currentTarget.form;

      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex gap-4">
      <input
        type="text"
        placeholder="enter a message"
        className="w-full min-h-10 px-4 py-2 text-gray-200 text-sm font-medium bg-[#0a0a0a] rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-600"
        onKeyDown={keyDown}
      />

      <button
        type="submit"
        className="h-10 w-10 flex items-center justify-center text-white bg-blue-600 rounded-md shadow-2xl focus:outline-none transition duration-300 ease-in-out hover:bg-blue-700"
      >
        <span className="w-5 h-5">
          <Icon />
        </span>
      </button>
    </form>
  );
}

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      color={"#fff"}
      fill={"none"}
    >
      <path
        d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M11.5 12.5L15 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
