package handler

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/form"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
)

// PluginTokenGet 返回当前插件令牌
func PluginTokenGet(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	if user.PluginToken == "" {
		c.JSON(http.StatusOK, result.ErrorWithMessage("当前没有插件令牌，请重新生成"))
		return
	}

	c.JSON(http.StatusOK, result.SuccessWithData(user.PluginToken))
}

// PluginTokenCreate 兼容 Flomo 插件接口，重新生成令牌
func PluginTokenCreate(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	user, err := service.UserUpdatePluginToken(user.ID)
	if err != nil {
		log.Println("service.UserUpdatePluginToken :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	c.JSON(http.StatusOK, result.SuccessWithData(user.PluginToken))
}

// PluginTokenCreateMemo 兼容 Flomo 插件接口，用令牌写入想法
func PluginTokenCreateMemo(c *gin.Context) {
	token := c.Param("pluginToken")
	if token == "" {
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "插件令牌为空",
		})
		return
	}

	user, err := service.UserGetByPluginToken(token)
	if err != nil {
		log.Println("service.UserGetByPluginToken :: err", err)
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "令牌无效",
		})
		return
	}

	formData := &form.MemoCreateForm{}
	if err = c.ShouldBindJSON(&formData); err != nil {
		log.Println("c.ShouldBindJSON :: err", err)
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: err.Error(),
		})
		return
	}

	content := strings.TrimSpace(formData.Content)
	if len(content) == 0 {
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "内容不能为空",
		})
		return
	}

	memo, err := service.MemoCreate(content, user.ID)
	if err != nil {
		log.Println("service.MemoCreate :: err", err)
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result.BaseResult{
		Code:    0,
		Success: true,
		Message: "已记录",
		Data:    memo,
	})
}

// PluginTokenRandomMemo 用令牌随机返回一条想法
func PluginTokenRandomMemo(c *gin.Context) {
	token := c.Param("pluginToken")
	if token == "" {
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "插件令牌为空",
		})
		return
	}

	user, err := service.UserGetByPluginToken(token)
	if err != nil {
		log.Println("service.UserGetByPluginToken :: err", err)
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "令牌无效",
		})
		return
	}

	memo, err := service.MemoGetRandomByUserID(user.ID)
	if err != nil {
		log.Println("service.MemoGetRandomByUserID :: err", err)
		c.JSON(http.StatusOK, result.BaseResult{
			Code:    -1,
			Success: false,
			Message: "获取想法失败",
		})
		return
	}

	c.JSON(http.StatusOK, result.BaseResult{
		Code:    0,
		Success: true,
		Message: "获取成功",
		Data:    memo,
	})
}
