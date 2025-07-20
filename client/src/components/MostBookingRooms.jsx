import React from 'react';

const MostBookedRooms = ({ rooms }) => {

  const sortedRooms = rooms.sort((a, b) => b.books - a.books).slice(0, 5);

  return (
    <div className="max-w-6xl mt-8"> 
      <h2 className="text-[28px] leading-[34px] font-normal text-[#5a5c69] text-center">5 phòng được đặt nhiều nhất</h2> 
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <tbody>
            {sortedRooms.map((room) => (
              <tr key={room._id} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-800 flex items-center">
                  <img src={room.imgLink[0]} alt={room.roomName} className="w-12 h-12 rounded-full mr-4" />
                  {room.roomName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{room.books}</td>
                {/* <td className="px-4 py-2 text-sm text-gray-800">{(room.revenue * 0.1).toLocaleString()} VND</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MostBookedRooms;
