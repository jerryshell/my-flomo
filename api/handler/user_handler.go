package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/form"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
)

// UpdateUserPassword 修改当前用户密码，新密码不能为空
func UpdateUserPassword(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	formData := &form.UserUpdatePasswordForm{}
	if err := c.BindJSON(formData); err != nil {
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	password := strings.TrimSpace(formData.Password)
	if len(password) == 0 {
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "密码不能为空",
		})
		return
	}

	if _, err := service.UserUpdatePassword(user.ID, password); err != nil {
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	c.JSON(http.StatusOK, result.Success())
}

// GetUserSettings 返回每日回顾与 Telegram 配置，密码等字段不下发
func GetUserSettings(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	userWithSettings, err := service.UserGetSettings(user.ID)
	if err != nil {
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	settings := map[string]interface{}{
		"dailyReviewEnabled": userWithSettings.DailyReviewEnabled,
		"telegramChatId":     userWithSettings.TelegramChatID,
		"telegramBotToken":   userWithSettings.TelegramBotToken,
	}

	c.JSON(http.StatusOK, result.SuccessWithData(settings))
}

// UpdateUserSettings 保存每日回顾开关与 Telegram 配置
func UpdateUserSettings(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	formData := &form.UserUpdateSettingsForm{}
	if err := c.BindJSON(formData); err != nil {
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	if _, err := service.UserUpdateSettings(user.ID, formData.DailyReviewEnabled, formData.TelegramChatID, formData.TelegramBotToken); err != nil {
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	c.JSON(http.StatusOK, result.Success())
}
