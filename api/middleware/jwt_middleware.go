package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
	"github.com/jerryshell/my-flomo/api/util"
)

// JWTMiddleware 校验请求头 token，并把邮箱与用户写入上下文
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("token")
		if token == "" {
			c.Abort()
			c.JSON(http.StatusOK, result.TokenError())
			return
		}

		email, err := util.GetEmailFromJWT(token)
		if err != nil {
			log.Println("util.GetEmailFromJWT :: err", err)
			c.Abort()
			c.JSON(http.StatusOK, result.TokenErrorWithMessage(err.Error()))
			return
		}
		c.Set("email", email)

		user, err := service.UserGetByEmail(email)
		if err != nil {
			log.Println("service.UserGetByEmail :: err", err)
			c.Abort()
			c.JSON(http.StatusOK, result.TokenErrorWithMessage(err.Error()))
			return
		}
		if user.ID == "" {
			c.Abort()
			c.JSON(http.StatusOK, result.TokenErrorWithMessage("用户不存在"))
			return
		}
		c.Set("user", user)

		c.Next()
	}
}
