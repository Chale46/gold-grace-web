import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

// HALAMAN INI HANYA UNTUK SETUP USER ADMIN PERTAMA
// HAPUS FILE INI SETELAH USER ADMIN BERHASIL DIBUAT!

const AdminSetup = () => {
  const [email, setEmail] = useState('jadtraconsulting@gmail.com');
  const [password, setPassword] = useState('Jadtra123!!');
  const [confirmPassword, setConfirmPassword] = useState('Jadtra123!!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const [mode, setMode] = useState<'create' | 'reset'>('create');

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (mode === 'reset') {
        // Reset password untuk user yang sudah ada
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin + '/admin/login',
        });
        
        if (resetError) {
          console.error('Reset error:', resetError);
          setError(resetError.message || 'Gagal mengirim reset password');
          return;
        }
        
        setSuccess(`Email reset password sudah dikirim ke ${email}. Cek inbox/spam folder.`);
      } else {
        // Sign up user baru
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });
        
        if (signUpError) {
          console.error('Setup error:', signUpError);
          
          // Kalau user sudah ada, suggest reset password
          if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
            setError('User sudah terdaftar. Gunakan mode "Reset Password" atau login dengan password yang benar.');
            setMode('reset');
          } else {
            setError(signUpError.message || 'Gagal membuat user admin');
          }
          return;
        }
        
        if (data?.user) {
          setSuccess(`User admin berhasil dibuat! Email: ${email}`);
          console.log('Admin user created:', data.user.email);
          
          // Auto redirect ke login setelah 3 detik
          setTimeout(() => {
            navigate('/admin/login');
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error('Setup exception:', err);
      setError(err?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Setup Admin User</h1>
          <p className="text-gray-500 mt-2">Buat user admin pertama Anda</p>
          
          {/* Warning Banner */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 text-left">
                <strong>Penting:</strong> Halaman ini hanya untuk setup awal. 
                Hapus file ini setelah user admin dibuat!
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('create')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'create' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Buat User Baru
            </button>
            <button
              type="button"
              onClick={() => setMode('reset')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'reset' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reset Password
            </button>
          </div>

          {mode === 'reset' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Mode Reset Password: Klik tombol di bawah untuk kirim email reset password ke <strong>{email}</strong>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">{success}</p>
                <p className="mt-1">Redirect ke halaman login...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSetup} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Admin
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Masukkan password lagi"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                mode === 'reset' 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {mode === 'reset' ? 'Mengirim Email...' : 'Membuat User...'}
                </>
              ) : (
                <>
                  {mode === 'reset' ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Kirim Reset Password
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Buat Admin User
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Link ke Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <a href="/admin/login" className="text-primary hover:text-primary/80 font-medium">
                Login disini
              </a>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            JADTRA Consulting Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
