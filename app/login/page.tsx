'use client';
import { saveDataToLocalStorage } from '@/lib/handleSaveData';
import { login } from '@/lib/handleApi';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { configToast, handleShowToast } from '@/lib/handleToasts';
import clsxm from '@/lib/clsxm';
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!!token) {
        router.push('/');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (
      email === process.env.NEXT_PUBLIC_USERNAME &&
      password === process.env.NEXT_PUBLIC_PASSWORD
    ) {
      await login(email, password)
        .then((res) => {
          if (res.status !== 200) {
            throw res;
          }
          const { username, token, id } = res.data;
          handleShowToast('Đăng nhập thành công!', 'success');
          saveDataToLocalStorage('username', username);
          saveDataToLocalStorage('token', token);
          saveDataToLocalStorage('id', id);
          router.push('/');
        })
        .catch(() => {
          handleShowToast('Sai email hoặc mật khẩu!', 'error');
        });
      return;
    }
    handleShowToast('Sai email hoặc mật khẩu!', 'error');
  };

  return (
    <div className="w-full h-[100vh] justify-center flex flex-col items-center bg-[url(https://i.ibb.co/5X1CnRL3/bg.webp)] bg-center bg-repeat bg-cover">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4">Đăng nhập</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full p-2 mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded w-full p-2 mb-4"
        />

        <button
          type="submit"
          className={clsxm(
            'bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition cursor-pointer',
            (!email || !password) &&
              'cursor-auto bg-[#d9d9d9] hover:bg-[#d9d9d9] pointer-events-none',
          )}
        >
          Đăng nhập
        </button>
      </form>
      <ToastContainer {...configToast} />
    </div>
  );
}
