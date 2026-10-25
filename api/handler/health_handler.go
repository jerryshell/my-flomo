package handler

import (
	"net/http"
	"runtime"
	"runtime/debug"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/result"
)

// buildInfo 启动时读取一次构建信息，避免每次请求重复读取
var buildInfo = struct {
	commit    string
	goVersion string
	buildTime string
	initTime  time.Time
}{
	initTime: time.Now(),
}

// init 从 Go 构建信息中读取提交号与构建时间
func init() {
	if info, ok := debug.ReadBuildInfo(); ok {
		for _, setting := range info.Settings {
			switch setting.Key {
			case "vcs.revision":
				buildInfo.commit = setting.Value
			case "vcs.time":
				buildInfo.buildTime = setting.Value
			}
		}
		buildInfo.goVersion = info.GoVersion
	}
}

// getBuildMode 无提交号时视为 go run 运行
func getBuildMode() string {
	if buildInfo.commit == "" {
		return "development (go run)"
	}

	// 有 ldflags 时视为正式构建
	if info, ok := debug.ReadBuildInfo(); ok {
		for _, setting := range info.Settings {
			if setting.Key == "-ldflags" {
				return "release"
			}
		}
	}

	return "unknown"
}

// Health 返回服务状态、版本、运行时与内存信息
func Health(c *gin.Context) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	data := gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Unix(),
		"uptime":    time.Since(buildInfo.initTime).String(),
		"version": gin.H{
			"commit":     buildInfo.commit,
			"go_version": buildInfo.goVersion,
			"build_time": buildInfo.buildTime,
			"build_mode": getBuildMode(),
		},
		"runtime": gin.H{
			"go_os":         runtime.GOOS,
			"go_arch":       runtime.GOARCH,
			"num_goroutine": runtime.NumGoroutine(),
			"num_cpu":       runtime.NumCPU(),
		},
		"memory": gin.H{
			"alloc":       m.Alloc,
			"total_alloc": m.TotalAlloc,
			"sys":         m.Sys,
			"num_gc":      m.NumGC,
		},
	}

	c.JSON(http.StatusOK, result.BaseResult{
		Code:    http.StatusOK,
		Success: true,
		Message: "Server Online",
		Data:    data,
	})
}
