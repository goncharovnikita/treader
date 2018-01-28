package db

func isTypeAllowed(v interface{}) (result bool) {
	_, ok := v.(*Book)
	if ok {
		result = true
	}

	return result
}
