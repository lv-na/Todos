$(function(){
  var localdata = localStorage.todos;          //本地存储 
  var todos = localdata ?  $.parseJSON(localdata): [];  //如果本地存储里有数据
  // 就执行$.parseJSON(localdata) 将字符串转换为对象  如果没有就为空
  var state = localStorage.state || 'all';    //用state代表状态    默认取all

  var saveData = function () {
       localStorage.todos = JSON.stringify(todos);
       // 把todos转成字符形式放到本地存储里   数据放生变化时调用
  }
  var render = function(){
    var ftodos = $.grep(todos,function(v){           // grep一次过滤   return值为真就会保留
        if( state === 'all'){
          return v;
        }else if(state === 'active'){              //谁是已完成的谁就保留下来
          return !v.isDone;
        }else if( state === 'completed'){
          return v.isDone;
        }
    })
    // append  after  insert prepend  可以接受函数作为参数
    // insertbefore    insertafter    append to   prepend to  不可以
    $('#todo-list').empty().append(function(){    //append能接受各种东西dom集合  用字符串表示的dom集合
      // 给todo-list放东西
      // empty()   把todo-list里所有东西清空掉再放li
        return $.map(ftodos, function(v){
            var tmp = v.isDone ? 'checked':'';
            // v.isDone是个布尔值
            // li上一定要加data-id 便于查找删除
            return '<li class="'+(v.isDone?'completed':'')+'" data-id="'+v.id+'"><div class="view"> <input '+tmp+' type="checkbox" class="toggle"> <label for="">'+v.content+'</label> <button class="destroy"></button> </div> <input class="edit" type="text" value="'+v.content+'"> </li>';
        })    //根据一个数组生成另一个数组  map
    });
    $('#footer .selected').removeClass('selected');
    $('#footer a[data-role='+state+']').addClass('selected');
    $('#todo-count strong').text(ftodos.length);
  };
  render();

  var addTodo = function (e) {
  var zhi = $.trim( $(this).val() );   //trim取出字符串两边的空格                  
    if( e.keyCode === 13 && zhi !== ''){      // 如果等于13 或不是空字符串的时候 走下边的操作
      var todo = {   //新数据
        id: todos.length ? (Math.max.apply(null,$.map(todos,function(v){
          return v.id;
          // map (可以得到一个新数组) 遍历   todos(代表 整个数组) 
        })) + 1) : 1001,
        // call apply 把this的指向换为第一个参数   都是调用Math。max这个函数
        // call用逗号隔开传   apply是用数组传
        content: zhi,
        isDone:false
      }
      $(this).val('');    //清空
      todos.push(todo);    //把todo放进去
      saveData();
      render();     //根据todos绘制页面
    }
  }
  $('#new-todo').on('keyup',addTodo);   
  // new-todo当keyup的时候添加一条数据执行新增函数

  var deleteTodo = function () {
    var id = parseInt($(this).closest('li').attr('data-id'));
    // closest   父元素中最近的    用attr取出来(是字符串)    parseInt 把它变为数字
    todos = $.grep(todos,function(v){      //相当于数组中的filter
        return v.id !== id;               //不等于的留下等于的移除掉
    })
    saveData();
    render();
  }
  $('#todo-list').on('click','.destroy',deleteTodo);   
  // 因为涉及到动态追加，所以要用事件委托   todo-list 整个ul

  var gaizhuangtai = function () {
      var state = $(this).prop('checked');   //$(this)框本身   prop操作表单元素
      var id = parseInt( $(this).closest('li').attr('data-id'));
      $.each(todos,function(i,v){  //i是下标v是数据
          if( v.id === id){
            v.isDone = state;   //v.isDone   值是什么就改成什么
          }
      })
      saveData();
      render();
  };
  $('#todo-list').on('click','.toggle',gaizhuangtai);   //利用事件委托

  var xiugaineirong = function(){
    $(this).addClass('editing');            //只需要加上editing这个类
    $(this).find('.edit').focus();        //找li下边的input框调用一个focus   光标
  }
  $('#todo-list').on('dblclick','li',xiugaineirong);   //委托到每个li上

  $('#todo-list').on('focusout','.edit',function(){   //给todo-list下每一个edit 添加失去焦点事件
    $(this).closest('li').removeClass('editing');  
    // editing这个类移除掉就会自动不见
    var id = parseInt($(this).closest('li').attr('data-id'));
    var self = this;    //保存下来this
    $.each(todos,function(i,v){
      if( v.id === id){
          v.content = $(self).val();   //换内容
      }
    })
    saveData();
    render();
  })

  $('#filters a').on('click',function(){  //找出三个添加事件
    $('#filters .selected').removeClass('selected');   //找出目前谁选中  再移除
    $(this).addClass('selected');          //点谁就给谁一个selected
    state  = localStorage.state = $(this).attr('data-role');
    render();
    return false;          //阻止默认行为
  })

});

// all  默认选中    active    找出未完成的重绘        completed找出已完成的重绘
