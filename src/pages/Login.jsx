import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../constant";

export default function Login() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  function loginProcess(e) {
    e.preventDefault();
    axios
      .post(API_URL + "/login", login)
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id_member", res.data.id_member);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data.message) {
          setError({ message: err.response.data.message }); // tampilkan error dari backend
        } else {
          setError({ message: "Terjadi kesalahan" });
        }
      });
  }

  return (
    <>
      {error.message && (
        <div className="alert alert-danger m-2 p-2">{error.message}</div>
      )}
      <form
        onSubmit={(e) => loginProcess(e)}
        className="d-flex justify-content-center align-items-center mt-5"
      >
        <div className="card login-card p-4 shadow">
          <h4 className="text-center mb-4 text-primary">Silahkan Login</h4>
          {Object.keys(error).length > 0 ? (
            <ol className="alert alert-danger m-2 p-2">
              {Object.entries(error.data).length > 0
                ? Object.entries(error.data).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))
                : error.message}
            </ol>
          ) : (
            ""
          )}
          <div className="mb-3">
            <label className="form-label text-primary fw-semibold">Email</label>
            <input
              type="email"
              className="form-control input-custom"
              placeholder="Masukkan Email"
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label text-primary fw-semibold">Password</label>
            <input
              type="password"
              className="form-control input-custom"
              placeholder="Masukkan password"
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100 mt-3 btn-lg shadow-sm">
            Masuk
          </button>
        </div>
      </form>

      <style jsx>{`
        .login-card {
          width: 100%;
          max-width: 400px;
          background: #e0f7fa; /* biru muda terang */
          border-radius: 1rem;
          box-shadow: 0 6px 25px rgba(255, 179, 0, 0.6); /* shadow oranye cerah */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .login-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(255, 179, 0, 0.9);
        }
        .text-primary {
          color: #0288d1 !important; /* biru terang */
        }
        .fw-semibold {
          font-weight: 600;
        }
        .input-custom {
          border: 2px solid #0288d1;
          border-radius: 0.5rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          padding: 0.5rem 0.75rem;
        }
        .input-custom:focus {
          border-color: #ffb300;
          box-shadow: 0 0 8px rgba(255, 179, 0, 0.7);
          outline: none;
        }
        .btn-warning {
          background-color: #ffb300;
          border: none;
          font-weight: 700;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        .btn-warning:hover {
          background-color: #ffa000;
          box-shadow: 0 8px 20px rgba(255, 160, 0, 0.7);
        }
        .alert-danger {
          background-color: #ffebee;
          color: #b00020;
          border-radius: 0.5rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
