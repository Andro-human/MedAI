import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUserMd, 
  FaUser, 
  FaCalendarCheck, 
  FaChartLine, 
  FaUserPlus,
  FaStethoscope
} from 'react-icons/fa';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function Analytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    newUsersThisWeek: 0,
    newDoctorsThisWeek: 0,
    appointmentsThisWeek: 0,
    appointmentsBySpecialty: [],
    appointmentTrend: [],
    userActivityByDay: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}admin/analytics?timeRange=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        // For demo purposes, let's use dummy data if API fails
        setStats({
          totalUsers: 1876,
          totalDoctors: 145,
          totalAppointments: 3542,
          newUsersThisWeek: 127,
          newDoctorsThisWeek: 8,
          appointmentsThisWeek: 428,
          revenueThisMonth: 24680,
          appointmentsBySpecialty: [
            { name: 'Cardiology', value: 86 },
            { name: 'Dermatology', value: 74 },
            { name: 'Orthopedics', value: 125 },
            { name: 'Neurology', value: 62 },
            { name: 'Gynecology', value: 98 },
            { name: 'ENT specialist', value: 51 },
            { name: 'Others', value: 112 }
          ],
          appointmentTrend: [
            { name: 'Mon', appointments: 42 },
            { name: 'Tue', appointments: 56 },
            { name: 'Wed', appointments: 48 },
            { name: 'Thu', appointments: 71 },
            { name: 'Fri', appointments: 89 },
            { name: 'Sat', appointments: 65 },
            { name: 'Sun', appointments: 57 }
          ],
          userActivityByDay: [
            { name: 'Mon', users: 86 },
            { name: 'Tue', users: 92 },
            { name: 'Wed', users: 78 },
            { name: 'Thu', users: 94 },
            { name: 'Fri', users: 112 },
            { name: 'Sat', users: 136 },
            { name: 'Sun', users: 98 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">View your platform's performance metrics and insights</p>
        
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            This Week
          </button>
          <button 
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            This Month
          </button>
          <button 
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              timeRange === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            This Year
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Patients</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</h3>
                  <p className="text-sm text-green-600">
                    <span className="font-medium">+{stats.newUsersThisWeek}</span> new this week
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <FaUserMd className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Doctors</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalDoctors.toLocaleString()}</h3>
                  <p className="text-sm text-green-600">
                    <span className="font-medium">+{stats.newDoctorsThisWeek}</span> new this week
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FaCalendarCheck className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Appointments</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalAppointments.toLocaleString()}</h3>
                  <p className="text-sm text-green-600">
                    <span className="font-medium">+{stats.appointmentsThisWeek}</span> this week
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* First Row of Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Appointments Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.appointmentTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#4f46e5" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Appointments by Specialty Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointments by Specialty</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.appointmentsBySpecialty}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.appointmentsBySpecialty.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Second Row of Charts */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* User Activity Heatmap */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Activity by Day</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.userActivityByDay}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
                    <Legend />
                    <Bar dataKey="users" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* New Patients Metric */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">New Patients</h3>
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUserPlus className="text-blue-600" />
                </div>
              </div>
              <div className="flex items-end">
                <h4 className="text-3xl font-bold text-gray-800">{stats.newUsersThisWeek}</h4>
                <p className="text-sm text-gray-500 ml-2 mb-1">this week</p>
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min((stats.newUsersThisWeek / stats.totalUsers) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* New Doctors Metric */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">New Doctors</h3>
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaStethoscope className="text-purple-600" />
                </div>
              </div>
              <div className="flex items-end">
                <h4 className="text-3xl font-bold text-gray-800">{stats.newDoctorsThisWeek}</h4>
                <p className="text-sm text-gray-500 ml-2 mb-1">this week</p>
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full" 
                  style={{ width: `${Math.min((stats.newDoctorsThisWeek / stats.totalDoctors) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Appointment Completion Metric */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">Weekly Appointments</h3>
                <div className="bg-green-100 p-2 rounded-full">
                  <FaChartLine className="text-green-600" />
                </div>
              </div>
              <div className="flex items-end">
                <h4 className="text-3xl font-bold text-gray-800">{stats.appointmentsThisWeek}</h4>
                <p className="text-sm text-gray-500 ml-2 mb-1">appointments</p>
              </div>
              <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${Math.min((stats.appointmentsThisWeek / stats.totalAppointments) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics; 