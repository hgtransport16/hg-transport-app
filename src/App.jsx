// Demo sin base de datos - Sistema para HG Transport LLC

import React, { useState } from "react";
import jsPDF from "jspdf";

export default function App() {
  const [chofer, setChofer] = useState({ nombre: "", licencia: "", telefono: "", direccion: "" });
  const [cargas, setCargas] = useState([]);
  const [gastos, setGastos] = useState({ recurrentes: 0, adicionales: 0, combustible: 0 });

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
    doc.text("HG Transport LLC - Reporte Semanal", 20, 20);
    doc.text(`Chofer: ${chofer.nombre}`, 20, 30);
    doc.text(`Licencia: ${chofer.licencia}`, 20, 40);
    doc.text(`Teléfono: ${chofer.telefono}`, 20, 50);
    doc.text(`Dirección: ${chofer.direccion}`, 20, 60);

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
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">HG Transport - Demo</h1>

      <div className="mb-4">
        <h2 className="font-semibold">Datos del Chofer</h2>
        {Object.keys(chofer).map((campo) => (
          <input
            key={campo}
            placeholder={campo}
            value={chofer[campo]}
            onChange={(e) => setChofer({ ...chofer, [campo]: e.target.value })}
            className="border p-1 w-full my-1"
          />
        ))}
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Cargas Semanales</h2>
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

      <div className="mb-4">
        <h2 className="font-semibold">Gastos</h2>
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

      <button onClick={generarPDF} className="bg-green-600 text-white px-4 py-2 rounded">Generar PDF</button>
    </div>
  );
}
