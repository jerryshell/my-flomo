package handler

import (
	"bytes"
	"encoding/csv"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
	"github.com/jerryshell/my-flomo/api/util"
)

// CsvExport 导出用户全部想法，列顺序与导入一致
func CsvExport(c *gin.Context) {
	token := c.Param("token")
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

	memoList, err := service.MemoListByUserID(user.ID)
	if err != nil {
		log.Println("service.MemoListByUserID :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	bytesBuffer := &bytes.Buffer{}
	csvWriter := csv.NewWriter(bytesBuffer)

	if err := csvWriter.Write([]string{"ID", "CreatedAt", "UpdatedAt", "Content"}); err != nil {
		log.Println("csvWriter.Write :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	// 单行写入失败时跳过该行
	for _, memo := range memoList {
		if err := csvWriter.Write([]string{
			memo.ID,
			memo.CreatedAt.Format(time.DateTime),
			memo.UpdatedAt.Format(time.DateTime),
			memo.Content,
		}); err != nil {
			log.Println("csvWriter.Write :: err", err)
			continue
		}
	}

	csvWriter.Flush()

	c.Writer.Header().Set("Content-Disposition", "attachment; filename=memo.csv")
	c.Data(http.StatusOK, "text/csv", bytesBuffer.Bytes())
}

// CsvImport 从 CSV 导入想法，时间按 Asia/Shanghai 解析
func CsvImport(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	csvFile, err := c.FormFile("csvFile")
	if err != nil {
		log.Println("c.FormFile :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	fileSrc, err := csvFile.Open()
	defer func() {
		_ = fileSrc.Close()
	}()

	if err != nil {
		log.Println("csvFile.Open :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	csvReader := csv.NewReader(fileSrc)
	csvReader.Comma = ','
	csvReader.LazyQuotes = true
	csvReader.TrimLeadingSpace = true
	recordList, err := csvReader.ReadAll()
	if err != nil {
		log.Println("csvReader.ReadAll :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	// 第一行为表头，跳过
	recordList = recordList[1:]

	for _, record := range recordList {
		id := record[0]
		createdAt, err := time.ParseInLocation("2006-01-02 15:04:05", record[1], loc)
		if err != nil {
			log.Println("time.ParseInLocation :: err", err)
			continue
		}
		updatedAt, err := time.ParseInLocation("2006-01-02 15:04:05", record[2], loc)
		if err != nil {
			log.Println("time.ParseInLocation :: err", err)
			continue
		}
		content := record[3]
		memo := &model.Memo{
			BaseModel: model.BaseModel{
				ID:        id,
				CreatedAt: createdAt,
				UpdatedAt: updatedAt,
			},
			UserID:  user.ID,
			Content: content,
		}
		if err := service.MemoSave(memo); err != nil {
			log.Println("service.MemoSave :: err", err)
			continue
		}
	}

	c.JSON(http.StatusOK, result.Success())
}
