import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { API_URL } from "../../constant";

export default function Buku() {
  const [DataBuku, setDataBuku] = useState([]);
  const [error, setError] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formModal, setFormModal] = useState({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
  const [alert, setAlert] = useState("");

  const [selectedDataBuku, setSelectedDataBuku] = useState(null);
  const [detailDataBuku, setDetailDataBuku] = useState([]);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get(API_URL + "/buku", {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    })
      .then(res => setDataBuku(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || err.message);
      });
  }

  function handleSubmitModal(e) {
    e.preventDefault();
    axios.post(API_URL + "/buku", formModal, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setIsModalOpen(false);
        setAlert("Success add new data book");
        setFormModal({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
        setError([]);
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || err.message);
      });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    axios.put(`${API_URL}/buku/${selectedDataBuku.id}`, formModal, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedDataBuku(null);
        setAlert("Success Update Data Buku");
        setFormModal({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
        setError([]);
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || err.message);
      });
  }

  function handleDelete() {
    axios.delete(`${API_URL}/buku/${selectedDataBuku.id}`, {
      headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setIsDeleteModalOpen(false);
        setSelectedDataBuku(null);
        setAlert("Success delete Data Buku");
        setError([]);
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || err.message);
      });
  }

  function handleDetailDataBuku(data) {
    setDetailDataBuku(data);
    setIsModalDetailOpen(true);
  }

  return (
    <>
      <style>{`
        .card-buku {
          background: linear-gradient(135deg, #e0f2ff 0%, #bbdefb 100%);
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0,123,255,0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .card-buku:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0,123,255,0.4);
        }
        .card-buku .card-body {
          flex-grow: 1;
          padding: 1.5rem;
          color: #003366;
        }
        .card-buku h5 {
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #004aad;
        }
        .card-buku .card-subtitle {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          color: #336699;
        }
        .card-buku p {
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        .card-buku .btn-group {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }
        .btn-biru {
          background-color: #1976d2;
          border: none;
          color: white;
          transition: background-color 0.3s ease;
        }
        .btn-biru:hover {
          background-color: #0d47a1;
          color: white;
        }
        .btn-biru-outline {
          background-color: transparent;
          border: 2px solid #1976d2;
          color: #1976d2;
          transition: all 0.3s ease;
        }
        .btn-biru-outline:hover {
          background-color: #1976d2;
          color: white;
        }
        .alert-success {
          background-color: #d1e7dd;
          border-color: #badbcc;
          color: #0f5132;
          margin-bottom: 1rem;
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
        }
      `}</style>

      {alert && <div className="alert alert-success">{alert}</div>}

      <div className="d-flex justify-content-end mt-3 mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setIsModalOpen(true);
            setFormModal({ no_rak: '', judul: '', pengarang: '', tahun_terbit: '', penerbit: '', stok: '', detail: '' });
            setError([]);
          }}
        >
          + Tambah Buku
        </button>
      </div>

      <div className="row g-4">
        {DataBuku.map((value) => (
          <div key={value.id} className="col-sm-12 col-md-6 col-lg-4">
            <div className="card-buku">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{value.judul}</h5>
                <h6 className="card-subtitle">Rak: {value.no_rak}</h6>
                <p><strong>Pengarang:</strong> {value.pengarang}</p>
                <p><strong>Tahun:</strong> {value.tahun_terbit}</p>
                <p><strong>Penerbit:</strong> {value.penerbit}</p>
                <p><strong>Stok:</strong> {value.stok}</p>
                <p className="mb-3"><strong>Detail:</strong> {value.detail}</p>
                <div className="btn-group">
                  <button
                    className="btn btn-biru-outline"
                    onClick={() => handleDetailDataBuku(value)}
                  >
                    Detail
                  </button>
                  <button
                    className="btn btn-biru-outline"
                    onClick={() => {
                      setSelectedDataBuku(value);
                      setFormModal({
                        no_rak: value.no_rak,
                        judul: value.judul,
                        pengarang: value.pengarang,
                        tahun_terbit: value.tahun_terbit,
                        penerbit: value.penerbit,
                        stok: value.stok,
                        detail: value.detail,
                      });
                      setIsEditModalOpen(true);
                      setError([]);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedDataBuku(value);
                      setIsDeleteModalOpen(true);
                      setError([]);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Buku Baru">
        <form onSubmit={handleSubmitModal}>
          {
            error.data ?
              Object.entries(error.data).map(([key, val]) => (
                <div key={key} className="text-danger">{val}</div>
              )) :
              <div className="text-danger">{error.message}</div>
          }
          <div className="form-group mb-2">
            <label>No. Rak <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              value={formModal.no_rak}
              onChange={e => setFormModal({ ...formModal, no_rak: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Judul <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.judul}
              onChange={e => setFormModal({ ...formModal, judul: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Pengarang <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.pengarang}
              onChange={e => setFormModal({ ...formModal, pengarang: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Tahun Terbit <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.tahun_terbit}
              onChange={e => setFormModal({ ...formModal, tahun_terbit: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Penerbit <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.penerbit}
              onChange={e => setFormModal({ ...formModal, penerbit: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Stok <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              value={formModal.stok}
              onChange={e => setFormModal({ ...formModal, stok: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Detail <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.detail}
              onChange={e => setFormModal({ ...formModal, detail: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-biru w-100 mt-3">Tambah</button>
        </form>
      </Modal>

      {/* Modal Edit */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Data Buku">
        <form onSubmit={handleEditSubmit}>
          {
            error.data ?
              Object.entries(error.data).map(([key, val]) => (
                <div key={key} className="text-danger">{val}</div>
              )) :
              <div className="text-danger">{error.message}</div>
          }
          <div className="form-group mb-2">
            <label>No. Rak <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              value={formModal.no_rak}
              onChange={e => setFormModal({ ...formModal, no_rak: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Judul <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.judul}
              onChange={e => setFormModal({ ...formModal, judul: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Pengarang <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.pengarang}
              onChange={e => setFormModal({ ...formModal, pengarang: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Tahun Terbit <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.tahun_terbit}
              onChange={e => setFormModal({ ...formModal, tahun_terbit: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Penerbit <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.penerbit}
              onChange={e => setFormModal({ ...formModal, penerbit: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Stok <span className="text-danger">*</span></label>
            <input
              type="number"
              className="form-control"
              value={formModal.stok}
              onChange={e => setFormModal({ ...formModal, stok: e.target.value })}
            />
          </div>
          <div className="form-group mb-2">
            <label>Detail <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={formModal.detail}
              onChange={e => setFormModal({ ...formModal, detail: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-biru w-100 mt-3">Update</button>
        </form>
      </Modal>

      {/* Modal Delete */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Hapus Data Buku?">
        <p>Apakah Anda yakin ingin menghapus data buku ini?</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
          <button className="btn btn-danger" onClick={handleDelete}>Hapus</button>
        </div>
      </Modal>

      {/* Modal Detail */}
      <Modal isOpen={isModalDetailOpen} onClose={() => setIsModalDetailOpen(false)} title="Detail Data Buku">
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>No. Rak</th>
              <td>{detailDataBuku.no_rak}</td>
            </tr>
            <tr>
              <th>Judul</th>
              <td>{detailDataBuku.judul}</td>
            </tr>
            <tr>
              <th>Pengarang</th>
              <td>{detailDataBuku.pengarang}</td>
            </tr>
            <tr>
              <th>Tahun Terbit</th>
              <td>{detailDataBuku.tahun_terbit}</td>
            </tr>
            <tr>
              <th>Penerbit</th>
              <td>{detailDataBuku.penerbit}</td>
            </tr>
            <tr>
              <th>Stok</th>
              <td>{detailDataBuku.stok}</td>
            </tr>
            <tr>
              <th>Detail</th>
              <td>{detailDataBuku.detail}</td>
            </tr>
          </tbody>
        </table>
      </Modal>
    </>
  );
}
