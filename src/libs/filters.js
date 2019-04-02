import { dateFormat as format, numberFormat as numFormat } from './tools'
import * as emnus from './enums'

const emnusFilters = {}
Object.keys(emnus).forEach(key => {
    emnusFilters[key] = val => emnus[key][val]
})

export default {
    dateFormat: (val, fmt) => val ? format(val, fmt) : '',
    numFormat: (val, fixed) => numFormat(val, fixed),
    ...emnusFilters
}
