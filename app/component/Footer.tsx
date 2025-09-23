"use client";

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex  lg:justify-end justify-center lg:pb-6 lg:pr-6 z-50    gap-4 z-50">
      {/* Pulsante Telefono */}
      <a
        href="tel:+39 3484713563"
        className=" text-white rounded-full text-sm  flex items-center justify-center   transition"
        title="Chiama"
      >
        +39 348 471 3563
      </a>

      {/* Pulsante Email */}
      <a
        href="mailto:francesco_tizzano@gmail.com"
        className=" text-white rounded-full text-sm  flex items-center justify-center   transition"
        title="Email"
      >
        francesco_tizazno@gmail.com
      </a>

      {/* Pulsante Instagram */}
      <a
        href="https://instagram.com/tuo_username"
        target="_blank"
        rel="noopener noreferrer"
        className=" text-white rounded-full text-sm  flex items-center justify-center   transition"
        title="Instagram"
      >
        @tizzano
      </a>
    </div>
  );
}
