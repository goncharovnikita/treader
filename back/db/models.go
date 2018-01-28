package db

import "encoding/xml"

// Book represents book unit with additional information
type Book struct {
	ID          string   `json:"_id" bson:"_id"`
	FictionBook string   `json:"FictionBook" bson:"FictionBook"`
	Stylesheet  []string `json:"Stylesheet" bson:"Stylesheet"`
	Description struct {
		TitleInfo struct {
			Genre      []string `json:"Genre" bson:"Genre"`
			GenreType  []string `json:"GenreType" bson:"GenreType"`
			Author     []AuthorType
			BookTitle  string `json:"BookTitle" bson:"BookTitle"`
			Annotation string `json:"Annotation" bson:"Annotation"`
			Keywords   string `json:"Keywords" bson:"Keywords"`
			Date       string `json:"Date" bson:"Date"`
			Coverpage  struct {
				Image struct {
					Href string `json:"Href" bson:"Href"`
				} `json:"Image" bson:"Image"`
			} `json:"Coverpage" bson:"Coverpage"`
			Lang       string     `json:"Lang" bson:"Lang"`
			SrcLang    string     `json:"SrcLang" bson:"SrcLang"`
			Translator AuthorType `json:"Translator" bson:"Translator"`
			Sequence   string     `json:"Sequence" bson:"Sequence"`
		} `json:"TitleInfo" bson:"TitleInfo"`
		DocumentInfo struct {
			Author      []AuthorType `json:"Author" bson:"Author"`
			ProgramUsed string       `json:"ProgramUsed" bson:"ProgramUsed"`
			Date        string       `json:"Date" bson:"Date"`
			SrcURL      []string     `json:"SrcURL" bson:"SrcURL"`
			SrcOcr      string       `json:"SrcOcr" bson:"SrcOcr"`
			ID          string       `json:"ID" bson:"ID"`
			Version     float64      `json:"Version" bson:"Version"`
			History     string       `json:"History" bson:"History"`
		} `json:"DocumentInfo" bson:"DocumentInfo"`
		PublishInfo struct {
			BookName  string `json:"BookName" bson:"BookName"`
			Publisher string `json:"Publisher" bson:"Publisher"`
			City      string `json:"city" bson:"city"`
			Year      int    `json:"Year" bson:"Year"`
			ISBN      string `json:"ISBN" bson:"ISBN"`
			Sequence  string `json:"Sequence" bson:"Sequence"`
		} `json:"PublishInfo" bson:"PublishInfo"`
		CustomInfo []struct {
			InfoType xml.Attr `json:"InfoType" bson:"InfoType"`
		} `json:"CustomInfo" bson:"CustomInfo"`
	} `json:"Description" bson:"Description"`
	Body struct {
		Sections []struct {
			P []string `json:"P" bson:"P"`
		} `json:"Section" bson:"Section"`
	} `json:"Body" bson:"Body"`
	Binary []struct {
		Value       string `json:"Value,chardata" bson:"Value,chardata"`
		ContentType string `json:"ContentType" bson:"ContentType"`
		ID          string `json:"ID" bson:"ID"`
	} `json:"Binary" bson:"Binary"`
}

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

// AuthorType embedded type, represents author info
type AuthorType struct {
	FirstName  string `json:"FirstName" bson:"FirstName"`
	MiddleName string `json:"MiddleName" bson:"MiddleName"`
	LastName   string `json:"LastName" bson:"LastName"`
	Nickname   string `json:"Nickname" bson:"Nickname"`
	HomePage   string `json:"Page" bson:"Page"`
	Email      string `json:"Email" bson:"Email"`
}

// TextFieldType embedded type, represents text field
type TextFieldType struct {
}

// TitleType embedded type, represents title type fields
type TitleType struct {
	P         []string `json:"P" bson:"P" `
	EmptyLine []string `json:"Line" bson:"Line" `
}
