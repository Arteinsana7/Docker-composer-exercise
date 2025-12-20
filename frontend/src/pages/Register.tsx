import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ username, email, password });
      console.log('✅ Account created!');
      navigate('/');
    } catch (err: unknown) {
      console.error('❌ Registration failed:', err);
      let message = 'Registration failed';
      if (typeof err === 'object' && err !== null) {
        const maybeErr = err as { response?: { data?: { message?: string } }; message?: string };
        message = maybeErr.response?.data?.message || maybeErr.message || message;
      }
      setError(message);
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
            <h1 className="font-large mb-2 text-center pb-4 uppercase">Register</h1>
            <h2 className="text-center mb-20">
              Join de Community of sound Synthesis
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-20">
              <div>
                <label htmlFor="username" className="block mb-4 text-sm font-semibold">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="your username"
                  required
                  disabled={loading}
                />
              </div>

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
                <label htmlFor="password" className="block mb-2 text-sm font-semibold">
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
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mb-20"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-6 text-sm opacity-70 ">
              Already have an account?{' '}
              <a href="/login" className="font-semibold  hover:text-lemon-green pl-5">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
