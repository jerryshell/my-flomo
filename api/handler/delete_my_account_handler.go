package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/db"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/result"
)

// DeleteMyAccount 物理删除当前用户的想法与账户，软删除记录也不保留
func DeleteMyAccount(c *gin.Context) {
	user := c.MustGet("user").(*model.User)
	db.DB.Unscoped().Delete(model.Memo{}, "user_id = ?", user.ID)
	db.DB.Unscoped().Delete(model.User{}, "id = ?", user.ID)
	c.JSON(http.StatusOK, result.SuccessWithDataAndMessage(nil, "账户及全部数据已永久删除"))
}
