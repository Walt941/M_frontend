import { Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useAuthGuard } from "../hooks/useAuthGuard"
import { useAuthStore } from "../stores/authStore"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import toast from "react-hot-toast"
import { SessionData, StatsData } from "../types/type"
import useApiRequest from "../hooks/useApiRequest"

const TypingProgressPage = () => {
  const { userData } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [sessions, setSessions] = useState<SessionData[]>([])
  const { makeRequest, isLoading } = useApiRequest()
  
  useAuthGuard()

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        await makeRequest({
          url: `/users/${userData?.id}/progress`,
          method: 'get',
          params: { limit: 10 },
          onSuccess: (data: { stats: StatsData; sessions: SessionData[] }) => {
            setStats(data.stats)
            setSessions(data.sessions)
          },
          onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?.message || 
                              'Error al obtener los datos de progreso'
            setError(errorMessage)
            toast.error(errorMessage)
          }
        })
      } catch (err) {
        const errorMessage = err instanceof AxiosError 
          ? (err.response?.data as { message?: string })?.message || 'Error al obtener los datos de progreso'
          : 'Error desconocido'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    }

    if (userData?.id) {
      fetchProgressData()
    }
  }, [userData?.id, makeRequest])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  if (!stats || !sessions.length) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Información: </strong>
          <span className="block sm:inline">No hay datos de progreso disponibles</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">
        Bienvenido <span className="font-bold text-blue-600">{userData?.username}</span> a tu Progreso
      </h1>
      
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500">Precisión promedio</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.precisionPromedio}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500">Errores totales</h3>
          <p className="text-2xl font-bold text-red-600">{stats.erroresTotales}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500">Mejor precisión</h3>
          <p className="text-2xl font-bold text-green-600">{stats.mejorPrecision}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-500">Sesiones totales</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.totalSesiones}</p>
        </div>
      </div>

     
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Precisión (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="fecha" stroke="#888" />
                <YAxis domain={[0, 100]} stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="precision" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

       
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Errores por Sesión</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="fecha" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar 
                  dataKey="detalles.erroresEnSesion" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Historial de Sesiones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fecha</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Precisión</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Errores</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Letras</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{session.fecha}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.precision >= 95 ? 'bg-green-100 text-green-800' :
                      session.precision >= 90 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.precision}%
                    </span>
                  </td>
                  <td className="py-3 px-4">{session.detalles.erroresEnSesion}</td>
                  <td className="py-3 px-4">{session.detalles.letrasEnSesion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TypingProgressPage