package config

import (
	"os"
	"path/filepath"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// LogConfig 全局日志配置，调用 InitLog 之前为空
var LogConfig *zap.Config

// === 日志配置 ===

// InitLog 按 LOG_LEVEL 生成 zap 配置，LOG_PATH 非空时同时写入文件
func InitLog() {
	logLevel := zapcore.InfoLevel
	development := false

	switch Data.LogLevel {
	case "debug":
		logLevel = zapcore.DebugLevel
		development = true
	case "info":
		logLevel = zapcore.InfoLevel
	case "warn":
		logLevel = zapcore.WarnLevel
	case "error":
		logLevel = zapcore.ErrorLevel
	case "dpanic":
		logLevel = zapcore.DPanicLevel
	case "panic":
		logLevel = zapcore.PanicLevel
	case "fatal":
		logLevel = zapcore.FatalLevel
	}

	LogConfig = &zap.Config{
		Level:       zap.NewAtomicLevelAt(logLevel),
		Development: development,
		Encoding:    "json",
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "time",
			LevelKey:       "level",
			NameKey:        "logger",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "msg",
			StacktraceKey:  "stacktrace",
			LineEnding:     zapcore.DefaultLineEnding,
			EncodeLevel:    zapcore.CapitalLevelEncoder,
			EncodeTime:     zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.SecondsDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
	}

	if Data.LogPath != "" {
		LogConfig.OutputPaths = append(LogConfig.OutputPaths, Data.LogPath)
		LogConfig.ErrorOutputPaths = append(LogConfig.ErrorOutputPaths, Data.LogPath)
	}
}

// GetLogger 返回指定名称的 logger，配置未构建时先初始化
func GetLogger(name string) *zap.Logger {
	if LogConfig == nil {
		InitLog()
	}

	logger, err := LogConfig.Build()
	if err != nil {
		defaultLogger, _ := zap.NewProduction()
		return defaultLogger.Named(name)
	}

	return logger.Named(name)
}

// GetDefaultLogger 返回名为 app 的 logger
func GetDefaultLogger() *zap.Logger {
	return GetLogger("app")
}

// SyncLogger 刷新日志缓冲区
func SyncLogger(logger *zap.Logger) {
	_ = logger.Sync()
}

// === 日志文件 ===

// LogData 单条结构化日志
type LogData struct {
	Timestamp time.Time `json:"timestamp"`
	Level     string    `json:"level"`
	Service   string    `json:"service"`
	Message   string    `json:"message"`
	Data      any       `json:"data,omitempty"`
	Error     string    `json:"error,omitempty"`
}

// SetupLogFile 按 LOG_PATH 创建目录与文件，路径为空时不处理
func SetupLogFile() error {
	if Data.LogPath == "" {
		return nil
	}

	dir := filepath.Dir(Data.LogPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	file, err := os.OpenFile(Data.LogPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	return nil
}
