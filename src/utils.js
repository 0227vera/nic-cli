
const chalk = require('chalk')
const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const fse = require('fs-extra')
const fs = require('fs')
const download = require('download-git-repo')
const template = require('art-template')
const { exec } = require('child_process')
const username = require('username')
template.defaults.rules.shift() // 移除ejs支持

/**
 * 关于颜色的方法
 */
const loading = text => chalk.bgGreen(chalk.white(text))

const success = text => chalk.green(text)

const warning = text => chalk.yellow(text)

const info = text => chalk.blue(text)

const c_loading = text => console.log(chalk.bgGreen(chalk.white(text)))

const c_success = text => console.log(chalk.green(text))

const c_warning = text => console.log(chalk.yellow(text))

const c_info = text => console.log(chalk.blue(text))

/**
 * 邮件发送
 */
const Mail = '1066788870@qq.com'
const mailTemplate = ejs.compile(
    fs.readFileSync(path.resolve(__dirname, 'mail.ejs'), 'utf8')
)
let transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    secureConnection: true,
    auth: {
        user: '1066788870@qq.com',
        pass: 'zyhxyxyksdttbejc'
    }
})
const mail = config => {
const html = mailTemplate(
    Object.assign(
        {
            title: `welcome ${config.mails} into nic-cli`
        },
        config
    )
)
return new Promise((resolve,reject) => {
        nodemailer.createTestAccount(err => {
            if (err) {
                reject(err)
            }
            let mailOptions = {
                from: '1066788870@qq.com',
                to: `${Mail},${config.mails}`,
                subject: 'git配置信息',
                html: html
            }
            transporter.sendMail(mailOptions, error => {
                if (error) {
                    reject(error)
                }
                resolve('Message sent successly')
            })
        })
    })
}

/**
 *创建项目目录
 *
 * @param {*} projectName
 */
async function createProject (projectName, projectPath) {
    projectPath = projectPath || process.env.PWD
    const dir = await fse.ensureDir(projectPath + '/' + projectName)
    return dir
}
  
/**
 *检查是否能创建DIR
 *
 * @param {*} projectName 项目名称
 * @param {*} projectPath 项目地址
 * @returns
 */
const ensureDir = (projectName, projectPath) => {
    projectPath = projectPath || process.env.PWD
    const dir = fs.existsSync(projectPath + '/' + projectName)
    return dir
} 

/**
 *
 * 复制远程模板
 * @param {*} type  h5-vue  h5-react web-vue web-react node applet
 * @param {*} target
 * @returns
 */
async function copyTemplate (type, target) {
    const error = await copyGitTemplace(type, target)
    return error
}


/**
 * 复制远程模板
 * type: 在之前已经拼成了和远程的name相同了
 */
function copyGitTemplace (type, target) {
    info('\n 开始拉取远程模板\n')
    let url = 'https://github.com:0227vera/' + type + '#master' // 模板的git地址
    if (type === 'standard') {
        url = 'https://gitee.com:panjiachen/vue-element-admin#master'
    }
    return new Promise((resolve, reject) => {
        download(url, target, { clone: true }, function (err) {
            if (!err) {
                info('\n 拉取远程模板完成\n')
            } else {
                info('\n 拉取远程模板失败，查看是否拥有模板权限，或联系脚手架管理人员\n')
            }
            err ? reject(err) : resolve(true)
        })
    })
}

/**
 * 复制一个文件或者文件夹到另一个目录
 * @param {string} src 文件或者文件夹路径
 * @param {string} dest 文件夹路径
 */
async function copy (src, dir) {
    const err = await fse.copy(src, dir)
    return err
}


/**
 * 将模板中的变量替换成指定值
 */
async function rewriteTemplate (data, files) {
    await files.forEach((file) => {
        let newFile = template(file, data)
        fs.writeFile(file, newFile, function () {})
    })
}

/**
 * 执行命令
 */
async function execCmd (cmd) {
    let res = await exec(cmd, async (error, stdout, stderr) => {
        if (error) return error
        return stderr
    })
    return res
}

/**
 * 获取当前项目用户
 */
async function getUsername () {
    const name = await username()
    return name
}

module.exports = {
    color: {
        loading,
        success,
        warning,
        info,
        c_loading,
        c_success,
        c_warning,
        c_info,
    },
    mail,
    rewriteTemplate,
    createProject,
    copyTemplate,
    getUsername,
    ensureDir,
    execCmd,
    copy
}