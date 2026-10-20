// const TOKEN = " 67e0e4d6";

// export async function getUpcomingTamilMovies() {
//   const today = new Date().toISOString().split("T")[0];

//   const url =
//     `https://api.themoviedb.org/3/discover/movie` +
//     `?with_original_language=ta` +
//     `&region=IN` +
//     `&release_date.gte=${today}` +
//     `&sort_by=release_date.asc` +
//     `&page=1`;

//   const response = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${TOKEN}`,
//       accept: "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to load Tamil movies");
//   }

//   const data = await response.json();
//   return data.results || [];
// }