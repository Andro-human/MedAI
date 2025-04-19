import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserMd,
  FaUser,
  FaCalendarCheck,
  FaChartLine,
  FaUserPlus,
  FaStethoscope,
} from "react-icons/fa";
import {
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
  Cell,
} from "recharts";

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
    userActivityByDay: [],
  });
  const [loading, setLoading] = useState(true);

  // Transform appointment trend data from object to array format for charts
  const transformAppointmentTrend = (trendData) => {
    if (!trendData || typeof trendData !== "object") return [];

    // Convert object to array format required by Recharts
    return Object.entries(trendData)
      .map(([date, count]) => {
        // Format date for display (e.g., convert "2025-04-19" to "Apr 19")
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return {
          name: formattedDate,
          appointments: count,
        };
      })
      .reverse(); // Reverse to show oldest to newest
  };

  // Transform specialty data for pie chart if needed
  const transformSpecialtyData = (specialtyData) => {
    if (!specialtyData) {
      return [];
    }

    if (Array.isArray(specialtyData)) {
      if (specialtyData.length === 0) {
        return [];
      }

      if (
        specialtyData[0] &&
        specialtyData[0].name &&
        specialtyData[0].value !== undefined
      ) {
        return specialtyData;
      }

      return specialtyData.map((item) => {
        if (typeof item === "object") {
          return {
            name: item.specialty || item.name || "Unknown",
            value: item.count || item.value || 0,
          };
        }
        return { name: "Unknown", value: 0 };
      });
    }

    if (typeof specialtyData === "object") {
      return Object.entries(specialtyData).map(([specialty, count]) => ({
        name: specialty,
        value: count,
      }));
    }

    return [];
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}admin/get-analytics`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("data", data);
        if (data.success) {
          const appointmentTrendArray = transformAppointmentTrend(
            data?.analytics?.appointmentTrends
          );

          // Store current stats to use in placeholder data generation
          const currentStats = {
            totalUsers: data?.analytics?.totalCounts?.patients || 0,
            totalDoctors: data?.analytics?.totalCounts?.doctors || 0,
            totalAppointments: data?.analytics?.totalCounts?.appointments || 0,
          };

          // Update stats first with the basic data
          setStats((prev) => ({
            ...prev,
            ...currentStats,
            newUsersThisWeek: data?.analytics?.newThisWeek?.patients || 0,
            newDoctorsThisWeek: data?.analytics?.newThisWeek?.doctors || 0,
            appointmentsThisWeek:
              data?.analytics?.newThisWeek?.appointments || 0,
            appointmentTrend: appointmentTrendArray,
          }));

          // Then handle the specialty data
          let specialtyArray = [];

          if (Array.isArray(data?.analytics?.appointmentsBySpecialty)) {
            specialtyArray = transformSpecialtyData(
              data?.analytics?.appointmentsBySpecialty
            );
          } else if (
            typeof data?.analytics?.appointmentsBySpecialty === "object" &&
            data?.analytics?.appointmentsBySpecialty !== null
          ) {
            // Handle if it's a non-array object
            specialtyArray = Object.entries(
              data?.analytics?.appointmentsBySpecialty
            ).map(([key, value]) => ({
              name: key,
              value: value,
            }));
          }

          // Update specialty data
          setStats((prev) => ({
            ...prev,
            appointmentsBySpecialty: specialtyArray,
          }));
        }
      } catch (error) {
        setStats({
          totalUsers: 0,
          totalDoctors: 0,
          totalAppointments: 0,
          newUsersThisWeek: 0,
          newDoctorsThisWeek: 0,
          appointmentsThisWeek: 0,
          appointmentsBySpecialty: [],
          appointmentTrend: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
  ];

  // Show placeholder message if there's no data
  const renderNoDataMessage = (title) => (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-gray-500 text-sm">
        No {title.toLowerCase()} data available
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 h-[92vh] flex flex-col p-4">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Platform performance metrics and insights
        </p>
      </div>

      <div className="flex-1 px-4 pb-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FaUser className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Patients</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {stats.totalUsers ? stats.totalUsers.toLocaleString() : 0}
                    </h3>
                    <p className="text-xs text-green-600">
                      <span className="font-medium">
                        +{stats.newUsersThisWeek || 0}
                      </span>{" "}
                      new this week
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <FaUserMd className="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Doctors</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {stats.totalDoctors
                        ? stats.totalDoctors.toLocaleString()
                        : 0}
                    </h3>
                    <p className="text-xs text-green-600">
                      <span className="font-medium">
                        +{stats.newDoctorsThisWeek || 0}
                      </span>{" "}
                      new this week
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FaCalendarCheck className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Appointments</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {stats.totalAppointments
                        ? stats.totalAppointments.toLocaleString()
                        : 0}
                    </h3>
                    <p className="text-xs text-green-600">
                      <span className="font-medium">
                        +{stats.appointmentsThisWeek || 0}
                      </span>{" "}
                      this week
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Appointments Trend Chart */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-800 mb-2">
                  Appointment Trends
                </h2>
                <div className="h-48 md:h-52 lg:h-56">
                  {stats.appointmentTrend.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stats.appointmentTrend}
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="appointments"
                          stroke="#4f46e5"
                          activeDot={{ r: 6 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    renderNoDataMessage("Appointment Trends")
                  )}
                </div>
              </div>

              {/* Appointments by Specialty Chart */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="text-base font-semibold text-gray-800 mb-2">
                  Appointments by Specialty
                </h2>
                <div className="h-48 md:h-52 lg:h-56">
                  {stats.appointmentsBySpecialty &&
                  stats.appointmentsBySpecialty.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.appointmentsBySpecialty}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value, percent }) =>
                            value > 0
                              ? `${name}: ${(percent * 100).toFixed(0)}%`
                              : ""
                          }
                        >
                          {stats.appointmentsBySpecialty.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} appointments`, ""]}
                        />
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{ fontSize: "12px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-gray-500 text-sm">
                        No specialty data available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* New Patients Metric */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-sm">
                    New Patients
                  </h3>
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <FaUserPlus className="text-blue-600 text-xs" />
                  </div>
                </div>
                <div className="flex items-end">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {stats.newUsersThisWeek || 0}
                  </h4>
                  <p className="text-xs text-gray-500 ml-2 mb-1">this week</p>
                </div>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        stats.totalUsers
                          ? (stats.newUsersThisWeek / stats.totalUsers) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* New Doctors Metric */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-sm">
                    New Doctors
                  </h3>
                  <div className="bg-purple-100 p-1.5 rounded-full">
                    <FaStethoscope className="text-purple-600 text-xs" />
                  </div>
                </div>
                <div className="flex items-end">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {stats.newDoctorsThisWeek || 0}
                  </h4>
                  <p className="text-xs text-gray-500 ml-2 mb-1">this week</p>
                </div>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        stats.totalDoctors
                          ? (stats.newDoctorsThisWeek / stats.totalDoctors) *
                              100
                          : 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Appointment Completion Metric */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-sm">
                    Weekly Appointments
                  </h3>
                  <div className="bg-green-100 p-1.5 rounded-full">
                    <FaChartLine className="text-green-600 text-xs" />
                  </div>
                </div>
                <div className="flex items-end">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {stats.appointmentsThisWeek || 0}
                  </h4>
                  <p className="text-xs text-gray-500 ml-2 mb-1">
                    appointments
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        stats.totalAppointments
                          ? (stats.appointmentsThisWeek /
                              stats.totalAppointments) *
                              100
                          : 0,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
