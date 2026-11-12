const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

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
export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Profile fetch failed");
  }

  return response.json();
}

export async function updateProfile(token, data) {
  const response = await fetch(`${API_BASE_URL}/profile/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.detail || "Profile update failed"
    );
  }

  return result;
}