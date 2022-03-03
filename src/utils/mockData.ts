import { defaults } from "lodash";

const x = 550;
const y = 2;
const z = 1;
// 目前假定gData为全量数据
const treeData: any = [];

const generateData = (_level: number, _preKey?: string, _tns?: any) => {
  const preKey = _preKey || '0';
  const tns = _tns || treeData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key, aaa: true });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

export default {};
export { treeData };