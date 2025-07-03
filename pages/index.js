import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then(res => {
        setReports(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lab Reports</h1>
      {reports.length === 0 && <p>No reports found.</p>}
      <ul>
        {reports.map((r) => (
          <li key={r._id} style={{ marginBottom: '1rem' }}>
            <strong>{r.title}</strong><br />
            Faculty: {r.faculty} | Semester: {r.semester} | Subject: {r.subject}<br />
            <a href={`http://localhost:5000${r.fileUrl}`} target="_blank" rel="noopener noreferrer">Download Report</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
