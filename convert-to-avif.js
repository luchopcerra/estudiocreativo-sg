#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";
import { glob } from "glob";
import sharp from "sharp";

async function convertToAVIF() {
  try {
    // Buscar todos los archivos de imagen en src/assets/proyectos (excluyendo .avif)
    const imageFiles = await glob(
      "src/assets/proyectos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
    );

    console.log(
      `🔍 Encontradas ${imageFiles.length} imágenes para convertir a AVIF`,
    );

    let convertedCount = 0;
    let errorCount = 0;

    for (const imagePath of imageFiles) {
      const parsedPath = path.parse(imagePath);
      const avifPath = path.join(parsedPath.dir, parsedPath.name + ".avif");

      try {
        // Verificar si ya existe la versión AVIF
        try {
          await fs.access(avifPath);
          console.log(
            `⚠️  Ya existe: ${avifPath} - eliminando original ${imagePath}`,
          );
          await fs.unlink(imagePath);
          continue;
        } catch {
          // No existe el archivo AVIF, proceder con la conversión
        }

        // Convertir a AVIF
        await sharp(imagePath)
          .avif({
            quality: 80,
            effort: 4, // Balance entre calidad y velocidad de compresión
          })
          .toFile(avifPath);

        // Eliminar el archivo original después de la conversión exitosa
        await fs.unlink(imagePath);

        console.log(`✅ Convertido: ${imagePath} → ${avifPath}`);
        convertedCount++;
      } catch (error) {
        console.error(`❌ Error convirtiendo ${imagePath}:`, error.message);
        errorCount++;
      }
    }

    console.log("\n🎉 Conversión completada!");
    console.log(`✅ Archivos convertidos: ${convertedCount}`);
    console.log(`❌ Errores: ${errorCount}`);

    // Verificar el resultado final
    const finalAvifFiles = await glob("src/assets/proyectos/**/*.avif");
    console.log(`📁 Total de archivos AVIF finales: ${finalAvifFiles.length}`);
  } catch (error) {
    console.error("💥 Error general:", error);
    process.exit(1);
  }
}

convertToAVIF();
