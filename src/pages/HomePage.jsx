import { useCallback, useMemo, useState } from 'react'
import Container from '../components/atoms/Container.jsx'
import Hero from '../components/organisms/Hero.jsx'
import CourseSection from '../components/organisms/CourseSection.jsx'
import CourseForm from '../components/organisms/CourseForm.jsx'
import CourseDetail from '../components/organisms/CourseDetail.jsx'
import NewsletterSection from '../components/organisms/NewsletterSection.jsx'
import Modal from '../components/molecules/Modal.jsx'
import ConfirmDialog from '../components/molecules/ConfirmDialog.jsx'
import Toast from '../components/molecules/Toast.jsx'
import {
  ALL_CATEGORY,
  CATEGORY_OPTIONS,
  COURSE_CATEGORIES,
  COURSE_IMAGES,
  initialCourses,
} from '../data/courses.js'
import {
  addCourse,
  deleteCourse,
  filterCourses,
  toCourseData,
  toFormValues,
  updateCourse,
} from '../utils/courseCrud.js'

/**
 * Halaman Homepage = "parent" yang memegang semua state (useState):
 *
 * - courses         : array of object kelas (sumber data CRUD)
 * - query           : kata kunci pencarian
 * - activeCategory  : tab kategori aktif
 * - formState       : null | { mode: 'create' } | { mode: 'edit', course }  -> modal form
 * - detailId        : id kelas yang sedang dilihat (modal detail)
 * - deleteTarget    : kelas yang akan dihapus (dialog konfirmasi)
 * - toast           : notifikasi hasil aksi
 *
 * Child component hanya menerima nilai & handler lewat props.
 */
export default function HomePage() {
  const [courses, setCourses] = useState(initialCourses)
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)
  const [formState, setFormState] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [toast, setToast] = useState(null)

  const visibleCourses = useMemo(
    () => filterCourses(courses, { category: activeCategory, query }),
    [courses, activeCategory, query],
  )
  const detailCourse = courses.find((course) => course.id === detailId) ?? null

  const closeToast = useCallback(() => setToast(null), [])
  const showToast = (message, type = 'success') => setToast({ message, type })

  const resetFilters = () => {
    setQuery('')
    setActiveCategory(ALL_CATEGORY)
  }

  /* ---------- CREATE & UPDATE ---------- */
  const openCreateForm = () => setFormState({ mode: 'create' })
  const openEditForm = (course) => {
    setDetailId(null)
    setFormState({ mode: 'edit', course })
  }
  const closeForm = () => setFormState(null)

  const handleSave = (values) => {
    if (formState.mode === 'create') {
      setCourses((prev) => addCourse(prev, toCourseData(values)))
      resetFilters() // pastikan kelas baru langsung terlihat
      showToast('Kelas berhasil ditambahkan')
    } else {
      const { course } = formState
      setCourses((prev) => updateCourse(prev, course.id, toCourseData(values, course)))
      showToast('Perubahan kelas berhasil disimpan')
    }
    closeForm()
  }

  /* ---------- DELETE ---------- */
  const askDelete = (course) => {
    setDetailId(null)
    setDeleteTarget(course)
  }
  const confirmDelete = () => {
    setCourses((prev) => deleteCourse(prev, deleteTarget.id))
    showToast(`Kelas "${deleteTarget.title}" dihapus`, 'danger')
    setDeleteTarget(null)
  }

  return (
    <Container className="flex flex-col gap-10 py-6 md:gap-16 md:py-10">
      <Hero
        image="/images/hero.jpg"
        title="Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video Interaktif!"
        description="Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran berkualitas tinggi. Tidak hanya itu, Anda juga dapat berpartisipasi dalam latihan interaktif yang akan meningkatkan pemahaman Anda."
        ctaLabel="Temukan Video Course untuk Dipelajari!"
        ctaHref="#koleksi"
      />

      {/* READ: daftar kelas + pencarian + filter */}
      <CourseSection
        id="koleksi"
        title="Koleksi Video Pembelajaran Unggulan"
        subtitle="Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!"
        categories={COURSE_CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        query={query}
        onQueryChange={setQuery}
        courses={visibleCourses}
        totalCount={courses.length}
        onAdd={openCreateForm}
        onView={(course) => setDetailId(course.id)}
        onEdit={openEditForm}
        onDelete={askDelete}
        onResetFilters={resetFilters}
      />

      <NewsletterSection
        image="/images/newsletter.jpg"
        eyebrow="Newsletter"
        title="Mau Belajar Lebih Banyak?"
        description="Daftarkan dirimu untuk mendapatkan informasi terbaru dan penawaran spesial dari program-program terbaik hariesok.id"
      />

      {formState && (
        <Modal
          title={formState.mode === 'create' ? 'Tambah Kelas Baru' : 'Edit Kelas'}
          onClose={closeForm}
          size="lg"
        >
          <CourseForm
            initialValues={toFormValues(formState.course)}
            categories={CATEGORY_OPTIONS}
            images={COURSE_IMAGES}
            submitLabel={formState.mode === 'create' ? 'Tambah Kelas' : 'Simpan Perubahan'}
            onSubmit={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}

      {detailCourse && (
        <Modal title="Detail Kelas" onClose={() => setDetailId(null)}>
          <CourseDetail
            course={detailCourse}
            onEdit={openEditForm}
            onDelete={askDelete}
            onClose={() => setDetailId(null)}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Hapus Kelas?"
          message={`Kelas "${deleteTarget.title}" akan dihapus dan tidak bisa dikembalikan.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </Container>
  )
}
