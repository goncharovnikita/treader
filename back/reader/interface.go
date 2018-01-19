package reader

// BookInfo type
type BookInfo struct {
	Author string `json:"author"`
	Genre  string `json:"genre"`
}

// BookReader interface
type BookReader interface {
	ReadBook(data []byte) (words []string, bookInfo BookInfo, content []string, err error)
}
