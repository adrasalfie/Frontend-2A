import { ALL_CATEGORY } from '../data/courses.js'

/**
 * Operasi CRUD pada array of object kelas.
 * Semuanya fungsi murni: tidak mengubah array lama, selalu mengembalikan array baru
 * (supaya React mendeteksi perubahan state).
 */

/** CREATE - tambah kelas baru di urutan paling atas. */
export function addCourse(courses, data) {
  const nextId = courses.reduce((max, course) => Math.max(max, course.id), 0) + 1
  return [{ ...data, id: nextId }, ...courses]
}

/** UPDATE - ganti field kelas dengan id tertentu. */
export function updateCourse(courses, id, changes) {
  return courses.map((course) => (course.id === id ? { ...course, ...changes } : course))
}

/** DELETE - buang kelas dengan id tertentu. */
export function deleteCourse(courses, id) {
  return courses.filter((course) => course.id !== id)
}

/** READ - cari berdasarkan judul/tutor/kategori dan filter per kategori. */
export function filterCourses(courses, { category = ALL_CATEGORY, query = '' }) {
  const keyword = query.trim().toLowerCase()
  return courses.filter((course) => {
    const matchCategory = category === ALL_CATEGORY || course.category === category
    const matchQuery =
      !keyword ||
      [course.title, course.tutor.name, course.tutor.company, course.category]
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    return matchCategory && matchQuery
  })
}

/** Course -> nilai awal form (semua string, mudah dipakai input). */
export function toFormValues(course) {
  if (!course) {
    return {
      title: '',
      description: '',
      category: '',
      price: '',
      rating: '',
      image: '',
      tutorName: '',
      tutorRole: '',
      tutorCompany: '',
    }
  }
  return {
    title: course.title,
    description: course.description,
    category: course.category,
    price: String(course.price),
    rating: String(course.rating),
    image: course.image,
    tutorName: course.tutor.name,
    tutorRole: course.tutor.role,
    tutorCompany: course.tutor.company,
  }
}

/** Nilai form -> object kelas. `existing` dipakai agar avatar & jumlah ulasan lama terjaga saat edit. */
export function toCourseData(values, existing) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    price: Number(values.price),
    rating: values.rating === '' ? 0 : Number(values.rating),
    reviews: existing?.reviews ?? 0,
    image: values.image,
    tutor: {
      name: values.tutorName.trim(),
      role: values.tutorRole.trim(),
      company: values.tutorCompany.trim(),
      avatar: existing?.tutor.avatar ?? '',
    },
  }
}
