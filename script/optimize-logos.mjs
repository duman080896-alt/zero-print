// Логотипы клиентов показываются не больше 112×40 px (TrustedBy: max-w-28, max-h-10),
// а исходники были до 5000 px. Ужимаем до двойного размера показа (для ретины)
// и пересобираем .webp рядом — его отдаёт server/static.ts браузерам с поддержкой WebP.
// Запуск: node script/optimize-logos.mjs
import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = "client/public/logos";
const MAX_W = 224;
const MAX_H = 80;

for (const file of fs.readdirSync(dir)) {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
  const src = path.join(dir, file);
  const input = fs.readFileSync(src);
  const before = input.length;
  const resized = sharp(input).resize(MAX_W, MAX_H, { fit: "inside", withoutEnlargement: true });
  const out = ext === ".png"
    ? await resized.clone().png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
    : await resized.clone().jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  if (out.length < before) fs.writeFileSync(src, out);
  const final = Math.min(out.length, before);
  // .webp оставляем, только если он меньше: иначе сервер подменял бы картинку на более тяжёлую.
  const webp = await resized.clone().webp({ quality: 85 }).toBuffer();
  const webpPath = src.replace(/\.(png|jpe?g)$/i, ".webp");
  if (webp.length < final) fs.writeFileSync(webpPath, webp);
  else if (fs.existsSync(webpPath)) fs.unlinkSync(webpPath);
  const meta = await sharp(out.length < before ? out : input).metadata();
  console.log(`${file.padEnd(18)} ${String(Math.round(before / 1024)).padStart(4)} KB → ${String(Math.round(Math.min(out.length, before) / 1024)).padStart(3)} KB, webp ${Math.round(webp.length / 1024)} KB, ${meta.width}×${meta.height}`);
}
