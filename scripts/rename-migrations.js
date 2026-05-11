import fs from "fs/promises";
import path from "path";

const migrationsDir = path.resolve("migrations");
const filePattern = /^(\d+)_([^.]+)\.js$/;

async function renameMigrations() {
  const entries = await fs.readdir(migrationsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && filePattern.test(entry.name))
    .map((entry) => entry.name)
    .sort();

  if (files.length === 0) {
    console.log(`Tidak ada file migrasi di folder: ${migrationsDir}`);
    return;
  }

  const baseTimestamp = Math.floor(Date.now() / 1000) * 1000;
  const renamePairs = files.map((name, index) => {
    const [, , body] = name.match(filePattern);
    const newTimestamp = baseTimestamp + index * 1000;
    return {
      oldName: name,
      newName: `${newTimestamp}_${body}.js`,
    };
  });

  const tempPrefix = `.renaming-${Date.now()}`;

  try {
    for (const { oldName, newName } of renamePairs) {
      if (oldName === newName) {
        console.log(`Lewati: ${oldName} (sudah benar)`);
        continue;
      }
      const tmpName = `${tempPrefix}-${oldName}`;
      await fs.rename(
        path.join(migrationsDir, oldName),
        path.join(migrationsDir, tmpName),
      );
      console.log(`Sementara ganti: ${oldName} -> ${tmpName}`);
    }

    for (const { oldName, newName } of renamePairs) {
      if (oldName === newName) continue;
      const tmpName = `${tempPrefix}-${oldName}`;
      await fs.rename(
        path.join(migrationsDir, tmpName),
        path.join(migrationsDir, newName),
      );
      console.log(`Rename: ${oldName} -> ${newName}`);
    }

    console.log(
      "\nSelesai! Semua file di folder migrations sudah diubah timestamp-nya.",
    );
  } catch (error) {
    console.error("Gagal melakukan rename:", error);
    process.exit(1);
  }
}

await renameMigrations();
