package result

import "net/http"

// BaseResult 统一响应结构，code 与 HTTP 状态码含义一致
type BaseResult struct {
	Success bool        `json:"success"`
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// === 成功 ===

func Success() *BaseResult {
	return &BaseResult{
		Success: true,
		Code:    200,
		Message: "success",
		Data:    nil,
	}
}

func SuccessWithData(data interface{}) *BaseResult {
	return &BaseResult{
		Success: true,
		Code:    200,
		Message: "success",
		Data:    data,
	}
}

func SuccessWithDataAndMessage(data interface{}, message string) *BaseResult {
	return &BaseResult{
		Success: true,
		Code:    200,
		Message: message,
		Data:    data,
	}
}

// === 失败 ===

func Error() *BaseResult {
	return &BaseResult{
		Success: false,
		Code:    http.StatusBadRequest,
		Message: "error",
		Data:    nil,
	}
}

func ErrorWithMessage(message string) *BaseResult {
	return &BaseResult{
		Success: false,
		Code:    http.StatusBadRequest,
		Message: message,
		Data:    nil,
	}
}

// === 令牌错误 ===

func TokenError() *BaseResult {
	return &BaseResult{
		Success: false,
		Code:    http.StatusUnauthorized,
		Message: "令牌无效",
		Data:    nil,
	}
}

func TokenErrorWithMessage(message string) *BaseResult {
	return &BaseResult{
		Success: false,
		Code:    http.StatusUnauthorized,
		Message: message,
		Data:    nil,
	}
}
