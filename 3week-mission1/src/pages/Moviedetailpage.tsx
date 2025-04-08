import { useParams } from "react-router-dom";
import useCustomFetch from "../hooks/useCustomFetch";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  genres: { id: number; name: string }[];
}

interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

interface Cast {
  cast_id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  credit_id: string;
  department: string;
  job: string;
  name: string;
  profile_path: string | null;
}

function MovieDetailPage() {
  const { movieId } = useParams<{ movieId: string }>();

  const movieUrl = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
    : null;
  const creditsUrl = movieId
    ? `https://api.themoviedb.org/3/movie/${movieId}/credits`
    : null;

  const {
    data: movie,
    isLoading: movieLoading,
    error: movieError,
  } = useCustomFetch<MovieDetail>(movieUrl);

  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useCustomFetch<Credits>(creditsUrl);

  const isLoading = movieLoading || creditsLoading;
  const error = movieError || creditsError;

  /* ---------- UI ---------- */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  if (!movie || !credits) return null;

  const directors = credits.crew.filter((p) => p.job === "Director");
  const mainCast = credits.cast.slice(0, 5);

  return (
    <div className="px-4 py-8 max-w-screen-lg mx-auto">
      {/* 배경 */}
      <div
        className="w-full h-80 bg-cover bg-center rounded-lg relative"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-lg" />
        <div className="absolute bottom-0 p-4 text-white">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
          <p className="mt-1">
            개봉일: {movie.release_date} | 상영 시간: {movie.runtime}분
          </p>
          <p className="mt-1">{movie.genres.map((g) => g.name).join(", ")}</p>
        </div>
      </div>

      {/* 본문 */}
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 rounded-lg"
        />

        <div className="md:flex-1">
          <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>
          <p className="text-gray-700 mb-4">{movie.overview}</p>

          <div className="mb-4">
            <h3 className="font-semibold">감독</h3>
            {directors.map((d) => (
              <p key={d.credit_id}>{d.name}</p>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">주요 출연진</h3>
            <div className="flex gap-4 overflow-x-auto">
              {mainCast.map((actor) => (
                <div
                  key={actor.cast_id}
                  className="min-w-[100px] flex flex-col items-center"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/placeholder-profile.png"
                    }
                    alt={actor.name}
                    className="w-24 h-24 object-cover rounded-full"
                  />
                  <p className="text-sm font-semibold mt-2 text-center">
                    {actor.name}
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
