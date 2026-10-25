package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/form"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
	"github.com/jerryshell/my-flomo/api/util"
)

// MemoList 返回当前用户全部想法
func MemoList(c *gin.Context) {
	logger := util.NewLogger("memo_handler")

	user := c.MustGet("user").(*model.User)
	memoList, err := service.MemoListByUserID(user.ID)
	if err != nil {
		logger.Error("failed to get memo list by user id", util.ErrorField(err), util.StringField("user_id", user.ID))
		c.JSON(http.StatusInternalServerError, result.ErrorWithMessage(err.Error()))
		return
	}

	logger.Debug("memo list retrieved successfully", util.StringField("user_id", user.ID), util.IntField("memo_count", len(memoList)))
	c.JSON(http.StatusOK, result.SuccessWithData(memoList))
}

// MemoCreate 内容去空格后入库，空内容拒绝
func MemoCreate(c *gin.Context) {
	logger := util.NewLogger("memo_handler")

	formData := &form.MemoCreateForm{}
	if err := c.ShouldBindJSON(formData); err != nil {
		logger.Error("failed to bind JSON for memo create", util.ErrorField(err))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	content := strings.TrimSpace(formData.Content)
	if len(content) == 0 {
		logger.Warn("memo create request with empty content", util.StringField("user_id", c.MustGet("user").(*model.User).ID))
		c.JSON(http.StatusOK, result.ErrorWithMessage("内容不能为空"))
		return
	}

	user := c.MustGet("user").(*model.User)

	memo, err := service.MemoCreate(content, user.ID)
	if err != nil {
		logger.Error("failed to create memo", util.ErrorField(err), util.StringField("user_id", user.ID))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	logger.Info("memo created successfully", util.StringField("memo_id", memo.ID), util.StringField("user_id", user.ID))
	c.JSON(http.StatusOK, result.SuccessWithData(memo))
}

// MemoUpdate 按 ID 更新想法内容
func MemoUpdate(c *gin.Context) {
	logger := util.NewLogger("memo_handler")

	formData := &form.MemoUpdateForm{}
	if err := c.ShouldBindJSON(&formData); err != nil {
		logger.Error("failed to bind JSON for memo update", util.ErrorField(err))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	memo, err := service.MemoUpdate(formData.ID, formData.Content)
	if err != nil {
		logger.Error("failed to update memo", util.ErrorField(err), util.StringField("memo_id", formData.ID))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	logger.Info("memo updated successfully", util.StringField("memo_id", memo.ID))
	c.JSON(http.StatusOK, result.SuccessWithData(memo))
}

// MemoDeleteByID 删除单条想法
func MemoDeleteByID(c *gin.Context) {
	logger := util.NewLogger("memo_handler")

	id := c.Param("id")
	if err := service.MemoDeleteByID(id); err != nil {
		logger.Error("failed to delete memo by id", util.ErrorField(err), util.StringField("memo_id", id))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	logger.Info("memo deleted successfully", util.StringField("memo_id", id))
	c.JSON(http.StatusOK, result.Success())
}

// MemoDailyReview 手动触发一次每日回顾，与定时任务共用逻辑
func MemoDailyReview(c *gin.Context) {
	logger := util.NewLogger("memo_handler")

	if err := service.MemoDailyReview(); err != nil {
		logger.Error("failed to execute memo daily review", util.ErrorField(err))
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	logger.Info("memo daily review executed successfully")
	c.JSON(http.StatusOK, result.Success())
}
