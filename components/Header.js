import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center">
        <Link href="/">
          <img
            src="https://i.ibb.co/s38hqSN/Medium-Logo-Black-CMYK-1x.png"
            className="w-44 object-contain cursor-pointer"
            alt=""
          />
        </Link>
        <div className="hidden md:inline-flex space-x-5 items-center">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="text-white bg-green-600 px-4 py-1 rounded-full">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>signin</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">
          Get started
        </h3>
      </div>
    </header>
  );
};
export default Header;
