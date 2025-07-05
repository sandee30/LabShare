import { useState } from 'react';
import { storage } from '../lib/firebaseClient';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '',
    faculty: '',
    semester: '',
    subject: '',
    topic: '',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    setUploading(true);
    const fileRef = ref(storage, `reports/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error(error);
        setMessage("Upload failed");
        setUploading(false);
      },
      async () => {
        const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Now send metadata + fileUrl to your backend
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reports/upload`, {
            ...form,
            fileUrl,
          });
          setMessage("Report uploaded successfully!");
          setForm({ title: '', faculty: '', semester: '', subject: '', topic: '' });
          setFile(null);
        } catch (err) {
          console.error(err);
          setMessage("Failed to save metadata.");
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Upload Lab Report</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="faculty" placeholder="Faculty" value={form.faculty} onChange={handleChange} required /><br />
        <input name="semester" placeholder="Semester" value={form.semester} onChange={handleChange} required /><br />
        <input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required /><br />
        <input name="topic" placeholder="Topic" value={form.topic} onChange={handleChange} required /><br /><br />
        <input type="file" accept="application/pdf" onChange={handleFileChange} required /><br /><br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}
