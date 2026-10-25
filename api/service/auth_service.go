package service

import (
	"errors"

	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/util"
)

// Register 邮箱不存在时创建账户
func Register(email, password string) (*model.User, error) {
	logger := util.NewLogger("auth_service")

	user, _ := UserGetByEmail(email)
	if user.ID != "" {
		logger.Warn("user already exists", util.StringField("email", email))
		return nil, errors.New("用户已存在")
	}

	user, err := UserCreate(email, password)
	if err != nil {
		logger.Error("failed to create user", util.ErrorField(err), util.StringField("email", email))
		return nil, errors.New("创建用户失败")
	}

	logger.Info("user registered successfully", util.StringField("user_id", user.ID), util.StringField("email", email))
	return user, nil
}
