package db

import (
	"./models"
)

// **** BOOK ****

// Book represents book unit with additional information
type Book models.Book

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

/**** User ****/

// User model, containing user info and related books
type User models.User

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

// **** UserBook ****

// UserBook type
// type UserBook models.UserBook

// **** UserStatistic ****

// UserStatistic type
type UserStatistic models.UserStatistic

// GetCollectionName implements Collectioner for UserStatistic model
func (u UserStatistic) GetCollectionName() string {
	return "user-statistics"
}

// Modificate implements Modificatior for UserStatistic model
func (u *UserStatistic) Modificate() {

}

// GetModel implements Modeller for UserStatistic model
func (u *UserStatistic) GetModel() interface{} {
	return u
}
