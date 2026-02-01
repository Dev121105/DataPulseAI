import { useState, useCallback } from 'react';
import axios from 'axios';
import LandingPage from './LandingPage';
import ChatbotUI from './ChatbotUI';

const API_URL = import.meta.env.VITE_API_URL;
const API_BASE = API_URL ? (API_URL.startsWith('http') ? API_URL : `https://${API_URL}`) : 'http://localhost:8001';

function App() {
    const [view, setView] = useState('landing');
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const extractChartData = (content) => {
        try {
            // 1. Try to extract from ANY markdown code block (json or not)
            const codeBlockRegex = /```(?:\w*)?\s*([\s\S]*?)\s*```/g;
            const matches = [...content.matchAll(codeBlockRegex)];

            for (const match of matches) {
                try {
                    // Try parsing the content of the code block
                    const candidate = match[1].trim();
                    // Sanitize potential single quotes to double quotes
                    const sanitized = candidate.replace(/'/g, '"');
                    const parsed = JSON.parse(candidate) || JSON.parse(sanitized);
                    if (parsed.type === 'chart') return parsed;
                } catch (e) { }
            }

            // 2. Try direct search for the specific chart pattern (aggressive)
            // Look for the start of the chart object
            const markers = ['{"type": "chart"', '{"type":"chart"', "{'type': 'chart'", "{'type':'chart'"];
            let start = -1;

            for (const marker of markers) {
                start = content.indexOf(marker);
                if (start !== -1) break;
            }

            if (start !== -1) {
                let braces = 0;
                let inString = false;
                for (let i = start; i < content.length; i++) {
                    const char = content[i];
                    if (char === '"' && content[i - 1] !== '\\') inString = !inString;
                    if (!inString) {
                        if (char === '{') braces++;
                        if (char === '}') braces--;
                    }
                    if (braces === 0) {
                        try {
                            const candidate = content.substring(start, i + 1);
                            const sanitized = candidate.replace(/'/g, '"');
                            const parsed = JSON.parse(candidate) || JSON.parse(sanitized);
                            return parsed; // Return immediately if validity confirmed
                        } catch (e) {
                            // Continue searching if this parse fails
                        }
                    }
                }
            }

            // 3. Last Resort: Regex looking for the type:chart pattern loosely
            const looseMatch = content.match(/\{[\s\S]*?"type":\s*["']chart["'][\s\S]*?\}/);
            if (looseMatch) {
                try {
                    return JSON.parse(looseMatch[0]);
                } catch (e) { }
            }

        } catch (e) {
            console.error("Chart parsing failed", e);
        }
        return null;
    };

    const handleUpload = async (targetFile) => {
        const selected = targetFile || file;
        if (!selected) return;

        const data = new FormData();
        data.append("file", selected);

        try {
            await axios.post(`${API_BASE}/upload`, data);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: `✅ Dataset \`${selected.name}\` indexed successfully.`
            }]);
        } catch (err) {
            alert("Upload failed. Verify server connection.");
        }
    };

    const handleDownload = async () => {
        try {
            const res = await axios.get(`${API_BASE}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'datapulse_export.csv';
            a.click();
        } catch (err) {
            alert("Export failed. Upload a dataset first.");
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const { data } = await axios.post(`${API_BASE}/ask`, { question: input, history: messages });
            const chart = extractChartData(data.answer);
            setMessages(prev => [...prev, { role: 'ai', content: data.answer, chart }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "Neural link interrupted. Please retry." }]);
        } finally {
            setLoading(false);
        }
    };

    return view === 'landing' ? (
        <LandingPage onStart={() => setView('chat')} />
    ) : (
        <ChatbotUI
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onUpload={handleUpload}
            onDownload={handleDownload}
            setFile={setFile}
            loading={loading}
            onBack={() => setView('landing')}
        />
    );
}

export default App;
