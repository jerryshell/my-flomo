package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jerryshell/my-flomo/api/config"
	"github.com/jerryshell/my-flomo/api/form"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
	"github.com/jerryshell/my-flomo/api/util"
	"golang.org/x/crypto/bcrypt"
)

// LoginOrRegister 校验邮箱与密码，邮箱未注册时自动创建账户
func LoginOrRegister(c *gin.Context) {
	logger := util.NewLogger("auth_handler")

	var formData = form.UserLoginOrRegisterForm{}
	if err := c.ShouldBindJSON(&formData); err != nil {
		logger.Error("failed to bind JSON for login/register", util.ErrorField(err))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	if emailValidationMessage := util.GetEmailValidationMessage(formData.Email); emailValidationMessage != "" {
		logger.Warn("invalid email format provided", util.StringField("email", formData.Email))
		c.JSON(http.StatusOK, result.ErrorWithMessage(emailValidationMessage))
		return
	}

	user, _ := service.UserGetByEmail(formData.Email)
	if user.ID == "" {
		logger.Info("user not found, proceeding with registration", util.StringField("email", formData.Email))
		userByRegister, err := service.Register(formData.Email, formData.Password)
		if err != nil {
			logger.Error("failed to register user", util.ErrorField(err), util.StringField("email", formData.Email))
			c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
			return
		}
		user = userByRegister
		logger.Info("user registered successfully", util.StringField("user_id", user.ID), util.StringField("email", user.Email))
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(formData.Password)); err != nil {
		logger.Warn("password verification failed", util.ErrorField(err), util.StringField("email", formData.Email))
		c.JSON(http.StatusOK, result.ErrorWithMessage("邮箱或密码错误"))
		return
	}

	now := time.Now()
	expiresAt := now.Add(time.Hour * 24 * 7) // 有效期 7 天
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		IssuedAt:  jwt.NewNumericDate(now),
		Issuer:    "my-flomo-server",
		ExpiresAt: jwt.NewNumericDate(expiresAt),
		Subject:   user.Email,
	}).SignedString([]byte(config.Data.JwtKey))
	if err != nil {
		logger.Error("failed to generate JWT token", util.ErrorField(err), util.StringField("email", user.Email))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	logger.Info("login/register successful", util.StringField("user_id", user.ID), util.StringField("email", user.Email))
	c.JSON(http.StatusOK, result.SuccessWithData(gin.H{
		"email":     user.Email,
		"token":     token,
		"expiresAt": expiresAt.Unix(),
	}))
}

// VerifyToken 校验令牌并返回邮箱
func VerifyToken(c *gin.Context) {
	logger := util.NewLogger("auth_handler")

	tokenString := c.Param("token")
	mapClaims, err := util.VerifyToken(tokenString)
	if err != nil {
		logger.Warn("token verification failed", util.ErrorField(err), util.StringField("token", tokenString))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	email, ok := mapClaims["sub"].(string)
	if !ok {
		logger.Warn("invalid subject claim in token")
		c.JSON(http.StatusOK, result.ErrorWithMessage("无效的令牌声明"))
		return
	}

	logger.Debug("token verified successfully", util.StringField("email", email))
	c.JSON(http.StatusOK, result.SuccessWithData(gin.H{
		"email": email,
	}))
}
