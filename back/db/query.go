package db

import (
	"gopkg.in/mgo.v2/bson"
)

// GetOne querying model from database by specified ID
func GetOne(id string, c CollectingModeller) (err error) {
	// if allowedModel := isTypeAllowed(c); !allowedModel {
	// 	return errors.New("cannot get unallowed model")
	// }

	sess := session.Copy()
	defer sess.Close()

	err = sess.DB(dbName).C(c.GetCollectionName()).Find(bson.M{"_id": id}).One(c.GetModel())

	return
}
