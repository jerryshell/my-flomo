import { get, post } from "./api";

interface UserSettings {
  dailyReviewEnabled: boolean;
  telegramChatId: string;
  telegramBotToken: string;
}

const userApi = {
  getSettings: () => {
    return get<UserSettings>("/user/getSettings");
  },
  updatePassword: (data: { password: string }) => {
    return post<null>("/user/updatePassword", data);
  },
  updateSettings: (data: {
    dailyReviewEnabled: boolean;
    telegramChatId?: string;
    telegramBotToken?: string;
  }) => {
    return post<null>("/user/updateSettings", data);
  },
  triggerDailyReview: () => {
    return get<null>("/memo/dailyReview");
  },
};

export default userApi;
