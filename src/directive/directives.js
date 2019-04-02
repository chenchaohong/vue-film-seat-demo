import { on } from '@/libs/tools'
const directives = {
    draggable: {
        inserted: (el, binding, vnode) => {
            let triggerDom = document.querySelector(binding.value.trigger)
            triggerDom.style.cursor = 'move'
            let bodyDom = document.querySelector(binding.value.body)
            let pageX = 0
            let pageY = 0
            let transformX = 0
            let transformY = 0
            let canMove = false
            const handleMousedown = e => {
                let transform = /\(.*\)/.exec(bodyDom.style.transform)
                if (transform) {
                    transform = transform[0].slice(1, transform[0].length - 1)
                    let splitxy = transform.split('px, ')
                    transformX = parseFloat(splitxy[0])
                    transformY = parseFloat(splitxy[1].split('px')[0])
                }
                pageX = e.pageX
                pageY = e.pageY
                canMove = true
            }
            const handleMousemove = e => {
                let xOffset = e.pageX - pageX + transformX
                let yOffset = e.pageY - pageY + transformY
                if (canMove) bodyDom.style.transform = `translate(${xOffset}px, ${yOffset}px)`
            }
            const handleMouseup = e => {
                canMove = false
            }
            on(triggerDom, 'mousedown', handleMousedown)
            on(document, 'mousemove', handleMousemove)
            on(document, 'mouseup', handleMouseup)
        },
        update: (el, binding, vnode) => {
            if (!binding.value.recover) return
            let bodyDom = document.querySelector(binding.value.body)
            bodyDom.style.transform = ''
        }
    },
    money: {
        inserted: (el, binding, vnode) => {
            let input = null
            for (let i of el.children) {
                if (i.tagName.toUpperCase() === 'INPUT') input = i
            }
            if (input) {
                let ref = binding.value[0]
                let refInput = binding.value[1]
                let num1 = binding.value[2] || 9
                let num2 = binding.value[3] || 2
                let regExp = new RegExp(`^(0|[1-9]\\d{0,${num1 - 1}})(\\.\\d{0,${num2}})?$`)
                let value = ''
                const handleInput = e => {
                    if (e.target.value && !(regExp.test(e.target.value))) {
                        e.target.value = value
                    } else {
                        value = e.target.value
                    }
                    ref.$refs[refInput].handleInput(e)
                    ref.$nextTick(() => {
                        e.target.value = value
                    })
                }
                on(input, 'input', handleInput)
            }
        }
    },
    number: {
        inserted: (el, binding, vnode) => {
            let input = null
            for (let i of el.children) {
                if (i.tagName.toUpperCase() === 'INPUT') input = i
            }
            if (input) {
                let ref = binding.value[0]
                let refInput = binding.value[1]
                let regExp = new RegExp(`^(0|[1-9]\\d*)$`)
                let value = ''
                const handleInput = e => {
                    if (e.target.value && !(regExp.test(e.target.value))) {
                        e.target.value = value
                    } else {
                        value = e.target.value
                    }
                    ref.$refs[refInput].handleInput(e)
                    ref.$nextTick(() => {
                        e.target.value = value
                    })
                }
                on(input, 'input', handleInput)
            }
        }
    },
    maxheight: {
        inserted: (el, binding, vnode) => {
            el.style.maxHeight = window.innerHeight - binding.value + 'px'
        }
    }
}

export default directives
