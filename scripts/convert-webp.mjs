import sharp from "sharp";
import fs from "fs";
import path from "path";

const folders = [
  "client/public/assets",
  "client/public/logos",
];

async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;

  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  
  if (fs.existsSync(webpPath)) {
    console.log(`⏭️  Уже есть: ${webpPath}`);
    return;
  }

  try {
    const originalSize = fs.statSync(filePath).size;
    await sharp(filePath).webp({ quality: 82 }).toFile(webpPath);
    const newSize = fs.statSync(webpPath).size;
    const saved = Math.round((1 - newSize / originalSize) * 100);
    console.log(`✅ ${path.basename(filePath)} → ${path.basename(webpPath)} (−${saved}%)`);
  } catch (e) {
    console.log(`❌ Ошибка: ${filePath}`, e.message);
  }
}

async function processFolder(folder) {
  if (!fs.existsSync(folder)) return;
  const files = fs.readdirSync(folder, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(folder, file.name);
    if (file.isDirectory()) {
      await processFolder(fullPath);
    } else {
      await convertToWebP(fullPath);
    }
  }
}

console.log("🔄 Конвертируем изображения в WebP...\n");
for (const folder of folders) {
  await processFolder(folder);
}
console.log("\n✨ Готово!");
