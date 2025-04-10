import React from "react";

const concerns = [
  {
    id: 1,
    title: "Hair Fall",
    image: "hair1.svg",
  },
  {
    id: 2,
    title: "Dandruff Control",
    image: "hair2.svg",
  },
  {
    id: 3,
    title: "Dull Hair",
    image: "hair3.svg",
  },
  {
    id: 4,
    title: "Slow Hair Growth",
    image: "hair4.svg",
  },
];

const HairConcerns = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title & Description */}
      <div className="mb-12 flex flex-col md:flex-row items-start justify-between gap-8">
        <h1 className="text-4xl md:text-5xl font-light md:w-[35%] leading-tight">
          Shop by Hair Concerns!
        </h1>
        <p className="text-gray-600 text-lg md:w-[55%] leading-relaxed">
          Get stronger, shinier, and healthier hair with our natural Hair
          Shampoo, Hair Oil, and Hair Pack. Nourish your scalp, reduce hair
          fall, and boost growth. Try it today for flawless hair!
        </p>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {concerns.map((concern) => (
          <div key={concern.id} className="flex flex-col items-center">
            <div className="w-full aspect-square overflow-hidden">
              <img
                src={concern.image}
                alt={concern.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-lg font-medium">{concern.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HairConcerns;
