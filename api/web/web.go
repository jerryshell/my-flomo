package web

import (
	"embed"
	"io/fs"
	"net/http"
	pathpkg "path"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/result"
)

//go:embed all:public
var publicFS embed.FS

// apiPrefixes 已注册的接口前缀，未匹配时返回 JSON 404
var apiPrefixes = []string{
	"/auth",
	"/memo",
	"/plugin",
	"/user",
	"/upload",
	"/deleteMyAccount",
	"/csvExport",
	"/health",
}

// Setup 注册前端静态资源与单页应用回退
func Setup(app *gin.Engine) {
	dist, err := fs.Sub(publicFS, "public")
	if err != nil {
		panic("前端资源目录缺失：" + err.Error())
	}

	files := http.FileServer(http.FS(dist))

	app.NoRoute(func(c *gin.Context) {
		requestPath := c.Request.URL.Path

		if c.Request.Method != http.MethodGet && c.Request.Method != http.MethodHead {
			apiNotFound(c)
			return
		}
		if isAPIPath(requestPath) {
			apiNotFound(c)
			return
		}

		// 带哈希的静态资源可长期缓存
		if strings.HasPrefix(requestPath, "/assets/") {
			c.Header("Cache-Control", "public, max-age=31536000, immutable")
		}

		if requestPath != "/" {
			if _, err := fs.Stat(dist, strings.TrimPrefix(requestPath, "/")); err == nil {
				files.ServeHTTP(c.Writer, c.Request)
				return
			}
			// 缺失的静态文件直接 404，避免返回页面内容
			if pathpkg.Ext(requestPath) != "" {
				c.String(http.StatusNotFound, "资源不存在")
				return
			}
		}

		index, err := fs.ReadFile(dist, "index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "前端资源未构建，请在 web 目录执行 bun run build")
			return
		}

		c.Header("Cache-Control", "no-cache")
		c.Data(http.StatusOK, "text/html; charset=utf-8", index)
	})
}

func apiNotFound(c *gin.Context) {
	c.JSON(http.StatusNotFound, result.BaseResult{
		Success: false,
		Code:    http.StatusNotFound,
		Message: "接口不存在",
		Data:    nil,
	})
}

func isAPIPath(path string) bool {
	for _, prefix := range apiPrefixes {
		if path == prefix || strings.HasPrefix(path, prefix+"/") {
			return true
		}
	}
	return false
}
