import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  function handleButtonClick() {
    navigate("/buku");
  }

  return (
    <>
      <div className="container mt-5">
        <div className="dashboard-wrapper p-5 rounded shadow text-center">
          <h1 className="mb-3 display-3 fw-extrabold text-primary">
            Selamat datang di
          </h1>
          <h2 className="mb-4 display-5 text-warning">
            Perpustakaan Online ku
          </h2>
          <p className="lead text-dark mb-4">
            Temukan buku favoritmu dengan mudah, pinjam, dan baca kapan saja
            secara online!
          </p>
          <button
            className="btn btn-warning btn-lg shadow-lg px-5"
            onClick={handleButtonClick}
          >
            Jelajahi Koleksi Buku
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard-wrapper {
          background: #e0f7fa; /* biru muda terang */
          color: #212121; /* abu sangat gelap */
          box-shadow: 0 6px 25px rgba(255, 193, 7, 0.6); /* shadow oranye cerah */
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .dashboard-wrapper:hover {
          transform: translateY(-12px);
          box-shadow: 0 12px 40px rgba(255, 193, 7, 0.9);
        }
        h1.text-primary {
          color: #0288d1; /* biru terang */
          font-weight: 900;
        }
        h2.text-warning {
          color: #ffb300; /* oranye cerah */
          font-weight: 700;
        }
        button.btn-warning {
          background-color: #ffb300;
          border: none;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        button.btn-warning:hover {
          background-color: #ffa000;
        }
        p.lead {
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
          font-size: 1.25rem;
        }
      `}</style>
    </>
  );
}
