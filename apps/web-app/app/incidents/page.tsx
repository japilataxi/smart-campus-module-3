'use client';

import { useEffect, useState } from 'react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3020/incidents')
      .then((res) => res.json())
      .then((data) => setIncidents(data));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Gestión de Incidentes</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td>{incident.title}</td>
              <td>{incident.description}</td>
              <td>{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}