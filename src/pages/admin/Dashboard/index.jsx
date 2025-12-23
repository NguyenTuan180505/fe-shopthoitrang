import { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClientUser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Dashboard = () => {
    // State lưu dữ liệu
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Gọi song song các API
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    axiosClient.get('/orders'),
                    axiosClient.get('/products'),
                    axiosClient.get('/users')
                ]);

                const orders = ordersRes.data || [];
                const products = productsRes.data || [];
                const users = usersRes.data || [];

                // 1. Tính tổng số liệu
                const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

                setStats({
                    totalRevenue: totalRevenue,
                    totalOrders: orders.length,
                    totalProducts: products.length,
                    totalUsers: users.length
                });

                // 2. Xử lý dữ liệu biểu đồ (Gom nhóm theo tháng)
                const revenueByMonth = {};
                orders.forEach(order => {
                    const date = new Date(order.orderDate);
                    const monthKey = `Tháng ${date.getMonth() + 1}`;
                    if (!revenueByMonth[monthKey]) revenueByMonth[monthKey] = 0;
                    revenueByMonth[monthKey] += order.totalAmount;
                });

                const dynamicChartData = Object.keys(revenueByMonth).map(key => ({
                    name: key,
                    revenue: revenueByMonth[key]
                }));

                setChartData(dynamicChartData.length > 0 ? dynamicChartData : [{ name: 'Chưa có dữ liệu', revenue: 0 }]);

            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-4 bg-light" style={{ minHeight: '100%' }}>
            
            {/* 1. HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-primary mb-1">
                        <i className="bi bi-speedometer2 me-2"></i>DASHBOARD
                    </h3>
                    <p className="text-muted mb-0">Tổng quan tình hình kinh doanh của cửa hàng</p>
                </div>
            </div>

            {/* 2. Doanh thu*/}
            <div className="row g-4 mb-4">
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-success">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                                    <i className="bi bi-currency-dollar fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted text-uppercase small fw-bold mb-1">Tổng Doanh Thu</h6>
                                    <h4 className="fw-bold text-success mb-0">{formatCurrency(stats.totalRevenue)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Người dùng */}
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-info">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3 text-info">
                                    <i className="bi bi-people fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted text-uppercase small fw-bold mb-1">Khách Hàng</h6>
                                    <h4 className="fw-bold text-dark mb-0">{stats.totalUsers}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sản phẩm */}
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                                    <i className="bi bi-box-seam fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted text-uppercase small fw-bold mb-1">Sản Phẩm</h6>
                                    <h4 className="fw-bold text-dark mb-0">{stats.totalProducts}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Đơn hàng */}
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-primary">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                                    <i className="bi bi-cart-check fs-3"></i>
                                </div>
                                <div>
                                    <h6 className="text-muted text-uppercase small fw-bold mb-1">Tổng Đơn Hàng</h6>
                                    <h4 className="fw-bold text-dark mb-0">{stats.totalOrders}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT*/}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">
                                <i className="bi bi-graph-up me-2"></i>Biểu đồ tăng trưởng
                            </h6>
                            <select className="form-select form-select-sm w-auto">
                                <option>Năm nay</option>
                                <option>Tháng này</option>
                            </select>
                        </div>
                        <div className="card-body">
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4e73df" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#4e73df" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e6f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#858796'}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#858796'}} tickFormatter={(value) => new Intl.NumberFormat('en', {notation: "compact"}).format(value)} />
                                        <Tooltip 
                                            formatter={(value) => formatCurrency(value)}
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)'}} 
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#4e73df" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cổng thanh toán */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                            <h6 className="m-0 font-weight-bold text-primary">
                                <i className="bi bi-credit-card-2-front me-2"></i>Cổng Thanh Toán
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4 py-3 bg-light rounded-3">
                                <i className="bi bi-wallet2 text-primary display-4"></i>
                                <p className="text-muted mt-2 mb-0 fw-semibold">Payment Gateway Integration</p>
                            </div>
                            
                            <div className="d-grid gap-3">
                                <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-qr-code-scan fs-4 text-primary me-3"></i>
                                        <div>
                                            <div className="fw-bold text-dark">VNPay QR</div>
                                            <small className="text-success"><i className="bi bi-check-circle-fill me-1"></i>Đã kết nối</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm btn-outline-primary rounded-pill">Cấu hình</button>
                                </div>

                                <div className="p-3 border rounded-3 d-flex justify-content-between align-items-center opacity-75">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-phone fs-4 text-danger me-3"></i>
                                        <div>
                                            <div className="fw-bold text-dark">MoMo Wallet</div>
                                            <small className="text-muted">Chưa kết nối</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm btn-outline-secondary rounded-pill">Kết nối</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;