class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Menandai error ini sebagai error operasional yang dapat diprediksi
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Mode Pengembangan: Munculkan keseluruhan riwayat stack error
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // Mode Produksi: bedakan berdasarkan "Apakah error ini validitas input/data"
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        payload: null,
      });
    } else {
      // Error pemrograman/Database: Sembunyikan Detail
      console.error('ERROR 💥', err); // Logging server only
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        payload: null,
      });
    }
  }
};

module.exports = { AppError, errorHandler };