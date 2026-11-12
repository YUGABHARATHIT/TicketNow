import { useState , useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Ticket } from "lucide-react";


function Showtime(){
    
    const navigate = useNavigate();
    const { id } = useParams();
    const[select,setSelect]=useState("");
    const [shows, setShows] = useState([]);
    console.log("Available shows:", shows);
    useEffect(() => {
        const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      
        fetch(`${API}/shows/`)
          .then((res) => res.json())
          .then((data) => setShows(data))
          .catch((error) => console.error("Shows fetch error:", error));
      }, []);
      const time = shows;
    return(
        <div className="min-h-screen bg-gray-950 p-6 text-white">
            <h1 className="mb-2 text-3xl font-bold">
            Select Showtime
            </h1>
            <p className="mb-6 text-gray-400">
                <MapPin  className="mr-2 inline" size={18}/>
                PVR Cinemas
            </p>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <h2 className="mb-4 text-xl font-semibold " >
                    <Clock className="mr-2 inline text-red-500" />
                    Today's Shows
                </h2>

            <div className="flex flex-wrap gap-3">
            {time.map((show) => (
            <button
            key={show.id}
            onClick={() => setSelect(show)}
            className={`rounded-lg border px-4 py-3 transition ${
            select?.id === show.id
            ? "border-red-500 bg-red-600"
            : "border-gray-700 hover:border-red-500"
            }`}
            >
            {show.show_time}
             </button>
            ))}
            </div>
            {select &&(
                <div className="mt-6">
                    <p className="mb-3 text-green-400">{select?.show_time}</p>
                    <button onClick={() =>
                     navigate(`/seats/${select.movie}`, {
                     state: {
                     movieId: select.movie,
                    showId: select.id,
                    movieTitle: select.movie_title,
                    theatre: select.theatre_name,
                    showtime: select.show_time,
                    date: select.show_date,
                    ticketPrice: Number(select.ticket_price),
                    },
                     })
                    } className="rounded-lg bg-red-600 px-5 py-3 font-semibold hover:bg-red-700">
                    <Ticket className="mr-2 inline" size={18} />
                    Book Tickets
                    </button>
                    </div>
            )}
            </div>

        </div>
    );
}
export default Showtime;