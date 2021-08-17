/**
 * 创建H5模板
 * inquirer: 交互使用的工具
 * ora: 交互loading
 */
let inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')

let {
  createProject,
  copyTemplate,
  getUsername,
  ensureDir
} = require('../creator')

let questions = [
  {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称',
    validate: function (value) {
      if (ensureDir(value)) {
        return '此目录已经存在' // todo: 询问是删除还是重新创建一个新的
      }
      return true
    },
    default: function () {
      return 'applet-template'
    }
  }
]

module.exports = async function () {
  let answer = await inquirer.prompt(questions)
  const spinner = ora('building for production...\n')
  spinner.start()
  answer.username = await getUsername()
  let dir = await createProject(answer.projectName)
  await copyTemplate('applet', dir)
  spinner.stop()
  console.log(chalk.cyan(`\n 项目初始化完成.\n 位置 ${dir}`))
}
