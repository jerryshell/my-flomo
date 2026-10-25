package util

import (
	"time"

	"github.com/jerryshell/my-flomo/api/config"
	"go.uber.org/zap"
)

// Logger 在 zap 基础上附带服务名
type Logger struct {
	*zap.Logger
}

// NewLogger 创建带服务名的 logger
func NewLogger(service string) *Logger {
	logger := config.GetLogger(service)
	return &Logger{Logger: logger}
}

// === 日志方法 ===

func (l *Logger) Debug(msg string, fields ...zap.Field) {
	l.Logger.Debug(msg, fields...)
}

func (l *Logger) Info(msg string, fields ...zap.Field) {
	l.Logger.Info(msg, fields...)
}

func (l *Logger) Warn(msg string, fields ...zap.Field) {
	l.Logger.Warn(msg, fields...)
}

func (l *Logger) Error(msg string, fields ...zap.Field) {
	l.Logger.Error(msg, fields...)
}

func (l *Logger) Fatal(msg string, fields ...zap.Field) {
	l.Logger.Fatal(msg, fields...)
}

// === 字段快捷方法 ===

func StringField(key, value string) zap.Field {
	return zap.String(key, value)
}

func IntField(key string, value int) zap.Field {
	return zap.Int(key, value)
}

func ErrorField(err error) zap.Field {
	return zap.Error(err)
}

func TimeField(key string, value time.Time) zap.Field {
	return zap.Time(key, value)
}

func BoolField(key string, value bool) zap.Field {
	return zap.Bool(key, value)
}
