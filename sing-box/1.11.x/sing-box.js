const { type, name } = $arguments
const { url } = $options || {}
const compatible_outbound = {
  tag: 'COMPATIBLE',
  type: 'direct',
}

let compatible
let config = JSON.parse($files[0])
let proxies = []
let configSource = ''

if (url) {
  if (Array.isArray(url)) {
    throw new Error("试图通过 url 参数指定多个订阅链接，但该功能尚未实现")
  }

  // 验证是否是订阅链接
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(`无效的订阅链接: ${url}`)
  }

  configSource = `配置来源: 外部订阅链接 (${url})`

  // 下载订阅内容
  const content = await ProxyUtils.download(url)

  // 解析为内部格式
  const parsed = await ProxyUtils.parse(content)

  // 转换为 sing-box 格式
  const produced = ProxyUtils.produce(parsed, 'sing-box')
  const producedConfig = JSON.parse(produced)
  proxies = producedConfig.outbounds || []
} else if (name) {
  configSource = `配置来源: Sub-Store 内部订阅 (${name})`

  proxies = await produceArtifact({
    name,
    type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
    platform: 'sing-box',
    produceType: 'internal',
  })
} else {
  throw new Error("请提供订阅或节点集名称，或通过 url 参数指定订阅链接")
}

config.outbounds.push(...proxies)

config.outbounds.map(i => {
  if (['all', 'all-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies))
  }
  if (['hk', 'hk-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i))
  }
  if (['tw', 'tw-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /台|tw|taiwan|🇹🇼/i))
  }
  if (['jp', 'jp-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /日本|jp|japan|🇯🇵/i))
  }
  if (['sg', 'sg-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /^(?!.*(?:us)).*(新|sg|singapore|🇸🇬)/i))
  }
  if (['us', 'us-auto'].includes(i.tag)) {
    i.outbounds.push(...getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i))
  }
})

config.outbounds.forEach(outbound => {
  if (Array.isArray(outbound.outbounds) && outbound.outbounds.length === 0) {
    if (!compatible) {
      config.outbounds.push(compatible_outbound)
      compatible = true
    }
    outbound.outbounds.push(compatible_outbound.tag);
  }
});

let output = JSON.stringify(config, null, 2)
if (configSource) {
  output = `// ${configSource}\n${output}`
}

$content = output

function getTags(proxies, regex) {
  return (regex ? proxies.filter(p => regex.test(p.tag)) : proxies).map(p => p.tag)
}
