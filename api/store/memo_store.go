package store

import (
	"time"

	"github.com/jerryshell/my-flomo/api/db"
	"github.com/jerryshell/my-flomo/api/model"
	"github.com/jerryshell/my-flomo/api/util"
)

// MemoListByUserID 按创建时间倒序返回用户全部想法
func MemoListByUserID(userID string) ([]model.Memo, error) {
	var memoList []model.Memo
	err := db.DB.Order("created_at desc").Where("user_id = ?", userID).Find(&memoList).Error
	return memoList, err
}

func MemoGetByID(id string) (model.Memo, error) {
	var memo model.Memo
	err := db.DB.Where("id = ?", id).First(&memo).Error
	return memo, err
}

func MemoCreate(content string, userID string) (*model.Memo, error) {
	logger := util.NewLogger("memo_store")

	id, err := util.NextIDStr()
	if err != nil {
		logger.Error("failed to generate next id", util.ErrorField(err))
		return nil, err
	}

	memo := &model.Memo{
		BaseModel: model.BaseModel{
			ID: id,
		},
		Content: content,
		UserID:  userID,
	}
	err = db.DB.Create(memo).Error

	if err != nil {
		logger.Error("failed to create memo", util.ErrorField(err), util.StringField("memo_id", id), util.StringField("user_id", userID))
	} else {
		logger.Info("memo created successfully", util.StringField("memo_id", id), util.StringField("user_id", userID))
	}

	return memo, err
}

// MemoCreateByTime 按指定时间创建，用于历史数据导入
func MemoCreateByTime(content string, userID string, createdAt time.Time) (*model.Memo, error) {
	logger := util.NewLogger("memo_store")

	id, err := util.NextIDStr()
	if err != nil {
		logger.Error("failed to generate next id", util.ErrorField(err))
		return nil, err
	}

	memo := &model.Memo{
		BaseModel: model.BaseModel{
			ID:        id,
			CreatedAt: createdAt,
		},
		Content: content,
		UserID:  userID,
	}
	err = db.DB.Create(memo).Error

	if err != nil {
		logger.Error("failed to create memo with custom time", util.ErrorField(err), util.StringField("memo_id", id), util.StringField("user_id", userID), util.TimeField("created_at", createdAt))
	} else {
		logger.Info("memo created successfully with custom time", util.StringField("memo_id", id), util.StringField("user_id", userID), util.TimeField("created_at", createdAt))
	}

	return memo, err
}

func MemoSave(memo *model.Memo) error {
	return db.DB.Save(memo).Error
}

// MemoDeleteByID 软删除，记录保留在库中
func MemoDeleteByID(id string) error {
	return db.DB.Delete(&model.Memo{BaseModel: model.BaseModel{ID: id}}).Error
}
