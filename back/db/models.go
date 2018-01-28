package db

import (
	"github.com/centrypoint/fb2"
)

// Book represents book unit with additional information
type Book fb2.FB2

// GetCollectionName implements Collectioner for Book model
func (b Book) GetCollectionName() string {
	return "books"
}

// Modificate implements Modificatior for Book model
func (b *Book) Modificate() {
	b.ID = b.Description.DocumentInfo.ID
}

// GetModel implements Modeller for Book model
func (b *Book) GetModel() interface{} {
	return b
}

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
}

// GetCollectionName imlements Collectioner for User model
func (u User) GetCollectionName() string {
	return "users"
}

// Modificate implements Modification for User model
func (u *User) Modificate() {

}

// GetModel implements Modeller for Book model
func (u *User) GetModel() interface{} {
	return u
}
