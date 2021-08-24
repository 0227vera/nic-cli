/**
 * 创建web模板
 * inquirer: 交互使用的工具
 * ora: 交互loading
 */
let inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')

let {
  rewriteTemplate,
  createProject,
  copyTemplate,
  getUsername,
  ensureDir,
  execCmd
} = require('../utils')

let questions = [
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称',
    validate: function (value) {
      if (ensureDir(value)) {
        return '此目录已经存在'
      }
      return true
    },
    default: function () {
      return 'web-template'
    }
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入项目描述',
    default: function () {
      return 'web开发模版'
    }
  },
  {
    type: 'list',
    name: 'langType',
    message: '请选择使用vue/react编写',
    choices: [
      { name: 'vue', value: 1 },
      { name: 'react', value: 2 }
    ],
    default: 0 // 默认是下标为0的选项
  },
  {
    type: 'input',
    name: 'projectContext',
    message: '请输入项目上下文',
    default: function () {
      return '/context'
    }
  },
  {
    type: 'input',
    name: 'projectProxyUrl',
    message: '请输入项目需要代理到的服务器',
    default: function () {
      return 'http://api.xxx.com/mock/xxx/'
    }
  },
  {
    type: 'confirm',
    name: 'isStandard',
    message: '是否需要拉vue的开源demo项目',
    when(answer) {
      return answer.langType === 1
    },
    default: function () {
      return false
    }
  },
  // NOTE: 先收起询问ci，之后根据需求定制
  // {
  //   type: 'confirm',
  //   name: 'isAddCI',
  //   message: '是否现在填写CI信息？',
  //   default: true
  // }
]

let questions2 = [
  {
    type: 'input',
    name: 'parkName',
    message: '请输入构建时输出补丁的压缩包名称(tar.gz)',
    default: function () {
      return 'app.front.tar.gz'
    }
  },
  {
    type: 'input',
    name: 'host',
    message: '请输入SFTP服务器地址',
    default: function () {
      return '127.0.0.1'
    }
  },
  {
    type: 'input',
    name: 'port',
    message: '请输入SFTP服务器端口',
    default: function () {
      return '80'
    }
  },
  {
    type: 'input',
    name: 'username',
    message: '请输入SFTP用户名',
    default: function () {
      return 'xxx'
    }
  },
  {
    type: 'input',
    name: 'password',
    message: '请输入SFTP密码',
    default: function () {
      return 'xxx'
    }
  },
  {
    type: 'input',
    name: 'sftpProjectPath',
    message: '请输入SFTP上传目录',
    default: function () {
      return '/xxx/xxx/web_demo_V1.0.0_000_20200331_name_前端补丁'
    }
  }
]

module.exports = async function () {
  let answer = await inquirer.prompt(questions)
  if (answer.isAddCI) {
    Object.assign(answer, await inquirer.prompt(questions2))
  } else {
    answer.parkName = 'app.front.tar.gz'
    answer.host = '127.0.0.1'
    answer.port = '80'
    answer.username = 'xxxx'
    answer.password = 'xxx'
    answer.sftpProjectPath = '/xxx/xxx/xxx_demo_V1.0.0_000_20200331_name_前端全部补丁'
  }
  const spinner = ora('building for production...\n')
  spinner.start()
  answer.username = await getUsername()
  let dir = await createProject(answer.projectName)
  let type = answer.langType === 1 ? 'vue' : 'react'
  if (answer.isStandard) {
    type = 'standard'
    dir.projectName = 'web-vue-demo'
    await copyTemplate('standard', dir)
  } else {
    await copyTemplate('web-' + type, dir)
    let awiatArr = type === 'vue' ? [
      path.resolve(dir, './package.json'),
      path.resolve(dir, './vue.config.js'),
      path.resolve(dir, './.env.temp'),
      path.resolve(dir, './.env.development')
    ] : [
      path.resolve(dir, './package.json'),
      path.resolve(dir, './.env.temp'),
      path.resolve(dir, './src/services/SetAxios.ts')
    ]
    await rewriteTemplate(answer, awiatArr)
    await execCmd('mv ' + path.resolve(dir, './.env.temp') + ' ' + path.resolve(dir, './.env'))
  }
  spinner.stop()
  console.log(chalk.cyan(`\n 项目初始化完成.\n 位置 ${dir}`))
}
