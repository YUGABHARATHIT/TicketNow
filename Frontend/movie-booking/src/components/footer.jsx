import {Ticket} from  "lucide-react";
function Footer() {
  return (
    <footer className="bg-[#111118] text-gray-300 px-6 md:px-16 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Logo */}
        <div className="flex " >
        <div className=" py-1 px-2 text-red-600 rounded-xl">
              <Ticket size={29} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Ticket<span className="text-red-600">Now</span>
            </h1></div>

        {/* Explore */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Explore
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-red-400">Home</a></li>
            <li><a href="/movies" className="hover:text-red-400">Movies</a></li>
            <li><a href="/theatres" className="hover:text-red-400">Theatres</a></li>
            <li><a href="/locations" className="hover:text-red-400">Locations</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Support
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/help" className="hover:text-red-400">Help Center</a></li>
            <li><a href="/contact" className="hover:text-red-400">Contact Us</a></li>
            <li><a href="/terms" className="hover:text-red-400">Terms & Conditions</a></li>
            <li><a href="/privacy" className="hover:text-red-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Follow Us
          </h3>
          <div className="flex gap-4 text-sm">
            <a href="https://instagram.com" target="_blank"
              rel="noreferrer" className="hover:text-red-400">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank"
              rel="noreferrer" className="hover:text-red-400">
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-5 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} TicketNow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;