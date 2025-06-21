document.addEventListener("DOMContentLoaded", function () {
    // --- Xử lý Đăng nhập ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Ngăn chặn form submit mặc định

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email === 'admin@vnua.com' && password === '123456a@') {
                window.location.href = 'home.html'; // Chuyển hướng đến trang chủ
            } else {
                alert('Email hoặc mật khẩu không đúng.');
            }
        });
    }

    // --- Xử lý Đăng xuất ---
    const logoutIcon = document.getElementById('log_out');
    if (logoutIcon) {
        logoutIcon.addEventListener('click', function () {
            window.location.href = 'dangnhap.html'; // Chuyển hướng về trang đăng nhập
        });
    }

    // --- Quản lý Nạp Nội dung Trang (SPA-like) ---
    function loadContent(page) {
    fetch(`pages/${page}`)
        .then(res => {
            if (!res.ok) throw new Error("Không thể tải nội dung.");
            return res.text();
        })
        .then(html => {
            const content = document.getElementById('content-area');
            if (content) {
                content.innerHTML = html;

                if (page === 'trangchu.html') {
                    loadNotificationsAndEvents();
                    if (typeof Chart !== 'undefined') {
                        initCharts();
                    }
                } else if (page === 'khoa.html') {
                    initKhoaManagement();
                } else if (page === 'lop.html') {
                    initClassManagement();
                } else if (page === 'sinhvien.html') { // --- THÊM DÒNG NÀY ---
                    initStudentManagement(); // Khởi tạo quản lý sinh viên
                }
                // Thêm các điều kiện else if cho các trang khác nếu có
            }
        })
        .catch(err => {
            console.error("Lỗi khi tải nội dung:", err);
            const content = document.getElementById('content-area');
            if (content) {
                content.innerHTML = "<p>Lỗi khi tải nội dung.</p>";
            }
        });
    }

    // Gắn sự kiện click cho các mục menu trong sidebar
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.addEventListener("click", function () {
            const page = this.getAttribute("data-page");
            if (page) {
                loadContent(page); // Tải nội dung trang tương ứng
            }
        });
    });

    // --- Chức năng Biểu đồ (Trang Chủ) ---
    function initCharts() {
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: context => `${context.dataset.label}: ${context.raw} người`
                    }
                }
            }
        };

        // Biểu đồ Thống kê Sinh viên
        createChart('studentGenderChart', {
            type: 'bar',
            data: {
                labels: ['CNTT', 'HTTT', 'KHMT'],
                datasets: [
                    {
                        label: 'Sinh viên Nam',
                        data: [1300, 1200, 800],
                        backgroundColor: '#2E8B57'
                    },
                    {
                        label: 'Sinh viên Nữ',
                        data: [1000, 800, 850],
                        backgroundColor: '#1E90FF'
                    }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 2000,
                        ticks: {
                            stepSize: 500,
                            callback: v => v === 2000 ? '2000 người' : v + ' người'
                        }
                    }
                },
                plugins: { title: { display: true, text: 'THỐNG KÊ SINH VIÊN', font: { size: 16 } } }
            }
        });

        // Biểu đồ Thống kê Giáo viên
        createChart('teacherGenderChart', {
            type: 'bar',
            data: {
                labels: ['CNTT', 'HTTT', 'KHMT'],
                datasets: [
                    {
                        label: 'Giáo viên Nam',
                        data: [20, 30, 25],
                        backgroundColor: '#3CB371'
                    },
                    {
                        label: 'Giáo viên Nữ',
                        data: [30, 25, 30],
                        backgroundColor: '#D2691E'
                    }
                ]
            },
            options: {
                ...commonOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        ticks: {
                            stepSize: 10,
                            callback: v => v + ' người'
                        }
                    }
                },
                plugins: { title: { display: true, text: 'THỐNG KÊ GIÁO VIÊN', font: { size: 16 } } }
            }
        });
    }

    // Hàm tạo biểu đồ Chart.js
    function createChart(id, config) {
        const ctx = document.getElementById(id);
        if (!ctx) {
            console.warn(`Không tìm thấy canvas với ID: ${id}`);
            return;
        }
        // Hủy biểu đồ cũ nếu có để tránh lỗi khi render lại
        if (ctx.chart) {
            ctx.chart.destroy();
        }

        try {
            ctx.chart = new Chart(ctx.getContext('2d'), config);
        } catch (e) {
            console.error(`Lỗi khi tạo biểu đồ ${id}:`, e);
        }
    }

    // --- Tải Thông báo và Sự kiện (Trang Chủ) ---
    function loadNotificationsAndEvents() {
        const notifications = [
            { date: "07/05/2025", content: "Thông báo tuyển sinh đào tạo trình độ thạc sĩ năm 2025" },
            { date: "07/05/2025", content: "Xét tuyển nghiên cứu sinh năm 2025" },
            { date: "10/05/2025", content: "Thông báo thu học phí học kì II năm 2025" },
            { date: "15/05/2025", content: "Thông báo thu học phí đối với nghiên cứu sinh" },
            { date: "21/05/2025", content: "Đăng kí nguyện vọng lớp học hè năm 2025" }
        ];

        const events = [
            { date: "05/05/2025", content: "Ngày hội việc làm năm 2025" },
            { date: "07/05/2025", content: "Kỉ niệm 71 năm chiến thắng Điện Biên Phủ" },
            { date: "10-18/05/2025", content: "Festival hoa, cây cảnh VNUA 2025" }
        ];

        const notificationList = document.getElementById('notificationList');
        const eventList = document.getElementById('eventList');

        if (notificationList) {
            notificationList.innerHTML = '';
            notifications.forEach(n => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${n.date}:</strong> ${n.content}`;
                notificationList.appendChild(li);
            });
        }

        if (eventList) {
            eventList.innerHTML = '';
            events.forEach(e => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${e.date}:</strong> ${e.content}`;
                eventList.appendChild(li);
            });
        }
    }

    // --- Khởi tạo Trang Chủ Mặc định ---
    // Đảm bảo Chart.js đã được tải trước khi gọi initCharts
    if (typeof Chart !== 'undefined') {
        loadContent("trangchu.html"); // Tải trang chủ khi DOMContentLoaded
    } else {
        console.error("Chart.js không được tìm thấy. Vui lòng đảm bảo thư viện đã được nhúng.");
        // Vẫn tải nội dung trang chủ nếu không có Chart.js, nhưng biểu đồ sẽ không hoạt động
        loadContent("trangchu.html");
    }

    // --- Quản lý Khoa ---
    function initKhoaManagement() {
        console.log("Đang khởi tạo quản lý khoa...");

    // Khởi tạo dữ liệu khoa từ localStorage hoặc dữ liệu mẫu
    let khoaData = JSON.parse(localStorage.getItem('khoaData')) || [
        { maKhoa: 'CNTT', tenKhoa: 'Công nghệ thông tin' },
        { maKhoa: 'HTTT', tenKhoa: 'Hệ thống thông tin' },
        { maKhoa: 'KHMT', tenKhoa: 'Khoa học máy tính' }
    ];

    // Hàm lưu dữ liệu khoa vào localStorage
    function saveKhoaData() {
        localStorage.setItem('khoaData', JSON.stringify(khoaData));
        console.log("Đã lưu dữ liệu khoa.");
    }

    // Hàm render (hiển thị) bảng khoa
    function renderKhoaTable(data = khoaData) {
        console.log("Đang render bảng khoa với dữ liệu:", data);
        const tbody = document.querySelector('#khoaTable tbody');
        if (!tbody) {
            console.error("Không tìm thấy tbody của bảng khoa.");
            return;
        }

        tbody.innerHTML = ''; // Xóa các hàng cũ

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Không tìm thấy kết quả phù hợp</td></tr>`;
            return;
        }

        data.forEach((khoa) => {
            // Tìm index gốc để đảm bảo sửa/xóa đúng phần tử khi dữ liệu đã được lọc
            const originalIndex = khoaData.findIndex(k => k.maKhoa === khoa.maKhoa);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${khoa.maKhoa}</td>
                <td>${khoa.tenKhoa}</td>
                <td>
                    <button class="action-btn btn-edit" data-index="${originalIndex}" onclick="openKhoaModal(true, ${originalIndex})">
                        <i class="bx bx-edit"></i> Sửa
                    </button>
                    <button class="action-btn btn-delete" data-index="${originalIndex}" onclick="deleteKhoa(${originalIndex})">
                        <i class="bx bx-trash-alt"></i> Xóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Xử lý tìm kiếm khoa
    const searchInput = document.getElementById('searchKhoa');
    if (searchInput) {
        console.log("Đã tìm thấy ô tìm kiếm khoa.");
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            console.log("Đang tìm kiếm khoa với từ khóa:", searchTerm);

            if (!searchTerm) {
                renderKhoaTable(); // Nếu rỗng thì hiển thị lại toàn bộ
                return;
            }

            const filteredData = khoaData.filter(khoa =>
                khoa.maKhoa.toLowerCase().includes(searchTerm) ||
                khoa.tenKhoa.toLowerCase().includes(searchTerm)
            );
            console.log("Kết quả tìm kiếm khoa:", filteredData);
            renderKhoaTable(filteredData);
        });
    } else {
        console.error("Không tìm thấy phần tử #searchKhoa.");
    }

    // Hàm mở modal thêm/sửa khoa
    window.openKhoaModal = function(isEdit = false, index = -1) {
        console.log(`Mở modal khoa ${isEdit ? 'sửa' : 'thêm'} với index:`, index);
        const modal = document.getElementById('khoaModal');
        if (!modal) {
            console.error("Không tìm thấy modal khoa.");
            return;
        }

        document.getElementById('modalTitle').textContent = isEdit ? 'Sửa Khoa' : 'Thêm Khoa';

        if (isEdit && index >= 0 && index < khoaData.length) {
            // Điền dữ liệu vào form nếu là chế độ sửa
            document.getElementById('maKhoa').value = khoaData[index].maKhoa;
            document.getElementById('tenKhoa').value = khoaData[index].tenKhoa;
            document.getElementById('editingRowIndex').value = index; // Lưu index của hàng đang sửa
        } else {
            // Reset form nếu là chế độ thêm mới
            document.getElementById('khoaForm').reset();
            document.getElementById('editingRowIndex').value = '';
        }

        modal.style.display = 'flex'; // Hiển thị modal
    };

    // Hàm đóng modal khoa
    window.closeKhoaModal = function() {
        const modal = document.getElementById('khoaModal');
        if (modal) modal.style.display = 'none';
    };

    // Đóng modal khi click ra ngoài nội dung modal
    document.getElementById('khoaModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeKhoaModal();
        }
    });

    // Hàm xóa khoa
    window.deleteKhoa = function(index) {
        console.log("Click xóa khoa có index:", index);
        if (confirm("Bạn có chắc muốn xóa khoa này?")) {
            khoaData.splice(index, 1); // Xóa phần tử tại index
            saveKhoaData(); // Lưu lại dữ liệu
            renderKhoaTable(); // Render lại bảng
        }
    };

    // Xử lý submit form thêm/sửa khoa
    const form = document.getElementById('khoaForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn chặn form submit mặc định

            const maKhoa = document.getElementById('maKhoa').value.trim();
            const tenKhoa = document.getElementById('tenKhoa').value.trim();
            const index = document.getElementById('editingRowIndex').value; // Lấy index nếu đang sửa

            console.log(`Submit form khoa với mã: ${maKhoa}, tên: ${tenKhoa}, index: ${index}`);

            if (!maKhoa || !tenKhoa) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            // Kiểm tra mã khoa trùng lặp khi thêm mới
            if (index === '' && khoaData.some(k => k.maKhoa === maKhoa)) {
                alert('Mã khoa đã tồn tại.');
                return;
            }

            if (index !== '') {
                // Chế độ sửa: cập nhật dữ liệu tại index
                khoaData[index] = { maKhoa, tenKhoa };
            } else {
                // Chế độ thêm mới: thêm vào cuối mảng
                khoaData.push({ maKhoa, tenKhoa });
            }

            saveKhoaData(); // Lưu dữ liệu mới
            renderKhoaTable(); // Render lại bảng
            closeKhoaModal(); // Đóng modal
        });
    } else {
        console.error("Không tìm thấy form khoa.");
    }

    // Khởi tạo ban đầu: Render bảng khoa khi hàm được gọi
    renderKhoaTable();
    }


    // --- Quản lý Lớp ---
    function initClassManagement() {
        console.log("Đang khởi tạo quản lý lớp...");

        // Khởi tạo dữ liệu lớp từ localStorage hoặc dữ liệu mẫu
        // Sử dụng 'classData' làm khóa lưu trữ riêng cho lớp
        let classData = JSON.parse(localStorage.getItem('classData')) || [
            { maClass: 'CNTT1', tenClass: 'Công nghệ thông tin 1' },
            { maClass: 'HTTT2', tenClass: 'Hệ thống thông tin 2' },
            { maClass: 'KHMT3', tenClass: 'Khoa học máy tính 3' }
        ];

    // Hàm lưu dữ liệu lớp vào localStorage
    function saveClassData() {
        localStorage.setItem('classData', JSON.stringify(classData));
        console.log("Đã lưu dữ liệu lớp.");
    }

    // Hàm render (hiển thị) bảng lớp
    function renderClassTable(data = classData) {
        console.log("Đang render bảng lớp với dữ liệu:", data);
        const tbody = document.querySelector('#classTable tbody');
        if (!tbody) {
            console.error("Không tìm thấy tbody của bảng lớp.");
            return;
        }

        tbody.innerHTML = ''; // Xóa các hàng cũ

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Không tìm thấy kết quả phù hợp</td></tr>`;
            return;
        }

        data.forEach((lop) => {
            // Tìm index gốc để đảm bảo sửa/xóa đúng phần tử khi dữ liệu đã được lọc
            const originalIndex = classData.findIndex(k => k.maClass === lop.maClass);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lop.maClass}</td>
                <td>${lop.tenClass}</td>
                <td>
                    <button class="action-btn btn-edit" data-index="${originalIndex}" onclick="openClassModal(true, ${originalIndex})">
                        <i class="bx bx-edit"></i> Sửa
                    </button>
                    <button class="action-btn btn-delete" data-index="${originalIndex}" onclick="deleteClass(${originalIndex})">
                        <i class="bx bx-trash-alt"></i> Xóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Xử lý tìm kiếm lớp
    const searchInput = document.getElementById('searchClass');
    if (searchInput) {
        console.log("Đã tìm thấy ô tìm kiếm lớp.");
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            console.log("Đang tìm kiếm lớp với từ khóa:", searchTerm);

            if (!searchTerm) {
                renderClassTable(); // Nếu rỗng thì hiển thị lại toàn bộ
                return;
            }

            const filteredData = classData.filter(lop =>
                lop.maClass.toLowerCase().includes(searchTerm) ||
                lop.tenClass.toLowerCase().includes(searchTerm)
            );
            console.log("Kết quả tìm kiếm lớp:", filteredData);
            renderClassTable(filteredData);
        });
    } else {
        console.error("Không tìm thấy phần tử #searchClass.");
    }

    // Hàm mở modal thêm/sửa lớp
    window.openClassModal = function(isEdit = false, index = -1) {
        console.log(`Mở modal lớp ${isEdit ? 'sửa' : 'thêm'} với index:`, index);
        const modal = document.getElementById('classModal');
        if (!modal) {
            console.error("Không tìm thấy modal lớp.");
            return;
        }

        document.getElementById('classModalTitle').textContent = isEdit ? 'Sửa Lớp' : 'Thêm Lớp';

        if (isEdit && index >= 0 && index < classData.length) {
            // Điền dữ liệu vào form nếu là chế độ sửa
            document.getElementById('maClass').value = classData[index].maClass;
            document.getElementById('tenClass').value = classData[index].tenClass;
            document.getElementById('editingClassRowIndex').value = index; // Lưu index của hàng đang sửa
        } else {
            // Reset form nếu là chế độ thêm mới
            document.getElementById('classForm').reset();
            document.getElementById('editingClassRowIndex').value = '';
        }

        modal.style.display = 'flex'; // Hiển thị modal
    };

    // Hàm đóng modal lớp
    window.closeClassModal = function() {
        const modal = document.getElementById('classModal');
        if (modal) modal.style.display = 'none';
    };

    // Đóng modal khi click ra ngoài nội dung modal
    document.getElementById('classModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeClassModal();
        }
    });

    // Hàm xóa lớp
    window.deleteClass = function(index) {
        console.log("Click xóa lớp có index:", index);
        if (confirm("Bạn có chắc muốn xóa lớp này?")) {
            classData.splice(index, 1); // Xóa phần tử tại index
            saveClassData(); // Lưu lại dữ liệu
            renderClassTable(); // Render lại bảng
        }
    };

    // Xử lý submit form thêm/sửa lớp
    const form = document.getElementById('classForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Ngăn chặn form submit mặc định

            const maClass = document.getElementById('maClass').value.trim();
            const tenClass = document.getElementById('tenClass').value.trim();
            const index = document.getElementById('editingClassRowIndex').value; // Lấy index nếu đang sửa

            console.log(`Submit form lớp với mã: ${maClass}, tên: ${tenClass}, index: ${index}`);

            if (!maClass || !tenClass) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            // Kiểm tra mã lớp trùng lặp khi thêm mới
            if (index === '' && classData.some(k => k.maClass === maClass)) {
                alert('Mã lớp đã tồn tại.');
                return;
            }

            if (index !== '') {
                // Chế độ sửa: cập nhật dữ liệu tại index
                classData[index] = { maClass, tenClass };
            } else {
                // Chế độ thêm mới: thêm vào cuối mảng
                classData.push({ maClass, tenClass });
            }

            saveClassData(); // Lưu dữ liệu mới
            renderClassTable(); // Render lại bảng
            closeClassModal(); // Đóng modal
        });
    } else {
        console.error("Không tìm thấy form lớp.");
    }

    // Khởi tạo ban đầu: Render bảng lớp khi hàm được gọi
    renderClassTable();
    }

    // --- Quản lý Sinh viên ---
    function initStudentManagement() {
        console.log("Đang khởi tạo quản lý sinh viên...");

        // Dữ liệu mẫu ban đầu cho sinh viên
        let studentData = JSON.parse(localStorage.getItem('studentData')) || [
            {
                maSV: '671800', tenSV: 'Nguyễn Thế Hiển', ngaySinh: '23/08/2004', gioiTinh: 'Nam',
                khoaSV: 'CNTT', lopSV: 'CNTTA', emailSV: 'nguyenthehien00@gmail.com', sdtSV: '0987654321',
                diaChiSV: 'Bắc Ninh', anhSV: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' // Ảnh mặc định nhỏ
            },
            {
                maSV: '671801', tenSV: 'Tạ Hữu Quân', ngaySinh: '26/08/2004', gioiTinh: 'Nam',
                khoaSV: 'CNTT', lopSV: 'CNTTC', emailSV: 'tahuuquan01@gmai.com', sdtSV: '0912345678',
                diaChiSV: 'Bắc Ninh', anhSV: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
            }
        ];

        // Dữ liệu khoa và lớp để điền vào dropdown (lấy từ localStorage)
        const khoaOptions = JSON.parse(localStorage.getItem('khoaData')) || [];
        const lopOptions = JSON.parse(localStorage.getItem('classData')) || [];

        // Hàm lưu dữ liệu sinh viên vào localStorage
        function saveStudentData() {
            localStorage.setItem('studentData', JSON.stringify(studentData));
            console.log("Đã lưu dữ liệu sinh viên.");
        }

        // Hàm điền dữ liệu vào dropdown Khoa và Lớp trong modal
        function populateSelects() {
            const khoaSelect = document.getElementById('khoaSV');
            const lopSelect = document.getElementById('lopSV');

            if (khoaSelect) {
                khoaSelect.innerHTML = '<option value="">-- Chọn Khoa --</option>';
                khoaOptions.forEach(khoa => {
                    const option = document.createElement('option');
                    option.value = khoa.maKhoa;
                    option.textContent = khoa.tenKhoa;
                    khoaSelect.appendChild(option);
                });
            }
            if (lopSelect) {
                lopSelect.innerHTML = '<option value="">-- Chọn Lớp --</option>';
                lopOptions.forEach(lop => {
                    const option = document.createElement('option');
                    option.value = lop.maClass;
                    option.textContent = lop.tenClass;
                    lopSelect.appendChild(option);
                });
            }
        }

        // Hàm render (hiển thị) bảng sinh viên
        function renderStudentTable(data = studentData) {
            console.log("Đang render bảng sinh viên với dữ liệu:", data);
            const tbody = document.querySelector('#studentTable tbody');
            if (!tbody) {
                console.error("Không tìm thấy tbody của bảng sinh viên.");
                return;
            }

            tbody.innerHTML = ''; // Xóa các hàng cũ

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="11" style="text-align: center;">Không tìm thấy kết quả phù hợp</td></tr>`;
                return;
            }

            data.forEach((sinhVien) => {
                const originalIndex = studentData.findIndex(sv => sv.maSV === sinhVien.maSV); // Tìm index gốc
                const row = document.createElement('tr');

                // Hiển thị ảnh hoặc ảnh placeholder nếu không có
                const imgSrc = sinhVien.anhSV && sinhVien.anhSV !== '' ? sinhVien.anhSV : '../img/OIP.jpg'; // Thay 'placeholder.png' bằng ảnh mặc định của bạn

                row.innerHTML = `
                    <td>${sinhVien.maSV}</td>
                    <td>${sinhVien.tenSV}</td>
                    <td>${sinhVien.ngaySinh}</td>
                    <td>${sinhVien.gioiTinh}</td>
                    <td>${sinhVien.khoaSV}</td>
                    <td>${sinhVien.lopSV}</td>
                    <td>${sinhVien.emailSV}</td>
                    <td>${sinhVien.sdtSV}</td>
                    <td>${sinhVien.diaChiSV}</td>
                    <td><img src="${imgSrc}" alt="Ảnh SV" class="student-avatar"></td>
                    <td>
                        <button class="action-btn btn-edit" data-index="${originalIndex}" onclick="openStudentModal(true, ${originalIndex})">
                            <i class="bx bx-edit"></i> Sửa
                        </button>
                        <button class="action-btn btn-delete" data-index="${originalIndex}" onclick="deleteStudent(${originalIndex})">
                            <i class="bx bx-trash-alt"></i> Xóa
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        // Xử lý tìm kiếm sinh viên
        const searchInput = document.getElementById('searchStudent');
        if (searchInput) {
            console.log("Đã tìm thấy ô tìm kiếm sinh viên.");
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                console.log("Đang tìm kiếm sinh viên với từ khoá:", searchTerm);

                if (!searchTerm) {
                    renderStudentTable();
                    return;
                }

                const filteredData = studentData.filter(sv =>
                    sv.maSV.toLowerCase().includes(searchTerm) ||
                    sv.tenSV.toLowerCase().includes(searchTerm) ||
                    sv.khoaSV.toLowerCase().includes(searchTerm) ||
                    sv.lopSV.toLowerCase().includes(searchTerm) ||
                    sv.emailSV.toLowerCase().includes(searchTerm) ||
                    sv.sdtSV.toLowerCase().includes(searchTerm) ||
                    sv.diaChiSV.toLowerCase().includes(searchTerm)
                );
                console.log("Kết quả tìm kiếm sinh viên:", filteredData);
                renderStudentTable(filteredData);
            });
        } else {
            console.error("Không tìm thấy phần tử #searchStudent.");
        }

        // Xử lý xem trước ảnh khi chọn file
        const anhSVInput = document.getElementById('anhSV');
        const imagePreview = document.querySelector('#imagePreview img');
        if (anhSVInput && imagePreview) {
            anhSVInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file); // Chuyển ảnh thành base64
                } else {
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                }
            });
        }

        // Hàm mở modal thêm/sửa sinh viên
        window.openStudentModal = function(isEdit = false, index = -1) {
            console.log(`Mở modal sinh viên ${isEdit ? 'sửa' : 'thêm'} với index:`, index);
            const modal = document.getElementById('studentModal');
            if (!modal) {
                console.error("Không tìm thấy modal sinh viên.");
                return;
            }

            document.getElementById('studentModalTitle').textContent = isEdit ? 'Sửa Sinh viên' : 'Thêm Sinh viên';
            populateSelects(); // Điền lại dropdown khoa/lớp mỗi khi mở modal

            const anhSVInput = document.getElementById('anhSV');
            const imagePreview = document.querySelector('#imagePreview img');
            const currentStudentImage = document.getElementById('currentStudentImage');

            if (isEdit && index >= 0 && index < studentData.length) {
                const sv = studentData[index];
                document.getElementById('maSV').value = sv.maSV;
                document.getElementById('tenSV').value = sv.tenSV;
                document.getElementById('ngaySinh').value = sv.ngaySinh;
                document.querySelector(`input[name="gioiTinh"][value="${sv.gioiTinh}"]`).checked = true;
                document.getElementById('khoaSV').value = sv.khoaSV;
                document.getElementById('lopSV').value = sv.lopSV;
                document.getElementById('emailSV').value = sv.emailSV;
                document.getElementById('sdtSV').value = sv.sdtSV;
                document.getElementById('diaChiSV').value = sv.diaChiSV;
                document.getElementById('editingStudentRowIndex').value = index;

                // Hiển thị ảnh hiện có
                if (sv.anhSV) {
                    imagePreview.src = sv.anhSV;
                    imagePreview.style.display = 'block';
                    currentStudentImage.value = sv.anhSV; // Lưu ảnh hiện tại
                } else {
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                    currentStudentImage.value = '';
                }
            } else {
                // Reset form nếu là chế độ thêm mới
                document.getElementById('studentForm').reset();
                document.getElementById('editingStudentRowIndex').value = '';
                imagePreview.src = '';
                imagePreview.style.display = 'none';
                currentStudentImage.value = '';
            }

            modal.style.display = 'flex'; // Hiển thị modal
        };

        // Hàm đóng modal sinh viên
        window.closeStudentModal = function() {
            const modal = document.getElementById('studentModal');
            if (modal) modal.style.display = 'none';
            // Reset preview ảnh khi đóng modal
            document.querySelector('#imagePreview img').src = '';
            document.querySelector('#imagePreview img').style.display = 'none';
        };

        // Đóng modal khi click ra ngoài nội dung modal
        document.getElementById('studentModal')?.addEventListener('click', function(e) {
            if (e.target === this) {
                closeStudentModal();
            }
        });

        // Hàm xóa sinh viên
        window.deleteStudent = function(index) {
            console.log("Click xóa sinh viên có index:", index);
            if (confirm("Bạn có chắc muốn xóa sinh viên này?")) {
                studentData.splice(index, 1); // Xóa phần tử tại index
                saveStudentData(); // Lưu lại dữ liệu
                renderStudentTable(); // Render lại bảng
            }
        };

        // Xử lý submit form thêm/sửa sinh viên
        const form = document.getElementById('studentForm');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault(); // Ngăn chặn form submit mặc định

                const maSV = document.getElementById('maSV').value.trim();
                const tenSV = document.getElementById('tenSV').value.trim();
                const ngaySinh = document.getElementById('ngaySinh').value;
                const gioiTinh = document.querySelector('input[name="gioiTinh"]:checked')?.value || '';
                const khoaSV = document.getElementById('khoaSV').value;
                const lopSV = document.getElementById('lopSV').value;
                const emailSV = document.getElementById('emailSV').value.trim();
                const sdtSV = document.getElementById('sdtSV').value.trim();
                const diaChiSV = document.getElementById('diaChiSV').value.trim();
                const anhSVInput = document.getElementById('anhSV');
                const editingStudentRowIndex = document.getElementById('editingStudentRowIndex').value;
                const currentStudentImage = document.getElementById('currentStudentImage').value; // Ảnh đang có (base64)

                console.log(`Submit form SV: ${maSV}, ${tenSV}, index: ${editingStudentRowIndex}`);

                if (!maSV || !tenSV || !ngaySinh || !gioiTinh || !khoaSV || !lopSV || !emailSV || !sdtSV || !diaChiSV) {
                    alert('Vui lòng nhập đầy đủ thông tin và chọn Khoa/Lớp.');
                    return;
                }

                let newImageBase64 = currentStudentImage; // Mặc định giữ ảnh cũ
                if (anhSVInput.files.length > 0) {
                    // Nếu có file ảnh mới được chọn, đọc nó
                    newImageBase64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.readAsDataURL(anhSVInput.files[0]);
                    });
                }


                // Kiểm tra mã sinh viên trùng lặp khi thêm mới
                if (editingStudentRowIndex === '' && studentData.some(sv => sv.maSV === maSV)) {
                    alert('Mã sinh viên đã tồn tại.');
                    return;
                }

                const newStudent = {
                    maSV, tenSV, ngaySinh, gioiTinh, khoaSV, lopSV, emailSV, sdtSV, diaChiSV, anhSV: newImageBase64
                };

                if (editingStudentRowIndex !== '') {
                    // Chế độ sửa: cập nhật dữ liệu tại index
                    studentData[editingStudentRowIndex] = newStudent;
                } else {
                    // Chế độ thêm mới: thêm vào cuối mảng
                    studentData.push(newStudent);
                }

                saveStudentData(); // Lưu dữ liệu mới
                renderStudentTable(); // Render lại bảng
                closeStudentModal(); // Đóng modal
            });
        } else {
            console.error("Không tìm thấy form sinh viên.");
        }

        // Khởi tạo ban đầu: Render bảng sinh viên khi hàm được gọi
        renderStudentTable();   
    }

