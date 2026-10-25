package service

import (
	"crypto/rand"
	"errors"
	"math/big"

	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/store"
	"github.com/jerryshell/my-flomo/api/util"
	"golang.org/x/crypto/bcrypt"
)

// === 查询 ===

func UserListByEmailIsNotNull() ([]model.User, error) {
	return store.UserListByEmailIsNotNull()
}

func UserListWithTelegramConfig() ([]model.User, error) {
	return store.UserListWithTelegramConfig()
}

func UserGetByEmail(email string) (*model.User, error) {
	return store.UserGetByEmail(email)
}

// === 创建与更新 ===

func UserCreate(email string, password string) (*model.User, error) {
	logger := util.NewLogger("user_service")

	passwordBcrypt, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("failed to generate password hash", util.ErrorField(err))
		return nil, errors.New("密码加密失败")
	}

	user, err := store.UserCreate(email, string(passwordBcrypt))
	if err != nil {
		logger.Error("failed to create user in store", util.ErrorField(err), util.StringField("email", email))
		return nil, err
	}

	logger.Info("user created successfully", util.StringField("user_id", user.ID), util.StringField("email", email))
	return user, nil
}

func UserUpdatePassword(userID string, password string) (*model.User, error) {
	logger := util.NewLogger("user_service")

	user, err := store.UserGetByID(userID)
	if err != nil {
		logger.Error("failed to get user by id", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}
	if user.ID == "" {
		logger.Warn("user not found", util.StringField("user_id", userID))
		return nil, errors.New("未找到对应用户")
	}

	passwordBcrypt, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		logger.Error("failed to generate password hash", util.ErrorField(err))
		return nil, errors.New("密码加密失败")
	}

	user.Password = string(passwordBcrypt)
	if err = store.UserSave(user); err != nil {
		logger.Error("failed to save user", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}

	logger.Info("user password updated successfully", util.StringField("user_id", userID))
	return user, nil
}

func UserGetByPluginToken(token string) (*model.User, error) {
	return store.UserGetByPluginToken(token)
}

func UserUpdatePluginToken(userID string) (*model.User, error) {
	logger := util.NewLogger("user_service")

	user, err := store.UserGetByID(userID)
	if err != nil {
		logger.Error("failed to get user by id", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}
	if user.ID == "" {
		logger.Warn("user not found", util.StringField("user_id", userID))
		return nil, errors.New("未找到对应用户")
	}

	// 令牌由 32 位字母与数字组成
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	tokenLength := 32
	token := make([]byte, tokenLength)

	for i := range token {
		randomIndex, gen_err := rand.Int(rand.Reader, big.NewInt(int64(len(charset))))
		if gen_err != nil {
			logger.Error("failed to generate random token", util.ErrorField(gen_err))
			return nil, errors.New("生成随机令牌失败")
		}
		token[i] = charset[randomIndex.Int64()]
	}

	user.PluginToken = string(token)

	if err = store.UserSave(user); err != nil {
		logger.Error("failed to save user with new plugin token", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}

	logger.Info("user plugin token updated successfully", util.StringField("user_id", userID))
	return user, nil
}

func UserGetSettings(userID string) (*model.User, error) {
	logger := util.NewLogger("user_service")

	user, err := store.UserGetByID(userID)
	if err != nil {
		logger.Error("failed to get user by id", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}
	if user.ID == "" {
		logger.Warn("user not found", util.StringField("user_id", userID))
		return nil, errors.New("未找到对应用户")
	}

	logger.Debug("user settings retrieved successfully", util.StringField("user_id", userID), util.BoolField("daily_review_enabled", user.DailyReviewEnabled))
	return user, nil
}

func UserUpdateSettings(userID string, dailyReviewEnabled bool, telegramChatID string, telegramBotToken string) (*model.User, error) {
	logger := util.NewLogger("user_service")

	user, err := store.UserGetByID(userID)
	if err != nil {
		logger.Error("failed to get user by id", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}
	if user.ID == "" {
		logger.Warn("user not found", util.StringField("user_id", userID))
		return nil, errors.New("未找到对应用户")
	}

	user.DailyReviewEnabled = dailyReviewEnabled
	user.TelegramChatID = telegramChatID
	user.TelegramBotToken = telegramBotToken
	if err = store.UserSave(user); err != nil {
		logger.Error("failed to save user settings", util.ErrorField(err), util.StringField("user_id", userID))
		return nil, err
	}

	logger.Info("user settings updated successfully", util.StringField("user_id", userID), util.BoolField("daily_review_enabled", dailyReviewEnabled))
	return user, nil
}
