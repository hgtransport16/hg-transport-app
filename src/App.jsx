// Demo sin base de datos - Sistema para HG Transport LLC con Menú lateral y submenú para choferes

import React, { useState } from "react";
import jsPDF from "jspdf";
import { ChevronDown, ChevronUp } from "lucide-react";

const menuItems = [
  { label: "Inicio" },
  {
    label: "Choferes",
    subItems: ["Agregar Chofer", "Editar Chofer", "Eliminar Chofer"]
  },
  { label: "Cargas Semanales" },
  { label: "Gastos" },
  { label: "Reportes" }
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

  const toggleSubmenu = (label) => {
    setSubmenuAbierto(submenuAbierto === label ? null : label);
  };

  const agregarChofer = () => {
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

  const eliminarChofer = (index) => {
    const nuevos = choferes.filter((_, i) => i !== index);
    setChoferes(nuevos);
  };

  const seleccionarChofer = (index) => {
    setChofer(choferes[index]);
    setEditarIndex(index);
    setSeccion("Agregar Chofer");
  };

  const agregarCarga = () => {
    setCargas([...cargas, { fecha: "", origen: "", destino: "", precio: 0, porcentaje: 0 }]);
  };

  const actualizarCarga = (index, campo, valor) => {
    const nuevasCargas = [...cargas];
    nuevasCargas[index][campo] = valor;
    setCargas(nuevasCargas);
  };

  const calcularGanancia = () => {
    const ingresos = cargas.reduce((sum, carga) => sum + Number(carga.precio || 0), 0);
    const totalDespacho = cargas.reduce(
      (sum, carga) => sum + (Number(carga.precio || 0) * Number(carga.porcentaje || 0)) / 100,
      0
    );
    const totalGastos = Number(gastos.recurrentes) + Number(gastos.adicionales) + Number(gastos.combustible);
    const ganancia = ingresos - totalDespacho - totalGastos;
    return { ingresos, totalDespacho, totalGastos, ganancia };
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("HG Transport LLC - Driver Pay Report", 20, 20);
    doc.text(`Chofer: ${chofer.nombre}`, 20, 30);
    doc.text(`Licencia: ${chofer.licencia}`, 20, 40);
    doc.text(`Teléfono: ${chofer.telefono}`, 20, 50);
    doc.text(`Dirección: ${chofer.direccionNumeroCalle}, ${chofer.direccionCiudadEstadoZip}`, 20, 60);

    let y = 70;
    doc.setFontSize(12);
    cargas.forEach((carga, i) => {
      doc.text(`Carga ${i + 1}: ${carga.fecha}, ${carga.origen} - ${carga.destino}`, 20, y);
      y += 7;
      doc.text(`Precio: $${carga.precio} | Porcentaje Despacho: ${carga.porcentaje}%`, 20, y);
      y += 10;
    });

    doc.text(`Gastos Recurrentes: $${gastos.recurrentes}`, 20, y);
    y += 7;
    doc.text(`Gastos Adicionales: $${gastos.adicionales}`, 20, y);
    y += 7;
    doc.text(`Gastos Combustible: $${gastos.combustible}`, 20, y);
    y += 10;

    const { ingresos, totalDespacho, totalGastos, ganancia } = calcularGanancia();
    doc.text(`Total Ingresos: $${ingresos.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Total Despacho: $${totalDespacho.toFixed(2)}`, 20, y);
    y += 7;
    doc.text(`Total Gastos: $${totalGastos.toFixed(2)}`, 20, y);
    y += 7;
    doc.setFontSize(14);
    doc.text(`Ganancia Semanal: $${ganancia.toFixed(2)}`, 20, y + 10);

    doc.save("reporte_semanal.pdf");
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-200 min-h-screen p-4">
        <h1 className="text-xl font-bold mb-4">HG Transport</h1>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label} className="mb-2">
              {!item.subItems ? (
                <button onClick={() => setSeccion(item.label)} className="text-left w-full">
                  {item.label}
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex justify-between items-center w-full text-left font-semibold mb-1"
                  >
                    {item.label} {submenuAbierto === item.label ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {submenuAbierto === item.label && (
                    <ul className="ml-4">
                      {item.subItems.map((sub) => (
                        <li key={sub} className="mb-1">
                          <button onClick={() => setSeccion(sub)} className="text-left w-full text-sm">
                            {sub}
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
      <div className="p-4 max-w-3xl mx-auto flex-1">
        <h1 className="text-xl font-bold mb-4">{seccion}</h1>

        {seccion === "Agregar Chofer" && (
          <div className="mb-4">
            {Object.keys(chofer).map((campo) => (
              <input
                key={campo}
                placeholder={campo}
                value={chofer[campo]}
                onChange={(e) => setChofer({ ...chofer, [campo]: e.target.value })}
                className="border p-1 w-full my-1"
              />
            ))}
            <button onClick={agregarChofer} className="bg-blue-600 text-white px-4 py-2 rounded">
              {editarIndex !== null ? "Actualizar Chofer" : "Guardar Chofer"}
            </button>
          </div>
        )}

        {seccion === "Editar Chofer" && (
          <div>
            {choferes.map((c, i) => (
              <div key={i} className="border p-2 my-2">
                <p>{c.nombre}</p>
                <button onClick={() => seleccionarChofer(i)} className="text-sm text-blue-600">Editar</button>
              </div>
            ))}
          </div>
        )}

        {seccion === "Eliminar Chofer" && (
          <div>
            {choferes.map((c, i) => (
              <div key={i} className="border p-2 my-2">
                <p>{c.nombre}</p>
                <button onClick={() => eliminarChofer(i)} className="text-sm text-red-600">Eliminar</button>
              </div>
            ))}
          </div>
        )}

        {seccion === "Cargas Semanales" && (
          <div className="mb-4">
            {cargas.map((carga, index) => (
              <div key={index} className="mb-2 border p-2">
                {Object.keys(carga).map((campo) => (
                  <input
                    key={campo}
                    placeholder={campo}
                    value={carga[campo]}
                    onChange={(e) => actualizarCarga(index, campo, e.target.value)}
                    className="border p-1 w-full my-1"
                  />
                ))}
              </div>
            ))}
            <button onClick={agregarCarga} className="bg-blue-500 text-white px-2 py-1 rounded">Agregar Carga</button>
          </div>
        )}

        {seccion === "Gastos" && (
          <div className="mb-4">
            {Object.keys(gastos).map((tipo) => (
              <input
                key={tipo}
                placeholder={tipo}
                value={gastos[tipo]}
                onChange={(e) => setGastos({ ...gastos, [tipo]: e.target.value })}
                className="border p-1 w-full my-1"
              />
            ))}
          </div>
        )}

        {seccion === "Reportes" && (
          <button onClick={generarPDF} className="bg-green-600 text-white px-4 py-2 rounded">Generar PDF</button>
        )}
      </div>
    </div>
  );
}
