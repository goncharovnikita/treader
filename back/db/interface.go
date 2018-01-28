package db

// Inserter provide Insert method, to perform insertion of any
// model to the database
type Inserter interface {
	Insert(interface{}) error
}

// Collectioner provide GetCollectionName method, to detect to which collection
// model belongs to
type Collectioner interface {
	GetCollectionName() string
}

// Modeller provide GetModel method, to reflect model struct
type Modeller interface {
	GetModel() interface{}
}

// Modificator provide Modificate method, to modify model before inserting to database
type Modificator interface {
	Modificate()
}

// CollectingModificator is Collectioner and Modificator union
type CollectingModificator interface {
	Collectioner
	Modificator
}

// CollectingModeller is Collectioner and Modeller union
type CollectingModeller interface {
	Collectioner
	Modeller
}
