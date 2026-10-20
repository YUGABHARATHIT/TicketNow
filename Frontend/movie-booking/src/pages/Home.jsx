import Footer from "../components/footer";
import Slide from "../components/moviecard";
import Navbar from "../components/navbar";
import Movies from "../components/heromovies";
function Home(){
    return(
        <>
        <Navbar/>
        <Slide/>
        <Movies/>
        <Footer/>
        </>
    )
}
export default Home;