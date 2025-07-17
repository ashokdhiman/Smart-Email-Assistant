import { useState } from 'react';
import './App.css';
import axios from 'axios';
import logo from './assets/logo.png'; // ✅ Importing from assets folder

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!emailContent.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://backendsamrtemailassistant-production.up.railway.app/api/email/generate', {
        emailContent,
        tone,
      });

      const reply = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(reply);
    } catch (err) {
      setError('⚠️ Failed to generate email reply. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="outer">
      <div className="container">
        {/* Logo imported and used here */}
        <img src={logo} alt="Logo" className="logo" />

        <h2 className="title">Smart Email Assistant</h2>

        <label htmlFor="emailInput" className="label">Paste Email:</label>
        <textarea
          id="emailInput"
          rows="10"
          className="textarea"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste your email here..."
        />

        <label htmlFor="toneSelect" className="label" style={{ marginTop: '20px' }}>
          Tone (optional):
        </label>
        <select
          id="toneSelect"
          className="select"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="">None</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="friendly">Friendly</option>
        </select>

        <button
          className="button"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
        >
          {loading ? 'Generating...' : 'Generate Reply'}
        </button>

        {error && (
          <div style={{ marginTop: '20px', color: 'red', fontWeight: 500 }}>{error}</div>
        )}

        {generatedReply && (
          <section className="reply-box">
            <h3 className="reply-title"> <span>Generated Reply:</span></h3>
            <div className="reply-content">
              <p>{generatedReply}</p>
            </div>

            <button
              className="copy-btn"
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              📋 Copy to Clipboard
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;
