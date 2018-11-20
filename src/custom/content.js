var fs = require('fs');

/**
 * This file exports the content of your website, as a bunch of concatenated
 * Markdown files. By doing this explicitly, you can control the order
 * of content without any level of abstraction.
 *
 * Using the brfs module, fs.readFileSync calls in this file are translated
 * into strings of those files' content before the file is delivered to a
 * browser: the content is read ahead-of-time and included in bundle.js.
 */
module.exports =
  '# 简介\n' +
  fs.readFileSync('./content/introduction.md', 'utf8') + '\n' +
  '# 连接器\n' +
  fs.readFileSync('./content/Connector.md', 'utf8') + '\n' +
  '# 认证和授权\n' +
  fs.readFileSync('./content/GIP0005.md', 'utf8') + '\n' +
  '# 支付协议\n' +
  fs.readFileSync('./content/GIP0006.md', 'utf8') + '\n' +
  '# 道具上链\n' +
  fs.readFileSync('./content/GIP0001.md', 'utf8') + '\n' +
  '# 游戏商部署指南\n' +
  fs.readFileSync('./content/deploy.md', 'utf8') + '\n' +
  '# 小程序多帐号体系\n' +
  fs.readFileSync('./content/multiAccount.md', 'utf8') + '\n' +
  '# RPC - 钱包\n' +
  fs.readFileSync('./content/api.rpc.wallet.md', 'utf8') + '\n' +
  '# 区块链浏览器 - 区块\n' +
  fs.readFileSync('./content/api.restful.block.md', 'utf8') + '\n' +
  '# 区块链浏览器 - 地址\n' +
  fs.readFileSync('./content/api.restful.address.md', 'utf8') + '\n' +
  '# 区块链浏览器 - 交易\n' +
  fs.readFileSync('./content/api.restful.tx.md', 'utf8') + '\n' +
  '# 区块链浏览器 - 域名\n' +
  fs.readFileSync('./content/api.restful.cp.md', 'utf8') + '\n' +
  '# 区块链浏览器 - 辅助\n' +
  fs.readFileSync('./content/api.restful.util.md', 'utf8') + '\n';