// --- Quản lý Môn học ---
function initSubjectManagement() {
    console.log("Đang khởi tạo quản lý môn học...");

    // Khởi tạo dữ liệu môn học từ localStorage hoặc dữ liệu mẫu
    let subjectData = JSON.parse(localStorage.getItem('subjectData')) || [
        { maMonHoc: 'MATH101', tenMonHoc: 'Toán giải tích', soTinChi: 3 },
        { maMonHoc: 'XSTK101', tenMonHoc: 'Xác suất thống kê', soTinChi: 4 }
    ];

    // Hàm lưu dữ liệu môn học vào localStorage
    function saveSubjectData() {
        localStorage.setItem('subjectData', JSON.stringify(subjectData));
        console.log("Đã lưu dữ liệu môn học.");
    }

    // Hàm render (hiển thị) bảng môn học
    function renderSubjectTable(data = subjectData) {
        console.log("Đang render bảng môn học với dữ liệu:", data);
        const tbody = document.querySelector('#subjectTable tbody');
        if (!tbody) {
            console.error("Không tìm thấy tbody của bảng môn học.");
            return;
        }

        tbody.innerHTML = ''; // Xóa các hàng cũ

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Không có môn học nào</td></tr>`;
            return;
        }

        data.forEach((mh, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mh.maMonHoc}</td>
                <td>${mh.tenMonHoc}</td>
                <td>${mh.soTinChi}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="openSubjectModal(true, ${index})">
                        <i class='bx bx-edit'></i> Sửa
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteSubject(${index})">
                        <i class='bx bx-trash-alt'></i> Xóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Xử lý tìm kiếm môn học
    const searchInput = document.getElementById('searchSubject');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const filteredData = subjectData.filter(mh =>
                mh.maMonHoc.toLowerCase().includes(searchTerm) ||
                mh.tenMonHoc.toLowerCase().includes(searchTerm)
            );
            renderSubjectTable(filteredData);
        });
    }

    // Hàm mở modal thêm/sửa môn học (gắn vào window để có thể gọi từ HTML)
    window.openSubjectModal = function(isEdit = false, index = -1) {
        console.log(`Mở modal môn học ${isEdit ? 'sửa' : 'thêm'} với index:`, index);
        const modal = document.getElementById('subjectModal');
        if (!modal) {
            console.error("Không tìm thấy modal môn học.");
            return;
        }

        // Đặt tiêu đề modal
        document.getElementById('subjectModalTitle').textContent = isEdit ? 'Sửa Môn học' : 'Thêm Môn học';

        // Nếu là chế độ sửa, điền dữ liệu vào form
        if (isEdit && index >= 0 && index < subjectData.length) {
            const mh = subjectData[index];
            document.getElementById('maSubject').value = mh.maMonHoc;
            document.getElementById('tenSubject').value = mh.tenMonHoc;
            document.getElementById('soTinChi').value = mh.soTinChi;
            document.getElementById('editingSubjectRowIndex').value = index;
            
            // Khóa trường mã môn học khi sửa
            document.getElementById('maSubject').readOnly = true;
        } else {
            // Reset form và mở khóa trường mã môn học khi thêm mới
            document.getElementById('subjectForm').reset();
            document.getElementById('editingSubjectRowIndex').value = '';
            document.getElementById('maSubject').readOnly = false;
        }

        // Hiển thị modal
        modal.style.display = 'flex';
    };

    // Hàm đóng modal môn học (gắn vào window)
    window.closeSubjectModal = function() {
        const modal = document.getElementById('subjectModal');
        if (modal) {
            modal.style.display = 'none';
            // Reset form khi đóng modal
            document.getElementById('subjectForm').reset();
        }
    };

    // Hàm xóa môn học (gắn vào window)
    window.deleteSubject = function(index) {
        if (confirm("Bạn có chắc muốn xóa môn học này?")) {
            subjectData.splice(index, 1);
            saveSubjectData();
            renderSubjectTable();
        }
    };

    // Xử lý submit form thêm/sửa môn học
    const form = document.getElementById('subjectForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Lấy giá trị từ form
            const maMonHoc = document.getElementById('maSubject').value.trim();
            const tenMonHoc = document.getElementById('tenSubject').value.trim();
            const soTinChi = parseInt(document.getElementById('soTinChi').value);
            const index = document.getElementById('editingSubjectRowIndex').value;

            // Validate dữ liệu
            if (!maMonHoc || !tenMonHoc || isNaN(soTinChi)) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            if (soTinChi < 1 || soTinChi > 10) {
                alert('Số tín chỉ phải từ 1 đến 10.');
                return;
            }

            // Tạo object môn học mới
            const newSubject = {
                maMonHoc: maMonHoc,
                tenMonHoc: tenMonHoc,
                soTinChi: soTinChi
            };

            if (index !== '') {
                // Chế độ sửa: cập nhật dữ liệu
                subjectData[index] = newSubject;
            } else {
                // Chế độ thêm mới: kiểm tra trùng mã
                if (subjectData.some(mh => mh.maMonHoc === maMonHoc)) {
                    alert('Mã môn học đã tồn tại.');
                    return;
                }
                // Thêm môn học mới
                subjectData.push(newSubject);
            }

            // Lưu dữ liệu và cập nhật giao diện
            saveSubjectData();
            renderSubjectTable();
            closeSubjectModal();
        });
    }

    // Đóng modal khi click ra ngoài nội dung modal
    document.getElementById('subjectModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSubjectModal();
        }
    });

    // Khởi tạo ban đầu: hiển thị danh sách môn học
    renderSubjectTable();
}

// Thêm điều kiện gọi hàm initSubjectManagement trong hàm loadContent
function loadContent(page) {
    fetch(`pages/${page}`)
        .then(res => {
            if (!res.ok) throw new Error("Không thể tải nội dung.");
            return res.text();
        })
        .then(html => {
            const content = document.getElementById('content-area');
            if (content) {
                content.innerHTML = html;

                if (page === 'trangchu.html') {
                    loadNotificationsAndEvents();
                    if (typeof Chart !== 'undefined') {
                        initCharts();
                    }
                } else if (page === 'khoa.html') {
                    initKhoaManagement();
                } else if (page === 'lop.html') {
                    initClassManagement();
                } else if (page === 'sinhvien.html') {
                    initStudentManagement();
                } else if (page === 'quanlymonhoc.html') {
                    initSubjectManagement();
                }else if (page === 'quanlydiem.html') {
                    initScoreManagement();
                }else if (page === 'diemdanh.html') {
                    initAttendanceManagement();
                }
                
            }
        })
        .catch(err => {
            console.error("Lỗi khi tải nội dung:", err);
            const content = document.getElementById('content-area');
            if (content) {
                content.innerHTML = "<p>Lỗi khi tải nội dung.</p>";
            }
        });
}

// --- Quản lý Điểm ---
function initScoreManagement() {
    console.log("Đang khởi tạo quản lý điểm...");

    // Khởi tạo dữ liệu điểm từ localStorage hoặc dữ liệu mẫu
    let scoreData = JSON.parse(localStorage.getItem('scoreData')) || [
        { 
            maSV: '671800', 
            tenSV: 'Nguyễn Thế Hiển', 
            maMH: 'MATH101', 
            tenMH: 'Toán giải tích', 
            diemGK: 8.5, 
            diemThi: 7.5 
        },
        { 
            maSV: '671801', 
            tenSV: 'Tạ Hữu Quân', 
            maMH: 'XSTK101', 
            tenMH: 'Xác suất thống kê', 
            diemGK: 7.0, 
            diemThi: 8.0 
        }
    ];

    // Hàm tính điểm tổng kết và xếp loại
    function calculateFinalScore(diemGK, diemThi) {
        const diemTK = (diemGK * 0.3) + (diemThi * 0.7);
        const xepLoai = diemTK >= 5 ? 'Đạt' : 'Không đạt';
        return { diemTK: diemTK.toFixed(1), xepLoai };
    }

    // Hàm lưu dữ liệu điểm vào localStorage
    function saveScoreData() {
        localStorage.setItem('scoreData', JSON.stringify(scoreData));
        console.log("Đã lưu dữ liệu điểm.");
    }

    // Hàm điền dữ liệu sinh viên và môn học vào dropdown
function populateSelects() {
    const studentData = JSON.parse(localStorage.getItem('studentData')) || [];
    const subjectData = JSON.parse(localStorage.getItem('subjectData')) || [];
    
    const studentSelect = document.getElementById('maSVScore');
    const subjectSelect = document.getElementById('maMHScore');

    // Xóa các option cũ
    studentSelect.innerHTML = '<option value="">-- Chọn Sinh viên --</option>';
    subjectSelect.innerHTML = '<option value="">-- Chọn Môn học --</option>';

    // Thêm sinh viên vào dropdown
    studentData.forEach(student => {
        const option = document.createElement('option');
        option.value = student.maSV;
        option.textContent = `${student.maSV} - ${student.tenSV}`;
        option.setAttribute('data-name', student.tenSV);
        studentSelect.appendChild(option);
    });

    // Thêm môn học vào dropdown
    subjectData.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.maMonHoc;
        option.textContent = `${subject.maMonHoc} - ${subject.tenMonHoc}`;
        option.setAttribute('data-name', subject.tenMonHoc);
        subjectSelect.appendChild(option);
    });
}

    // Hàm render (hiển thị) bảng điểm
    function renderScoreTable(data = scoreData) {
        console.log("Đang render bảng điểm với dữ liệu:", data);
        const tbody = document.querySelector('#scoreTable tbody');
        if (!tbody) {
            console.error("Không tìm thấy tbody của bảng điểm.");
            return;
        }

        tbody.innerHTML = ''; // Xóa các hàng cũ

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center;">Không có dữ liệu điểm</td></tr>`;
            return;
        }

        data.forEach((score, index) => {
            const { diemTK, xepLoai } = calculateFinalScore(score.diemGK, score.diemThi);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${score.maSV}</td>
                <td>${score.tenSV}</td>
                <td>${score.maMH}</td>
                <td>${score.tenMH}</td>
                <td>${score.diemGK}</td>
                <td>${score.diemThi}</td>
                <td>${diemTK}</td>
                <td class="${xepLoai === 'Đạt' ? 'pass' : 'fail'}">${xepLoai}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="openScoreModal(true, ${index})">
                        <i class='bx bx-edit'></i> Sửa
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteScore(${index})">
                        <i class='bx bx-trash-alt'></i> Xóa
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Xử lý tìm kiếm điểm
    const searchInput = document.getElementById('searchScore');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const filteredData = scoreData.filter(score =>
                score.maSV.toLowerCase().includes(searchTerm) ||
                score.tenSV.toLowerCase().includes(searchTerm) ||
                score.maMH.toLowerCase().includes(searchTerm) ||
                score.tenMH.toLowerCase().includes(searchTerm)
            );
            renderScoreTable(filteredData);
        });
    }

    // Hàm mở modal thêm/sửa điểm
    window.openScoreModal = function(isEdit = false, index = -1) {
        console.log(`Mở modal điểm ${isEdit ? 'sửa' : 'thêm'} với index:`, index);
        const modal = document.getElementById('scoreModal');
        if (!modal) {
            console.error("Không tìm thấy modal điểm.");
            return;
        }

        document.getElementById('scoreModalTitle').textContent = isEdit ? 'Sửa Điểm' : 'Thêm Điểm';
        populateSelects(); // Điền lại dropdown sinh viên/môn học

        if (isEdit && index >= 0 && index < scoreData.length) {
            const score = scoreData[index];
            document.getElementById('maSVScore').value = score.maSV;
            document.getElementById('maMHScore').value = score.maMH;
            document.getElementById('diemGK').value = score.diemQT;
            document.getElementById('diemThi').value = score.diemThi;
            document.getElementById('editingScoreRowIndex').value = index;
        } else {
            document.getElementById('scoreForm').reset();
            document.getElementById('editingScoreRowIndex').value = '';
        }

        modal.style.display = 'flex';
    };

    // Hàm đóng modal điểm
    window.closeScoreModal = function() {
        const modal = document.getElementById('scoreModal');
        if (modal) modal.style.display = 'none';
    };

    // Hàm xóa điểm
    window.deleteScore = function(index) {
        if (confirm("Bạn có chắc muốn xóa điểm này?")) {
            scoreData.splice(index, 1);
            saveScoreData();
            renderScoreTable();
        }
    };

    // Xử lý submit form thêm/sửa điểm
    const form = document.getElementById('scoreForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const maSV = document.getElementById('maSVScore').value;
            const tenSV = document.querySelector('#maSVScore option:checked').getAttribute('data-name');
            const maMH = document.getElementById('maMHScore').value;
            const tenMH = document.querySelector('#maMHScore option:checked').getAttribute('data-name');
            const diemGK = parseFloat(document.getElementById('diemGK').value);
            const diemThi = parseFloat(document.getElementById('diemThi').value);
            const index = document.getElementById('editingScoreRowIndex').value;

            if (!maSV || !maMH || isNaN(diemGK) || isNaN(diemThi)) {
                alert('Vui lòng nhập đầy đủ thông tin.');
                return;
            }

            if (diemGK < 0 || diemGK > 10 || diemThi < 0 || diemThi > 10) {
                alert('Điểm phải từ 0 đến 10.');
                return;
            }

            const newScore = {
                maSV, tenSV, maMH, tenMH, diemGK, diemThi
            };

            if (index !== '') {
                // Sửa điểm
                scoreData[index] = newScore;
            } else {
                // Thêm điểm mới - kiểm tra trùng (mã SV + mã MH)
                const exists = scoreData.some(s => s.maSV === maSV && s.maMH === maMH);
                if (exists) {
                    alert('Sinh viên đã có điểm môn học này. Vui lòng chọn sửa điểm thay vì thêm mới.');
                    return;
                }
                scoreData.push(newScore);
            }

            saveScoreData();
            renderScoreTable();
            closeScoreModal();
        });
    }

    // Đóng modal khi click ra ngoài nội dung modal
    document.getElementById('scoreModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeScoreModal();
        }
    });

    // Khởi tạo ban đầu
    renderScoreTable();
}

