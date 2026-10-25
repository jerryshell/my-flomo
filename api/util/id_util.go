package util

import (
	"hash/fnv"
	"os"
	"strconv"

	"github.com/sony/sonyflake/v2"
)

var sf *sonyflake.Sonyflake

// GetMachineID 依次读取 MACHINE_ID 与主机名哈希，结果落在 0 至 1023
func GetMachineID() (int, error) {
	if machineIDStr := os.Getenv("MACHINE_ID"); machineIDStr != "" {
		if machineID, err := strconv.Atoi(machineIDStr); err == nil && machineID >= 0 && machineID <= 1023 {
			return machineID, nil
		}
	}

	hostname, err := os.Hostname()
	if err != nil {
		return 0, nil
	}

	h := fnv.New32a()
	h.Write([]byte(hostname))
	machineID := int(h.Sum32() % 1024)

	return machineID, nil
}

// === ID 生成 ===

func init() {
	var st = sonyflake.Settings{
		MachineID: GetMachineID,
	}
	var err error
	if sf, err = sonyflake.New(st); err != nil {
		panic("sonyflake init failed: " + err.Error())
	}
}

func NextID() (int64, error) {
	return sf.NextID()
}

func NextIDStr() (string, error) {
	logger := NewLogger("id_util")

	id, err := NextID()
	if err != nil {
		logger.Error("failed to generate next id", ErrorField(err))
		return "", err
	}

	logger.Debug("generated new id", StringField("id", strconv.FormatInt(id, 10)))
	return strconv.FormatInt(id, 10), nil
}
