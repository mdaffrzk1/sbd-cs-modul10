const User = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');
// Tambahkan import library bcrypt 
const bcrypt = require('bcrypt');

class UserService {
  static async register({ name, username, email, phone, password }) {
    // Check if user already exists by email
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 400);
    }
    // Note: username uniqueness is enforced by database constraint

    // Hash password plain text menggunakan bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      username,
      email,
      phone,
      password: hashedPassword, // hash
    });

    return user;
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Bandingkan password login plain text dengan hash yang tersimpan di Db
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Return error
      throw new AppError('Invalid email or password', 401); 
    }

    // No JWT, just return user data
    return { user: { id: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone, balance: user.balance } };
  }

  static async updateProfile(id, updateData) {
    // Jika ada perubahan string password dari payload update, lakukan Hashing
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    
    const updatedUser = await User.update(id, updateData);
    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }
    return updatedUser;
  }

  static async getTransactionHistory(userId) {
    // Simple query without JOIN (just return raw transactions)
    const transactions = await User.getTransactions(userId);
    return transactions;
  }

  static async getTotalSpent(userId) {
    // Simple total without aggregate
    const transactions = await User.getTransactions(userId);
    const total = transactions.reduce((sum, t) => sum + t.total, 0);
    return total;
  }

  static async getByEmail(email) {
    // Ambil data user by email dari PostgreSQL untuk fallback saat cache miss
    const user = await User.findByEmail(email);
    return user;
  }
}

module.exports = UserService;