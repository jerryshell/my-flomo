// 校验邮箱格式

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 返回校验结果，空字符串表示通过

export const getEmailValidationMessage = (email: string): string => {
  if (!email || email.trim().length === 0) {
    return "邮箱不能为空";
  }

  if (!validateEmail(email)) {
    return "请输入有效的邮箱地址";
  }

  return "";
};
