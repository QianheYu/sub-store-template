const { type, name } = $arguments
const { url } = $options || {}

let proxies = []
let sourceDescription = ''

if (url) {
    if (Array.isArray(url)) {
        throw new Error("试图通过 url 参数指定多个订阅链接，但该功能尚未实现")
    }

    sourceDescription = `配置来源: 外部链接 (${url})`

    // 验证是否是订阅链接
    if (!/^https?:\/\//i.test(url)) {
        throw new Error(`无效的订阅链接: ${url}`)
    }

    // 下载订阅内容
    const content = await ProxyUtils.download(url)

    // ProxyUtils.parse 能够自动识别多种格式 (Clash, V2Ray, Surge, Quantumult X 等)
    // 并将其转换为内部统一格式 (Clash 兼容)
    proxies.push(...await ProxyUtils.parse(content))
} else if (name) {
    sourceDescription = `配置来源: Sub-Store (${name})`
    // 获取代理列表 (Sub-Store 内部格式，兼容 Clash)
    proxies = await produceArtifact({
        name,
        type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
        produceType: 'internal',
    })
} else {
    throw new Error("请提供订阅或节点集名称，或通过 url 参数指定订阅链接")
}

// 提取代理名称
let proxyNames = proxies.map(p => p.name)

// 如果没有代理，添加 DIRECT 防止报错
if (proxyNames.length === 0) {
    proxyNames.push('DIRECT')
}

// 格式化代理名称列表，用于替换 __PROXY_NAMES__
// 例如: "节点1", "节点2"
const proxyNamesString = proxyNames.map(n => JSON.stringify(n)).join(", ")

// 格式化代理列表为 JSON 字符串 (YAML 兼容)，用于替换 __PROXIES__
const proxiesString = JSON.stringify(proxies, null, 2)

// 读取模板文件
let template = $files[0]

// 添加来源描述
if (sourceDescription) {
    template = `# ${sourceDescription}\n${template}`
}

// 替换占位符
// 使用正则确保只替换非注释行的内容
// 1. 替换 proxies: __PROXIES__
// 正则含义：(行首或换行)(非#字符的缩进+proxies:空格)__PROXIES__
$content = template
    .replace(/(^|\n)([^#\n]*proxies:\s*)__PROXIES__/g, `$1$2${proxiesString}`)
    .replace(/(^|\n)([^#\n]*proxies:\s*\[.*?)__PROXY_NAMES__(.*?\])/g, `$1$2${proxyNamesString}$3`)
