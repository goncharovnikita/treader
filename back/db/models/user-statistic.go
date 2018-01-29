package models

// UserStatistic collects various user statistic data
type UserStatistic struct {
	ID      string                                  `bson:"_id"`
	Lexicon map[string]map[string]map[string]string `json:"Lexicon" bson:"lexicon"`
}
