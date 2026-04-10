import { useParams } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";

export default function RoomDetails() {
  const { id } = useParams();

  // 🔥 Replace this with API later
  const room = {
    title: "Modern 2BHK Apartment",
    location: "Jaipur, Rajasthan",
    price: 1500,
    description:
      "A beautiful and spacious apartment located in the heart of the city. Perfect for families and working professionals.",
    amenities: ["WiFi", "AC", "Parking", "Kitchen"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      
      {/* 🔥 IMAGE SECTION */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <img
          src={room.images[0]}
          className="w-full h-[350px] object-cover rounded-xl"
        />
        <div className="grid grid-cols-2 gap-4">
          {room.images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-[170px] object-cover rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex gap-6">
        
        {/* LEFT */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow">
          
          <h1 className="text-2xl font-bold mb-2">{room.title}</h1>
          <p className="text-gray-500 mb-4">{room.location}</p>

          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 mb-4">{room.description}</p>

          <h2 className="text-xl font-semibold mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((item, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT (BOOKING CARD) */}
        <div className="w-[300px] bg-white p-6 rounded-xl shadow h-fit">
          
          <h2 className="text-xl font-bold mb-4">
            {formatCurrency(room.price)} / night
          </h2>

          <button className="w-full bg-indigo-600 text-white py-2 rounded mb-3">
            Book Now
          </button>

          <button className="w-full border py-2 rounded">
            Contact Owner
          </button>
        </div>

      </div>

    </div>
  );
}