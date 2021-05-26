
<template>
    <h6>props title : {{title}}</h6>
    <input type="text" :value="title" @input="update"/>
    <button @click="emitMadafaka"> emit</button>
</template>
<script>
import {ref,reactive} from 'vue'
export default {
    props:{
        title:{
            type:String,
        }
    },
    emits:['update-title'],
    // watch:{
    //     mytitle(newVal){
    //         console.log("newVal",newVal)
    //         this.$emit('update-title',newVal)
    //     }
    // },
    created(){        
    },
    setup(props,context){
        console.log("props",props)
        const emitMadafaka= ()=>{
            //mytitle.value='ola k ase'
            context.emit('update-title','ola k ase');
        }
        const update= (event)=>{
            console.log("updating value....",event.target.value)
            context.emit('update-title',event.target.value)
        }
        return {emitMadafaka,update}
    }
}
</script>