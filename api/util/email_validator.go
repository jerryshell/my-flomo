package util

import (
	"regexp"
)

// ValidateEmail 校验邮箱格式
func ValidateEmail(email string) bool {
	emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	matched, _ := regexp.MatchString(emailRegex, email)
	return matched
}

// GetEmailValidationMessage 返回校验结果，空字符串表示通过
func GetEmailValidationMessage(email string) string {
	if email == "" {
		return "邮箱不能为空"
	}

	if !ValidateEmail(email) {
		return "请输入有效的邮箱地址"
	}

	return ""
}
