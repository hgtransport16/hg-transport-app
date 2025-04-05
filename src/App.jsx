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
    <div className="flex">
      <div className="w-64 bg-gray-100 min-h-screen p-4 shadow-md">
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

      <div className="p-6 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{seccion}</h1>

        {seccion === "Agregar Chofer" && (
          <div className="mb-4 bg-white p-6 rounded shadow-md">
            {seccionesFormulario.map((seccion) => (
              <div key={seccion.titulo} className="mb-6">
                <h2 className="text-lg font-semibold mb-4 border-b pb-1">{seccion.titulo}</h2>
                <div className="space-y-4">
                  {seccion.campos.map((campo) => (
                    <div key={campo} className="flex items-center">
                      <label className="w-1/3 text-right font-medium pr-4">{(etiquetas[campo] || campo) + ':'}</label>
                      <div className="w-2/3">
                        <input
                          type={campo.toLowerCase().includes("fecha") ? "date" : "text"}
                          value={chofer[campo]}
                          onChange={(e) => setChofer({ ...chofer, [campo]: e.target.value })}
                          className="w-full border border-gray-300 p-2 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {error && <p className="text-red-600 text-sm my-4">{error}</p>}
            <div className="text-center">
              <button
                onClick={agregarChofer}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
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
