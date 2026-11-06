# PT Karya Maritim / MPI Website

Website ini dibuat dengan React, TypeScript, Vite, Tailwind CSS, dan Three.js.

## Cara paling mudah: deploy ke Vercel lewat GitHub

**Kamu tidak perlu menjalankan `npm install` di komputer jika hanya ingin deploy lewat GitHub.** Vercel akan memasang semua paket dari `package-lock.json` secara otomatis.

1. Ekstrak ZIP ini.
2. Buka folder hasil ekstrak. Pastikan file `package.json`, `package-lock.json`, `index.html`, dan folder `src` terlihat langsung di dalam folder tersebut.
3. Upload seluruh ISI folder ini ke repository GitHub (jangan upload folder pembungkus yang membuat `package.json` berada satu tingkat lebih dalam).
4. Di Vercel pilih **Add New → Project**, lalu pilih repository GitHub tadi.
5. Pada pengaturan project, pastikan **Root Directory** adalah `./` (folder utama repository).
6. Pastikan pengaturan build berikut:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. Klik **Deploy**.

## Jika ingin menjalankan di komputer (opsional)

Install **Node.js 22 LTS** dari https://nodejs.org terlebih dahulu. Setelah itu buka terminal di folder project (folder yang berisi `package.json`), lalu jalankan:

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan di terminal.

## Jika deploy Vercel masih error

Buka project di Vercel → **Deployments** → pilih deployment yang gagal → **Build Logs**. Salin pesan error merah paling bawah untuk diperiksa. Jangan mengubah Build Command atau Output Directory secara acak.
