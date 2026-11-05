const fs = require("fs/promises");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads/products");

const replaceProductImage = async (productId, uploadedFilePath) => {
  if (!uploadedFilePath) return;

  const extension = path.extname(uploadedFilePath).toLowerCase();
  const fileName = `${productId}${extension}`;
  const destination = path.join(uploadDir, fileName);

  // Copy first so an existing image stays intact if writing the new one fails.
  await fs.copyFile(uploadedFilePath, destination);

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

  await fs.unlink(uploadedFilePath);
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
