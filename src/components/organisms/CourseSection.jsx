import Button from '../atoms/Button.jsx'
import Icon from '../atoms/Icon.jsx'
import SearchBar from '../molecules/SearchBar.jsx'
import TabNav from '../molecules/TabNav.jsx'
import CourseCard from '../molecules/CourseCard.jsx'

/**
 * Judul + tombol tambah + pencarian + tab kategori + grid kartu kelas.
 * Komponen ini tidak menyimpan state sendiri: semua data dan handler datang dari parent (HomePage).
 */
export default function CourseSection({
  id,
  title,
  subtitle,
  categories,
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
  courses,
  totalCount,
  onAdd,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
}) {
  const isFiltering = query.trim() !== '' || activeCategory !== categories[0]

  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold leading-tight md:text-[28px]">
            {title}
          </h2>
          <p className="mt-1.5 text-sm text-muted md:text-base">{subtitle}</p>
        </div>
        <Button
          size="sm"
          className="w-full py-2.5 md:w-auto"
          icon={<Icon name="plus" size={18} />}
          onClick={onAdd}
        >
          Tambah Kelas
        </Button>
      </div>

      <div className="mt-6">
        <SearchBar
          value={query}
          onChange={onQueryChange}
          placeholder="Cari judul kelas, tutor, atau perusahaan"
          label="Cari kelas"
        />
      </div>

      <div className="mt-4 border-b border-line">
        <TabNav items={categories} activeItem={activeCategory} onChange={onCategoryChange} />
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-muted">
        Menampilkan {courses.length} dari {totalCount} kelas
      </p>

      {courses.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-white px-4 py-12 text-center">
          <p className="font-heading text-lg font-semibold">
            {totalCount === 0 ? 'Belum ada kelas' : 'Kelas tidak ditemukan'}
          </p>
          <p className="max-w-sm text-sm text-muted">
            {totalCount === 0
              ? 'Mulai dengan menambahkan kelas pertamamu.'
              : 'Coba kata kunci atau kategori lain.'}
          </p>
          {isFiltering && totalCount > 0 ? (
            <Button variant="outline" size="sm" onClick={onResetFilters}>
              Reset pencarian
            </Button>
          ) : (
            <Button size="sm" icon={<Icon name="plus" size={16} />} onClick={onAdd}>
              Tambah Kelas
            </Button>
          )}
        </div>
      )}
    </section>
  )
}
