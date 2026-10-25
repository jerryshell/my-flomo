package main

import (
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/config"
	"github.com/jerryshell/my-flomo/api/route"
	"github.com/jerryshell/my-flomo/api/service"
	"github.com/jerryshell/my-flomo/api/util"
	"github.com/jerryshell/my-flomo/api/web"
	"github.com/robfig/cron/v3"
)

func main() {
	// === 定时任务 ===
	initCron()

	// === HTTP 服务 ===
	app := gin.Default()

	// 允许全部来源与请求头，适合本机或内网自托管
	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: true,
	}))

	route.Setup(app)
	web.Setup(app)

	_ = app.Run(config.Data.Host + ":" + strconv.Itoa(config.Data.Port))
}

// initCron 按 CRON_SPEC 触发每日回顾，默认每天 20:00
func initCron() {
	logger := util.NewLogger("cron")

	c := cron.New()
	_, err := c.AddFunc(config.Data.CronSpec, func() {
		logger.Info("cron job started", util.StringField("cron_spec", config.Data.CronSpec))
		err := service.MemoDailyReview()
		if err != nil {
			logger.Error("memo daily review failed", util.ErrorField(err))
			return
		}
		logger.Info("cron job completed successfully")
	})
	if err != nil {
		logger.Fatal("failed to add cron function", util.ErrorField(err))
	}
	c.Start()

	logger.Info("cron scheduler started")
}
