package db

import "gopkg.in/mgo.v2/bson"

// Update updates model
func Update(id string, c CollectingModeller) (err error) {
	sess := session.Copy()
	defer sess.Close()

	err = sess.DB(dbName).C(c.GetCollectionName()).Update(bson.M{"_id": id}, c.GetModel())

	return
}
