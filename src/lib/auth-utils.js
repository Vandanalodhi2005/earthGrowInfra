import jwt from 'jsonwebtoken';

export async function verifyAdminToken(req) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : null;

    if (!token) {
      return { valid: false, error: 'Access denied. No token provided.', status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return { valid: true, admin: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid token', status: 401 };
  }
}
