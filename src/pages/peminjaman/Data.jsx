import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import Modal from "../../components/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList,
} from "recharts";

export default function DataPeminjaman() {
  const [lending, setLending] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState([]);
  const [alert, setAlert] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedLending, setSelectedLending] = useState(null);
  const [fineForm, setFineForm] = useState({ id_member: '', id_buku: '', jumlah_denda: '', jenis_denda: '', deskripsi: '' });

  const [completedReturns, setCompletedReturns] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get(API_URL + "/peminjaman", {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        setLending(res.data.data);
        formatChartData(res.data.data);
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
        setError(err.response?.data || { message: "Gagal memuat data." });
      });
  }

  function formatChartData(data) {
    const monthlyCounts = {};
    data.forEach(item => {
      const month = dayjs(item.tgl_pinjam).format('YYYY-MM');
      monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    });

    const result = Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      jumlah: count
    })).sort((a, b) => new Date(a.month) - new Date(b.month));

    setChartData(result);
  }

  function handlePengembalian(idPeminjaman) {
    axios.put(API_URL + `/peminjaman/pengembalian/${idPeminjaman}`, {
      status_pengembalian: 1
    }, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(() => {
        setAlert("Berhasil mengembalikan peminjaman.");
        fetchData();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setError(err.response?.data || { message: "Unexpected error" });
        }
      });
  }

  function handleShowFineConfirmation(lending) {
    setSelectedLending(lending);
    setShowConfirmModal(true);
  }

  function handleFineConfirmation() {
    setFineForm({
      id_member: selectedLending.id_member,
      id_buku: selectedLending.id_buku,
      jumlah_denda: '',
      jenis_denda: '',
      deskripsi: ''
    });
    setShowConfirmModal(false);
    setShowFineModal(true);
  }

  function handleSkipFine() {
    setCompletedReturns([...completedReturns, selectedLending.id]);
    setShowConfirmModal(false);
  }

  function handleFineSubmit(e) {
    e.preventDefault();
    axios.post(API_URL + "/denda", fineForm, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(() => {
        setAlert("Denda berhasil ditambahkan.");
        setShowFineModal(false);
        setCompletedReturns([...completedReturns, selectedLending.id]);
        fetchData();
      })
      .catch(err => {
        setError(err.response?.data || { message: "Gagal menyimpan denda." });
      });
  }

  function exportExcelPeminjaman() {
    const formattedData = lending.map((item, index) => ({
      No: index + 1,
      Id_Buku: item.id_buku,
      Id_Member: item.id_member,
      TanggalPeminjaman: item.tgl_pinjam,
      TanggalPengembalian: item.tgl_pengembalian,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    saveAs(file, "data_peminjaman_buku.xlsx");
  }

  // Komponen chart dengan gradient dan animasi
  const GradientBarChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#004aad" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fill: "#333", fontWeight: "600" }} />
        <YAxis allowDecimals={false} tick={{ fill: "#333", fontWeight: "600" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#004aad", borderRadius: "8px", color: "white" }}
          itemStyle={{ color: "#ffde59", fontWeight: "700" }}
          cursor={{ fill: "rgba(0, 74, 173, 0.2)" }}
        />
        <Legend wrapperStyle={{ fontWeight: "700", color: "#004aad" }} />
        <Bar
          dataKey="jumlah"
          fill="url(#colorBar)"
          radius={[10, 10, 0, 0]}
          animationDuration={1500}
          barSize={40}
        >
          <LabelList dataKey="jumlah" position="top" fill="#004aad" fontWeight="700" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {alert && <div className="alert alert-success mt-3">{alert}</div>}

      {/* Grafik Bar */}
      <div className="container mt-5">
        <h4>Grafik Peminjaman per Bulan</h4>
        <GradientBarChart data={chartData} />
      </div>

      <div className="d-flex justify-content-end align-items-center mt-3">
        <button className="btn btn-warning me-3" onClick={exportExcelPeminjaman}>Export Excel</button>
      </div>
      <table className="table table-bordered m-3">
  <thead className="table-primary">
    <tr className="fw-bold">
      <th>#</th>
      <th>ID Buku</th>
      <th>ID Member</th>
      <th>TANGGAL PINJAM</th>
      <th>TANGGAL PENGEMBALIAN</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {lending.map((value, index) => (
      <tr key={value.id}>
        <td>{index + 1}</td>
        <td>{value.id_buku}</td>
        <td>{value.id_member}</td>
        <td>{value.tgl_pinjam}</td>
        <td>{value.tgl_pengembalian}</td>
        <td className="w-25">
  {value.status_pengembalian ? (
    completedReturns.includes(value.id) ? (
      <button className="btn btn-info me-2" disabled>Selesai</button>
    ) : (
      <button className="btn btn-primary me-2" onClick={() => handleShowFineConfirmation(value)}>Perlu Denda?</button>
    )
  ) : (
    <button className="btn btn-outline-primary me-2" onClick={() => handlePengembalian(value.id)}>Kembalikan</button>
  )}
</td>

      </tr>
    ))}
  </tbody>
</table>


      {/* Modal Konfirmasi Denda */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Konfirmasi Denda">
        <p>Apakah Peminjaman <b>{selectedLending?.id_buku}</b> perlu di denda?</p>
        <button className="btn btn-danger me-2" onClick={handleFineConfirmation}>Ya, Tambah Denda</button>
        <button className="btn btn-secondary" onClick={handleSkipFine}>Tidak Perlu</button>
      </Modal>

      {/* Modal Form Denda */}
      <Modal isOpen={showFineModal} onClose={() => setShowFineModal(false)} title="Input Denda">
        <form onSubmit={handleFineSubmit}>
          <div className="form-group">
            <label>ID Member</label>
            <input type="text" className="form-control" value={fineForm.id_member} disabled />
          </div>
          <div className="form-group mt-2">
            <label>ID Buku</label>
            <input type="text" className="form-control" value={fineForm.id_buku} disabled />
          </div>
          <div className="form-group mt-2">
            <label>Jumlah Denda</label>
            <input type="number" className="form-control" required onChange={(e) => setFineForm({ ...fineForm, jumlah_denda: e.target.value })} />
          </div>
          <div className="form-group mt-2">
            <label>Jenis Denda</label>
            <select className="form-control" required onChange={(e) => setFineForm({ ...fineForm, jenis_denda: e.target.value })}>
              <option value="">-- Pilih Jenis --</option>
              <option value="terlambat">Terlambat</option>
              <option value="kerusakan">Kerusakan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div className="form-group mt-2">
            <label>Deskripsi</label>
            <textarea className="form-control" required onChange={(e) => setFineForm({ ...fineForm, deskripsi: e.target.value })}></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-3">Simpan Denda</button>
        </form>
      </Modal>
    </>
  );
}
