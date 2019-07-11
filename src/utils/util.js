
export default {
    // 将后台返回的导出文档流转换成excel后下载
    download (data,downName) {
        if (!data) {
            return
        }
        const blob = new Blob([data])
        const fileName = downName + '.' + 'xlsx'
        if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
        } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
        }
    }
}