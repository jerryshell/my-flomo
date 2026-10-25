app_name = my-flomo-server

.PHONY: all build run frontend clean dep amd64-darwin amd64-linux amd64-windows arm-linux

all : amd64-darwin amd64-linux amd64-windows arm-linux

frontend : web/public/index.html

web/public/index.html : $(shell find ../web/src -type f) ../web/index.html ../web/package.json ../web/bun.lock ../web/vite.config.ts ../web/.env
	cd ../web && bun install && bun run build

build : frontend
	go build -ldflags "-s -w" -o $(app_name)

run : frontend
	go run main.go

amd64-darwin : frontend
	CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w" -o $(app_name)-amd64-darwin
	tar -czvf $(app_name)-amd64-darwin.tar.gz $(app_name)-amd64-darwin

amd64-linux : frontend
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o $(app_name)-amd64-linux
	tar -czvf $(app_name)-amd64-linux.tar.gz $(app_name)-amd64-linux

amd64-windows : frontend
	CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -o $(app_name)-amd64-windows.exe
	tar -czvf $(app_name)-amd64-windows.tar.gz $(app_name)-amd64-windows.exe

arm-linux : frontend
	CGO_ENABLED=0 GOOS=linux GOARCH=arm go build -ldflags "-s -w" -o $(app_name)-arm-linux
	tar -czvf $(app_name)-arm-linux.tar.gz $(app_name)-arm-linux

clean :
	rm -f $(app_name)-*
	rm -rf web/public

dep :
	go get -u && go mod tidy
