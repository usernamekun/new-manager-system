# 						全球新闻管理系统
##  运行项目
```
npm install
```
### 使用到了json-server
```
npm install -g json-server
```
```
json-server --watch ./db.json --port 8000
```
```
yarn start
```


## json-server

#### 1.概念
  是直接可以将一个`json`文件以服务器形式打开接口
### 2.使用
#### 1.安装


```
npm i -g json-server

  json-server --watch ./db.json --port 8080
```

####   2.取数据 

​	`axios.get()`

####   3.增加数据 

​    

```
axios.post('http://localhost:8080/ports/',{
      title:'aaa',
      'xxx':'xxx'
    })
```

####   4.删除数据  

​	也会删除与他相关的对象
​    `axios.delete('',)`

####   5.修改数据 

​	 `put`这是直接替换对象
​    

```
axios.put('http://localhost:8080/ports/id',{
      title:'111',
      'xxx':'xxx'
    })
```

  `patch`局部修改数据

```
 axios.patch('http://localhost:8080/ports/id',{
      'title': 'dsss'
    })
```


### 3.高级使用
#### _embed
  向下关联

```
 axios.get('http://localhost:8080/ports?_embed=comments').then(res=>{
      console.log(res.data)
    })
```

#### _expand
  向上关联

```
 axios.get('http://localhost:8080/ports?_expand=comments').then(res=>{
      console.log(res.data)
    })
```
#### _sort=age
  按照age排序 默认升序
#### _order=desc  降序
#### _limit=3  限制收到的数据数量

## 1.SideMenu组件

#### 1.动态渲染菜单

## 项目中使用到的有用的依赖
#### 1.particles-bg
  1.可以有一个动态的背景
  2.使用：

```
import ParticlesBg from 'particles-bg'
<ParticlesBg type='random' bg={true}/>
```

3.type的类型可以选择--查文档

#### 2.nprogress

1.实现进度条的效果

2.使用：

```
import nProgress from "nprogress";
import 'nprogress/nprogress.css'
//进度条开始的时候
nProgress.start()
  useEffect(()=>{
  //进度条结束的时候
    nProgress.done()
  })
```

#### 3.redux-persist
  持久化缓存redux

#### loadsh
##### _.groupBy
  可以根据对象中的某个属性进行分组。以数组形式返回
  _.groupBy(arr,item=>arr.title)
  按照arr中的每一项title分组