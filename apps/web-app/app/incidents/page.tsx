'use client';

import { useEffect, useState } from 'react';

type Incident = {
  id: number;
  title: string;
  description: string;
  location: string;
  status: string;
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const loadIncidents = () => {
    fetch('http://localhost:3020/incidents')
      .then((res) => res.json())
      .then((data) => setIncidents(data));
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const createIncident = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('http://localhost:3020/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, location }),
    });

    setTitle('');
    setDescription('');
    setLocation('');
    loadIncidents();
  };

  return (
    <main style={{ padding: 30, fontFamily: 'Arial' }}>
      <h1>Gestión de Incidentes</h1>

      <form onSubmit={createIncident} style={{ marginBottom: 25 }}>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: 10, padding: 8 }}
        />

        <input
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: 10, padding: 8 }}
        />

        <input
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ marginRight: 10, padding: 8 }}
        />

        <button type="submit" style={{ padding: 8 }}>
          Crear incidente
        </button>
      </form>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#111',
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Título</th>
            <th style={thStyle}>Descripción</th>
            <th style={thStyle}>Ubicación</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td style={tdStyle}>{incident.id}</td>
              <td style={tdStyle}>{incident.title}</td>
              <td style={tdStyle}>{incident.description}</td>
              <td style={tdStyle}>{incident.location}</td>
              <td style={tdStyle}>{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const thStyle = {
  border: '1px solid #444',
  padding: 10,
  textAlign: 'left' as const,
  background: '#222',
};

const tdStyle = {
  border: '1px solid #444',
  padding: 10,
};