package handler

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/result"
	"github.com/jerryshell/my-flomo/api/service"
)

// loc Flomo 导出文件中的时间为 Asia/Shanghai
var loc, _ = time.LoadLocation("Asia/Shanghai")

// Upload 解析 Flomo 导出的 HTML，按 .memo 节点逐条写入
func Upload(c *gin.Context) {
	user := c.MustGet("user").(*model.User)

	form, err := c.MultipartForm()
	if err != nil {
		log.Println("c.MultipartForm :: err", err)
		c.JSON(http.StatusOK, result.ErrorWithMessage(err.Error()))
		return
	}

	for _, file := range form.File["uploadFileList[]"] {
		fileSrc, err := file.Open()
		if err != nil {
			log.Println("file.Open :: err", err)
			continue
		}

		doc, err := goquery.NewDocumentFromReader(fileSrc)
		if err != nil {
			log.Println("goquery.NewDocumentFromReader :: err", err)
			continue
		}

		doc.Find(".memo").Each(func(i int, memoElement *goquery.Selection) {
			// 时间取 .time，内容取 .content 下的全部段落
			timeElement := memoElement.Find(".time").First()
			timeStr := strings.TrimSpace(timeElement.Text())
			memoTime, err := time.ParseInLocation("2006-01-02 15:04:05", timeStr, loc)
			if err != nil {
				log.Println("time.ParseInLocation :: err", err)
				return
			}

			var memoContent string
			memoElement.Find(".content p").Each(func(i int, p *goquery.Selection) {
				memoContent += strings.TrimSpace(p.Text()) + "\n"
			})
			memoContent = strings.TrimSpace(memoContent)

			if _, err := service.MemoCreateByTime(memoContent, user.ID, memoTime); err != nil {
				log.Println("service.MemoCreate :: err", err)
			}
		})
	}

	c.JSON(http.StatusOK, result.Success())
}
