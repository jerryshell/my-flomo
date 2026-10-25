package route

import (
	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/handler"
	"github.com/jerryshell/my-flomo/api/middleware"
)

// Setup 注册全部路由，需认证的接口先经过 JWT 中间件
func Setup(app *gin.Engine) {
	app.GET("/health", handler.Health)

	authGroup := app.Group("/auth")
	{
		authGroup.POST("/login", handler.LoginOrRegister)
		authGroup.POST("/verifyToken/token/:token", handler.VerifyToken)
	}

	memoGroup := app.Group("/memo")
	{
		memoGroup.GET("/list", middleware.JWTMiddleware(), handler.MemoList)
		memoGroup.POST("/create", middleware.JWTMiddleware(), handler.MemoCreate)
		memoGroup.POST("/update", middleware.JWTMiddleware(), handler.MemoUpdate)
		memoGroup.POST("/delete/id/:id", middleware.JWTMiddleware(), handler.MemoDeleteByID)
		memoGroup.GET("/dailyReview", handler.MemoDailyReview) // 无鉴权，供定时器或外部调用
	}

	pluginGroup := app.Group("/plugin")
	{
		pluginGroup.GET("/getToken", middleware.JWTMiddleware(), handler.PluginTokenGet)
		pluginGroup.POST("/createToken", middleware.JWTMiddleware(), handler.PluginTokenCreate)
		pluginGroup.POST("/createMemo/:pluginToken", handler.PluginTokenCreateMemo)
		pluginGroup.GET("/randomMemo/:pluginToken", handler.PluginTokenRandomMemo)
	}

	userGroup := app.Group("/user")
	{
		userGroup.GET("/getSettings", middleware.JWTMiddleware(), handler.GetUserSettings)
		userGroup.POST("/updatePassword", middleware.JWTMiddleware(), handler.UpdateUserPassword)
		userGroup.POST("/updateSettings", middleware.JWTMiddleware(), handler.UpdateUserSettings)
	}

	app.POST("/upload", middleware.JWTMiddleware(), handler.Upload)
	app.POST("/deleteMyAccount", middleware.JWTMiddleware(), handler.DeleteMyAccount)
	app.GET("/csvExport/token/:token", handler.CsvExport) // 令牌放在路径中，供浏览器直接下载
	app.POST("/csvImport", middleware.JWTMiddleware(), handler.CsvImport)
}
