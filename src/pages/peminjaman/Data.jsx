import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constant";
import Modal from "../../components/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);
  const [detailMember, setDetailMember] = useState(null);

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

  function handleDetailPeminjaman(peminjaman) {
    setDetailMember(peminjaman);
    setIsModalDetailOpen(true);
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

  // Fungsi export PDF detail peminjaman member
  function exportDetailToPDF() {
    if (!detailMember) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Riwayat Peminjaman Member: ${detailMember.id_member}`, 14, 22);

    const filteredData = lending.filter(item => item.id_member === detailMember.id_member);

    const tableColumn = ["#", "ID Buku", "Tgl Pinjam", "Tgl Kembali", "Status"];
    const tableRows = [];

    filteredData.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.id_buku,
        item.tgl_pinjam,
        item.tgl_pengembalian,
        item.status_pengembalian ? "Sudah Dikembalikan" : "Belum",
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.save(`riwayat_peminjaman_${detailMember.id_member}.pdf`);
  }


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

      <div className="container mt-5">
        <h4>Grafik Peminjaman per Bulan</h4>
        <GradientBarChart data={chartData} />
      </div>

      <div className="d-flex justify-content-end align-items-center mt-3">
        <button className="btn btn-warning me-3" onClick={exportExcelPeminjaman}>Export Excel</button>
      </div>

      <table className="table table-bordered text-center m-3">
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
              <td style={{ minWidth: "220px" }}>
                <div className="d-flex justify-content-center">
                  {value.status_pengembalian ? (
                    completedReturns.includes(value.id) ? (
                      <button className="btn btn-info btn-sm" disabled>Selesai</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleShowFineConfirmation(value)}>Perlu Denda?</button>
                    )
                  ) : (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handlePengembalian(value.id)}>Kembalikan</button>
                  )}
                  <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleDetailPeminjaman(value)}>Detail</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Konfirmasi Denda */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)} title="Apakah ingin menambahkan denda?">
        <button className="btn btn-danger me-3" onClick={handleFineConfirmation}>Ya</button>
        <button className="btn btn-outline-secondary" onClick={handleSkipFine}>Tidak</button>
      </Modal>

      {/* Modal Form Denda */}
      <Modal isOpen={showFineModal} onClose={() => setShowFineModal(false)} title="Tambah Denda">
        <form onSubmit={handleFineSubmit}>
          <div className="mb-3">
            <label className="form-label">ID Member</label>
            <input
              type="text"
              className="form-control"
              value={fineForm.id_member}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ID Buku</label>
            <input
              type="text"
              className="form-control"
              value={fineForm.id_buku}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Jumlah Denda</label>
            <input
              type="number"
              className="form-control"
              name="jumlah_denda"
              value={fineForm.jumlah_denda}
              onChange={e => setFineForm({ ...fineForm, jumlah_denda: e.target.value })}
              required
              min={0}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Jenis Denda</label>
            <select
              className="form-select"
              name="jenis_denda"
              value={fineForm.jenis_denda}
              onChange={e => setFineForm({ ...fineForm, jenis_denda: e.target.value })}
              required
            >
              <option value="">Pilih jenis denda</option>
              <option value="terlambat">Terlambat</option>
              <option value="kerusakan">Kerusakan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea
              className="form-control"
              name="deskripsi"
              value={fineForm.deskripsi}
              onChange={e => setFineForm({ ...fineForm, deskripsi: e.target.value })}
              rows={3}
              required
            ></textarea>
          </div>
          <button className="btn btn-primary" type="submit">Simpan Denda</button>
        </form>
      </Modal>

      {/* Modal Detail Peminjaman */}
      <Modal
        isOpen={isModalDetailOpen}
        onClose={() => setIsModalDetailOpen(false)}
        title={`Riwayat Peminjaman Member : ${detailMember?.id_member}`}
      >
        {detailMember && (
          <>
            <button className="btn btn-danger mb-3" onClick={exportDetailToPDF}>Export PDF</button>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID Buku</th>
                  <th>Tgl Pinjam</th>
                  <th>Tgl Kembali</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lending
                  .filter(item => item.id_member === detailMember.id_member)
                  .map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.id_buku}</td>
                      <td>{item.tgl_pinjam}</td>
                      <td>{item.tgl_pengembalian}</td>
                      <td>
                        {item.status_pengembalian ? (
                          <span className="badge bg-success">Sudah Dikembalikan</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Belum</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </Modal>
    </>
  );
}
