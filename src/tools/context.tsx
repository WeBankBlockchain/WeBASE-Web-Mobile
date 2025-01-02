import { createContext, useContext } from 'react'

/**
 * @description: 小型数据共享
 * @param {*} T useHook的参数
 * @param {*} D useHook的返回值 能力有限、有T则D必传
 * @return {*} Provider 包裹器 Consumer 忘了干啥的了 getShareValues 子组件取值时使用
 */
const PackingContent = <T, D>(useShare: (props: T) => D) => {
  type useShareValues = ReturnType<typeof useShare>
  const context = createContext<useShareValues>({} as unknown as useShareValues)

  return {
    Provider: context.Provider,
    Consumer: context.Consumer,
    /* eslint-disable-next-line */
    getShareValues: () => useContext(context)
  }
}

export { PackingContent }
