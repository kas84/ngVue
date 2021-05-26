
<template>
    <h6>props title : {{title}}</h6>
    <input type="text" :value="title" @input="update"/>
    <button @click="update"> emit</button>
</template>
<script>
export default {
    props:{
        title:{
            type:String,
        }
    },
    emits:['update-title'],
    created(){        
    },
    setup(props,context){
        console.log("props",props)
        const update= (event)=>{
            console.log("updating value....",event.target.value)
            context.emit('update-title',event.target.value)
        }
        return {update}
    }
}
</script>