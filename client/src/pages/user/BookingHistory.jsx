import React, { useState } from "react";
import { FaCar, FaCog, FaParking, FaInfoCircle } from "react-icons/fa"; // FontAwesome for icons

const BookingPage = () => {
  const [isOpen, setIsOpen] = useState(false); // For dropdown
  const [isHistoryOpen, setIsHistoryOpen] = useState(false); // For history dropdown

  const a = "flex items-center w-full border-t border-gray-200 pt-2 mb-2";
  const b = "bg-white shadow-md p-4 rounded-lg";
  const c = "block text-left py-2 px-2 text-sm text-gray-700 hover:bg-gray-100 no-underline";

  return (
    <div className="container mx-auto p-4">
      <section className="mb-10">
        <div className="justify-between flex">
          <h2 className="text-3xl font-bold mb-4">Bookings & Trips</h2>
          <a href="" className="no-underline mt-1.5">Can't find your booking?</a>
        </div>
        <div className="relative">
          <img
            src="https://q-xx.bstatic.com/xdata/images/xphoto/2192x548/78535300.jpg?k=73bd5f533738bab542583ed2066a11195404a3e4a93621b1fec45ae762509ddc&o="
            alt="Ho Chi Minh City"
            className="rounded-md w-full object-cover brightness-75"
          />
          <div className="absolute top-[40%] left-4 text-white">
            <h3 className="text-2xl font-bold">Ho Chi Minh City</h3>
            <p className="text-lg">Nov 29 – Nov 30</p>
          </div>
        </div>

        {/* Booking details */}
        <div className="relative bg-[#f5f5f5] rounded-lg shadow-md p-4 mt-2">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/575946873.jpg?k=b650248d3e5008b3275c40d3cf22f5e1e2453313418b337b92a474131c486187&o=&hp=1"
                alt="Private Lumiere Manor"
                className="w-[100px] h-[100px] object-cover rounded-md"
              />
              <div className="ml-2">
                <p className="text-left font-bold">
                  Private Lumiere Manor - Luxury Living in Thao Dien
                </p>
                <p className="text-left">
                  Nov 29 - Nov 30 . Ho Chi Minh City . Free cancellation
                </p>
                <p className="text-green-600 font-semi text-left">Confirmed</p>
              </div>
            </div>

            <div className="relative">
              <button
                className="text-xl font-bold"
                onClick={() => setIsOpen(!isOpen)}
              >
                VND 1,928,880
                <span className="ml-2">⋮</span>
              </button>
              {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="#" className={c}>Change dates</a>
                    <a href="#" className={c}>Message the property</a>
                    <a href="#" className={c}>Contact Customer Service</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <button className={a}>
              <FaCar />
              <span className="ml-2">Save up to 10% on transportation options</span>
            </button>
            <button className={a}>
              <FaCog />
              <span className="ml-2">Manage your booking</span>
            </button>
            <button className={a}>
              <FaParking />
              <span className="ml-2">Parking information</span>
            </button>
          </div>
        </div>
      </section>

      {/* Your History Section */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Your history</h2>
        <div className="relative bg-[#f5f5f5] rounded-lg shadow-md p-4 mt-2">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/575946873.jpg?k=b650248d3e5008b3275c40d3cf22f5e1e2453313418b337b92a474131c486187&o=&hp=1"
                alt="Private Lumiere Manor"
                className="w-[100px] h-[100px] object-cover rounded-md"
              />
              <div className="ml-2">
                <p className="text-left font-bold">
                  Private Lumiere Manor - Luxury Living in Thao Dien
                </p>
                <p className="text-left">
                  Nov 29 - Nov 30 . Ho Chi Minh City . Free cancellation
                </p>
                <p className="text-red-600 font-semi text-left">Canceled</p>
              </div>
            </div>

            <div className="relative">
              <button
                className="text-xl font-bold"
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              >
                VND 1,928,880
                <span className="ml-2">⋮</span>
              </button>
              {isHistoryOpen && (
                <div className="absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="#" className={c}>Book again</a>
                    <a href="#" className={c}>Remove booking</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <button className={a}>
              <FaInfoCircle />
              <span className="ml-2">Cancellation and rebooking info</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
