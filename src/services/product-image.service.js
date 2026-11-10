const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const Product = require("../models/product.model");

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

  const imagePath = `/uploads/products/${fileName}`;
  await Product.updateOne({ _id: productId }, { $set: { image: imagePath } });
  return imagePath;
};

const getProductImagePath = async (product) => {
  if (product.image) return product.image;

  // Older uploads predate the image field, so discover their existing file.
  try {
    const entries = await fs.readdir(uploadDir, { withFileTypes: true });
    const image = entries.find(
      (entry) => entry.isFile() && entry.name.startsWith(`${product._id}.`)
    );
    return image ? `/uploads/products/${image.name}` : null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
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
  getProductImagePath,
  removeProductImages,
};
