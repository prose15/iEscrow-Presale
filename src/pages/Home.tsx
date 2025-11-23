import PresaleForm from "../components/presale-form/PresaleForm";

export default function Home() {
  return (
    <div
      className="
        relative
        w-auto overflow-clip px-2 md:px-4 py-0 
        flex items-center justify-center 
        pt-20 md:pt-24 lg:pt-28
        min-h-screen
      "
    >
      {/* DESKTOP SPLIT BACKGROUND */}
      <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        {/* LEFT = 180° ROTATED */}
        <div className="absolute left-0 top-0 w-1/2 h-full overflow-hidden">
          {/* <div
            className="
              w-full h-full
              bg-[url('./assets/banner_bg.webp')]
              bg-cover bg-center bg-no-repeat
              rotate-180
            "
          /> */}
        </div>

        {/* RIGHT = NORMAL */}
        <div className="absolute right-0 top-0 w-1/2 h-full overflow-hidden">
          {/* <div
            className="
              w-full h-full
              bg-[url('./assets/banner_bg.webp')]
              bg-cover bg-center bg-no-repeat
            "
          /> */}
        </div>
      </div>

      <PresaleForm />
    </div>
  );
}
