import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { API_URL } from "../../constant";

export default function Member() {
  // state 
  const [member, setMember] = useState([]);
  const [error, setError] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formModal, setFormModal] = useState({ no_ktp: '', nama: '', alamat: '', tgl_lahir: '' });
  const [alert, setAlert] = useState("");

  const [selectedMember, setSelectedMember] = useState(null);
  const [detailMember, setDetailMember] = useState(null);
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get(API_URL + "/member", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => setMember(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || {});
      });
  }

  function handleSubmitModal(e) {
    e.preventDefault();
    axios.post(API_URL + "/member", formModal, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setIsModalOpen(false);
        setAlert("Success add new member");
        setFormModal({ no_ktp: '', nama: '', alamat: '', tgl_lahir: '' });
        setError({});
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || {});
      });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    axios.put(`${API_URL}/member/${selectedMember.id}`, formModal, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedMember(null);
        setAlert("Success update member");
        setFormModal({ no_ktp: '', nama: '', alamat: '', tgl_lahir: '' });
        setError({});
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || {});
      });
  }

  function handleDelete() {
    axios.delete(`${API_URL}/member/${selectedMember.id}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setIsDeleteModalOpen(false);
        setSelectedMember(null);
        setAlert("Success delete member");
        setError({});
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || {});
      });
  }

  function handleDetailMember(member) {
    setDetailMember(member);
    setIsModalDetailOpen(true);
  }

  return (
    <>
      {alert && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {alert}
          <button type="button" className="btn-close" onClick={() => setAlert("")}></button>
        </div>
      )}

      <div className="d-flex justify-content-end my-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setIsModalOpen(true);
            setFormModal({ no_ktp: '', nama: '', alamat: '', tgl_lahir: '' });
            setError({});
          }}
        >
          + TAMBAH MEMBER
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>No. KTP</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Tanggal Lahir</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {member.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">No members found.</td>
              </tr>
            )}
            {member.map((value, index) => (
              <tr key={value.id}>
                <td>{index + 1}</td>
                <td>{value.no_ktp}</td>
                <td>{value.nama}</td>
                <td>{value.alamat}</td>
                <td>{value.tgl_lahir}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-warning me-1"
                    onClick={() => handleDetailMember(value)}
                  >
                    Detail
                  </button>
                  <button
                    className="btn btn-sm btn-outline-info me-1"
                    onClick={() => {
                      setSelectedMember(value);
                      setFormModal({ no_ktp: value.no_ktp, nama: value.nama, alamat: value.alamat, tgl_lahir: value.tgl_lahir });
                      setIsEditModalOpen(true);
                      setError({});
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setSelectedMember(value);
                      setIsDeleteModalOpen(true);
                      setError({});
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member" size="md">
        <form onSubmit={handleSubmitModal}>
          <div className="mb-3">
            <label className="form-label">No. KTP <span className="text-danger">*</span></label>
            <input
              type="number"
              className={`form-control ${error.data?.no_ktp ? "is-invalid" : ""}`}
              value={formModal.no_ktp}
              onChange={(e) => setFormModal({ ...formModal, no_ktp: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nama <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${error.data?.nama ? "is-invalid" : ""}`}
              value={formModal.nama}
              onChange={(e) => setFormModal({ ...formModal, nama: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Alamat <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${error.data?.alamat ? "is-invalid" : ""}`}
              value={formModal.alamat}
              onChange={(e) => setFormModal({ ...formModal, alamat: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Lahir <span className="text-danger">*</span></label>
            <input
              type="date"
              className={`form-control ${error.data?.tgl_lahir ? "is-invalid" : ""}`}
              value={formModal.tgl_lahir}
              onChange={(e) => setFormModal({ ...formModal, tgl_lahir: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Tambah</button>
        </form>
      </Modal>

      {/* Edit Member Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Member" size="md">
        <form onSubmit={handleEditSubmit}>
          <div className="mb-3">
            <label className="form-label">No. KTP <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${error.data?.no_ktp ? "is-invalid" : ""}`}
              value={formModal.no_ktp}
              onChange={(e) => setFormModal({ ...formModal, no_ktp: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nama <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${error.data?.nama ? "is-invalid" : ""}`}
              value={formModal.nama}
              onChange={(e) => setFormModal({ ...formModal, nama: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Alamat <span className="text-danger">*</span></label>
            <input
              type="text"
              className={`form-control ${error.data?.alamat ? "is-invalid" : ""}`}
              value={formModal.alamat}
              onChange={(e) => setFormModal({ ...formModal, alamat: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tanggal Lahir <span className="text-danger">*</span></label>
            <input
              type="date"
              className={`form-control ${error.data?.tgl_lahir ? "is-invalid" : ""}`}
              value={formModal.tgl_lahir}
              onChange={(e) => setFormModal({ ...formModal, tgl_lahir: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Update</button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Member" size="sm">
        <p>Are you sure you want to delete member <strong>{selectedMember?.nama}</strong>?</p>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isModalDetailOpen} onClose={() => setIsModalDetailOpen(false)} title="Member Detail" size="sm">
        {detailMember && (
          <div>
            <p><strong>No. KTP:</strong> {detailMember.no_ktp}</p>
            <p><strong>Nama:</strong> {detailMember.nama}</p>
            <p><strong>Alamat:</strong> {detailMember.alamat}</p>
            <p><strong>Tanggal Lahir:</strong> {detailMember.tgl_lahir}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
