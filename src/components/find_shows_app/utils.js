// Type options for media content
export const typeOptions = [
  { value: 'movie', label: 'Movies' },
  { value: 'tv_series', label: 'TV Series' },
  { value: 'tv_special', label: 'TV Specials' },
  { value: 'tv_miniseries', label: 'TV Mini-Series' },
  { value: 'short_film', label: 'Short Films' }
]

// Function to render the type in a user-friendly format
export const renderType = type => {
  const typeMap = {
    movie: 'Movie',
    tv_series: 'TV Series',
    tv_special: 'TV Special',
    tv_miniseries: 'TV Mini-Series',
    short_film: 'Short Film'
  }
  return typeMap[type] || type
}

// Genre options from the API
export const genreOptions = [
  { id: 1, name: 'Action', tmdb_id: 28 },
  { id: 39, name: 'Action & Adventure', tmdb_id: 10759 },
  { id: 30, name: 'Adult', tmdb_id: 0 },
  { id: 2, name: 'Adventure', tmdb_id: 12 },
  { id: 3, name: 'Animation', tmdb_id: 16 },
  { id: 33, name: 'Anime', tmdb_id: 0 },
  { id: 31, name: 'Biography', tmdb_id: 0 },
  { id: 4, name: 'Comedy', tmdb_id: 35 },
  { id: 5, name: 'Crime', tmdb_id: 80 },
  { id: 6, name: 'Documentary', tmdb_id: 99 },
  { id: 7, name: 'Drama', tmdb_id: 18 },
  { id: 8, name: 'Family', tmdb_id: 10751 },
  { id: 9, name: 'Fantasy', tmdb_id: 14 },
  { id: 34, name: 'Food', tmdb_id: 0 },
  { id: 28, name: 'Game Show', tmdb_id: 0 },
  { id: 10, name: 'History', tmdb_id: 36 },
  { id: 11, name: 'Horror', tmdb_id: 27 },
  { id: 21, name: 'Kids', tmdb_id: 10762 },
  { id: 12, name: 'Music', tmdb_id: 10402 },
  { id: 32, name: 'Musical', tmdb_id: 0 },
  { id: 13, name: 'Mystery', tmdb_id: 9648 },
  { id: 36, name: 'Nature', tmdb_id: 0 },
  { id: 22, name: 'News', tmdb_id: 10763 },
  { id: 23, name: 'Reality', tmdb_id: 10764 },
  { id: 14, name: 'Romance', tmdb_id: 10749 },
  { id: 40, name: 'Sci-Fi & Fantasy', tmdb_id: 10765 },
  { id: 15, name: 'Science Fiction', tmdb_id: 878 },
  { id: 25, name: 'Soap', tmdb_id: 10766 },
  { id: 29, name: 'Sports', tmdb_id: 0 },
  { id: 37, name: 'Supernatural', tmdb_id: 0 },
  { id: 26, name: 'Talk', tmdb_id: 10767 },
  { id: 17, name: 'Thriller', tmdb_id: 53 },
  { id: 35, name: 'Travel', tmdb_id: 0 },
  { id: 38, name: 'TV Movie', tmdb_id: 10770 },
  { id: 18, name: 'War', tmdb_id: 10752 },
  { id: 41, name: 'War & Politics', tmdb_id: 10768 },
  { id: 19, name: 'Western', tmdb_id: 37 }
]
