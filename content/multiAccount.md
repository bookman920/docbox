## Gamegold 多账户体系整改方案

为了向用户屏蔽不必要的技术细节，以降低使用门槛，微信小程序并不在本地管理钱包，而是将关键操作全部委托到远方的微信小程序服务器。
微信小程序服务器管理着一个超级钱包，其中包含了海量的账户，每个账户由个人用户的OPENID所标识，区隔开了用户的私钥、地址、道具等信息。
从某种角度来看，微信小程序服务器是一个特殊的全节点，与其目的性相对应，有一系列的函数需要完成这种相关性改造，以便该特殊节点可以携带额外的OPENID参数访问这些函数，从而营造出一个多账户系统。
与此同时，忽略这个参数的系列调用，其运作机制又回到了一个单账户体系。

需要注意的是，同样的机制可能会被用在一个游戏特约全节点需要管理不同的游戏的场景中。
在这个场景中，每一台游戏服务器都会被分配一个终端编码（等比于微信小程序用户的OPENID），从而被特约全节点映射到一个单独的账户上。

以下为参与整改的函数清单

### 查询钱包余额

```bash
balance.all account
```

Property | Description
---|---
account     |   子账户名称

### 创建虚拟道具

```bash
prop.create cid oid gold [openid]
```

Property | Description
---|---
cid         |   游戏编码
oid         |   道具原生编码
gold        |   道具含金量
openid      |   子账号名称

### 转移虚拟道具

```bash
prop.send addr hash index [openid]
```

Property | Description
---|---
addr        |   转移的目标地址
hash        |   交易哈希
index       |   交易输出索引
openid      |   子账户名称

### 创建用户通行证

```bash
token.user cid uid [openid]
```

Property | Description
---|---
cid         |   游戏编码
uid         |   用户游戏内编码
openid      |   子账号名称

### 捐赠道具

```bash
prop.donate hash index [openid]
```

### 收取捐赠

```bash
prop.receive raw [openid]
```

Property | Description
---|---
raw         |   原始交易数据，HEX格式
openid      |   子账号名称

### 拍卖道具

```bash
prop.sale hash index fixed [openid]
```

Property | Description
---|---
hash        |   道具所在交易哈希
index       |   输出索引。在批量转移道具的交易中，需要输出索引以指明目标道具；如果遇到拍卖交易(目前只支持单件道具拍卖)，系统将锁定 index=2 ：该交易在 index=2 的输出上携带有效载荷
fixed       |   一口价
openid      |   子账号名称

### 竞拍道具

```bash
prop.buy pid bid [openid]
```

Property | Description
---|---
pid         |   道具编号
bid         |   竞拍价
openid      |   子账号名称

### 查询道具列表

```bash
prop.list [pageNum] [openid]
```

Property | Description
---|---
pageNum     |   道具列表的页码，从1开始
openid      |   子账号名称
