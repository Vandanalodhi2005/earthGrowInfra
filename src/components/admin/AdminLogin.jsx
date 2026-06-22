import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginAdmin, clearError } from '../../store/slices/authSlice';
import { HiLockClosed, HiUser, HiShieldCheck } from 'react-icons/hi';

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginAdmin(credentials));
    if (loginAdmin.fulfilled.match(result)) {
      if (result.payload.token) {
        localStorage.setItem('adminToken', result.payload.token);
      }
      navigate('/admin/dashboard');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px 16px 50px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none',
    fontSize: '14px',
    transition: 'all 0.3s'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        {/* Glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--color-gold)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'var(--color-teal)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.1 }}></div>

        <div style={{ maxWidth: '450px', width: '100%', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--color-gold)', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 10px 30px rgba(198, 156, 109, 0.3)' }}>
                    <HiShieldCheck size={40} style={{ color: 'var(--color-navy)' }} />
                </div>
                <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>Admin Access</h2>
                <p style={{ color: 'var(--color-gold)', fontSize: '9px', fontWeight: 'bold', letterSpacing: '4px', marginTop: '5px', opacity: 0.6 }}>REALTY XPERTS MANAGEMENT</p>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '32px', padding: '40px', backdropFilter: 'blur(20px)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ position: 'relative' }}>
                        <HiUser size={18} style={{ position: 'absolute', left: '20px', top: '20px', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <HiLockClosed size={18} style={{ position: 'absolute', left: '20px', top: '20px', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            style={inputStyle}
                            required
                        />
                    </div>

                    {error && <div style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '18px',
                            backgroundColor: 'var(--color-gold)',
                            color: 'var(--color-navy)',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            transition: 'transform 0.2s',
                            boxShadow: '0 10px 30px rgba(198, 156, 109, 0.2)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'AUTHENTICATING...' : 'ENTER MANAGEMENT'}
                    </button>
                </form>

                <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '30px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '8px', fontWeight: 'bold', letterSpacing: '2px' }}>© 2026 THE REALTY XPERTS • SECURE SYSTEM</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminLogin;