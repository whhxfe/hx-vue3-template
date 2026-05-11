// 动态导入所有测试页面模块来生成菜单
const modules = import.meta.glob("./*/index.vue")
const childModules = import.meta.glob("./*/*.vue")


// 从模块路径中提取菜单项
const generateMenuList = (): MenuItem[] => {
  const menuItems: MenuItem[] = []
  
  // 创建一个映射来跟踪哪些目录有子页面
  const dirsWithChildren: Record<string, string[]> = {}
  
  // 先找出所有子页面
  for (const path in childModules) {
    const match = path.match(/\/([^\/]+)\/([^\/]+)\.vue$/)
    if (match && match[1] !== 'layout') {
      const folderName = match[1]
      const fileName = match[2]
      
      if (fileName !== 'index') {
        if (!dirsWithChildren[folderName]) {
          dirsWithChildren[folderName] = []
        }
        dirsWithChildren[folderName].push(fileName)
      }
    }
  }
  
  // 处理主页面
  for (const path in modules) {
    // 使用正则表达式从路径中提取文件夹名称
    const match = path.match(/\/([^\/]+)\/index\.vue$/)
    if (match && match[1] !== 'layout') {
      const folderName = match[1]
      // 将驼峰命名转换为短横线命名（kebab-case）
      const kebabName = folderName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      
      // 将文件夹名称转换为可读的标题
      const title = folderName
        .replace(/([a-z])([A-Z])/g, '$1 $2') // 在驼峰之间添加空格
        .replace(/\b\w/g, l => l.toUpperCase()) // 首字母大写
      
      // 检查是否有子页面
      if (dirsWithChildren[folderName]) {
        // 创建带子菜单的项
        const children: MenuItem[] = [
          {
            title: "主页面",
            path: `/test/${kebabName}`
          },
          ...dirsWithChildren[folderName].map(fileName => {
            const childKebabName = fileName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
            const childTitle = fileName
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .replace(/\b\w/g, l => l.toUpperCase())
            
            return {
              title: childTitle,
              path: `/test/${kebabName}/${childKebabName}`
            }
          })
        ]
        
        menuItems.push({
          title: title,
          path: `/test/${kebabName}`,
          children: children
        })
      } else {
        // 没有子页面，正常处理
        menuItems.push({
          title: title,
          path: `/test/${kebabName}`
        })
      }
    }
  }
  
  return menuItems
}

const menuList: MenuItem[] = generateMenuList()

export default menuList