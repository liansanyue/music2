

    $("#tag").click(function(e){
    	if($(e.target).className="tag"){
    		$(e.target).css({"color":"#000","background-color":"#eee"});
    		$(e.target).siblings().css({"color":"#fff","background-color":"#009C95"});

    	getformusic($(".show ul"),$(e.target).html(),1);
    }
    })

 function getformusic(elem,language,page){
    
         $.ajax({
                  type: "post",
                  url: "/getformusicpv",
                  data: {
                  tag: language,
                  page:page
                  },
                 async:false,//同步
                 dataType: "json",
                  success: function(msg) {
                    elem.html("");
                  msg.docs.forEach(function(item,index){
                    elem.append("<li><a href='javascript:' title='"+item.songname+"' class='ellipsis mname'  data-name='"+item.filename+"'>"+item.songname+"</a><a href='javascript:' title='"+item.singername+"' class='ellipsis msinger'>-"+item.singername+"</a> </li>");
                  });  
                   
                  elem.next().html("");
                  if(!msg.isFirstPage)
                  {elem.next().html("<i class='angle left icon' style='float:left' data-page='"+page+"'></i>")}
                       
                  
                  if(!msg.isLastPage){
                    elem.next().html(elem.next().html()+"<i class='angle right icon' style='float:right' data-page='"+page+"'></i>")
                  }
                 },
                  error: function(err) {
                      console.log(err);
                  }

                });
      } 
var list=parent.document.querySelector(".playlist ul");
var listli=parent.document.querySelector(".playlist li");
var audio=parent.document.querySelector("audio");  

//列表加入
 $("i.play").click(function(){
    var lis= $(".show ul").children();
    window.parent.count=window.parent.playlist.length;
    lis.each(function(index,li){ 
       window.parent.playlist.push($(this).children().first().attr("data-name"));
       $(list).append("<li data-index="+(window.parent.playlist.length-1)+">"+$(this).html()+" <i class='trash outline icon'></i></li>");
       $(list).scrollTop($(list).scrollTop()+30);
    })

    musicnum(window.parent.count);
   
});
 //单个点击-------------------------------------

$(".show ul").click(function(e){

    if($(e.target).hasClass("mname")){

    window.parent.playlist.push($(e.target).attr("data-name"));
    // window.parent.playlisthtml.push($(this).parent().html());
    $(list).append("<li data-index="+(window.parent.playlist.length-1)+">"+$(e.target).parent().html()+"<i class='trash outline icon'></i></li> ")
    $(list).scrollTop($(list).scrollTop()+30);
    window.parent.count=window.parent.playlist.length-1;
    musicnum(window.parent.count);}
});
//播放函数

  function musicnum(num){
           
            $(".playlist a",window.parent.document).attr("style","color:skyblue");
            $(".playlist li:eq("+num+") a",window.parent.document).attr("style","color:#03524F");

            $(audio).attr("src","/checked/"+window.parent.playlist[num]+".mp3"); 

              audio.play(); 
              var filename=window.parent.playlist[num];
              if(filename=='undefined'){return;}
                if($("#user",window.parent.document).text()!=""){
                 var songname=$(".playlist li:eq("+num+") a",window.parent.document).first().attr("title");

                    $("#download",window.parent.document).attr("href","/checked/"+window.parent.playlist[num]+".mp3");

                    $("#download",window.parent.document).attr("download",songname+".mp3");}
                    $.ajax({
                          type: "post",
                          url: "/getlrc",
                          data: {
                          filename: filename,
                          
                          },

                        // async:false,//同步

                        dataType: "text",
                          success: function(msg) {
                            showlrc(msg);
                           

                          },
                          error: function(err) {
                              console.log(err);
                          }

                  });
              
        }

    //显示歌词

  function showlrc(lrc){

      var result=[];
     var showelem=$("#lrc div",window.parent.document)[0];
     var lines=lrc.split('\n');//将歌词按行切成数组
       //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
     var pattern = /\[\d{2}:\d{2}.\d{2}\]/g;

      //去掉不含时间的行
      while (!pattern.test(lines[0])) {
          lines = lines.slice(1);
      };
      if(!lines[lines.length-1].length){lines.pop();}
      lines.forEach(function(item,index,array){
          var time=item.match(pattern);//获得时间

          var lrcvalue=item.replace(pattern,"");//获取歌词
          //t [0]为分钟，t [1]为秒数

          time.forEach(function(v1, i1, a1) {
              //去掉时间里的中括号得到xx:xx.xx
              var t = v1.slice(1, -1).split(':');
              //将结果压入最终数组
              result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), lrcvalue]);
              });

          })
          result.sort(function(a,b){
              return a[0]-b[0];
          });
          $(showelem).html("").css("display","none");
         result.forEach(function(item,index){
          $(showelem).append("<p>"+item[1]+"</p>");
         })
          audio.ontimeupdate=function(e){
            $(showelem).css("display","block");
              for(var i= 0,l=result.length;i<l;i++){
                  if (this.currentTime /*当前播放的时间*/ > result[i][0]) {
                    if( $("#lrc p:eq("+i+")",window.parent.document).html().length>1){
                   $("#lrc p:eq("+i+")",window.parent.document).css({"color":"#009C95","font-weight":"700"});
                   $("#lrc p:eq("+i+")",window.parent.document).siblings().css({"color":"#aaa","font-weight":"500"});}
                   
                    $(showelem).scrollTop((i+1)*30);
                    
                  };
              }
          }
   }