import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function App() {
    const [mainTab, setMainTab] = useState('keuangan'); // 'keuangan' | 'perencanaan'
    const [userRole, setUserRole] = useState('guest'); // 'guest' | 'admin'
    const [selectedYear, setSelectedYear] = useState('2026');
    const [currentMonth, setCurrentMonth] = useState(8); // August default (1-12)
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBidang, setSelectedBidang] = useState('ALL');
    const [toastMessage, setToastMessage] = useState('');

    // Modal Authentication & TA Management States
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [isAddYearModalOpen, setIsAddYearModalOpen] = useState(false);
    const [newYearSelect, setNewYearSelect] = useState('');
    const [newYearSubOption, setNewYearSubOption] = useState('clone'); // 'clone' | 'manual'

    const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
    const [newSubKode, setNewSubKode] = useState('');
    const [newSubNama, setNewSubNama] = useState('');
    const [newSubBidang, setNewSubBidang] = useState('Sekretariat BPKAD');
    const [newSubPPTK, setNewSubPPTK] = useState('');
    const [newSubBendahara, setNewSubBendahara] = useState('');
    const [newSubPagu, setNewSubPagu] = useState('');
    const [newSubPaguPerubahan, setNewSubPaguPerubahan] = useState('');

    // Unified Sub-Kegiatan Manager Modal State
    const [activeSubModalItem, setActiveSubModalItem] = useState(null);
    const [modalSubTab, setModalSubTab] = useState('realisasi'); // 'realisasi' | 'detail'
    const [editingRealMonth, setEditingRealMonth] = useState(8);
    const [formNominalBulanan, setFormNominalBulanan] = useState('');
    const [formFisikBulanan, setFormFisikBulanan] = useState('');
    const [formEditKode, setFormEditKode] = useState('');
    const [formEditNama, setFormEditNama] = useState('');
    const [formEditBidang, setFormEditBidang] = useState('');
    const [formEditPPTK, setFormEditPPTK] = useState('');
    const [formEditBendahara, setFormEditBendahara] = useState('');
    const [formEditPagu, setFormEditPagu] = useState('');
    const [formEditPaguPerubahan, setFormEditPaguPerubahan] = useState('');
    const [isPaguLocked, setIsPaguLocked] = useState(true);

    // Planning Documents State & Drag and Drop
    const [docSearchQuery, setDocSearchQuery] = useState('');
    const [selectedDocCategory, setSelectedDocCategory] = useState('ALL');
    const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
    const [isEditDocModalOpen, setIsEditDocModalOpen] = useState(false);
    const [editingDocItem, setEditingDocItem] = useState(null);
    const [docDeleteTarget, setDocDeleteTarget] = useState(null);

    // New Document Form State
    const [newDocTitle, setNewDocTitle] = useState('');
    const [newDocCategory, setNewDocCategory] = useState('POK BPKAD');
    const [customCategoryInput, setCustomCategoryInput] = useState('');
    const [newDocBadge, setNewDocBadge] = useState('2026');
    const [newDocUrl, setNewDocUrl] = useState('#');
    const [newDocIcon, setNewDocIcon] = useState('fa-file-lines');
    const [newDocType, setNewDocType] = useState('green'); // 'green' | 'neutral'
    const [newDocDesc, setNewDocDesc] = useState('');

    // Modal Pratinjau & Cetak Laporan State
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    const [categoryOrder, setCategoryOrder] = useState([
        'POK BPKAD',
        'INDEKS PENGELOLAAN KEUANGAN DAERAH (IPKD)',
        'RENCANA STRATEGIS (RENSTRA)',
        'RENCANA ANGGARAN',
        'RENCANA KERJA (RENJA)',
        'STANDAR OPERASIONAL PROSEDUR (SOP)',
        'PERJANJIAN KINERJA',
        'LAPORAN KINERJA INSTANSI PEMERINTAH (LKjIP)',
        'SISTEM PENGENDALIAN INTERN PEMERINTAH (SPIP)',
        'LAPORAN KETERANGAN PERTANGGUNGJAWABAN (LKPJ)',
        'PENGARUSUTAMAAN GENDER (PUG)'
    ]);
    const draggedCategoryRef = useRef(null);

    const initialPokData = [
        // --- SEKRETARIAT BPKAD ---
        { id: '1', kode: '5.02.01.2.01.01', nama: 'Penyusunan Dokumen Perencanaan Perangkat Daerah', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Afifatul Islamiyah, SE', pagu: 7500000, paguPerubahan: 7500000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '2', kode: '5.02.01.2.01.06', nama: 'Koordinasi dan Penyusunan Laporan Capaian Kinerja dan Ihktisar Realisasi Kinerja SKPD', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Afifatul Islamiyah, SE', pagu: 0, paguPerubahan: 0, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '3', kode: '5.02.01.2.01.07', nama: 'Evaluasi Kinerja Perangkat Daerah', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Afifatul Islamiyah, SE', pagu: 50000000, paguPerubahan: 50000000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 48014800, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 96, 0, 0, 0, 0] },
        { id: '4', kode: '5.02.01.2.02.01', nama: 'Penyediaan Gaji dan Tunjangan ASN', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Lina Maulida, SE', pagu: 8294932168, paguPerubahan: 8294932168, realisasiBulanan: [500000000, 500000000, 600000000, 600000000, 600000000, 600000000, 643206767, 524552258, 0, 0, 0, 0], fisikBulanan: [7, 14, 21, 28, 35, 42, 49, 55, 0, 0, 0, 0] },
        { id: '5', kode: '5.02.01.2.05.09', nama: 'Pendidikan dan Pelatihan Pegawai Berdasarkan Tugas dan Fungsi', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: '-', pagu: 0, paguPerubahan: 0, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '6', kode: '5.02.01.2.06.02', nama: 'Penyediaan Peralatan dan Perlengkapan Kantor', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 111565000, paguPerubahan: 111565000, realisasiBulanan: [5000000, 5000000, 6000000, 6000000, 6000000, 6459300, 0, 3120000, 0, 0, 0, 0], fisikBulanan: [5, 10, 15, 20, 25, 30, 30, 34, 0, 0, 0, 0] },
        { id: '7', kode: '5.02.01.2.06.03', nama: 'Penyediaan Peralatan Rumah Tangga', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Yunita Setyaningrum, S.Sos', pagu: 15418000, paguPerubahan: 15418000, realisasiBulanan: [1000000, 1000000, 1000000, 1000000, 1000000, 1895500, 0, 0, 0, 0, 0, 0], fisikBulanan: [6, 12, 18, 24, 30, 45, 45, 45, 0, 0, 0, 0] },
        { id: '8', kode: '5.02.01.2.06.04', nama: 'Penyediaan Bahan Logistik Kantor', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Yunita Setyaningrum, S.Sos', pagu: 65000000, paguPerubahan: 65000000, realisasiBulanan: [2000000, 2000000, 2000000, 2000000, 3000000, 4923000, 0, 2159000, 0, 0, 0, 0], fisikBulanan: [4, 8, 12, 16, 20, 24, 24, 28, 0, 0, 0, 0] },
        { id: '9', kode: '5.02.01.2.06.05', nama: 'Penyediaan Barang Cetakan dan Penggandaan', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 75791000, paguPerubahan: 75791000, realisasiBulanan: [3000000, 3000000, 3000000, 3000000, 4000000, 4500675, 0, 0, 0, 0, 0, 0], fisikBulanan: [4, 8, 12, 16, 20, 27, 27, 27, 0, 0, 0, 0] },
        { id: '10', kode: '5.02.01.2.06.06', nama: 'Penyediaan Bahan Bacaan dan Peraturan Perundang-undangan', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: '-', pagu: 0, paguPerubahan: 0, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '11', kode: '5.02.01.2.06.09', nama: 'Penyelenggaraan Rapat Koordinasi dan Konsultasi SKPD', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Yunita Setyaningrum, S.Sos', pagu: 775903000, paguPerubahan: 775903000, realisasiBulanan: [50000000, 50000000, 50000000, 60000000, 65000000, 70388901, 0, 51988600, 0, 0, 0, 0], fisikBulanan: [6, 13, 20, 27, 34, 44, 44, 51, 0, 0, 0, 0] },
        { id: '12', kode: '5.02.01.2.06.10', nama: 'Penatausahaan Arsip Dinamis pada SKPD', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 50889250, paguPerubahan: 50889250, realisasiBulanan: [2000000, 2000000, 3000000, 3000000, 4000000, 4074796, 0, 0, 0, 0, 0, 0], fisikBulanan: [5, 10, 15, 20, 26, 36, 36, 36, 0, 0, 0, 0] },
        { id: '13', kode: '5.02.01.2.07.05', nama: 'Pengadaan Mebel', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 25000000, paguPerubahan: 25000000, realisasiBulanan: [0, 0, 0, 0, 10000000, 10812500, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 40, 83, 83, 83, 0, 0, 0, 0] },
        { id: '14', kode: '5.02.01.2.07.06', nama: 'Pengadaan Peralatan dan Mesin Lainnya', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 8500000, paguPerubahan: 8500000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '15', kode: '5.02.01.2.08.01', nama: 'Penyediaan Jasa Surat Menyurat', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Lina Maulida, SE', pagu: 12500000, paguPerubahan: 12500000, realisasiBulanan: [400000, 400000, 500000, 500000, 500000, 573000, 0, 0, 0, 0, 0, 0], fisikBulanan: [3, 6, 10, 14, 18, 23, 23, 23, 0, 0, 0, 0] },
        { id: '16', kode: '5.02.01.2.08.02', nama: 'Penyediaan Jasa Komunikasi, Sumber Daya Air dan Listrik', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Lina Maulida, SE', pagu: 286093000, paguPerubahan: 286093000, realisasiBulanan: [15000000, 15000000, 16000000, 16000000, 20000000, 34111022, 0, 15872650, 0, 0, 0, 0], fisikBulanan: [6, 12, 18, 24, 30, 41, 41, 46, 0, 0, 0, 0] },
        { id: '17', kode: '5.02.01.2.08.04', nama: 'Penyediaan Jasa Pelayanan Umum Kantor', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Lina Maulida, SE', pagu: 112689750, paguPerubahan: 112689750, realisasiBulanan: [8000000, 8000000, 9000000, 9000000, 14000000, 15618924, 0, 5573262, 0, 0, 0, 0], fisikBulanan: [7, 14, 21, 28, 40, 56, 56, 61, 0, 0, 0, 0] },
        { id: '18', kode: '5.02.01.2.09.02', nama: 'Penyediaan Jasa Pemeliharaan, Biaya Pemeliharaan, Pajak, dan Perizinan Kendaraan Dinas Operasional atau Lapangan', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 136500000, paguPerubahan: 136500000, realisasiBulanan: [5000000, 5000000, 7000000, 8000000, 10000000, 12801190, 0, 0, 0, 0, 0, 0], fisikBulanan: [4, 8, 14, 20, 27, 35, 35, 35, 0, 0, 0, 0] },
        { id: '19', kode: '5.02.01.2.09.06', nama: 'Pemeliharaan Peralatan dan Mesin Lainnya', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 132080000, paguPerubahan: 132080000, realisasiBulanan: [6000000, 6000000, 7000000, 8000000, 10000000, 12165000, 0, 5599000, 0, 0, 0, 0], fisikBulanan: [5, 10, 15, 21, 29, 37, 37, 41, 0, 0, 0, 0] },
        { id: '20', kode: '5.02.01.2.09.09', nama: 'Pemeliharaan/Rehabilitasi Gedung Kantor dan Gedung Lainnya', bidang: 'Sekretariat BPKAD', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 70000000, paguPerubahan: 70000000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },

        // --- BIDANG ANGGARAN ---
        { id: '21', kode: '5.02.02.2.01.01', nama: 'Koordinasi dan Penyusunan KUA dan PPAS', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 43520000, paguPerubahan: 43520000, realisasiBulanan: [1000000, 1000000, 1500000, 1500000, 1800000, 0, 0, 700000, 0, 0, 0, 0], fisikBulanan: [2, 5, 9, 12, 15, 15, 15, 17, 0, 0, 0, 0] },
        { id: '22', kode: '5.02.02.2.01.02', nama: 'Koordinasi dan Penyusunan Perubahan KUA dan Perubahan PPAS', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 27300000, paguPerubahan: 27300000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '23', kode: '5.02.02.2.01.03', nama: 'Koordinasi, Penyusunan dan Verifikasi RKA-SKPD', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 36300000, paguPerubahan: 36300000, realisasiBulanan: [0, 0, 1000000, 1200000, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 3, 6, 6, 6, 6, 6, 0, 0, 0, 0] },
        { id: '24', kode: '5.02.02.2.01.04', nama: 'Koordinasi, Penyusunan dan Verifikasi Perubahan RKA-SKPD', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 16850000, paguPerubahan: 16850000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '25', kode: '5.02.02.2.01.07', nama: 'Koordinasi dan Penyusunan Peraturan Daerah tentang APBD dan Peraturan Kepala Daerah tentang Penjabaran APBD', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 116610000, paguPerubahan: 116610000, realisasiBulanan: [5000000, 6000000, 8000000, 10000000, 14287200, 0, 0, 3280000, 0, 0, 0, 0], fisikBulanan: [4, 9, 16, 25, 37, 37, 37, 40, 0, 0, 0, 0] },
        { id: '26', kode: '5.02.02.2.01.08', nama: 'Koordinasi dan Penyusunan Peraturan Daerah tentang Perubahan APBD dan Peraturan Kepala Daerah tentang Penjabaran Perubahan APBD', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 50000000, paguPerubahan: 50000000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '27', kode: '5.02.02.2.01.09', nama: 'Koordinasi dan Penyusunan Regulasi serta Kebijakan Bidang Anggaran', bidang: 'Bidang Anggaran', pptk: 'Slamet Mulyo, SE, MM', bendahara: 'Istiqamah Rahmawati, S.Kom', pagu: 125000000, paguPerubahan: 125000000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 1000000, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
        { id: '28', kode: '5.02.02.2.05.02', nama: 'Implementasi dan Pemeliharaan Sistem Informasi Pemerintah Daerah Bidang Keuangan Daerah', bidang: 'Bidang Anggaran', pptk: 'Rihayu Utaviani, SE', bendahara: 'Dwi Purwanto', pagu: 23700000, paguPerubahan: 23700000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },

        // --- BIDANG PERBENDAHARAAN & AKUNTANSI ---
        { id: '29', kode: '5.02.02.2.02.01', nama: 'Koordinasi dan Pengelolaan Kas Daerah', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Dewi Susanti, SE, M.Si', bendahara: 'Eni Nurhidayati, S.Ak', pagu: 243840000, paguPerubahan: 243840000, realisasiBulanan: [100000, 100000, 100000, 120000, 0, 0, 0, 10200000, 0, 0, 0, 0], fisikBulanan: [1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0] },
        { id: '30', kode: '5.02.02.2.02.05', nama: 'Koordinasi, Fasilitasi, Asistensi, Sinkronisasi, Supervisi, Monitoring, dan Evaluasi Pengelolaan Dana Perimbangan dan Dana Transfer Lainnya', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Dewi Susanti, SE, M.Si', bendahara: 'Eni Nurhidayati, S.Ak', pagu: 18830000, paguPerubahan: 18830000, realisasiBulanan: [50000, 50000, 50000, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0] },
        { id: '31', kode: '5.02.02.2.02.09', nama: 'Rekonsiliasi Data Penerimaan dan Pengeluaran Kas serta Pemungutan dan Pemotongan atas SP2D dengan Instansi Terkait', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Mursidah, SE, MM', bendahara: 'Umi Fardiana, S.Sos', pagu: 29510000, paguPerubahan: 29510000, realisasiBulanan: [200000, 200000, 300000, 368675, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [1, 2, 3, 4, 4, 4, 4, 4, 0, 0, 0, 0] },
        { id: '32', kode: '5.02.02.2.02.10', nama: 'Penyusunan Petunjuk Teknis Administrasi Keuangan yang Berkaitan dengan Penerimaan dan Pengeluaran Kas serta Penatausahaan dan Pertanggungjawaban Sub Kegiatan', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Mursidah, SE, MM', bendahara: 'Umi Fardiana, S.Sos', pagu: 52496000, paguPerubahan: 52496000, realisasiBulanan: [100000, 100000, 100000, 100000, 0, 0, 0, 400000, 0, 0, 0, 0], fisikBulanan: [1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0] },
        { id: '33', kode: '5.02.02.2.03.01', nama: 'Koordinasi Pelaksanaan Akuntansi Penerimaan dan Pengeluaran Kas Daerah', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Nur Chasanah, SE, M.Acc', bendahara: 'Nabila Aliya Rahma, S.Tr.Ak', pagu: 11543000, paguPerubahan: 11543000, realisasiBulanan: [100000, 100000, 200000, 365240, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [1, 2, 4, 7, 7, 7, 7, 7, 0, 0, 0, 0] },
        { id: '34', kode: '5.02.02.2.03.03', nama: 'Koordinasi Penyusunan Laporan Pertanggungjawaban Pelaksanaan APBD Bulanan, Triwulanan dan Semesteran', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Nur Chasanah, SE, M.Acc', bendahara: 'Nabila Aliya Rahma, S.Tr.Ak', pagu: 86405000, paguPerubahan: 86405000, realisasiBulanan: [50000, 50000, 100000, 100000, 0, 0, 0, 10667100, 0, 0, 0, 0], fisikBulanan: [1, 1, 1, 1, 1, 1, 1, 13, 0, 0, 0, 0] },
        { id: '35', kode: '5.02.02.2.03.04', nama: 'Konsolidasi Laporan Keuangan SKPD, BLUD dan Laporan Keuangan Pemerintah Daerah', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Nur Chasanah, SE, M.Acc', bendahara: 'Nabila Aliya Rahma, S.Tr.Ak', pagu: 9577000, paguPerubahan: 9577000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '36', kode: '5.02.02.2.03.06', nama: 'Penyusunan Tanggapan/Tindak Lanjut Terhadap LHP BPK atas Laporan Pertanggungjawaban Pelaksanaan APBD', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Nur Chasanah, SE, M.Acc', bendahara: 'Nabila Aliya Rahma, S.Tr.Ak', pagu: 4811000, paguPerubahan: 4811000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '37', kode: '5.02.02.2.03.09', nama: 'Penyusunan Kebijakan dan Panduan Teknis Operasional Penyelenggaraan Akuntansi Pemerintah Daerah', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Nur Chasanah, SE, M.Acc', bendahara: 'Nabila Aliya Rahma, S.Tr.Ak', pagu: 8029000, paguPerubahan: 8029000, realisasiBulanan: [500000, 500000, 1000000, 1699000, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [6, 12, 24, 46, 46, 46, 46, 46, 0, 0, 0, 0] },
        { id: '38', kode: '5.02.02.2.03.11', nama: 'Pembinaan Akuntansi, Pelaporan dan Pertanggungjawaban Pemerintah Kabupaten/Kota', bidang: 'Bidang Perbendaharaan & Akuntansi', pptk: 'Nur Chasanah, SE, M.Acc', bendahara: 'Nabila Aliya Rahma, S.Tr.Ak', pagu: 16571000, paguPerubahan: 16571000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },

        // --- BIDANG PENGELOLAAN ASET DAERAH ---
        { id: '39', kode: '5.02.03.2.01.01', nama: 'Penyusunan Standar Harga', bidang: 'Bidang Pengelolaan Aset Daerah', pptk: 'Rusliana, SH', bendahara: 'Dewi Arumsasi, S.Kom', pagu: 303000000, paguPerubahan: 303000000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 67600000, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 22, 0, 0, 0, 0] },
        { id: '40', kode: '5.02.03.2.01.03', nama: 'Penyusunan Perencanaan Kebutuhan Barang Milik Daerah', bidang: 'Bidang Pengelolaan Aset Daerah', pptk: 'Rusliana, SH', bendahara: 'Dewi Arumsasi, S.Kom', pagu: 11200000, paguPerubahan: 11200000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '41', kode: '5.02.03.2.01.05', nama: 'Penatausahaan Barang Milik Daerah', bidang: 'Bidang Pengelolaan Aset Daerah', pptk: 'Rusliana, SH', bendahara: 'Untung Prihantono, A.md', pagu: 475897000, paguPerubahan: 475897000, realisasiBulanan: [1000000, 1000000, 2000000, 4484135, 0, 0, 0, 4336413, 0, 0, 0, 0], fisikBulanan: [1, 1, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0] },
        { id: '42', kode: '5.02.03.2.01.06', nama: 'Inventarisasi Barang Milik Daerah', bidang: 'Bidang Pengelolaan Aset Daerah', pptk: 'Rusliana, SH', bendahara: 'Dewi Arumsasi, S.Kom', pagu: 39000000, paguPerubahan: 39000000, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { id: '43', kode: '5.02.03.2.01.10', nama: 'Optimalisasi Penggunaan, Pemanfaatan, Pemindahtanganan, Pemusnahan, dan Penghapusan Barang Milik Daerah', bidang: 'Bidang Pengelolaan Aset Daerah', pptk: 'Rusliana, SH', bendahara: 'Untung Prihantono, A.md', pagu: 328230000, paguPerubahan: 328230000, realisasiBulanan: [30000000, 30000000, 40000000, 50000000, 50000000, 53194288, 0, 0, 0, 0, 0, 0], fisikBulanan: [9, 18, 30, 45, 60, 77, 77, 77, 0, 0, 0, 0] },
        { id: '44', kode: '5.02.03.2.01.12', nama: 'Penyusunan Laporan Barang Milik Daerah', bidang: 'Bidang Pengelolaan Aset Daerah', pptk: 'Rusliana, SH', bendahara: 'Untung Prihantono, A.md', pagu: 200080000, paguPerubahan: 200080000, realisasiBulanan: [500000, 500000, 1000000, 1629000, 0, 0, 0, 2250000, 0, 0, 0, 0], fisikBulanan: [1, 1, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0] },

        // --- PPKD (BANTUAN KEUANGAN & PEMBIAYAAN) ---
        { id: '45', kode: '5.02.02.2.04.08', nama: 'Analisis Perencanaan dan Penyaluran Bantuan Keuangan', bidang: 'PPKD (Bantuan Keuangan)', pptk: 'Rihayu Utaviani, SE', bendahara: 'Muhammad Nafis Shidiq, ST', pagu: 321365684300, paguPerubahan: 321365684300, realisasiBulanan: [20000000000, 20000000000, 30000000000, 40000000000, 50000000000, 3121404619, 0, 10354537948, 0, 0, 0, 0], fisikBulanan: [6, 12, 21, 33, 48, 51, 51, 54, 0, 0, 0, 0] },
        { id: '46', kode: '5.02.02.2.04.09', nama: 'Pengelolaan Dana Darurat dan Mendesak', bidang: 'PPKD (Bantuan Keuangan)', pptk: 'Rihayu Utaviani, SE', bendahara: 'Afifatul Islamiyah, SE', pagu: 6700000000, paguPerubahan: 6700000000, realisasiBulanan: [500000000, 500000000, 500000000, 500000000, 500000000, 528958725, 0, 0, 0, 0, 0, 0], fisikBulanan: [7, 14, 21, 28, 35, 45, 45, 45, 0, 0, 0, 0] },
        { id: '47', kode: '5.02.02.2.04.10', nama: 'Pengelolaan Dana Bagi Hasil Kabupaten/Kota', bidang: 'PPKD (Bantuan Keuangan)', pptk: 'Rihayu Utaviani, SE', bendahara: 'Afifatul Islamiyah, SE', pagu: 31286442961, paguPerubahan: 31286442961, realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
    ];

    const initialPortalDocs = [
        { id: 'd1', category: 'POK BPKAD', title: 'POK BPKAD TA 2026 - AGUSTUS', badge: '2026', url: '#', icon: 'fa-file-excel', type: 'green', desc: 'Dokumen pelaksanaan anggaran operasional & PPKD per Agustus 2026.' },
        { id: 'd2', category: 'INDEKS PENGELOLAAN KEUANGAN DAERAH (IPKD)', title: 'Data Dukung IPKD', badge: 'Dokumen', url: '#', icon: 'fa-folder-open', type: 'green', desc: 'Berkas dan instrumen pendukung penilaian IPKD Kabupaten Kendal.' },
        { id: 'd3', category: 'INDEKS PENGELOLAAN KEUANGAN DAERAH (IPKD)', title: 'Aplikasi IPKD', badge: 'Portal', url: '#', icon: 'fa-globe', type: 'neutral', desc: 'Tautan sistem aplikasi pendukung pelaporan IPKD.' },
        { id: 'd4', category: 'RENCANA STRATEGIS (RENSTRA)', title: 'Renstra BPKAD Tahun 2025-2029', badge: '2025-2029', url: '#', icon: 'fa-book', type: 'green', desc: 'Dokumen Rencana Strategis BPKAD Kendal periode 5 tahun.' },
        { id: 'd5', category: 'RENCANA STRATEGIS (RENSTRA)', title: 'Renstra BPKAD Tahun 2021-2026', badge: 'Arsip', url: '#', icon: 'fa-book-bookmark', type: 'neutral', desc: 'Dokumen Rencana Strategis periode sebelumnya.' },
        { id: 'd6', category: 'RENCANA STRATEGIS (RENSTRA)', title: 'Aplikasi Renstra', badge: 'Portal', url: '#', icon: 'fa-laptop-code', type: 'neutral', desc: 'Sistem informasi pengelolaan dan monitoring Renstra.' },
        { id: 'd7', category: 'RENCANA ANGGARAN', title: 'DPA T.A. 2026', badge: 'Utama', url: '#', icon: 'fa-file-invoice-dollar', type: 'green', desc: 'Dokumen Pelaksanaan Anggaran BPKAD Tahun Anggaran 2026.' },
        { id: 'd8', category: 'RENCANA ANGGARAN', title: 'DPPA I T.A. 2026 (6 MARET 2026)', badge: '06 Mar', url: '#', icon: 'fa-file-contract', type: 'green', desc: 'Dokumen Perubahan Pelaksanaan Anggaran Tahap I.' },
        { id: 'd9', category: 'RENCANA ANGGARAN', title: 'DPPA II T.A. 2026 (7 JULI 2026)', badge: '07 Jul', url: '#', icon: 'fa-file-contract', type: 'green', desc: 'Dokumen Perubahan Pelaksanaan Anggaran Tahap II.' },
        { id: 'd10', category: 'RENCANA KERJA (RENJA)', title: 'Pagu Rankhir Renja 2027', badge: '2027', url: '#', icon: 'fa-chart-pie', type: 'green', desc: 'Rancangan Akhir Pagu Indikatif Renja BPKAD 2027.' },
        { id: 'd11', category: 'RENCANA KERJA (RENJA)', title: 'Paparan Renja 2027', badge: 'Slide', url: '#', icon: 'fa-person-chalkboard', type: 'neutral', desc: 'Bahan paparan dan ekspose Renja 2027.' },
        { id: 'd12', category: 'RENCANA KERJA (RENJA)', title: 'Dokumen Renja', badge: 'PDF', url: '#', icon: 'fa-file-pdf', type: 'neutral', desc: 'Dokumen lengkap Renja BPKAD.' },
        { id: 'd13', category: 'STANDAR OPERASIONAL PROSEDUR (SOP)', title: 'SOP BPKAD Baru', badge: 'Terbaru', url: '#', icon: 'fa-sitemap', type: 'green', desc: 'Kumpulan SOP layanan administrasi keuangan dan aset terbaru.' },
        { id: 'd14', category: 'PERJANJIAN KINERJA', title: 'Perjanjian Kinerja 2026', badge: '2026', url: '#', icon: 'fa-handshake', type: 'green', desc: 'Dokumen Perjanjian Kinerja Pejabat Eselon dan Kepala BPKAD 2026.' },
        { id: 'd15', category: 'PERJANJIAN KINERJA', title: 'Perjanjian Kinerja 2025', badge: '2025', url: '#', icon: 'fa-handshake', type: 'neutral', desc: 'Dokumen Perjanjian Kinerja tahun 2025.' },
        { id: 'd16', category: 'LAPORAN KINERJA INSTANSI PEMERINTAH (LKjIP)', title: 'LKjIP Tahun 2025', badge: '2025', url: '#', icon: 'fa-award', type: 'green', desc: 'Laporan Kinerja Instansi Pemerintah BPKAD Tahun 2025.' },
        { id: 'd17', category: 'LAPORAN KINERJA INSTANSI PEMERINTAH (LKjIP)', title: 'LKjIP Tahun 2024', badge: '2024', url: '#', icon: 'fa-award', type: 'neutral', desc: 'Laporan Kinerja Instansi Pemerintah BPKAD Tahun 2024.' },
        { id: 'd18', category: 'SISTEM PENGENDALIAN INTERN PEMERINTAH (SPIP)', title: 'Rencana Tindak Lanjut SPIP 2025', badge: '2025', url: '#', icon: 'fa-shield-halved', type: 'green', desc: 'Dokumen RTL SPIP Tahun 2025.' },
        { id: 'd19', category: 'SISTEM PENGENDALIAN INTERN PEMERINTAH (SPIP)', title: 'Rencana Tindak Lanjut SPIP 2024', badge: '2024', url: '#', icon: 'fa-shield-halved', type: 'neutral', desc: 'Dokumen RTL SPIP Tahun 2024.' },
        { id: 'd20', category: 'SISTEM PENGENDALIAN INTERN PEMERINTAH (SPIP)', title: 'Data Dukung Dokumen', badge: 'Arsip', url: '#', icon: 'fa-folder', type: 'neutral', desc: 'Kumpulan data dukung audit SPIP.' },
        { id: 'd21', category: 'LAPORAN KETERANGAN PERTANGGUNGJAWABAN (LKPJ)', title: 'LKPJ 2025', badge: '2025', url: '#', icon: 'fa-file-lines', type: 'green', desc: 'Buku LKPJ BPKAD Tahun 2025.' },
        { id: 'd22', category: 'LAPORAN KETERANGAN PERTANGGUNGJAWABAN (LKPJ)', title: 'LKPJ 2024', badge: '2024', url: '#', icon: 'fa-file-lines', type: 'neutral', desc: 'Buku LKPJ BPKAD Tahun 2024.' },
        { id: 'd23', category: 'PENGARUSUTAMAAN GENDER (PUG)', title: 'Data Dukung Dokumen', badge: 'PUG', url: '#', icon: 'fa-scale-balanced', type: 'neutral', desc: 'Analisis Gender Budgeting dan Data Dukung PUG BPKAD.' }
    ];

    const [allYearsData, setAllYearsData] = useState(() => {
        const saved = localStorage.getItem('bpkad_years_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed['2026'] && parsed['2026'].length >= 40) {
                    return parsed;
                }
            } catch (e) { }
        }
        return { '2026': initialPokData };
    });

    const [portalDocs, setPortalDocs] = useState(() => {
        const saved = localStorage.getItem('bpkad_portal_docs');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return initialPortalDocs;
    });

    useEffect(() => {
        localStorage.setItem('bpkad_years_data', JSON.stringify(allYearsData));
    }, [allYearsData]);

    useEffect(() => {
        localStorage.setItem('bpkad_portal_docs', JSON.stringify(portalDocs));
    }, [portalDocs]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 3500);
    };

    const currentPokList = allYearsData[selectedYear] || [];

    const formatRp = (num) => {
        if (isNaN(num)) return 'Rp 0';
        return 'Rp ' + Number(num).toLocaleString('id-ID');
    };

    const formatPct = (num) => {
        if (isNaN(num)) return '0,00%';
        return Number(num).toFixed(2).replace('.', ',') + '%';
    };

    const getEffectivePagu = (item) => {
        return (item.paguPerubahan !== undefined && item.paguPerubahan !== null && item.paguPerubahan !== '' && Number(item.paguPerubahan) > 0)
            ? Number(item.paguPerubahan)
            : Number(item.pagu);
    };

    const getRealisasiKumulatif = (item, uptoMonth) => {
        if (!item.realisasiBulanan) return 0;
        let sum = 0;
        for (let i = 0; i < uptoMonth; i++) {
            sum += Number(item.realisasiBulanan[i] || 0);
        }
        return sum;
    };

    const getFisikLatest = (item, uptoMonth) => {
        if (!item.fisikBulanan) return 0;
        let latest = 0;
        for (let i = 0; i < uptoMonth; i++) {
            if (item.fisikBulanan[i] > 0) {
                latest = item.fisikBulanan[i];
            }
        }
        return latest;
    };

    // Executive Metrics
    const totalPaguPenetapan = useMemo(() => {
        return currentPokList.reduce((acc, item) => acc + Number(item.pagu || 0), 0);
    }, [currentPokList]);

    const totalPaguPerubahan = useMemo(() => {
        return currentPokList.reduce((acc, item) => acc + getEffectivePagu(item), 0);
    }, [currentPokList]);

    const totalRealisasiYear = useMemo(() => {
        return currentPokList.reduce((acc, item) => acc + getRealisasiKumulatif(item, currentMonth), 0);
    }, [currentPokList, currentMonth]);

    const totalSisaYear = totalPaguPerubahan - totalRealisasiYear;
    const avgPctKeuYear = totalPaguPerubahan > 0 ? (totalRealisasiYear / totalPaguPerubahan) * 100 : 0;

    const avgFisikYear = useMemo(() => {
        if (currentPokList.length === 0) return 0;
        const sumFisik = currentPokList.reduce((acc, item) => acc + getFisikLatest(item, currentMonth), 0);
        return sumFisik / currentPokList.length;
    }, [currentPokList, currentMonth]);

    const lastDayOfMonth = useMemo(() => {
        const y = parseInt(selectedYear, 10) || 2026;
        return new Date(y, currentMonth, 0).getDate();
    }, [selectedYear, currentMonth]);

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const availableNewYears = useMemo(() => {
        const existingYears = Object.keys(allYearsData).map(y => parseInt(y, 10)).filter(y => !isNaN(y));
        const maxYear = existingYears.length > 0 ? Math.max(...existingYears) : 2026;
        const list = [];
        for (let i = 1; i <= 5; i++) {
            const yStr = String(maxYear + i);
            if (!allYearsData[yStr]) list.push(yStr);
        }
        return list;
    }, [allYearsData]);

    const filteredPokList = useMemo(() => {
        return currentPokList.filter(item => {
            const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.pptk && item.pptk.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchBidang = selectedBidang === 'ALL' || item.bidang === selectedBidang;
            return matchSearch && matchBidang;
        });
    }, [currentPokList, searchQuery, selectedBidang]);

    const handleLogin = (e) => {
        e.preventDefault();
        if ((loginUsername === 'admin' && loginPassword === 'admin123') || (loginUsername === 'admin' && loginPassword === 'bpkad2026')) {
            setUserRole('admin');
            setIsLoginModalOpen(false);
            setLoginUsername('');
            setLoginPassword('');
            showToast('Berhasil Login sebagai Admin BPKAD!');
        } else {
            showToast('Username atau Password Admin salah!');
        }
    };

    const handleLogout = () => {
        setUserRole('guest');
        showToast('Keluar dari Mode Admin.');
    };

    const handleAddYear = (e) => {
        e.preventDefault();
        const yr = newYearSelect || availableNewYears[0];
        if (!yr) return;
        if (allYearsData[yr]) {
            showToast('Tahun Anggaran tersebut sudah ada!');
            return;
        }

        let newSubList = [];
        if (newYearSubOption === 'clone') {
            newSubList = currentPokList.map(x => ({
                ...x,
                id: 'sub_' + Math.random().toString(36).substr(2, 9),
                pagu: 0,
                paguPerubahan: 0,
                realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                isPaguLocked: false
            }));
        }

        setAllYearsData(prev => ({ ...prev, [yr]: newSubList }));
        setSelectedYear(yr);
        setIsAddYearModalOpen(false);
        showToast(`Tahun Anggaran ${yr} berhasil dibuat!`);
    };

    const handleAddSubActivity = (e) => {
        e.preventDefault();
        if (userRole !== 'admin') {
            setIsLoginModalOpen(true);
            return;
        }
        const newSub = {
            id: 'sub_' + Math.random().toString(36).substr(2, 9),
            kode: newSubKode.trim(),
            nama: newSubNama.trim(),
            bidang: newSubBidang,
            pptk: newSubPPTK.trim(),
            bendahara: newSubBendahara.trim(),
            pagu: Number(newSubPagu) || 0,
            paguPerubahan: (newSubPaguPerubahan !== '' && newSubPaguPerubahan !== null) ? Number(newSubPaguPerubahan) : 0,
            realisasiBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            fisikBulanan: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };

        setAllYearsData(prev => ({
            ...prev,
            [selectedYear]: [...(prev[selectedYear] || []), newSub]
        }));

        setIsAddSubModalOpen(false);
        setNewSubKode('');
        setNewSubNama('');
        setNewSubPPTK('');
        setNewSubBendahara('');
        setNewSubPagu('');
        setNewSubPaguPerubahan('');
        showToast('Sub Kegiatan baru berhasil ditambahkan!');
    };

    // Open Unified Manager Modal
    const openUnifiedSubModal = (item) => {
        if (userRole !== 'admin') {
            setIsLoginModalOpen(true);
            return;
        }
        setActiveSubModalItem(item);
        setModalSubTab('realisasi');
        setEditingRealMonth(currentMonth);
        setFormNominalBulanan(item.realisasiBulanan[currentMonth - 1] || '');
        setFormFisikBulanan(item.fisikBulanan[currentMonth - 1] || '');
        setFormEditKode(item.kode);
        setFormEditNama(item.nama);
        setFormEditBidang(item.bidang || 'Sekretariat BPKAD');
        setFormEditPPTK(item.pptk || '');
        setFormEditBendahara(item.bendahara || '');
        setFormEditPagu(item.pagu);
        setFormEditPaguPerubahan(item.paguPerubahan !== undefined && item.paguPerubahan !== null ? item.paguPerubahan : 0);
        setIsPaguLocked(item.isPaguLocked !== undefined ? item.isPaguLocked : true);
    };

    const handleSaveRealizationFromModal = (e) => {
        e.preventDefault();
        if (!activeSubModalItem) return;
        const nom = Number(formNominalBulanan) || 0;
        const fis = Number(formFisikBulanan) || 0;

        setAllYearsData(prev => {
            const list = [...(prev[selectedYear] || [])];
            const idx = list.findIndex(x => x.id === activeSubModalItem.id);
            if (idx !== -1) {
                const item = { ...list[idx] };
                const newReal = [...item.realisasiBulanan];
                const newFis = [...item.fisikBulanan];
                newReal[editingRealMonth - 1] = nom;
                newFis[editingRealMonth - 1] = fis;
                item.realisasiBulanan = newReal;
                item.fisikBulanan = newFis;
                list[idx] = item;
            }
            return { ...prev, [selectedYear]: list };
        });

        showToast(`Realisasi Bulan ${monthNames[editingRealMonth - 1]} berhasil diperbarui!`);
        setActiveSubModalItem(null);
    };

    const handleSaveDetailFromModal = (e) => {
        e.preventDefault();
        if (!activeSubModalItem) return;

        setAllYearsData(prev => {
            const list = [...(prev[selectedYear] || [])];
            const idx = list.findIndex(x => x.id === activeSubModalItem.id);
            if (idx !== -1) {
                const item = { ...list[idx] };
                item.kode = formEditKode.trim();
                item.nama = formEditNama.trim();
                item.bidang = formEditBidang;
                item.pptk = formEditPPTK.trim();
                item.bendahara = formEditBendahara.trim();
                item.pagu = Number(formEditPagu) || 0;
                item.paguPerubahan = (formEditPaguPerubahan !== '' && formEditPaguPerubahan !== null) ? Number(formEditPaguPerubahan) : 0;
                item.isPaguLocked = isPaguLocked;
                list[idx] = item;
            }
            return { ...prev, [selectedYear]: list };
        });

        showToast('Detail Sub Kegiatan & Pagu berhasil diperbarui!');
        setActiveSubModalItem(null);
    };

    // Document Handlers
    const handleAddDocumentLink = (e) => {
        e.preventDefault();
        if (userRole !== 'admin') {
            setIsLoginModalOpen(true);
            return;
        }
        const cat = newDocCategory === 'NEW' ? customCategoryInput.trim() : newDocCategory;
        if (!cat) {
            showToast('Kategori dokumen tidak boleh kosong!');
            return;
        }

        const newDoc = {
            id: 'doc_' + Math.random().toString(36).substr(2, 9),
            category: cat,
            title: newDocTitle.trim(),
            badge: newDocBadge.trim(),
            url: newDocUrl.trim(),
            icon: newDocIcon,
            type: newDocType,
            desc: newDocDesc.trim()
        };

        setPortalDocs(prev => [newDoc, ...prev]);
        setIsAddDocModalOpen(false);
        setNewDocTitle('');
        setCustomCategoryInput('');
        setNewDocBadge('2026');
        setNewDocUrl('#');
        setNewDocDesc('');
        showToast('Portal dokumen perencanaan berhasil ditambahkan!');
    };

    const handleOpenEditDoc = (doc) => {
        if (userRole !== 'admin') {
            setIsLoginModalOpen(true);
            return;
        }
        setEditingDocItem(doc);
        setNewDocTitle(doc.title);
        setNewDocCategory(doc.category);
        setNewDocBadge(doc.badge);
        setNewDocUrl(doc.url);
        setNewDocIcon(doc.icon);
        setNewDocType(doc.type);
        setNewDocDesc(doc.desc);
        setIsEditDocModalOpen(true);
    };

    const handleUpdateDocumentLink = (e) => {
        e.preventDefault();
        if (!editingDocItem) return;

        setPortalDocs(prev => prev.map(d => {
            if (d.id === editingDocItem.id) {
                return {
                    ...d,
                    title: newDocTitle.trim(),
                    category: newDocCategory,
                    badge: newDocBadge.trim(),
                    url: newDocUrl.trim(),
                    icon: newDocIcon,
                    type: newDocType,
                    desc: newDocDesc.trim()
                };
            }
            return d;
        }));

        setIsEditDocModalOpen(false);
        setEditingDocItem(null);
        showToast('Portal dokumen berhasil diperbarui!');
    };

    const confirmDeletePortalDoc = (doc) => {
        if (userRole !== 'admin') {
            setIsLoginModalOpen(true);
            return;
        }
        setDocDeleteTarget(doc);
    };

    const executeDeletePortalDoc = () => {
        if (!docDeleteTarget) return;
        setPortalDocs(prev => prev.filter(d => d.id !== docDeleteTarget.id));
        setDocDeleteTarget(null);
        showToast('Portal dokumen berhasil dihapus.');
    };

    // Category Drag and Drop
    const handleDragStartCat = (catName) => {
        draggedCategoryRef.current = catName;
    };

    const handleDragOverCat = (e) => {
        e.preventDefault();
    };

    const handleDropCat = (targetCat) => {
        const draggedCat = draggedCategoryRef.current;
        if (!draggedCat || draggedCat === targetCat) return;

        const oldIdx = categoryOrder.indexOf(draggedCat);
        const newIdx = categoryOrder.indexOf(targetCat);

        if (oldIdx !== -1 && newIdx !== -1) {
            const updated = [...categoryOrder];
            updated.splice(oldIdx, 1);
            updated.splice(newIdx, 0, draggedCat);
            setCategoryOrder(updated);
            showToast('Urutan kategori berhasil diperbarui.');
        }
        draggedCategoryRef.current = null;
    };

    const availableCategories = useMemo(() => {
        const fromDocs = Array.from(new Set(portalDocs.map(d => d.category)));
        const combined = Array.from(new Set([...categoryOrder, ...fromDocs]));
        return combined;
    }, [portalDocs, categoryOrder]);

    const filteredPortalDocs = useMemo(() => {
        return portalDocs.filter(d => {
            const matchSearch = d.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                d.desc.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
                d.category.toLowerCase().includes(docSearchQuery.toLowerCase());
            const matchCat = selectedDocCategory === 'ALL' || d.category === selectedDocCategory;
            return matchSearch && matchCat;
        });
    }, [portalDocs, docSearchQuery, selectedDocCategory]);

    const triggerPrint = () => {
        setIsPrintModalOpen(true);
        showToast('Membuka Pratinjau & Laporan Resmi POK BPKAD...');
    };

    const handleDirectPrint = () => {
        try {
            window.print();
        } catch (err) {
            showToast('Silakan gunakan opsi "Buka Jendela Cetak Baru".');
        }
    };

    const handlePrintNewWindow = () => {
        const reportEl = document.getElementById('printable-official-report-content');
        if (!reportEl) return;
        const printWin = window.open('', '_blank');
        if (printWin) {
            printWin.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Laporan Resmi POK BPKAD TA ${selectedYear}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @page { size: A4 landscape; margin: 10mm; }
                        body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; padding: 15px; background: #ffffff; color: #000000; }
                    </style>
                </head>
                <body>
                    ${reportEl.innerHTML}
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                            }, 400);
                        };
                    </script>
                </body>
                </html>
            `);
            printWin.document.close();
        } else {
            handleDirectPrint();
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            {/* Embedded Print CSS Rules */}
            <style>{`
                @media print {
                    body {
                        background-color: #ffffff !important;
                        color: #000000 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 12mm;
                    }
                }
            `}</style>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce no-print">
                    <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
                    <span className="text-xs font-semibold">{toastMessage}</span>
                </div>
            )}

            {/* HEADER NAVIGATION */}
            <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-lg no-print">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-extrabold text-white text-lg shadow-md shadow-emerald-900/40">
                            B
                        </div>
                        <div>
                            <h1 className="font-black text-base sm:text-lg leading-tight tracking-tight text-white flex items-center gap-2">
                                <span>BPKAD KENDAL</span>
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    TA {selectedYear}
                                </span>
                            </h1>
                            <p className="text-[11px] text-slate-400 font-medium">Dashboard Perencanaan & Keuangan Terpadu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {userRole === 'admin' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-emerald-900/80 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-600 flex items-center gap-1.5">
                                    <i className="fa-solid fa-user-shield"></i>
                                    <span>Mode Admin</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition border border-slate-700"
                                >
                                    Keluar
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="px-3.5 py-1.5 bg-slate-800 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs transition border border-slate-700 flex items-center gap-1.5 shadow-sm"
                            >
                                <i className="fa-solid fa-lock text-emerald-400"></i>
                                <span>Login Admin</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Navigation Tabs */}
                <div className="bg-slate-950/80 border-t border-slate-800 py-2.5 px-4 no-print">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                        <button
                            onClick={() => setMainTab('keuangan')}
                            className={`flex-1 max-w-md py-2.5 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${mainTab === 'keuangan' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'}`}
                        >
                            <i className="fa-solid fa-calculator text-emerald-300"></i>
                            <span>KEUANGAN (OPERASIONAL POK)</span>
                        </button>
                        <button
                            onClick={() => setMainTab('perencanaan')}
                            className={`flex-1 max-w-md py-2.5 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 ${mainTab === 'perencanaan' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700'}`}
                        >
                            <i className="fa-solid fa-folder-tree text-emerald-300"></i>
                            <span>PERENCANAAN (DOKUMEN & PORTAL)</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

                {/* ================= TAB 1: KEUANGAN ================= */}
                {mainTab === 'keuangan' && (
                    <div className="space-y-6 animate-fadeIn">

                        {/* TOOLBAR CONTROLS (1 Baris Seimbang pada Dasbor Admin/User) */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Pilih Tahun Anggaran */}
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Tahun Anggaran:</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                                    >
                                        {Object.keys(allYearsData).map(yr => (
                                            <option key={yr} value={yr}>TA {yr}</option>
                                        ))}
                                    </select>
                                    {userRole === 'admin' && (
                                        <button
                                            onClick={() => {
                                                setNewYearSelect(availableNewYears[0] || '');
                                                setNewYearSubOption('clone');
                                                setIsAddYearModalOpen(true);
                                            }}
                                            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5"
                                            title="Buat Tahun Anggaran Baru"
                                        >
                                            <i className="fa-solid fa-plus text-[10px]"></i>
                                            <span>TA Baru</span>
                                        </button>
                                    )}
                                </div>

                                {/* Pilih Periode Realisasi Bulan */}
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">Periode Realisasi:</label>
                                    <select
                                        value={currentMonth}
                                        onChange={(e) => setCurrentMonth(Number(e.target.value))}
                                        className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                                    >
                                        {monthNames.map((m, idx) => (
                                            <option key={idx + 1} value={idx + 1}>s.d. {m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Cetak Laporan Resmi PDF Button */}
                            <button
                                onClick={triggerPrint}
                                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                                title="Cetak atau Simpan Laporan Keuangan POK ke PDF"
                            >
                                <i className="fa-solid fa-print text-emerald-400"></i>
                                <span>Cetak Laporan Resmi (PDF)</span>
                            </button>
                        </div>

                        {/* EXECUTIVE METRICS CARDS (3 Kolom x 2 Baris Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 no-print">
                            {/* Card 1: Pagu Penetapan */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-600 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Total Pagu Penetapan</span>
                                    <i className="fa-solid fa-wallet text-emerald-600 text-base"></i>
                                </div>
                                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                                    {formatRp(totalPaguPenetapan)}
                                </div>
                                <div className="mt-2 text-[11px] font-medium text-slate-500">
                                    Pagu Murni Penetapan TA {selectedYear}
                                </div>
                            </div>

                            {/* Card 2: Pagu Perubahan */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-teal-600 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Total Pagu Perubahan</span>
                                    <i className="fa-solid fa-file-invoice-dollar text-teal-600 text-base"></i>
                                </div>
                                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                                    {formatRp(totalPaguPerubahan)}
                                </div>
                                <div className="mt-2 text-[11px] font-medium text-slate-500">
                                    Patokan Efektif Anggaran
                                </div>
                            </div>

                            {/* Card 3: Realisasi s.d. Bulan Berjalan */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-600 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Realisasi s.d. {monthNames[currentMonth - 1]}</span>
                                    <i className="fa-solid fa-chart-line text-blue-600 text-base"></i>
                                </div>
                                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                                    {formatRp(totalRealisasiYear)}
                                </div>
                                <div className="mt-2 text-[11px] font-medium text-slate-500">
                                    <span className="bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded mr-1">{formatPct(avgPctKeuYear)}</span> terkesekusi
                                </div>
                            </div>

                            {/* Card 4: Sisa Anggaran */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Sisa Anggaran</span>
                                    <i className="fa-solid fa-piggy-bank text-amber-500 text-base"></i>
                                </div>
                                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                                    {formatRp(totalSisaYear)}
                                </div>
                                <div className="mt-2 text-[11px] font-medium text-slate-500">
                                    Selisih Pagu Efektif & Realisasi
                                </div>
                            </div>

                            {/* Card 5: Rata-Rata Capaian Keuangan */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-cyan-600 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Capaian Keuangan</span>
                                    <i className="fa-solid fa-percent text-cyan-600 text-base"></i>
                                </div>
                                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                                    {formatPct(avgPctKeuYear)}
                                </div>
                                <div className="mt-2 text-[11px] font-medium text-slate-500">
                                    <span className="bg-cyan-100 text-cyan-800 font-bold px-1.5 py-0.5 rounded">Serapan Keuangan</span>
                                </div>
                            </div>

                            {/* Card 6: Rata-Rata Capaian Fisik */}
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-600 flex flex-col justify-between">
                                <div className="flex items-center justify-between text-slate-500 mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider">Rata-Rata Capaian Fisik</span>
                                    <i className="fa-solid fa-gauge-high text-indigo-600 text-base"></i>
                                </div>
                                <div className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">
                                    {formatPct(avgFisikYear)}
                                </div>
                                <div className="mt-2 text-[11px] font-medium text-slate-500">
                                    <span className="bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">Capaian Fisik</span>
                                </div>
                            </div>
                        </div>

                        {/* MATRIKS SUB KEGIATAN POK (FULL WIDTH & COMPLETE 47 ITEMS) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
                            <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                        <i className="fa-solid fa-table-list text-emerald-400"></i>
                                        Matriks Pelaksanaan Anggaran POK BPKAD ({currentPokList.length} Sub Kegiatan - {selectedYear})
                                    </h3>
                                    <p className="text-xs text-slate-400">Posisi realisasi keuangan dan fisik s.d. bulan {monthNames[currentMonth - 1]}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    {userRole === 'admin' && (
                                        <button
                                            onClick={() => setIsAddSubModalOpen(true)}
                                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <i className="fa-solid fa-plus text-[10px]"></i>
                                            <span>Sub Kegiatan Baru</span>
                                        </button>
                                    )}

                                    {/* Filter Bidang */}
                                    <select
                                        value={selectedBidang}
                                        onChange={(e) => setSelectedBidang(e.target.value)}
                                        className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 outline-none cursor-pointer"
                                    >
                                        <option value="ALL">Semua Bidang / Unit</option>
                                        <option value="Sekretariat BPKAD">Sekretariat BPKAD</option>
                                        <option value="Bidang Anggaran">Bidang Anggaran</option>
                                        <option value="Bidang Perbendaharaan & Akuntansi">Bidang Perbendaharaan & Akuntansi</option>
                                        <option value="Bidang Pengelolaan Aset Daerah">Bidang Pengelolaan Aset Daerah</option>
                                        <option value="PPKD (Bantuan Keuangan)">PPKD (Bantuan Keuangan)</option>
                                    </select>

                                    {/* Search input */}
                                    <div className="relative flex-1 sm:w-56">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                                            <i className="fa-solid fa-magnifying-glass"></i>
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="Cari sub kegiatan / PPTK..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse text-[11px]">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                                            <th className="p-2.5 text-center w-10">No</th>
                                            <th className="p-2.5">Sub-Kegiatan & PPTK</th>
                                            <th className="p-2.5 hidden sm:table-cell">Bidang</th>
                                            <th className="p-2.5 text-right">Pagu Penetapan</th>
                                            <th className="p-2.5 text-right text-amber-700">Pagu Perubahan</th>
                                            <th className="p-2.5 text-right text-blue-700">Realisasi s.d. {monthNames[currentMonth - 1]}</th>
                                            <th className="p-2.5 text-right">Sisa Anggaran</th>
                                            <th className="p-2.5 text-center">% Keu</th>
                                            <th className="p-2.5 text-center">% Fisik</th>
                                            <th className="p-2.5 text-center">Status</th>
                                            {userRole === 'admin' && <th className="p-2.5 text-center w-24">Aksi</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                                        {filteredPokList.length === 0 ? (
                                            <tr>
                                                <td colSpan={userRole === 'admin' ? 11 : 10} className="p-8 text-center text-slate-400 italic">
                                                    Tidak ada data sub-kegiatan yang sesuai dengan filter pencarian.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredPokList.map((item, idx) => {
                                                const effPagu = getEffectivePagu(item);
                                                const realKum = getRealisasiKumulatif(item, currentMonth);
                                                const sisa = effPagu - realKum;
                                                const pctKeu = effPagu > 0 ? (realKum / effPagu) * 100 : 0;
                                                const pctFis = getFisikLatest(item, currentMonth);

                                                let statusBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                                let statusText = 'Aman / Optimal';
                                                if (pctKeu < 20 && currentMonth >= 6 && effPagu > 0) {
                                                    statusBadge = 'bg-rose-100 text-rose-800 border-rose-300';
                                                    statusText = 'Kritis (Rendah)';
                                                } else if (pctKeu < 40 && currentMonth >= 6 && effPagu > 0) {
                                                    statusBadge = 'bg-amber-100 text-amber-800 border-amber-300';
                                                    statusText = 'Waspada';
                                                }

                                                return (
                                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                                                        <td className="p-2.5">
                                                            <div className="font-extrabold text-slate-900 leading-tight">{item.nama}</div>
                                                            <div className="font-mono text-[10px] text-slate-500 mt-0.5">{item.kode} • PPTK: <span className="text-slate-700 font-semibold">{item.pptk || '-'}</span></div>
                                                        </td>
                                                        <td className="p-2.5 hidden sm:table-cell text-slate-600 font-semibold">{item.bidang || '-'}</td>
                                                        <td className="p-2.5 text-right font-mono text-slate-600">{formatRp(item.pagu)}</td>
                                                        <td className="p-2.5 text-right font-mono font-bold text-amber-800">{formatRp(effPagu)}</td>
                                                        <td className="p-2.5 text-right font-mono font-extrabold text-blue-700">{formatRp(realKum)}</td>
                                                        <td className="p-2.5 text-right font-mono text-slate-600">{formatRp(sisa)}</td>
                                                        <td className="p-2.5 text-center font-bold text-slate-900">{formatPct(pctKeu)}</td>
                                                        <td className="p-2.5 text-center font-semibold text-indigo-700">{formatPct(pctFis)}</td>
                                                        <td className="p-2.5 text-center">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>{statusText}</span>
                                                        </td>
                                                        {userRole === 'admin' && (
                                                            <td className="p-2.5 text-center">
                                                                <button
                                                                    onClick={() => openUnifiedSubModal(item)}
                                                                    className="w-full py-1.5 px-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold rounded-lg transition flex items-center justify-center gap-1.5 border border-emerald-200 shadow-sm text-[11px] cursor-pointer"
                                                                    title="Kelola Realisasi & Edit Detail Sub Kegiatan"
                                                                >
                                                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                                    </svg>
                                                                    <span>Kelola</span>
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

                {/* ================= TAB 2: PERENCANAAN (DOKUMEN & PORTAL) ================= */}
                {mainTab === 'perencanaan' && (
                    <div className="space-y-6 animate-fadeIn no-print">
                        
                        {/* PORTAL HEADER BANNER */}
                        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-2 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                                    <i className="fa-solid fa-compass-drafting"></i>
                                    <span>PORTAL REPOSITORY & DOKUMEN PERENCANAAN</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                    Pusat Informasi & Dokumen Perencanaan BPKAD Kendal
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                                    Akses cepat seluruh dokumen resmi perencanaan, POK, DPA, Renstra, Renja, SOP, LKjIP, dan laporan pendukung instansi.
                                </p>
                            </div>

                            {userRole === 'admin' && (
                                <button
                                    onClick={() => {
                                        setNewDocTitle('');
                                        setNewDocCategory('POK BPKAD');
                                        setCustomCategoryInput('');
                                        setNewDocBadge('2026');
                                        setNewDocUrl('#');
                                        setNewDocDesc('');
                                        setIsAddDocModalOpen(true);
                                    }}
                                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
                                >
                                    <i className="fa-solid fa-plus text-sm"></i>
                                    <span>Tambah Link Dokumen</span>
                                </button>
                            )}
                        </div>

                        {/* FILTER & SEARCH BAR */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                            {/* Input Cari Judul Dokumen */}
                            <div className="relative flex-1 w-full">
                                <span className="absolute left-3.5 top-3 text-slate-400 text-xs">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Cari judul atau deskripsi dokumen perencanaan..."
                                    value={docSearchQuery}
                                    onChange={(e) => setDocSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 transition"
                                />
                            </div>

                            {/* Dropdown Filter Kategori Dokumen */}
                            <div className="relative w-full sm:w-80">
                                <span className="absolute left-3.5 top-3 text-emerald-600 text-xs pointer-events-none">
                                    <i className="fa-solid fa-filter"></i>
                                </span>
                                <select
                                    value={selectedDocCategory}
                                    onChange={(e) => setSelectedDocCategory(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition appearance-none"
                                >
                                    <option value="ALL">Semua Kategori Dokumen ({portalDocs.length})</option>
                                    {availableCategories.map(cat => {
                                        const count = portalDocs.filter(d => d.category === cat).length;
                                        return (
                                            <option key={cat} value={cat}>
                                                {cat} ({count})
                                            </option>
                                        );
                                    })}
                                </select>
                                <span className="absolute right-3 top-3 text-slate-400 text-xs pointer-events-none">
                                    <i className="fa-solid fa-chevron-down"></i>
                                </span>
                            </div>
                        </div>

                        {/* DOCUMENT CATEGORIES & CARDS (DRAG & DROP SUPPORTED) */}
                        <div className="space-y-6">
                            {(selectedDocCategory === 'ALL' ? availableCategories : [selectedDocCategory]).map(catName => {
                                const docsInCat = filteredPortalDocs.filter(d => d.category === catName);
                                if (docsInCat.length === 0 && selectedDocCategory !== 'ALL') return null;
                                if (docsInCat.length === 0) return null;

                                return (
                                    <div
                                        key={catName}
                                        draggable={userRole === 'admin'}
                                        onDragStart={() => handleDragStartCat(catName)}
                                        onDragOver={handleDragOverCat}
                                        onDrop={() => handleDropCat(catName)}
                                        className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 transition ${userRole === 'admin' ? 'cursor-grab active:cursor-grabbing hover:border-emerald-400' : ''}`}
                                    >
                                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                                            <div className="flex items-center gap-2.5">
                                                {userRole === 'admin' && (
                                                    <span className="text-slate-400 hover:text-slate-700 text-sm" title="Tahan dan geser untuk mengatur prioritas kategori">
                                                        <i className="fa-solid fa-grip-vertical"></i>
                                                    </span>
                                                )}
                                                <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                                                    <span>{catName}</span>
                                                </h3>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                                {docsInCat.length} Dokumen
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {docsInCat.map(doc => {
                                                const isGreen = doc.type === 'green';
                                                return (
                                                    <div
                                                        key={doc.id}
                                                        className={`relative rounded-xl p-4 border transition flex flex-col justify-between gap-3 ${isGreen ? 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isGreen ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/20' : 'bg-slate-800 text-white'}`}>
                                                                    <i className={`fa-solid ${doc.icon || 'fa-file-lines'} text-sm`}></i>
                                                                </div>
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${isGreen ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-800'}`}>
                                                                        {doc.badge}
                                                                    </span>
                                                                    {userRole === 'admin' && (
                                                                        <div className="flex items-center gap-1 ml-1">
                                                                            <button
                                                                                onClick={() => handleOpenEditDoc(doc)}
                                                                                className="px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 text-[10px] font-extrabold transition shadow cursor-pointer"
                                                                                title="Edit Link Dokumen"
                                                                            >
                                                                                <i className="fa-solid fa-pen-to-square text-[10px]"></i>
                                                                                <span>Edit</span>
                                                                            </button>
                                                                            <button
                                                                                onClick={() => confirmDeletePortalDoc(doc)}
                                                                                className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1 text-[10px] font-extrabold transition shadow cursor-pointer"
                                                                                title="Hapus Link Dokumen"
                                                                            >
                                                                                <i className="fa-solid fa-trash-can text-[10px]"></i>
                                                                                <span>Hapus</span>
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                                                                {doc.title}
                                                            </h4>
                                                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                                                                {doc.desc}
                                                            </p>
                                                        </div>

                                                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                                            <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px]">
                                                                {doc.url !== '#' ? doc.url : 'Internal Repository'}
                                                            </span>
                                                            <a
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${isGreen ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                                                            >
                                                                <span>Buka Berkas</span>
                                                                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                )}

            </main>

            {/* ================= MODALS & POPUPS ================= */}

            {/* 1. LOGIN ADMIN MODAL */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <i className="fa-solid fa-lock text-emerald-400"></i>
                                Autentikasi Administrator BPKAD
                            </h3>
                            <button onClick={() => setIsLoginModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleLogin} className="p-6 space-y-4 text-xs">
                            <p className="text-slate-600 text-xs">
                                Masukkan kredensial administrator untuk membuka hak akses pengelolaan anggaran, sub kegiatan, dan dokumen portal.
                            </p>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Username:</label>
                                <input
                                    type="text"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    placeholder="admin"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Password:</label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="admin123 / bpkad2026"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                />
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsLoginModalOpen(false)}
                                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                                >
                                    Masuk Admin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. ADD YEAR MODAL */}
            {isAddYearModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <i className="fa-solid fa-calendar-plus text-emerald-400"></i>
                                Buat Tahun Anggaran Baru
                            </h3>
                            <button onClick={() => setIsAddYearModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddYear} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Pilih Tahun Anggaran Baru:</label>
                                <select
                                    value={newYearSelect || (availableNewYears[0] || '')}
                                    onChange={(e) => setNewYearSelect(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    {availableNewYears.map(yr => (
                                        <option key={yr} value={yr}>Tahun Anggaran {yr}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-2">Pilihan Sub Kegiatan:</label>
                                <div className="space-y-2">
                                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${newYearSubOption === 'clone' ? 'bg-emerald-50/70 border-emerald-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                        <input
                                            type="radio"
                                            name="subOption"
                                            value="clone"
                                            checked={newYearSubOption === 'clone'}
                                            onChange={() => setNewYearSubOption('clone')}
                                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div>
                                            <div className="font-extrabold text-slate-900">Disamakan dengan Tahun Sebelumnya ({selectedYear})</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">Struktur nama & kode sub kegiatan disalin, namun Pagu Penetapan, Pagu Perubahan, & Realisasi dikosongkan (Rp 0).</div>
                                        </div>
                                    </label>

                                    <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${newYearSubOption === 'manual' ? 'bg-emerald-50/70 border-emerald-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                                        <input
                                            type="radio"
                                            name="subOption"
                                            value="manual"
                                            checked={newYearSubOption === 'manual'}
                                            onChange={() => setNewYearSubOption('manual')}
                                            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <div>
                                            <div className="font-extrabold text-slate-900">Mengisi Manual (Daftar Kosong)</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">Memulai dari daftar kosong, Admin akan menambah sub kegiatan satu per satu.</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddYearModalOpen(false)}
                                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                                >
                                    Buat TA Baru
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 3. ADD SUB ACTIVITY MODAL */}
            {isAddSubModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <i className="fa-solid fa-circle-plus text-emerald-400"></i>
                                Tambah Sub Kegiatan POK ({selectedYear})
                            </h3>
                            <button onClick={() => setIsAddSubModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddSubActivity} className="p-6 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Kode Rekening / Sub:</label>
                                    <input
                                        type="text"
                                        value={newSubKode}
                                        onChange={(e) => setNewSubKode(e.target.value)}
                                        placeholder="5.02.01.2.01.0X"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Bidang / Unit:</label>
                                    <select
                                        value={newSubBidang}
                                        onChange={(e) => setNewSubBidang(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        <option value="Sekretariat BPKAD">Sekretariat BPKAD</option>
                                        <option value="Bidang Anggaran">Bidang Anggaran</option>
                                        <option value="Bidang Perbendaharaan & Akuntansi">Bidang Perbendaharaan & Akuntansi</option>
                                        <option value="Bidang Pengelolaan Aset Daerah">Bidang Pengelolaan Aset Daerah</option>
                                        <option value="PPKD (Bantuan Keuangan)">PPKD (Bantuan Keuangan)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Nama Sub Kegiatan:</label>
                                <input
                                    type="text"
                                    value={newSubNama}
                                    onChange={(e) => setNewSubNama(e.target.value)}
                                    placeholder="Contoh: Koordinasi Pengelolaan..."
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Nama PPTK:</label>
                                    <input
                                        type="text"
                                        value={newSubPPTK}
                                        onChange={(e) => setNewSubPPTK(e.target.value)}
                                        placeholder="Nama PPTK"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Pembantu Bendahara:</label>
                                    <input
                                        type="text"
                                        value={newSubBendahara}
                                        onChange={(e) => setNewSubBendahara(e.target.value)}
                                        placeholder="Nama Bendahara"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Pagu Penetapan (Rp):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={newSubPagu}
                                        onChange={(e) => setNewSubPagu(e.target.value)}
                                        placeholder="0"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Pagu Perubahan (Rp):</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={newSubPaguPerubahan}
                                        onChange={(e) => setNewSubPaguPerubahan(e.target.value)}
                                        placeholder="Opsional / sama"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddSubModalOpen(false)}
                                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                                >
                                    Simpan Sub Kegiatan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 4. CONSOLIDATED SUB-ACTIVITY MANAGER MODAL */}
            {activeSubModalItem && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <div>
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    <i className="fa-solid fa-sliders text-emerald-400"></i>
                                    Kelola Sub Kegiatan: {activeSubModalItem.kode}
                                </h3>
                                <p className="text-[11px] text-slate-300 truncate max-w-md mt-0.5">{activeSubModalItem.nama}</p>
                            </div>
                            <button onClick={() => setActiveSubModalItem(null)} className="text-slate-400 hover:text-white text-base">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Modal Sub Tabs */}
                        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 px-6">
                            <button
                                onClick={() => setModalSubTab('realisasi')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${modalSubTab === 'realisasi' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                            >
                                <i className="fa-solid fa-chart-line"></i>
                                <span>Input Realisasi Bulanan</span>
                            </button>
                            <button
                                onClick={() => setModalSubTab('detail')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${modalSubTab === 'detail' ? 'bg-emerald-600 text-white shadow' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit Detail & Pagu</span>
                            </button>
                        </div>

                        {modalSubTab === 'realisasi' ? (
                            <form onSubmit={handleSaveRealizationFromModal} className="p-6 space-y-4 text-xs">
                                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-emerald-900">
                                    <div>
                                        <div className="font-bold">Pagu Efektif (Patokan):</div>
                                        <div className="font-mono text-sm font-black">{formatRp(getEffectivePagu(activeSubModalItem))}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">Akumulasi s.d. Bulan Ini:</div>
                                        <div className="font-mono text-sm font-black text-blue-700">
                                            {formatRp(getRealisasiKumulatif(activeSubModalItem, currentMonth))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Pilih Bulan Realisasi:</label>
                                        <select
                                            value={editingRealMonth}
                                            onChange={(e) => {
                                                const m = Number(e.target.value);
                                                setEditingRealMonth(m);
                                                setFormNominalBulanan(activeSubModalItem.realisasiBulanan[m - 1] || '');
                                                setFormFisikBulanan(activeSubModalItem.fisikBulanan[m - 1] || '');
                                            }}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                                        >
                                            {monthNames.map((m, idx) => (
                                                <option key={idx + 1} value={idx + 1}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Capaian Fisik Bulan Ini (%):</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={formFisikBulanan}
                                            onChange={(e) => setFormFisikBulanan(e.target.value)}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Nominal Realisasi Keuangan Bulan {monthNames[editingRealMonth - 1]} (Rp):</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 font-bold text-slate-400">Rp</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={formNominalBulanan}
                                            onChange={(e) => setFormNominalBulanan(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">Masukkan nominal pengeluaran aktual pada bulan tersebut secara real-time.</p>
                                </div>

                                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSubModalItem(null)}
                                        className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
                                    >
                                        Simpan Realisasi
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSaveDetailFromModal} className="p-6 space-y-3 text-xs max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Kode Sub Kegiatan:</label>
                                        <input
                                            type="text"
                                            value={formEditKode}
                                            onChange={(e) => setFormEditKode(e.target.value)}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Bidang / Unit:</label>
                                        <select
                                            value={formEditBidang}
                                            onChange={(e) => setFormEditBidang(e.target.value)}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                        >
                                            <option value="Sekretariat BPKAD">Sekretariat BPKAD</option>
                                            <option value="Bidang Anggaran">Bidang Anggaran</option>
                                            <option value="Bidang Perbendaharaan & Akuntansi">Bidang Perbendaharaan & Akuntansi</option>
                                            <option value="Bidang Pengelolaan Aset Daerah">Bidang Pengelolaan Aset Daerah</option>
                                            <option value="PPKD (Bantuan Keuangan)">PPKD (Bantuan Keuangan)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Nama Sub Kegiatan:</label>
                                    <input
                                        type="text"
                                        value={formEditNama}
                                        onChange={(e) => setFormEditNama(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Nama PPTK:</label>
                                        <input
                                            type="text"
                                            value={formEditPPTK}
                                            onChange={(e) => setFormEditPPTK(e.target.value)}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Pembantu Bendahara:</label>
                                        <input
                                            type="text"
                                            value={formEditBendahara}
                                            onChange={(e) => setFormEditBendahara(e.target.value)}
                                            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                        />
                                    </div>
                                </div>

                                {/* Lock/Unlock Pagu Controller */}
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isPaguLocked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            <i className={`fa-solid ${isPaguLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-xs">Proteksi Nominal Pagu</div>
                                            <div className="text-[10px] text-slate-500">
                                                {isPaguLocked ? 'Nominal pagu terkunci dari pengeditan tak disengaja' : 'Nominal pagu terbuka & dapat diubah'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsPaguLocked(!isPaguLocked);
                                            showToast(isPaguLocked ? 'Akses pengeditan pagu dibuka.' : 'Nominal pagu dikunci.');
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${isPaguLocked ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
                                    >
                                        <i className={`fa-solid ${isPaguLocked ? 'fa-key' : 'fa-lock'}`}></i>
                                        <span>{isPaguLocked ? 'Buka Kunci' : 'Kunci Pagu'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Pagu Penetapan (Rp):</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={formEditPagu}
                                            onChange={(e) => setFormEditPagu(e.target.value)}
                                            disabled={isPaguLocked}
                                            className={`w-full p-2.5 border rounded-xl font-bold ${isPaguLocked ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-900 border-slate-300 focus:ring-2 focus:ring-emerald-500'}`}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-slate-700 mb-1">Pagu Perubahan (Patokan):</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1000"
                                            value={formEditPaguPerubahan}
                                            onChange={(e) => setFormEditPaguPerubahan(e.target.value)}
                                            disabled={isPaguLocked}
                                            className={`w-full p-2.5 border rounded-xl font-bold ${isPaguLocked ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-900 border-slate-300 focus:ring-2 focus:ring-emerald-500'}`}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveSubModalItem(null)}
                                        className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* 5. ADD PLANNING DOCUMENT LINK MODAL */}
            {isAddDocModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <i className="fa-solid fa-plus-circle text-amber-400"></i>
                                Tambah Link Dokumen Perencanaan
                            </h3>
                            <button onClick={() => setIsAddDocModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddDocumentLink} className="p-6 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Judul Dokumen / Portal:</label>
                                <input
                                    type="text"
                                    value={newDocTitle}
                                    onChange={(e) => setNewDocTitle(e.target.value)}
                                    placeholder="Contoh: DPA Perubahan BPKAD 2026"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Kategori Dokumen:</label>
                                    <select
                                        value={newDocCategory}
                                        onChange={(e) => setNewDocCategory(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        {availableCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="NEW">+ Tambah Kategori Baru...</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Label / Badge:</label>
                                    <input
                                        type="text"
                                        value={newDocBadge}
                                        onChange={(e) => setNewDocBadge(e.target.value)}
                                        placeholder="2026 / Utama / PDF"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                        required
                                    />
                                </div>
                            </div>

                            {newDocCategory === 'NEW' && (
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Nama Kategori Baru:</label>
                                    <input
                                        type="text"
                                        value={customCategoryInput}
                                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                                        placeholder="Ketik nama kategori baru..."
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">URL Target (Drive / s.id / Web):</label>
                                <input
                                    type="text"
                                    value={newDocUrl}
                                    onChange={(e) => setNewDocUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Gaya Tombol:</label>
                                    <select
                                        value={newDocType}
                                        onChange={(e) => setNewDocType(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        <option value="green">Hijau Utama (Highlight)</option>
                                        <option value="neutral">Netral / Arsip</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Ikon FontAwesome:</label>
                                    <select
                                        value={newDocIcon}
                                        onChange={(e) => setNewDocIcon(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        <option value="fa-file-lines">File Lines</option>
                                        <option value="fa-file-pdf">File PDF</option>
                                        <option value="fa-file-excel">File Excel</option>
                                        <option value="fa-folder-open">Folder</option>
                                        <option value="fa-globe">Globe Portal</option>
                                        <option value="fa-book">Buku Renstra</option>
                                        <option value="fa-file-invoice-dollar">DPA Anggaran</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat:</label>
                                <textarea
                                    value={newDocDesc}
                                    onChange={(e) => setNewDocDesc(e.target.value)}
                                    rows="2"
                                    placeholder="Keterangan singkat isi dokumen..."
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddDocModalOpen(false)}
                                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl shadow"
                                >
                                    Simpan Dokumen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 6. EDIT PLANNING DOCUMENT LINK MODAL */}
            {isEditDocModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <i className="fa-solid fa-pen text-amber-400"></i>
                                Edit Link Dokumen Perencanaan
                            </h3>
                            <button onClick={() => setIsEditDocModalOpen(false)} className="text-slate-400 hover:text-white text-base">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDocumentLink} className="p-6 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Judul Dokumen / Portal:</label>
                                <input
                                    type="text"
                                    value={newDocTitle}
                                    onChange={(e) => setNewDocTitle(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Kategori Dokumen:</label>
                                    <select
                                        value={newDocCategory}
                                        onChange={(e) => setNewDocCategory(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        {availableCategories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Label / Badge:</label>
                                    <input
                                        type="text"
                                        value={newDocBadge}
                                        onChange={(e) => setNewDocBadge(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">URL Target:</label>
                                <input
                                    type="text"
                                    value={newDocUrl}
                                    onChange={(e) => setNewDocUrl(e.target.value)}
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Gaya Tombol:</label>
                                    <select
                                        value={newDocType}
                                        onChange={(e) => setNewDocType(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        <option value="green">Hijau Utama (Highlight)</option>
                                        <option value="neutral">Netral / Arsip</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Ikon FontAwesome:</label>
                                    <select
                                        value={newDocIcon}
                                        onChange={(e) => setNewDocIcon(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900"
                                    >
                                        <option value="fa-file-lines">File Lines</option>
                                        <option value="fa-file-pdf">File PDF</option>
                                        <option value="fa-file-excel">File Excel</option>
                                        <option value="fa-folder-open">Folder</option>
                                        <option value="fa-globe">Globe Portal</option>
                                        <option value="fa-book">Buku Renstra</option>
                                        <option value="fa-file-invoice-dollar">DPA Anggaran</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Deskripsi Singkat:</label>
                                <textarea
                                    value={newDocDesc}
                                    onChange={(e) => setNewDocDesc(e.target.value)}
                                    rows="2"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditDocModalOpen(false)}
                                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 7. DELETE CONFIRMATION MODAL FOR PORTAL DOC */}
            {docDeleteTarget && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 p-6 space-y-4 text-center">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-sm text-slate-900">Hapus Portal Dokumen?</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Anda yakin ingin menghapus portal <span className="font-bold text-slate-800">"{docDeleteTarget.title}"</span> dari repository?
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setDocDeleteTarget(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                            >
                                Batal
                            </button>
                            <button
                                onClick={executeDeletePortalDoc}
                                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 8. OFFICIAL REPORT PRINT PREVIEW MODAL */}
            {isPrintModalOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 no-print">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-fadeIn">
                        {/* Modal Header */}
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                                    <i className="fa-solid fa-print text-sm"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">Pratinjau Laporan Resmi POK BPKAD</h3>
                                    <p className="text-[11px] text-slate-400">Tahun Anggaran {selectedYear} • Posisi s.d. Bulan {monthNames[currentMonth - 1]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrintNewWindow}
                                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                                    title="Buka laporan di jendela terpisah untuk pencetakan langsung"
                                >
                                    <i className="fa-solid fa-arrow-up-right-from-square text-emerald-400 text-[10px]"></i>
                                    <span>Buka Jendela Cetak Baru</span>
                                </button>
                                <button
                                    onClick={handleDirectPrint}
                                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                                >
                                    <i className="fa-solid fa-file-pdf text-xs"></i>
                                    <span>Cetak / Simpan PDF</span>
                                </button>
                                <button
                                    onClick={() => setIsPrintModalOpen(false)}
                                    className="text-slate-400 hover:text-white p-2 rounded-lg text-lg ml-2"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>

                        {/* Printable Content Viewport */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-200/60">
                            <div id="printable-official-report-content" className="bg-white p-8 sm:p-12 rounded-xl shadow-md border border-slate-300 max-w-4xl mx-auto text-slate-900 font-sans">
                                {/* Formal Kop Surat */}
                                <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-5">
                                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Pemerintah Kabupaten Kendal</h2>
                                    <h1 className="text-base sm:text-lg font-black uppercase tracking-widest text-slate-950">Badan Pengelolaan Keuangan dan Aset Daerah</h1>
                                    <p className="text-[10px] font-medium text-slate-600 mt-0.5">Jl. Soekarno-Hatta No. 193 Kendal - Jawa Tengah | Telp: (0294) 381234 | Website: bpkad.kendalkab.go.id</p>
                                </div>

                                <div className="text-center mb-5">
                                    <h3 className="text-xs font-black uppercase underline tracking-wide">LAPORAN REALISASI PELAKSANAAN ANGGARAN POK BPKAD</h3>
                                    <p className="text-[10px] font-bold text-slate-700 mt-1">
                                        Tahun Anggaran {selectedYear} (Posisi s.d. Bulan {monthNames[currentMonth - 1]} {selectedYear})
                                    </p>
                                </div>

                                <table className="w-full text-[9px] border-collapse border border-slate-900 mb-6">
                                    <thead>
                                        <tr className="bg-slate-200 text-slate-950 font-black border-b border-slate-900">
                                            <th className="p-1.5 border border-slate-900 text-center w-7">No</th>
                                            <th className="p-1.5 border border-slate-900 text-left">Kode & Sub-Kegiatan</th>
                                            <th className="p-1.5 border border-slate-900 text-left">PPTK</th>
                                            <th className="p-1.5 border border-slate-900 text-right">Pagu Penetapan</th>
                                            <th className="p-1.5 border border-slate-900 text-right">Pagu Perubahan</th>
                                            <th className="p-1.5 border border-slate-900 text-right">Realisasi s.d. {monthNames[currentMonth - 1]}</th>
                                            <th className="p-1.5 border border-slate-900 text-right">Sisa Anggaran</th>
                                            <th className="p-1.5 border border-slate-900 text-center">% Keu</th>
                                            <th className="p-1.5 border border-slate-900 text-center">% Fisik</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPokList.map((item, i) => {
                                            const eff = getEffectivePagu(item);
                                            const rel = getRealisasiKumulatif(item, currentMonth);
                                            const sisa = eff - rel;
                                            const pct = eff > 0 ? (rel / eff) * 100 : 0;
                                            const fis = getFisikLatest(item, currentMonth);

                                            return (
                                                <tr key={item.id} className="border-b border-slate-700">
                                                    <td className="p-1 border border-slate-900 text-center font-bold">{i + 1}</td>
                                                    <td className="p-1 border border-slate-900">
                                                        <div className="font-extrabold text-slate-950">{item.nama}</div>
                                                        <div className="font-mono text-[8px] text-slate-600">{item.kode}</div>
                                                    </td>
                                                    <td className="p-1 border border-slate-900 text-slate-800">{item.pptk || '-'}</td>
                                                    <td className="p-1 border border-slate-900 text-right font-mono">{formatRp(item.pagu)}</td>
                                                    <td className="p-1 border border-slate-900 text-right font-mono font-bold">{formatRp(eff)}</td>
                                                    <td className="p-1 border border-slate-900 text-right font-mono font-black">{formatRp(rel)}</td>
                                                    <td className="p-1 border border-slate-900 text-right font-mono">{formatRp(sisa)}</td>
                                                    <td className="p-1 border border-slate-900 text-center font-bold">{formatPct(pct)}</td>
                                                    <td className="p-1 border border-slate-900 text-center">{formatPct(fis)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-200 font-black border-t-2 border-slate-900 text-slate-950">
                                            <td colSpan={3} className="p-1.5 border border-slate-900 text-center uppercase font-black">TOTAL KESELURUHAN</td>
                                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalPaguPenetapan)}</td>
                                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalPaguPerubahan)}</td>
                                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalRealisasiYear)}</td>
                                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalSisaYear)}</td>
                                            <td className="p-1.5 border border-slate-900 text-center font-bold">{formatPct(avgPctKeuYear)}</td>
                                            <td className="p-1.5 border border-slate-900 text-center font-bold">{formatPct(avgFisikYear)}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                                {/* Formal Signature Block: Kepala BPKAD Kabupaten Kendal */}
                                <div className="flex justify-end pt-4">
                                    <div className="text-center w-72 text-[11px] space-y-1">
                                        <p className="font-medium">Kendal, {lastDayOfMonth} {monthNames[currentMonth - 1]} {selectedYear}</p>
                                        <p className="font-bold uppercase">Kepala BPKAD Kabupaten Kendal</p>
                                        <div className="h-16"></div>
                                        <p className="font-extrabold underline uppercase">ABDUL WAHAB, S.Sos., MIDS, M.Eng.</p>
                                        <p className="font-medium">Pembina Utama Muda</p>
                                        <p className="font-mono text-[10px]">NIP. 19731021 199703 1 002</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
                            <span className="font-semibold">
                                <i className="fa-solid fa-circle-info text-emerald-600 mr-1.5"></i>
                                Ganti printer ke "Save as PDF" jika ingin menyimpan berkas digital.
                            </span>
                            <button
                                onClick={() => setIsPrintModalOpen(false)}
                                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition"
                            >
                                Tutup Pratinjau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= PRINT ONLY OFFICIAL REPORT (PDF) ================= */}
            <div className="hidden print:block print-only p-4 bg-white text-slate-900 font-sans">
                {/* Formal Kop Surat */}
                <div className="text-center border-b-4 border-double border-slate-900 pb-3 mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">Pemerintah Kabupaten Kendal</h2>
                    <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-950">Badan Pengelolaan Keuangan dan Aset Daerah</h1>
                    <p className="text-[10px] font-medium text-slate-600 mt-0.5">Jl. Soekarno-Hatta No. 193 Kendal - Jawa Tengah | Telp: (0294) 381234 | Website: bpkad.kendalkab.go.id</p>
                </div>

                <div className="text-center mb-5">
                    <h3 className="text-xs font-black uppercase underline tracking-wide">LAPORAN REALISASI PELAKSANAAN ANGGARAN POK BPKAD</h3>
                    <p className="text-[10px] font-bold text-slate-700 mt-1">
                        Tahun Anggaran {selectedYear} (Posisi s.d. Bulan {monthNames[currentMonth - 1]} {selectedYear})
                    </p>
                </div>

                <table className="w-full text-[9px] border-collapse border border-slate-900 mb-6">
                    <thead>
                        <tr className="bg-slate-200 text-slate-950 font-black border-b border-slate-900">
                            <th className="p-1.5 border border-slate-900 text-center w-7">No</th>
                            <th className="p-1.5 border border-slate-900 text-left">Kode & Sub-Kegiatan</th>
                            <th className="p-1.5 border border-slate-900 text-left">PPTK</th>
                            <th className="p-1.5 border border-slate-900 text-right">Pagu Penetapan</th>
                            <th className="p-1.5 border border-slate-900 text-right">Pagu Perubahan</th>
                            <th className="p-1.5 border border-slate-900 text-right">Realisasi s.d. {monthNames[currentMonth - 1]}</th>
                            <th className="p-1.5 border border-slate-900 text-right">Sisa Anggaran</th>
                            <th className="p-1.5 border border-slate-900 text-center">% Keu</th>
                            <th className="p-1.5 border border-slate-900 text-center">% Fisik</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPokList.map((item, i) => {
                            const eff = getEffectivePagu(item);
                            const rel = getRealisasiKumulatif(item, currentMonth);
                            const sisa = eff - rel;
                            const pct = eff > 0 ? (rel / eff) * 100 : 0;
                            const fis = getFisikLatest(item, currentMonth);

                            return (
                                <tr key={item.id} className="border-b border-slate-700">
                                    <td className="p-1 border border-slate-900 text-center font-bold">{i + 1}</td>
                                    <td className="p-1 border border-slate-900">
                                        <div className="font-extrabold text-slate-950">{item.nama}</div>
                                        <div className="font-mono text-[8px] text-slate-600">{item.kode}</div>
                                    </td>
                                    <td className="p-1 border border-slate-900 text-slate-800">{item.pptk || '-'}</td>
                                    <td className="p-1 border border-slate-900 text-right font-mono">{formatRp(item.pagu)}</td>
                                    <td className="p-1 border border-slate-900 text-right font-mono font-bold">{formatRp(eff)}</td>
                                    <td className="p-1 border border-slate-900 text-right font-mono font-black">{formatRp(rel)}</td>
                                    <td className="p-1 border border-slate-900 text-right font-mono">{formatRp(sisa)}</td>
                                    <td className="p-1 border border-slate-900 text-center font-bold">{formatPct(pct)}</td>
                                    <td className="p-1 border border-slate-900 text-center">{formatPct(fis)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-200 font-black border-t-2 border-slate-900 text-slate-950">
                            <td colSpan={3} className="p-1.5 border border-slate-900 text-center uppercase font-black">TOTAL KESELURUHAN</td>
                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalPaguPenetapan)}</td>
                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalPaguPerubahan)}</td>
                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalRealisasiYear)}</td>
                            <td className="p-1.5 border border-slate-900 text-right font-mono">{formatRp(totalSisaYear)}</td>
                            <td className="p-1.5 border border-slate-900 text-center font-bold">{formatPct(avgPctKeuYear)}</td>
                            <td className="p-1.5 border border-slate-900 text-center font-bold">{formatPct(avgFisikYear)}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Formal Signature Block: Kepala BPKAD Kabupaten Kendal */}
                <div className="flex justify-end pt-4">
                    <div className="text-center w-72 text-[11px] space-y-1">
                        <p className="font-medium">Kendal, {lastDayOfMonth} {monthNames[currentMonth - 1]} {selectedYear}</p>
                        <p className="font-bold uppercase">Kepala BPKAD Kabupaten Kendal</p>
                        <div className="h-16"></div>
                        <p className="font-extrabold underline uppercase">ABDUL WAHAB, S.Sos., MIDS, M.Eng.</p>
                        <p className="font-medium">Pembina Utama Muda</p>
                        <p className="font-mono text-[10px]">NIP. 19731021 199703 1 002</p>
                    </div>
                </div>
            </div>

        </div>
    );
}