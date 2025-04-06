// Demo sin base de datos - Sistema para HG Transport LLC con Menú lateral y submenú para choferes

import React, { useState } from "react";
import jsPDF from "jspdf";
import {
  ChevronDown,
  ChevronUp,
  Home,
  Truck,
  UserPlus,
  Users,
  UserMinus,
  Package,
  Fuel,
  FileText
} from "lucide-react";

const menuItems = [
  { label: "Inicio", icon: <Home size={16} /> },
  {
    label: "Choferes",
    icon: <Users size={16} />,
    subItems: [
      { label: "Agregar Chofer", icon: <UserPlus size={14} /> },
      { label: "Editar Chofer", icon: <Users size={14} /> },
      { label: "Eliminar Chofer", icon: <UserMinus size={14} /> },
    ]
  },
  { label: "Cargas Semanales", icon: <Package size={16} /> },
  { label: "Gastos", icon: <Fuel size={16} /> },
  { label: "Reportes", icon: <FileText size={16} /> }
];

const etiquetas = {
  nombre: "Nombre del Chofer",
  licencia: "Número de Licencia",
  telefono: "Teléfono",
  direccionNumeroCalle: "Calle y Número",
  direccionCiudadEstadoZip: "Ciudad, Estado y Código Postal",
  email: "Correo Electrónico",
  fechaNacimiento: "Fecha de Nacimiento",
  fechaContratacion: "Fecha de Contratación",
  ssn: "Número de Seguro Social (SSN)",
  foto: "Foto (URL o archivo)",
  estado: "Estado del Chofer"
};

const seccionesFormulario = [
  {
    titulo: "Datos Personales",
    campos: ["nombre", "fechaNacimiento", "fechaContratacion", "ssn", "estado"]
  },
  {
    titulo: "Dirección y Contacto",
    campos: ["direccionNumeroCalle", "direccionCiudadEstadoZip", "telefono", "email"]
  },
  {
    titulo: "Documentación",
    campos: ["licencia", "foto"]
  }
];

export default function App() {
  const [chofer, setChofer] = useState({
    nombre: "",
    licencia: "",
    telefono: "",
    direccionNumeroCalle: "",
    direccionCiudadEstadoZip: "",
    email: "",
    fechaNacimiento: "",
    fechaContratacion: "",
    ssn: "",
    foto: "",
    estado: "activo",
  });
  const [choferes, setChoferes] = useState([]);
  const [cargas, setCargas] = useState([]);
  const [gastos, setGastos] = useState({ recurrentes: 0, adicionales: 0, combustible: 0 });
  const [seccion, setSeccion] = useState("Inicio");
  const [editarIndex, setEditarIndex] = useState(null);
  const [submenuAbierto, setSubmenuAbierto] = useState(null);
  const [error, setError] = useState("");

  const toggleSubmenu = (label) => {
    setSubmenuAbierto(submenuAbierto === label ? null : label);
  };

  const validarEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validarTelefono = (telefono) => /^\d{10}$/.test(telefono);
  const esFechaValida = (fecha) => /^\d{4}-\d{2}-\d{2}$/.test(fecha);

  const agregarChofer = () => {
    if (
      !chofer.nombre ||
      !chofer.licencia ||
      !chofer.telefono ||
      !chofer.direccionNumeroCalle ||
      !chofer.direccionCiudadEstadoZip ||
      !chofer.fechaNacimiento
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!validarTelefono(chofer.telefono)) {
      setError("El teléfono debe tener exactamente 10 dígitos.");
      return;
    }
    if (chofer.email && !validarEmail(chofer.email)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    if (!esFechaValida(chofer.fechaNacimiento)) {
      setError("La fecha de nacimiento debe tener el formato YYYY-MM-DD.");
      return;
    }

    setError("");
    if (editarIndex !== null) {
      const nuevos = [...choferes];
      nuevos[editarIndex] = chofer;
      setChoferes(nuevos);
      setEditarIndex(null);
    } else {
      setChoferes([...choferes, chofer]);
    }
    setChofer({
      nombre: "",
      licencia: "",
      telefono: "",
      direccionNumeroCalle: "",
      direccionCiudadEstadoZip: "",
      email: "",
      fechaNacimiento: "",
      fechaContratacion: "",
      ssn: "",
      foto: "",
      estado: "activo",
    });
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-64 bg-gray-100 p-4 shadow-md overflow-y-auto flex-shrink-0">
        <h1 className="text-2xl font-bold text-center mb-6">HG Transport</h1>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label} className="mb-2">
              {!item.subItems ? (
                <button
                  onClick={() => setSeccion(item.label)}
                  className="text-left w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-300 rounded"
                >
                  {item.icon} {item.label}
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex justify-between items-center w-full text-left font-semibold px-3 py-2 hover:bg-gray-300 rounded"
                  >
                    <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                    {submenuAbierto === item.label ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {submenuAbierto === item.label && (
                    <ul className="ml-4 mt-1">
                      {item.subItems.map((sub) => (
                        <li key={sub.label} className="mb-1">
                          <button
                            onClick={() => setSeccion(sub.label)}
                            className="text-left w-full text-sm flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded"
                          >
                            {sub.icon} {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 ml-6 px-10 py-6 bg-white overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">{seccion}</h1>

        {seccion === "Inicio" && (
          <div className="space-y-6">
            <p className="text-lg">Bienvenido a HG Transport. Desde aquí puedes gestionar a tus choferes, registrar cargas, llevar control de gastos y generar reportes.</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-100 p-4 rounded shadow">
                <p className="font-semibold">Choferes registrados:</p>
                <p className="text-2xl">{choferes.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow">
                <p className="font-semibold">Cargas esta semana:</p>
                <p className="text-2xl">{cargas.length}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow">
                <p className="font-semibold">Total gastos:</p>
                <p className="text-2xl">${gastos.recurrentes + gastos.adicionales + gastos.combustible}</p>
              </div>
            </div>

            <div className="space-x-4">
              <button onClick={() => setSeccion("Agregar Chofer")} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Agregar Chofer</button>
              <button onClick={() => setSeccion("Cargas Semanales")} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Registrar Carga</button>
              <button onClick={() => setSeccion("Reportes")} className="bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800">Ver Reporte</button>
            </div>
          </div>
        )}

        {seccion === "Agregar Chofer" && (
          <div className="bg-gray-50 p-6 rounded shadow-md space-y-6">
            {seccionesFormulario.map((seccionForm) => (
              <div key={seccionForm.titulo} className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-1">{seccionForm.titulo}</h2>
                {seccionForm.campos.map((campo) => (
                  <div key={campo} className="flex items-center">
                    <label className="w-1/3 text-right pr-4 font-medium">{etiquetas[campo]}:</label>
                    <input
                      type={campo.toLowerCase().includes("fecha") ? "date" : "text"}
                      value={chofer[campo]}
                      onChange={(e) => setChofer({ ...chofer, [campo]: e.target.value })}
                      className="w-2/3 border border-gray-300 p-2 rounded"
                    />
                  </div>
                ))}
              </div>
            ))}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="text-center">
              <button
                onClick={agregarChofer}
                className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
              >
                {editarIndex !== null ? "Actualizar Chofer" : "Guardar Chofer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
