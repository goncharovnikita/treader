package reader

// BookReader interface
type BookReader interface {
	ReadBook(data []byte) ([]string, error)
}
