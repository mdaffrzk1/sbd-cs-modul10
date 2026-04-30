const db = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

class ReportController {
  
  // 1. GET /reports/top-users?limit=10 
  static async getTopUsers(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      
      // Menggunakan Window function RANK() dengan aggregasi sum
      const query = `
        SELECT 
          u.id, 
          u.name, 
          u.email,
          COALESCE(SUM(t.total), 0) AS total_spent,
          RANK() OVER (ORDER BY COALESCE(SUM(t.total), 0) DESC) AS rank_position
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id AND t.status = 'paid'
        GROUP BY u.id, u.name, u.email
        ORDER BY rank_position ASC
        LIMIT $1;
      `;
      
      const result = await db.query(query, [limit]);

      res.status(200).json({
        success: true,
        message: 'Top users retrieved successfully',
        payload: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. GET /reports/items-sold
  static async getItemsSold(req, res, next) {
    try {
      // Menggunakan agregasi SUM dan JOIN dari tabel items ke transactions
      const query = `
        SELECT 
          i.id, 
          i.name, 
          COALESCE(SUM(t.quantity), 0) AS total_quantity_sold,
          COALESCE(SUM(t.total), 0) AS total_revenue
        FROM items i
        LEFT JOIN transactions t ON i.id = t.item_id AND t.status = 'paid'
        GROUP BY i.id, i.name
        ORDER BY total_revenue DESC;
      `;
      
      const result = await db.query(query);

      res.status(200).json({
        success: true,
        message: 'Items sold report retrieved successfully',
        payload: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. GET /reports/monthly-sales?year=2026
  static async getMonthlySales(req, res, next) {
    try {
      const year = req.query.year || new Date().getFullYear();

      // Gunakan date_trunc() untuk memecah tanggal menjadi bulan dan rekap dengan GROUP BY
      const query = `
        SELECT 
          date_trunc('month', created_at) AS month,
          COUNT(id) AS total_transactions,
          COALESCE(SUM(quantity), 0) AS total_items_sold,
          COALESCE(SUM(total), 0) AS total_revenue
        FROM transactions
        WHERE EXTRACT(YEAR FROM created_at) = $1 AND status = 'paid'
        GROUP BY month
        ORDER BY month ASC;
      `;
      
      const result = await db.query(query, [year]);

      res.status(200).json({
        success: true,
        message: `Monthly sales report for ${year} retrieved successfully`,
        payload: result.rows,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportController;