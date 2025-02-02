import React from "react";

const person = [
  {
    name: "Rehan Shaikh",
    role: "Backend Developer",
    image: "https://mist.ac.in/images/facultys/dummy.jpg",
    testimonial:
      "This platform has transformed the way I learn. The courses are well-structured, and the community is incredibly supportive!",
  },
  {
    name: "Karanraj Chauhan",
    role: "Backend Developer",
    image: "https://mist.ac.in/images/facultys/dummy.jpg",
    testimonial:
      "Amazing experience! The tools provided helped me achieve my goals faster than I expected. Highly recommended!",
  },
  {
    name: "Rudra Burbadkar",
    role: "Frontend Developer",
    image: "https://mist.ac.in/images/facultys/dummy.jpg",
    testimonial:
      "The UI is so intuitive, and the content is top-notch. This platform is a game-changer for anyone looking to upskill.",
  },
];

const Testimonial = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white sm:text-4xl">
            What People Say About Us
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            Hear from our happy users who have had amazing experiences.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {person.map((p, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-600 shadow-lg rounded-2xl p-6 text-center flex flex-col items-center transform transition hover:scale-105"
            >
              <img
                className="w-20 h-20 rounded-full object-cover"
                src={p.image}
                alt={p.name}
              />
              <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
                {p.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{p.role}</p>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{p.testimonial}</p>
              <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition">
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
