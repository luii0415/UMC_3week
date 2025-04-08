import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
}

function MoviesPage() {
  const { category } = useParams<{ category: string }>();
  const [page, setPage] = useState(1);

  // 카테고리 → TMDB 엔드포인트 매핑
  const getEndpointFromCategory = (cat?: string) => {
    switch (cat) {
      case "popular":
        return "popular";
      case "upcoming":
        return "upcoming";
      case "top-rated":
        return "top_rated";
      case "now_playing":
        return "now_playing";
      default:
        return "popular";
    }
  };

  // 카테고리가 바뀌면 1페이지로 초기화
  useEffect(() => setPage(1), [category]);

  const endpoint = getEndpointFromCategory(category);
  const url = `https://api.themoviedb.org/3/movie/${endpoint}?language=en-US&page=${page}`;

  const { data, isLoading, error } = useCustomFetch<{ results: Movie[] }>(url);
  const movies = data?.results ?? [];

  // 페이지 이동
  const prevPage = () => page > 1 && setPage((p) => p - 1);
  const nextPage = () => setPage((p) => p + 1);

  /* ---------- UI ---------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="pt-5 pb-10 px-4">
      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className={`w-10 h-10 rounded-md flex items-center justify-center text-xl shadow-md ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-pink-300"
          }`}
        >
          &lt;
        </button>
        <span className="font-semibold">{page} 페이지</span>
        <button
          onClick={nextPage}
          className="w-10 h-10 rounded-md flex items-center justify-center text-xl bg-pink-400 text-white hover:bg-pink-500 shadow-md"
        >
          &gt;
        </button>
      </div>

      {/* 영화 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link key={movie.id} to={`/movies/${movie.id}/details`}>
            <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="object-cover w-full h-full transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white">
                <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                <p className="text-sm line-clamp-4">{movie.overview}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MoviesPage;
