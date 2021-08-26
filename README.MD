# 模版初始化小工具

为什么需要做这样一个工具呢？

1. 开发中根据团队的规范制定模版，统一团队的开发习惯，减少项目交接带来的沟通成本
2. 通过配置化初始化开发模版生成项目，而不是通过拉 git 文件，再去修改文件
3. ci 等配置，通过邮件等去告知，如果权限可以，可以通过 node 直接打通自动化构建配置
4. 规范化团队开发，对于新人，减小熟悉各种项目的成本
5. 远程模版，随着前端的发展以及市场对网页的需求变化，模版可技术变化，不用频繁发版 cli 的版本

## 使用方式

npm install -g nic-cli

## h5 项目

```shell
nic init h5
```

1. `vue`: `vue + vuex + vue-router + axios + vant`

2. `react`: `react + react-router-dom + mobx(js) + axios + ant-design-mobild`

## WEB 端项目

```shell
nic init web
```

1. `vue`: `vue + vuex + vue-router + axios + element-ui`

2. `react`: `react + react-router-dom + mobx(ts) + axios + ant-design`

## 小程序项目

```shell
nic init mp
```

## 微前端项目

```shell
nic init micro
```

## node 项目

```shell
nic init node
```

`node`: `mongodb + express + http + fs + ……`

## 开发注意

`#!/usr/bin/env node` 表示 node 运行环境；在 weindows 上开发，请使用`npm link`到系统模块可以使用命令，mac 上直接`npm run dev`即可

## 问题

如果你是 windows 的电脑，请使用`bash`的终端，否则会出现`undefined`的目录的情况，请尽量使用最新版本
