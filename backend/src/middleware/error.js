// Catches errors from async route handlers (wrapped with asyncHandler) and
// Prisma errors, and returns a consistent JSON error shape.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({ message: `A record with this ${err.meta?.target?.join(", ")} already exists` });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncHandler };
