import { useState } from "react";
import { Clock, MapPin, Ticket } from "lucide-react";

function Showtime(){
    const[select,setSelect]=useState("");
    const time=[
    "10:00 AM",
    "1:30 PM",
    "4:30 PM",
    "6:30 PM",
    "9:30 PM",
    ]
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
                {time.map((timing)=>(
                    <button
                    key={time}
                    onClick={()=>setSelect(timing)}
                    className={`rounded-lg border px-4 py-3 transition ${
                        select===timing
                        ? "border-red-500 bg-red-600"
                        : "border-gray-700 hover:border-red-500"

                    }`}>{timing}</button>
                ))}
            </div>
            {select &&(
                <div className="mt-6">
                    <p className="mb-3 text-green-400">Selected show:{select}</p>
                    <button onClick={()=>
                        alert(`Booking show at ${select}`)
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