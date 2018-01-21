package reader

import (
	"github.com/centrypoint/fb2"
)

// BookReader interface
type BookReader interface {
	ReadBook(data []byte) (words []string, bookInfo fb2.FB2, err error)
}
