import React from "react";
import game from "@/assets/tryGame.jpg";

function MyGame() {
  return (
    <div className="w-full h-full flex justify-center items-center p-6 mt-[200px]">
      <a
        href="https://obada33nabulsi-crypto.github.io/UMBRELLA_GAME/"
        target="_blank"
        rel="noopener noreferrer"
        className="relative overflow-hidden border-4 border-transparent hover:border-pink-500 transition-all duration-300 group"
      >
        {/* Image */}
        <img
          src={game}
          alt="Try Our Game"
          className="w-[1500px] h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>

        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-4xl font-extrabold tracking-wide">
            TRY OUR GAME
          </h1>

          <p className="text-gray-200 mt-3 text-lg font-medium">
            Click to play now
          </p>

          {/* Button */}
          <div className="mt-6 px-6 py-3 bg-white text-black font-bold hover:text-white transition-all duration-300 hover:bg-pink-500 hover:scale-110">
            Play Now
          </div>
        </div>
      </a>
    </div>
  );
}

export default MyGame;