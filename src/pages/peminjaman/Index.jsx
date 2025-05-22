import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { API_URL } from "../../constant";

export default function Peminjaman() {
  const [DataBuku, setDataBuku] = useState([]);
  const [DataMember, setDataMember] = useState([]);
  const [error, setError] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState("");
  const [formPeminjaman, setFormPeminjaman] = useState({
    id_buku: "",
    id_member: "",
    tgl_pinjam: "",
    tgl_pengembalian: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchMembers();
  }, []);

  function fetchData() {
    axios
      .get(API_URL + "/buku", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setDataBuku(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || []);
      });
  }

  function fetchMembers() {
    axios
      .get(API_URL + "/member", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setDataMember(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || []);
      });
  }

  function handleSubmitPeminjaman(e) {
    e.preventDefault();

    axios
      .post(API_URL + "/peminjaman", formPeminjaman, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsModalOpen(false);
        setAlert("Peminjaman berhasil dilakukan");
        setError([]);
        setFormPeminjaman({
          id_buku: "",
          id_member: "",
          tgl_pinjam: "",
          tgl_pengembalian: "",
        });
        fetchData();
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || []);
      });
  }

  return (
    <>
      {alert && <div className="alert alert-success m-3">{alert}</div>}

      <table className="table table-bordered m-3">
        <thead className="table-primary">
          <tr>
            <th>No. Rak</th>
            <th>Judul</th>
            <th>Pengarang</th>
            <th>Tahun Terbit</th>
            <th>Penerbit</th>
            <th>Stok</th>
            <th>Detail</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {DataBuku.map((value) => (
            <tr key={value.id}>
              <td>{value.no_rak}</td>
              <td>{value.judul}</td>
              <td>{value.pengarang}</td>
              <td>{value.tahun_terbit}</td>
              <td>{value.penerbit}</td>
              <td>{value.stok}</td>
              <td>{value.detail}</td>
              <td>
                {value.stok < 1 ? (
                  <button className="btn btn-danger btn-sm" disabled>
                    Stok Buku Tidak Ada
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setFormPeminjaman({
                        id_buku: value.id,
                        id_member: "",
                        tgl_pinjam: "",
                        tgl_pengembalian: "",
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    Pinjam
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form Peminjaman Buku"
      >
        <form onSubmit={handleSubmitPeminjaman}>
          {error.data ? (
            Object.entries(error.data).map(([key, value]) => (
              <div key={key} className="text-danger mb-1">
                {value}
              </div>
            ))
          ) : (
            error.message && (
              <div className="text-danger mb-2">{error.message}</div>
            )
          )}

          <div className="mb-3">
            <label className="form-label">ID Buku</label>
            <input
              type="text"
              className="form-control"
              value={formPeminjaman.id_buku}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Pilih Member</label>
            <select
              className="form-select"
              value={formPeminjaman.id_member}
              onChange={(e) =>
                setFormPeminjaman({ ...formPeminjaman, id_member: e.target.value })
              }
              required
            >
              <option value="">-- Pilih Member --</option>
              {DataMember.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Tanggal Pinjam</label>
            <input
              type="date"
              className="form-control"
              value={formPeminjaman.tgl_pinjam}
              onChange={(e) =>
                setFormPeminjaman({ ...formPeminjaman, tgl_pinjam: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tanggal Pengembalian</label>
            <input
              type="date"
              className="form-control"
              value={formPeminjaman.tgl_pengembalian}
              onChange={(e) =>
                setFormPeminjaman({ ...formPeminjaman, tgl_pengembalian: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Pinjam Buku
          </button>
        </form>
      </Modal>
    </>
  );
}
