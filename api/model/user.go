package model

// User 账户与每日回顾配置，密码不返回给前端
type User struct {
	BaseModel
	Password           string `json:"-"`
	Email              string `json:"email"`
	PluginToken        string `json:"pluginToken"`
	DailyReviewEnabled bool   `json:"dailyReviewEnabled" gorm:"default:false"`
	TelegramChatID     string `json:"telegramChatId" gorm:"default:''"`
	TelegramBotToken   string `json:"telegramBotToken" gorm:"default:''"`
}
