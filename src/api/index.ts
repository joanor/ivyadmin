import { BaseURLType } from '@/libs/shared/types'
import { RequestOptions } from 'ivy2'
import type { ResultColumnsData, ResultPagingData } from './model'
import { ResultMainFieldStruct } from './model/dict'

// export const getList = <
//   QueryParams,
//   R = ResultPagingData<ResultMainFieldStruct>,
//   Column = ResultColumnsData[]
// >(
//   data: QueryParams,
//   bUrl: BaseURLType = 'orginformation',
//   option: RequestOptions = {}
// ) => {
//   return handleDict<QueryParams, R, Column>(
//     'POST',
//     `/system/${bUrl}/page`,
//     data,
//     option
//   )
// }