// --- Quản lý Điểm Danh ---
function initAttendanceManagement() {
    console.log("Đang khởi tạo quản lý điểm danh...");

    // Khởi tạo dữ liệu điểm danh
    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];
    let classData = JSON.parse(localStorage.getItem('classData')) || [];
    let studentData = JSON.parse(localStorage.getItem('studentData')) || [];

    // Hàm lưu dữ liệu
    function saveAttendanceData() {
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    }

    // Hàm điền select lớp
    function populateClassSelect(selectElement) {
        selectElement.innerHTML = '<option value="">-- Chọn Lớp --</option>';
        classData.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.maClass;
            option.textContent = cls.tenClass;
            selectElement.appendChild(option);
        });
    }

    // Hàm điền select sinh viên theo lớp
        document.getElementById('attendanceStudent').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const classId = document.getElementById('attendanceClass').value;
        const suggestions = document.getElementById('studentSuggestions');
        
        suggestions.innerHTML = '';
        
        if (!searchTerm || !classId) {
            suggestions.style.display = 'none';
            return;
        }
        
        const studentData = JSON.parse(localStorage.getItem('studentData')) || [];
        const filteredStudents = studentData.filter(student => 
            student.lopSV === classId && 
            (student.tenSV.toLowerCase().includes(searchTerm) || 
             student.maSV.toLowerCase().includes(searchTerm))
        );
        
        if (filteredStudents.length === 0) {
            const noResult = document.createElement('div');
            noResult.textContent = 'Không tìm thấy sinh viên';
            suggestions.appendChild(noResult);
        } else {
            filteredStudents.forEach(student => {
                const option = document.createElement('div');
                option.textContent = `${student.maSV} - ${student.tenSV}`;
                option.setAttribute('data-id', student.maSV);
                option.setAttribute('data-name', student.tenSV);
                option.addEventListener('click', function() {
                    document.getElementById('attendanceStudent').value = `${student.maSV} - ${student.tenSV}`;
                    document.getElementById('attendanceStudent').setAttribute('data-id', student.maSV);
                    suggestions.style.display = 'none';
                });
                suggestions.appendChild(option);
            });
        }
        
        suggestions.style.display = filteredStudents.length > 0 ? 'block' : 'none';
    });

        document.addEventListener('click', function(e) {
        if (e.target.id !== 'attendanceStudent') {
            document.getElementById('studentSuggestions').style.display = 'none';
        }
    });
    
    // Hàm hiển thị bảng điểm danh
    function renderAttendanceTable(filterDate = '', filterClass = '') {
        const tbody = document.querySelector('#attendanceTable tbody');
        tbody.innerHTML = '';

        let filteredData = attendanceData;
        
        if (filterDate) {
            filteredData = filteredData.filter(a => a.date === filterDate);
        }
        
        if (filterClass) {
            filteredData = filteredData.filter(a => a.classId === filterClass);
        }

        if (filteredData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center;">Không có dữ liệu điểm danh</td></tr>`;
            return;
        }

        filteredData.forEach((record, index) => {
            const student = studentData.find(s => s.maSV === record.studentId) || {};
            const classInfo = classData.find(c => c.maClass === record.classId) || {};
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(record.date)}</td>
                <td>${classInfo.tenClass || record.classId}</td>
                <td>${record.studentId}</td>
                <td>${student.tenSV || record.studentId}</td>
                <td class="attendance-status ${getStatusClass(record.status)}">
                    ${getStatusText(record.status)}
                </td>
                <td>${record.note || ''}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn btn-edit" onclick="openAttendanceModal(true, '${record.id}')">
                            <i class='bx bx-edit'></i> Sửa
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteAttendanceRecord('${record.id}')">
                            <i class='bx bx-trash-alt'></i> Xóa
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Hàm hỗ trợ
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    }

    function getStatusText(status) {
        const statusMap = {
            present: 'Có mặt',
            absent: 'Vắng',
            late: 'Đi muộn'
        };
        return statusMap[status] || status;
    }

    function getStatusClass(status) {
        const classMap = {
            present: 'status-present-badge',
            absent: 'status-absent-badge',
            late: 'status-late-badge'
        };
        return classMap[status] || '';
    }

    // Hàm mở modal điểm danh
    window.openAttendanceModal = function(isEdit = false, recordId = '') {
        const modal = document.getElementById('attendanceModal');
        modal.style.display = 'flex';
        
        document.getElementById('attendanceModalTitle').textContent = 
            isEdit ? 'Sửa Điểm Danh' : 'Điểm Danh Sinh Viên';
        
        populateClassSelect(document.getElementById('attendanceClass'));
        document.getElementById('attendanceDate').valueAsDate = new Date();
        
        if (isEdit && recordId) {
            const record = attendanceData.find(a => a.id === recordId);
            if (record) {
                document.getElementById('attendanceDate').value = record.date;
                document.getElementById('attendanceClass').value = record.classId;
                populateStudentSelect(record.classId);
                setTimeout(() => {
                    document.getElementById('attendanceStudent').value = record.studentId;
                }, 100);
                document.querySelector(`input[name="attendanceStatus"][value="${record.status}"]`).checked = true;
                document.getElementById('attendanceNote').value = record.note || '';
                document.getElementById('editingAttendanceId').value = recordId;
            }
        } else {
            document.getElementById('attendanceForm').reset();
            document.getElementById('editingAttendanceId').value = '';
        }
    };

    // Hàm đóng modal
    window.closeAttendanceModal = function() {
        document.getElementById('attendanceModal').style.display = 'none';
    };

    // Hàm xóa bản ghi
    window.deleteAttendanceRecord = function(recordId) {
        if (confirm('Bạn có chắc muốn xóa bản ghi điểm danh này?')) {
            attendanceData = attendanceData.filter(a => a.id !== recordId);
            saveAttendanceData();
            renderAttendanceTable(
                document.getElementById('filterDate').value,
                document.getElementById('filterClass').value
            );
        }
    };

    // Sự kiện thay đổi lớp
    document.getElementById('attendanceClass').addEventListener('change', function() {
        populateStudentSelect(this.value);
    });

    // Sự kiện lọc
    document.getElementById('filterDate').addEventListener('change', function() {
        renderAttendanceTable(this.value, document.getElementById('filterClass').value);
    });

    document.getElementById('filterClass').addEventListener('change', function() {
        renderAttendanceTable(document.getElementById('filterDate').value, this.value);
    });

    // Điền select lọc lớp
    const filterClassSelect = document.getElementById('filterClass');
    if (filterClassSelect) {
        filterClassSelect.innerHTML = '<option value="">Tất cả lớp</option>';
        classData.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.maClass;
            option.textContent = cls.tenClass;
            filterClassSelect.appendChild(option);
        });
    }

    // Xử lý submit form
    document.getElementById('attendanceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const date = document.getElementById('attendanceDate').value;
        const classId = document.getElementById('attendanceClass').value;
        const studentInput = document.getElementById('attendanceStudent');
        const studentId = studentInput.getAttribute('data-id') || studentInput.value.split(' - ')[0];
        const studentName = studentInput.getAttribute('data-name') || studentInput.value.split(' - ')[1] || '';
        const status = document.querySelector('input[name="attendanceStatus"]:checked').value;
        const note = document.getElementById('attendanceNote').value;
        const recordId = document.getElementById('editingAttendanceId').value;
        
        if (!date || !classId || !studentId) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
            return;
        }
        
        const newRecord = {
            id: recordId || Date.now().toString(),
            date,
            classId,
            studentId,
            studentName,
            status,
            note,
            createdAt: new Date().toISOString()
        };
        
        if (recordId) {
            // Cập nhật
            const index = attendanceData.findIndex(a => a.id === recordId);
            if (index !== -1) {
                attendanceData[index] = newRecord;
            }
        } else {
            // Thêm mới
            attendanceData.push(newRecord);
        }
        
        saveAttendanceData();
        renderAttendanceTable(
            document.getElementById('filterDate').value,
            document.getElementById('filterClass').value
        );
        closeAttendanceModal();
    });

    // Khởi tạo ban đầu
    renderAttendanceTable();
}

    // --- Tải trang chủ mặc định ---
    loadContent("trangchu.html");
});

