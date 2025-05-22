import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";

export default function IndexDenda() {
    const [denda, setDenda] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    function fetchData() {
        axios.get(`${API_URL}/denda`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(res => setDenda(res.data.data))
        .catch(err => {
            if (err.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            } else {
                setError(err.response?.data || { message: "Gagal memuat data" });
            }
        });
    }

    return (
        <div className="container mt-4">

            {error && <div className="alert alert-danger">{error.message}</div>}

            <table className="table table-bordered">
                <thead className="table-light">
                    <tr className="fw-bold text-center">
                        <th>ID Buku</th>
                        <th>ID Member</th>
                        <th>Jumlah Denda</th>
                        <th>Jenis Denda</th>
                        <th>Deskripsi</th>
                        <th>Tanggal Dibuat</th>
                    </tr>
                </thead>
                <tbody>
                    {denda.length > 0 ? denda.map((value) => (
                        <tr key={value.id}>
                            <td>{value.id_buku}</td>
                            <td>{value.id_member}</td>
                            <td>Rp {parseInt(value.jumlah_denda).toLocaleString('id-ID')}</td>
                            <td>{value.jenis_denda}</td>
                            <td>{value.deskripsi}</td>
                            <td>{new Date(value.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" className="text-center text-muted">Belum ada data denda.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
