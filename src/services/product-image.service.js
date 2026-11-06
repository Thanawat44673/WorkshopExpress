const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const uploadDir = path.join(__dirname, "../uploads/products");

const replaceProductImage = async (productId, uploadedFile) => {
  if (!uploadedFile) return;

  const extensionByMimeType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  const extension = extensionByMimeType[uploadedFile.mimetype];
  if (!extension) {
    const error = new Error("Unsupported product image type");
    error.statusCode = 400;
    throw error;
  }
  const fileName = `${productId}${extension}`;
  const destination = path.join(uploadDir, fileName);
  const temporaryPath = path.join(
    uploadDir,
    `.upload-${crypto.randomUUID()}${extension}`
  );

  // The file is kept in memory by Multer until the product save succeeds.
  // Write to a temporary file first so a failed write does not damage the old image.
  await fs.mkdir(uploadDir, { recursive: true });
  try {
    await fs.writeFile(temporaryPath, uploadedFile.buffer, { flag: "wx" });
    await fs.rename(temporaryPath, destination);
  } catch (error) {
    await fs.unlink(temporaryPath).catch(() => {});
    throw error;
  }

  const existingFiles = await fs.readdir(uploadDir, { withFileTypes: true });
  await Promise.all(
    existingFiles
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.startsWith(`${productId}.`) &&
          entry.name !== fileName
      )
      .map((entry) => fs.unlink(path.join(uploadDir, entry.name)))
  );
};

const removeProductImages = async (productId) => {
  const existingFiles = await fs.readdir(uploadDir, { withFileTypes: true });
  await Promise.all(
    existingFiles
      .filter(
        (entry) => entry.isFile() && entry.name.startsWith(`${productId}.`)
      )
      .map((entry) => fs.unlink(path.join(uploadDir, entry.name)))
  );
};

module.exports = {
  replaceProductImage,
  removeProductImages,
};
