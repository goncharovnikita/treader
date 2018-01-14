package reader

// BookInfo type
type BookInfo struct {
	Author  string   `json:"author"`
	Genre   string   `json:"genre"`
	Content []string `json:"content"`
}

// BookReader interface
type BookReader interface {
	ReadBook(data []byte) (words []string, bookInfo BookInfo, err error)
}
