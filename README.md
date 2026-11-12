# videobelajar (React + Vite + Tailwind CSS)

Halaman **Homepage**, **Login**, dan **Register** yang responsif (mobile, tablet, desktop).

## Menjalankan

```bash
npm install
npm run dev      # development di http://localhost:5173
npm run build    # build production ke folder dist/
```

## Rute

| Path        | Halaman  |
| ----------- | -------- |
| `/`         | Homepage |
| `/login`    | Login    |
| `/register` | Register |

## Struktur (Atomic Design)

```
src/
├── components/
│   ├── atoms/        Button, Input, Icon, Logo, Avatar, Rating, Container, Flag
│   ├── molecules/    TextField, PasswordField, SelectField, PhoneField, ForgotPasswordLink,
│   │                 AuthActions, DividerText,
│   │                 CourseCard, TutorInfo, TabNav, NewsletterForm,
│   │                 FooterLinkGroup, SocialLinks, UserMenu
│   └── organisms/    Navbar, Hero, CourseSection, NewsletterSection, Footer,
│                     AuthCard, LoginForm, RegisterForm
├── layouts/          MainLayout (navbar + footer), AuthLayout
├── pages/            HomePage, LoginPage, RegisterPage
├── data/             courses, navigation, footer, countryCodes (data dummy)
├── hooks/            useForm
└── utils/            format, validators
```

## Prinsip

- **Reusable component**: semua data masuk lewat props (mis. `CourseCard` menerima `course`,
  `Hero` menerima `title`, `description`, `image`, `ctaLabel`).
- **Responsif**: Tailwind breakpoints (`sm`, `md`, `lg`). Contoh: kartu kelas horizontal di
  mobile dan vertikal di tablet/desktop, navbar hamburger di mobile, footer accordion di mobile.
- **Design token** (warna & font) ada di `src/index.css` pada blok `@theme`.

## Fitur CRUD (Homepage)

State dipegang oleh **parent** (`src/pages/HomePage.jsx`) dengan `useState`, lalu dikirim ke
child lewat props.

| State            | Fungsi                                                    |
| ---------------- | --------------------------------------------------------- |
| `courses`        | array of object kelas (sumber data CRUD)                  |
| `query`          | kata kunci pencarian                                      |
| `activeCategory` | tab kategori aktif                                        |
| `formState`      | `null` / `{ mode: 'create' }` / `{ mode: 'edit', course }` |
| `detailId`       | id kelas yang sedang dilihat                              |
| `deleteTarget`   | kelas yang akan dihapus (dialog konfirmasi)               |
| `toast`          | notifikasi hasil aksi                                     |

Operasi array ada di `src/utils/courseCrud.js` (fungsi murni, tidak memutasi array lama):

- **Create**: `addCourse` - tombol "Tambah Kelas" membuka form modal.
- **Read**: `filterCourses` - daftar kartu, cari, filter kategori, dan modal detail.
- **Update**: `updateCourse` - tombol "Edit" membuka form yang sama, sudah terisi data lama.
- **Delete**: `deleteCourse` - tombol "Hapus" dengan dialog konfirmasi.

Catatan: data hanya hidup di memori (useState), jadi kembali ke data awal saat halaman di-refresh.
