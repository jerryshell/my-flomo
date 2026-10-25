package store

import (
	"github.com/jerryshell/my-flomo/api/db"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/util"
)

func UserListByEmailIsNotNull() ([]model.User, error) {
	var userList []model.User
	err := db.DB.Where("email is not null").Order("created_at desc").Find(&userList).Error
	return userList, err
}

// UserListWithTelegramConfig 返回同时填写 Chat ID 与 Bot Token 的用户
func UserListWithTelegramConfig() ([]model.User, error) {
	var userList []model.User
	err := db.DB.Where("telegram_chat_id != '' AND telegram_bot_token != ''").Order("created_at desc").Find(&userList).Error
	return userList, err
}

func UserGetByID(id string) (*model.User, error) {
	logger := util.NewLogger("user_store")

	user := &model.User{}
	if err := db.DB.First(user, id).Error; err != nil {
		logger.Error("failed to get user by id", util.ErrorField(err), util.StringField("user_id", id))
		return nil, err
	}

	logger.Debug("user retrieved by id", util.StringField("user_id", id))
	return user, nil
}

func UserGetByEmail(email string) (*model.User, error) {
	user := &model.User{}
	err := db.DB.Where("email = ?", email).First(user).Error
	return user, err
}

func UserGetByPluginToken(token string) (*model.User, error) {
	user := &model.User{}
	err := db.DB.Where("plugin_token = ?", token).First(user).Error
	return user, err
}

func UserCreate(email string, password string) (*model.User, error) {
	logger := util.NewLogger("user_store")

	id, err := util.NextIDStr()
	if err != nil {
		logger.Error("failed to generate next id", util.ErrorField(err))
		return nil, err
	}

	user := &model.User{
		BaseModel: model.BaseModel{
			ID: id,
		},
		Email:    email,
		Password: password,
	}
	err = db.DB.Create(user).Error

	if err != nil {
		logger.Error("failed to create user", util.ErrorField(err), util.StringField("user_id", id), util.StringField("email", email))
	} else {
		logger.Info("user created successfully", util.StringField("user_id", id), util.StringField("email", email))
	}

	return user, err
}

func UserSave(user *model.User) error {
	return db.DB.Save(user).Error
}
