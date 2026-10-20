import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import Login from "./pages/login"
import Register from "./pages/register";
import MovieDetails from "./pages/moviedetails";
import Showtime from "./pages/showtime";
import UpcomingMovies from "./pages/upcomingmovies";
import Theatre from "./pages/theatre";
import Movies from "./pages/movies";
import SeatSelection from "./pages/seatselection";
import BookingSummary from "./pages/bookingsummary";
import Booking from "./pages/booking";
import Profile from "./pages/profile";
import Payment from "./pages/payment";
import BookingConfirmation from "./pages/bookingconfirmation";
import MyBooking from "./pages/my booking";
import Dashboard from "../admin/dashboard";
import Movie from "../admin/movie";
import AdminTheatres from "../admin/theatre";
import AdminShows from "../admin/shows";
import AdminBookings from '../admin/booking';


function App() {
  return (

    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/showtime" element={<Showtime />} />
        <Route path="/upcoming" element={<UpcomingMovies />} />
        <Route path="/theatre/:id" element={<Theatre />} />
        <Route path="/theatre" element={<Theatre />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/seats/:id" element={<SeatSelection />}/>
        <Route path="/booking-summary/:id" element={<BookingSummary/>}/>
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />}/>
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="/admin" element={<Dashboard/>}/>
        <Route path="/admin/movie" element={<Movie/>}/>
        <Route path="/admin/theatres" element={<AdminTheatres />} />
        <Route path="/admin/shows" element={<AdminShows />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </>
  )
}

export default App
