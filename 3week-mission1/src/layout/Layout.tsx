import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  const baseClass =
    "px-4 py-2 rounded font-semibold text-black visited:text-black no-underline hover:bg-gray-200 transition-colors duration-200";
  const activeClass = "bg-sky-500 text-white";

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full flex items-center justify-center gap-4 p-4 shadow bg-white z-50 ">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${baseClass} ${activeClass}` : baseClass
          }
        >
          홈
        </NavLink>

        <NavLink
          to="/movies/popular"
          className={({ isActive }) =>
            isActive ? `${baseClass} ${activeClass}` : baseClass
          }
        >
          인기 영화
        </NavLink>

        <NavLink
          to="/movies/upcoming"
          className={({ isActive }) =>
            isActive ? `${baseClass} ${activeClass}` : baseClass
          }
        >
          개봉 예정 순
        </NavLink>

        <NavLink
          to="/movies/top-rated"
          className={({ isActive }) =>
            isActive ? `${baseClass} ${activeClass}` : baseClass
          }
        >
          평점 높은 순
        </NavLink>

        <NavLink
          to="/movies/now_playing"
          className={({ isActive }) =>
            isActive ? `${baseClass} ${activeClass}` : baseClass
          }
        >
          상영 중
        </NavLink>
      </nav>

      <div className="pt-20 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
