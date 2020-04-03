import Vue from 'vue'

new Vue({
  el: '#root',
  template: `
  <div>
    <div v-if="active">{{text}}</div>
    <div v-else-if="text === 0">else if content</div>
    <div v-else>else content</div>
    <div>
      <input type="text" v-model.lazy="text" />
      <input type="checkbox" v-model="active"/>
    </div>
    <div>复选框：
      <input type="checkbox" v-model="arr" :value="1"/>
      <input type="checkbox" v-model="arr" :value="2"/>
      <input type="checkbox" v-model="arr" :value="3"/>
      <input type="checkbox" v-model="arr" :value="4"/>
    </div>
    <div>单选框：
      <input type="radio" v-model="picked" value="one"/>
      <input type="radio" v-model="picked" value="two"/>
    </div>
    <ul>
      <li v-for="(item,index) in arr" :key="item">{{item}}--{{index}}</li>
    </ul>
    <ul>
      <li v-for="(value,key,index) in obj" :key="value">{{value}}---{{key}}---{{index}}</li>
    </ul>
  </div>
  `,
  data: {
    text: 0,
    active: true,
    arr: [1, 2, 3],
    obj: {
      a: 123,
      b: 456,
      c: 789
    },
    picked: ''
  }
})

// v-text 只能标签里面显示的内容，只能显示绑定的值。如果想要显示Text: {{text}}的效果，会比较麻烦，不友善 v-text=" 'Text:' + text"，要使用字符串拼接。一般推荐数据绑定就可以了Text: {{text}}
// v-html 作为html插入，解析字符串

// v-show  是否显示该节点，原理是加上display:none
// v-if  不把节点放在DOM流里面，动态增删节点，会引起DOM的重绘，性能高

// v-else-if  书写条件
// v-else  配合v-if使用，否则会报错

// v-for  循环显示  遍历对象时的index，其实就是使用Object.keys()把键值对传进来的顺序
// 循环出来的列表为什么要加key？
// 希望key去唯一指定数列里的一个值。vue里的数据经常会变，每次变化都会重新渲染列表，再放到DOM里面，性能开销会很大。指定key的话，下次循环的时候，从缓存里面拿到了同样的key，就把这一项DOM节点复用，不需要生成新的DOM节点，性能开销较小。
// 不推荐使用index，因为数组下标的变化和数组里面的内容关系不大，可能会导致错误的缓存。

// v-on  拿到vm对象，通过$on添加事件；如果DOM节点，就通过addEventListner去添加事件。

// v-bind

// v-model 一般使用在输入组件input。可以加修饰符。
// （1）.number修饰符：v-model.number = "text"，如果不加.number修饰符，修改text默认是字符串（初始值是数字0，但是只要重新输入了，值就是字符串）；加了的话text就是数字
// 如果用了.number修饰符，输入非数字的话，text里面还是字符串，如"ppp"
// （2）.trim修饰符：去除收尾的空格
// （3）.lazy修饰符：input默认监听input事件，加上.lazy就绑定了change事件。change事件是整个值改变结束了触发，input事件是只要改变了就触发。

// v-pre  表达式不解析

// v-cloak  使用webpack开发基本用不到，使用场景是直接引入vue库，在body里面写代码的时候。因为在html里面写vue代码，里面有很多{{}}，在html加载的时候，浏览器是不知道的，会把{{}}这些内容直接显示出来，给用户的体验差。在vue代码没有加载完成之前，给v-cloak加display:none，把{{}}隐藏；vue代码加载完成以后，会把v-cloak去掉。

// v-once  数据绑定的内容只执行一次。使用场景是绑定静态数据，作用是节省性能开销，节点下的东西都不需要更新，使用v-once就不需要对比虚拟Dom，不需要再去检查。

// v-slot
