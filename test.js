const download = require('download-git-repo')
const url = 'https://git.xiaojukeji.com:taxi-fe/mp-kuaidi#master'
download(url,'./', { clone: true }, (err) => {
    console.log('=====>',err)
})
