package config

import "github.com/caarlos0/env/v11"

// Config 汇总全部环境变量，缺省值见 envDefault 标签
type Config struct {
	Host         string `json:"host" env:"HOST" envDefault:"localhost"`
	Port         int    `json:"port" env:"PORT" envDefault:"8060"`
	DSN          string `json:"dsn" env:"DSN" envDefault:"my-flomo.db"`
	JwtKey       string `json:"jwtKey" env:"JWT_KEY" envDefault:"YOUR_JWT_KEY"`
	CronSpec     string `json:"cronSpec" env:"CRON_SPEC" envDefault:"0 20 * * *"`
	SmtpHost     string `json:"smtpHost" env:"SMTP_HOST" envDefault:"smtp-mail.outlook.com"`
	SmtpPort     int    `json:"smtpPort" env:"SMTP_PORT" envDefault:"587"`
	SmtpUsername string `json:"smtpUsername" env:"SMTP_USERNAME" envDefault:""`
	SmtpPassword string `json:"smtpPassword" env:"SMTP_PASSWORD" envDefault:""`
	SmtpSubject  string `json:"smtpSubject" env:"SMTP_SUBJECT" envDefault:"My Flomo 每日回顾"`
	LogPath      string `json:"logPath" env:"LOG_PATH" envDefault:""`
	LogLevel     string `json:"logLevel" env:"LOG_LEVEL" envDefault:"info"`
}

var Data *Config = &Config{}

func init() {
	var err = env.Parse(Data)
	if err != nil {
		panic(err)
	}
}
