
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

function Slide() {
  const [slide, setSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const movies = [
    {
      title: "OM",
      language: "Tamil + 2 more",
      description:
        "An action drama about power, struggle, transformation and conviction.",
      genre: ["Action", "Drama", "Thriller"],
      release: "Releasing 20 November 2026",
      image: "/images/om.jpg",
      video: "/video/om.mp4",
    },
    {
      title: "AVENGERS DOOMSDAY",
      language: "Tamil",
      description:
        "Experience an exciting story filled with action, emotion and adventure.",
      genre: ["Action", "Adventure"],
      release: "Coming soon",
      image: "/images/avengers.jpg",
      video: "/video/videoplayback%20(1).mp4",
    },
    {
      title: "JAILER 2",
      language: "Tamil + 1 more",
      description:
        "A powerful story of courage, friendship and unforgettable moments.",
      genre: ["Drama", "Thriller"],
      release: "Coming soon",
      image: "/images/jailer.jpg",
      video: "/video/videoplayback%20(2).mp4",
    },
  ];

  const movie = movies[slide];

  const nextSlide = () => {
    setSlide((prev) => (prev + 1) % movies.length);
    setIsHovered(false);
  };

  const prevSlide = () => {
    setSlide((prev) => (prev - 1 + movies.length) % movies.length);
    setIsHovered(false);
  };

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % movies.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [isHovered, movies.length]);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">

      {/* Blurred background */}
      <img
        key={movie.image}
        src={movie.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-900/90 to-blue-950/70" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-6 md:px-12 lg:px-20 py-12 md:py-16 min-h-125 md:min-h-150">

        {/* Movie details */}
        <div className="w-full md:w-3/5 space-y-5">
          <p className="text-sm font-semibold text-red-400 uppercase tracking-widest">
            Featured Movie
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
            {movie.title}
          </h1>

          <p className="text-gray-300">{movie.language}</p>

          <p className="max-w-2xl text-gray-200 text-base md:text-lg leading-7">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {movie.genre.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/15 border border-white/10 px-4 py-1.5 text-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="text-gray-300 text-sm">{movie.release}</p>
        </div>

        {/* Poster and hover trailer */}
        <div
          className="relative w-50 sm:w-60 md:w-70 shrink-0 aspect-2/3 overflow-hidden rounded-xl shadow-2xl shadow-black/50 group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={movie.image}
            alt={`${movie.title} poster`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />

          {isHovered && (
            <video
              key={movie.video}
              src={movie.video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {!isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="rounded-full bg-black/60 p-4 border border-white/70">
                <Play size={28} fill="white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Previous and next */}
      <button
        onClick={prevSlide}
        aria-label="Previous movie"
        className="absolute z-20 left-3 md:left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 md:p-3 hover:bg-red-600 transition"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next movie"
        className="absolute z-20 right-3 md:right-5 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 md:p-3 hover:bg-red-600 transition"
      >
        <ChevronRight size={28} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.map((item, index) => (
          <button
            key={item.title}
            onClick={() => {
              setSlide(index);
              setIsHovered(false);
            }}
            aria-label={`Go to ${item.title}`}
            className={`h-2 rounded-full transition-all ${
              slide === index ? "w-8 bg-red-500" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Slide;
