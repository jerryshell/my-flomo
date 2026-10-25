package db

import (
	"github.com/jerryshell/my-flomo/api/config"
	"github.com/jerryshell/my-flomo/api/model"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// init 启动时打开 SQLite 并自动迁移表结构
func init() {
	dsn := config.Data.DSN
	db, _ := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	DB = db

	if err := db.AutoMigrate(&model.Memo{}); err != nil {
		panic("Memo autoMigrate failed")
	}

	if err := db.AutoMigrate(&model.User{}); err != nil {
		panic("User autoMigrate failed")
	}
}
