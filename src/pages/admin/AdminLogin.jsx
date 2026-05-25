import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockKeyhole } from 'lucide-react';
import { api } from '../../services/api.js';

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState(
      'admin@royaloverseas.com'
    );

  const [password, setPassword] =
    useState('admin123');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [attemptsRemaining,
    setAttemptsRemaining] =
    useState(5);

  const login = async (event) => {

    event.preventDefault();

    setError('');
    setLoading(true);

    try {

      const data =
        await api.login({
          email,
          password
        });

      localStorage.setItem(
        'royalAdminToken',
        data.token
      );

      localStorage.setItem(
        'royalAdminAuth',
        'true'
      );

      localStorage.setItem(
        'royalAdminUser',
        JSON.stringify(
          data.user
        )
      );

      navigate("/ro-panel-2026/dashboard");

    } catch (apiError) {

      if (
        apiError.response?.data
          ?.attemptsRemaining !==
        undefined
      ) {

        setAttemptsRemaining(
          apiError.response
            .data
            .attemptsRemaining
        );

      }

      setError(
        apiError.response?.data
          ?.message ||
        apiError.message ||
        'Login failed'
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="grid min-h-screen place-items-center bg-royal-blue px-4 py-10">

      <motion.form

        initial={{
          opacity: 0,
          y: 24
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        onSubmit={login}

        className="w-full max-w-md rounded-lg bg-white p-7 shadow-soft"

      >

        <span className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-royal-light text-royal-blue">

          <LockKeyhole
            size={26}
          />

        </span>

        <h1 className="mt-5 text-center text-3xl font-bold text-royal-navy">

          Admin Login

        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">

          Secure admin dashboard for Royal Overseas

        </p>

        <label className="mt-7 grid gap-2 text-sm font-semibold text-slate-700">

          Email

          <input

            type="email"

            value={email}

            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }

            disabled={loading}

            className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue disabled:opacity-50"

          />

        </label>

        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">

          Password

          <input

            type="password"

            value={password}

            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }

            disabled={loading}

            className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-royal-blue disabled:opacity-50"

          />

        </label>

        {

          error && (

            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">

              {error}

              {

                attemptsRemaining > 0 &&
                attemptsRemaining < 5 && (

                  <p className="mt-1 text-xs text-red-600">

                    Attempts remaining:
                    {attemptsRemaining}

                  </p>

                )

              }

            </div>

          )

        }

        <button

          type="submit"

          disabled={loading}

          className="btn-primary mt-6 w-full disabled:opacity-50 disabled:cursor-not-allowed"

        >

          {

            loading
              ? 'Logging in...'
              : 'Login'

          }

        </button>

      </motion.form>

    </section>

  );

}
