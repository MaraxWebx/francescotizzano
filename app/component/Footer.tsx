"use client";

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex  flex-col md:flex-row lg:flex-row lg:justify-end justify-center pb-6 lg:pr-6 z-50   gap-2 md:gap-4 lg:gap-4 z-50">
      {/* Pulsante Telefono */}
      <a
        href="tel:+39 3484713563"
        className=" text-white rounded-full text-xs  flex items-center justify-center   transition"
        title="Chiama"
      >
        +39 348 471 3563
      </a>

      {/* Pulsante Email */}
      <a
        href="mailto:francesco_tizzano@gmail.com"
        className=" text-white rounded-full text-xs  flex items-center justify-center   transition"
        title="Email"
      >
        francesco_tizazno@gmail.com
      </a>

      {/* Pulsante Instagram */}
      <a
        href="https://www.instagram.com/francescotizzano?utm_source=ig_web_button_share_sheet&igsh=dmp4bG43dnA0anJr"
        target="_blank"
        rel="noopener noreferrer"
        className=" text-white rounded-full text-xs  flex items-center justify-center   transition"
        title="Instagram"
      >
        @francescotizzano
      </a>
    </div>
  );
}
