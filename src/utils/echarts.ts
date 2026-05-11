import * as echarts from "echarts"; //引入echarts
// import "echarts-gl";
// import "echarts-liquidfill";
import { use } from 'echarts/core' 
import {
  CanvasRenderer,
  SVGRenderer     // 渲染器（必须导入）
} from 'echarts/renderers'
use([
  CanvasRenderer,
  // SVGRenderer 
])


export default echarts