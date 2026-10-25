package util

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jerryshell/my-flomo/api/config"
)

// VerifyToken 校验签名与有效期，返回 JWT 声明
func VerifyToken(tokenString string) (jwt.MapClaims, error) {
	logger := NewLogger("jwt_util")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			logger.Warn("unsupported signing method", StringField("algorithm", fmt.Sprintf("%v", token.Header["alg"])))
			return nil, fmt.Errorf("不支持的签名方法：%v", token.Header["alg"])
		}
		return []byte(config.Data.JwtKey), nil
	})
	if err != nil {
		logger.Error("failed to parse jwt token", ErrorField(err))
		return nil, err
	}
	if !token.Valid {
		logger.Warn("invalid jwt token")
		return nil, errors.New("令牌无效")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		logger.Warn("invalid token claims type")
		return nil, errors.New("无效的令牌声明")
	}

	logger.Debug("jwt token verified successfully")
	return claims, nil
}

// GetEmailFromJWT 从 sub 声明读取登录邮箱
func GetEmailFromJWT(token string) (string, error) {
	mapClaims, err := VerifyToken(token)
	if err != nil {
		return "", err
	}
	email, ok := mapClaims["sub"].(string)
	if !ok {
		return "", errors.New("无效的令牌主体")
	}
	return email, nil
}
