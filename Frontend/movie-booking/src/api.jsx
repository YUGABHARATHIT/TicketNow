const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getMovies() {
  const response = await fetch(`${API_BASE_URL}/movies/`);

  if (!response.ok) {
    throw new Error("Movies fetch failed");
  }

  return response.json();
}

export async function getTheatres() {
  const response = await fetch(`${API_BASE_URL}/theatres/`);

  if (!response.ok) {
    throw new Error("Theatres fetch failed");
  }

  return response.json();
}

export async function getShows() {
  const response = await fetch(`${API_BASE_URL}/shows/`);

  if (!response.ok) {
    throw new Error("Shows fetch failed");
  }

  return response.json();
}