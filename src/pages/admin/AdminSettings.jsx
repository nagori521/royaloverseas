import { useEffect, useState } from 'react';
import AdminPageHeader from '../../components/admin/AdminPageHeader.jsx';
import { api } from '../../services/api.js';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    companyName: 'Royal Overseas',
    email: 'info@royaloverseas.com',
    whatsapp: '+91 63595 78922',
    address: 'Royal Overseas Trade Office, Mumbai, India',
    facebook: '',
    instagram: '',
    linkedin: '',
  });
  const [logo, setLogo] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSettings = () => {
    return api.settings()
      .then((data) => {
        setSettings({
          companyName: data.companyName || 'Royal Overseas',
          email: data.email || 'info@royaloverseas.com',
          whatsapp: data.whatsapp || '+91 63595 78922',
          address: data.address || '',
          facebook: data.socialLinks?.facebook || '',
          instagram: data.socialLinks?.instagram || '',
          linkedin: data.socialLinks?.linkedin || '',
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateField = (name, value) => {
    setSettings((current) => ({ ...current, [name]: value }));
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      const payload = new FormData();
      payload.append('companyName', settings.companyName);
      payload.append('email', settings.email);
      payload.append('whatsapp', settings.whatsapp);
      payload.append('address', settings.address);
      payload.append('socialLinks[facebook]', settings.facebook);
      payload.append('socialLinks[instagram]', settings.instagram);
      payload.append('socialLinks[linkedin]', settings.linkedin);
      if (logo) payload.append('logo', logo);
      await api.updateSettings(payload);
      await loadSettings();
      setLogo(null);
      setMessage('Settings saved successfully');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-5 sm:p-8">
      <AdminPageHeader title="Settings" subtitle="Company profile, contact details, and social media." />
      <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={saveSettings}>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Company Name', 'companyName'],
            ['Contact Info', 'address'],
            ['WhatsApp Number', 'whatsapp'],
            ['Email', 'email'],
            ['Facebook', 'facebook'],
            ['Instagram', 'instagram'],
            ['LinkedIn', 'linkedin'],
          ].map(([label, name]) => (
            <label key={name} className="grid gap-2 text-sm font-semibold text-slate-700">
              {label}
              <input
                value={settings[name]}
                onChange={(event) => updateField(name, event.target.value)}
                className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue"
              />
            </label>
          ))}
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Logo Upload
            <input type="file" onChange={(event) => setLogo(event.target.files?.[0] || null)} className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue" />
          </label>
        </div>
        {message && <p className="mt-4 rounded-md bg-green-50 p-3 text-sm font-semibold text-green-800">{message}</p>}
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" className="btn-primary mt-6" disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </section>
  );
}
