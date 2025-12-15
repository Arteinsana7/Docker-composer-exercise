import { useState } from 'react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // TODO: Call authService.login()
  };

  return (
    <div className="main-grid min-h-screen">
      <div className="col-span-6 md:col-span-4 md:col-start-5 flex items-center">
        <div className="main-container w-full py-20">
          <div className="card">
            <h1 className="text-4xl mb-2 text-center">Login</h1>
            <p className="text-center mb-8 opacity-70">
              Welcome back to La Synthèse 🎹
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Sign In
              </button>
            </form>

            <p className="text-center mt-6 text-sm opacity-70">
              Don't have an account?{' '}
              <a href="/register" className="font-semibold hover:text-lemon-green">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
