import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      console.log('✅ Login successful!');
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('❌ Login failed:', error);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-grid min-h-screen">
      <div className="col-span-6 md:col-span-4 md:col-start-5 flex items-center">
        <div className="main-container w-full py-20">

          <button
            onClick={() => navigate(-1)}
            className="text-lemon-green hover:underline flex items-center gap-2 mb-40"
          >
            ← Back
          </button>

          <div className="card">
            <h1 className="text-4xl mb-2 text-center uppercase">Login</h1>
            <p className="text-center mb-8 opacity-70">
              Welcome Back !
            </p>
            <p className="text-center mb-8 opacity-70 pb-30">
              Please connect to your account
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-20">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-4 text-sm font-semibold">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mb-20"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-center text-sm opacity-70">
                <Link to="/forgot-password" className="text-lemon-green hover:underline font-semibold">
                  Forgot password?
                </Link>
              </p>
            </form>

            <div className="flex justify-center">
              <p className="text-center mt-6 text-sm opacity-80">
                You dont have an account?{' '}
                <a href="/register" className="font-semibold hover:text-lemon-green">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
