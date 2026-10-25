package model

// Memo 一条想法记录
type Memo struct {
	BaseModel
	UserID  string `json:"userId"`
	Content string `json:"content"`
}
