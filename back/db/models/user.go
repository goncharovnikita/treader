package models

// User model, containing user info and related books
type User struct {
	ID    string              `json:"id" bson:"_id"`
	Books map[string]UserBook `json:"books" bson:"books"`
}

// UserBook type
type UserBook struct {
	ID             string `json:"ID" bson:"id"`
	LastPage       int    `json:"LastPage" bson:"last_page"`
	LastTotalPages int    `json:"LastTotalPages" bson:"last_total_pages"`
	LastOpenedDate string `json:"LastOpenedDate" bson:"last_opened_date"`
	TotalOpenings  int    `json:"TotalOpenings" bson:"total_openings"`
	LastReadWords  int    `json:"LastReadWords" bson:"last_read_words"`
	Read           bool   `json:"Read" bson:"read"`
}
