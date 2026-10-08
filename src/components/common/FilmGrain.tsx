"use client";

export function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1000] h-full w-full select-none"
      style={{
        opacity: 0.2,
        backgroundImage: "url('/images/grain.png')",
        backgroundRepeat: "repeat",
        backgroundPosition: "center top",
        backgroundSize: "153.5px auto",
      }}
    />
  );
}
