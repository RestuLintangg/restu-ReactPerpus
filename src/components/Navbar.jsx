import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  let isLogin = localStorage.getItem("token");

  function logoutHandler() {
        // hapus localstorage ketika logout
      localStorage.removeItem("token");
      navigate("/login");
    }

  return (
    <>
      <nav
        id="navbar-example2"
        className="navbar navbar-expand-lg navbar-light px-3 mb-4 shadow navbar-custom"
      >
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            Perpustakaan
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav align-items-center">
              {isLogin === null ? (
                <li className="nav-item">
                  <Link className="nav-link text-primary fw-bold" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-primary fw-bold"
                      to="/dashboard"
                    >
                      <i className="bi bi-speedometer2 me-1"></i> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-primary fw-bold"
                      to="/member"
                    >
                      <i className="bi bi-people me-1"></i> Member
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-primary fw-bold"
                      to="/buku"
                    >
                      <i className="bi bi-book me-1"></i> Buku
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle text-primary fw-bold btn-dropdown"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Peminjaman
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <Link className="dropdown-item" to="/peminjaman">
                          <i className="bi bi-arrow-right-circle me-1"></i>{" "}
                          Minjem?
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/peminjaman/data">
                          <i className="bi bi-list-check me-1"></i> Data Yang
                          Minjem
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link text-primary fw-bold"
                      to="/denda"
                    >
                      <i className="bi bi-cash-stack me-1"></i> Denda
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn nav-link text-primary fw-bold btn-logout"
                      onClick={logoutHandler}
                    >
                      <i className="bi bi-box-arrow-right me-1"></i> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <style jsx>{`
          .navbar-custom {
            background: #e0f7fa;
            box-shadow: 0 6px 25px rgba(255, 193, 7, 0.6);
            transition: box-shadow 0.4s ease;
            border-radius: 0.5rem;
          }
          .navbar-custom:hover {
            box-shadow: 0 12px 40px rgba(255, 193, 7, 0.9);
          }
          .navbar-brand.text-primary {
            color: #0288d1;
            font-weight: 900;
            font-size: 1.5rem;
            transition: color 0.3s ease;
          }
          .navbar-brand.text-primary:hover {
            color: #ffb300;
            text-decoration: none;
          }
          .nav-link.text-primary {
            color: #0288d1;
            font-weight: 700;
            transition: color 0.3s ease, background-color 0.3s ease;
            border-radius: 0.375rem;
            padding: 0.375rem 0.75rem;
          }
          .nav-link.text-primary:hover,
          .nav-link.text-primary:focus {
            color: #ffb300;
            background-color: rgba(255, 179, 0, 0.15);
            text-decoration: none;
          }
          .btn-dropdown {
            background: none;
            border: none;
            padding: 0.375rem 0.75rem;
            font-weight: 700;
            color: #0288d1;
            cursor: pointer;
            border-radius: 0.375rem;
            transition: color 0.3s ease, background-color 0.3s ease;
          }
          .btn-dropdown:hover,
          .btn-dropdown:focus {
            color: #ffb300;
            background-color: rgba(255, 179, 0, 0.15);
            outline: none;
          }
          .dropdown-menu {
            border-radius: 0.5rem;
            box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5);
            border: none;
          }
          .dropdown-item {
            font-weight: 600;
            color: #0288d1;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
          .dropdown-item:hover,
          .dropdown-item:focus {
            background-color: #ffb300;
            color: white;
          }
          .navbar-toggler-icon {
            filter: invert(33%) sepia(75%) saturate(555%) hue-rotate(166deg)
              brightness(89%) contrast(90%);
          }
          .btn-logout {
            border: 1.5px solid #0288d1;
            background-color: transparent;
            border-radius: 0.375rem;
            transition: background-color 0.3s ease;
            padding: 0.375rem 0.75rem;
          }

          .btn-logout:hover,
          .btn-logout:focus {
            background-color: rgba(2, 136, 209, 0.1); /* biru muda transparan */
            outline: none;
          }
        `}</style>
      </nav>
    </>
  );
}
