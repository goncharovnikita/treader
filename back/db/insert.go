package db

// Insert performs inserting document to database
func Insert(c CollectingModificator) (err error) {
	// if allowedModel := isTypeAllowed(c); !allowedModel {
	// 	return errors.New("cannot insert unallowed model")
	// }

	c.Modificate()

	sess := session.Copy()
	defer sess.Close()

	err = sess.DB(dbName).C(c.GetCollectionName()).Insert(c)

	return
}

// Add performs updating or creating new document in database
// func Add(c CollectingModificator) (err error) {
// 	c.Modificate()

// 	return
// }
