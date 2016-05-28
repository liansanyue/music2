
     
      $(document).ready(function() { 
            $('.ui.menu .ui.dropdown').dropdown({

               on: 'hover'
            });
            $('.ui.menu a.item').on('click', function() {
                $(this)
                  .addClass('active')
                  .siblings()
                  .removeClass('active');
                
                 $("#main_content iframe").css("display","block"); 
                 $("#main_content div.info").css("display","none");
                var tab=$(this).attr("data-tab")
               if(tab){
                $("div[data-tab]").hide();
                $("div[data-tab="+tab+"]").show();
               }
            }) ;
            //点击删除全部
            $(".delall").click(function(){
              $(".playlist ul").html("")
               playlist=[];
               count=0;
               musicnum(count);
            })
            //播放列表中单个点击或点击删除按钮
            $(".playlist ul").click(function(e){
              
                if($(e.target).hasClass("mname")){
                    count=$(e.target).parent().attr("data-index")
                    musicnum(count)
                   
                }
                 if($(e.target).hasClass("trash")){
                    
                   var index=$(e.target).parent().attr("data-index");
                  
                    
                     playlist.splice(index,1);
                      $(e.target).parent().remove(); 
                      $(this).children().each(function(index){
                      
                        $(this).attr("data-index",index);
                      })
                    if(index==count){
                      
                      musicnum(count);
                    }
                   
                    
                    
                }
            })

            //上一首
            $(".backward").click(function(){
                if(count>0){count--; }
                else{
                    count=playlist.length-1;

                }
               musicnum(count);
            })
            //下一首
            $(".forward").click(function(){
                if(count<playlist.length-1){count++; }
                else{
                    count=0;
                    
                }
               musicnum(count);
            })
            //播放函数
            function musicnum(num){
               if(playlist.length==0){
                 $("audio").attr("src",""); 
                  $(".playlist a").attr("style","color:skyblue");
                  return ;
               }
                $(".playlist a").attr("style","color:skyblue");
                $(".playlist li:eq("+num+") a").attr("style","color:#03524F");

                $("audio").attr("src","/checked/"+playlist[num]+".mp3"); 

                  $("audio")[0].play(); 
                  var filename=playlist[num];
                   var songname=$(".playlist li:eq("+num+") a").first().attr("title");
                  
                  if(filename==undefined||playlist.length==0){return ;}
                  else{ 
                     if($("#user").text()!=""){

                    $("#download").attr("href","/checked/"+playlist[num]+".mp3");

                    $("#download").attr("download",songname+".mp3");}
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

                      });}
                  
            }
            //一首歌播完，播放列表的下一首，循环列表
            $("audio")[0].addEventListener("ended",function(){
                

                if(count<playlist.length-1)
                {count++;}
                else
                {
                    count=0;
                }
                 $(".playlist a").attr("style","color:skyblue");
                $(".playlist li:eq("+count+") a").attr("style","color:#03524F");
                musicnum(count);
            })
            //点击我的收藏中添加按钮
            $("i.add").click(function(){
              count=playlist.length==0? 0 : playlist.length;
              $("#loves ul").children().each(function(index){      
                     playlist.push($(this).children().first().attr("data-name"));

                     $(".playlist ul").append("<li data-index="+(playlist.length-1)+">"+$(this).html()+"</li>");
                     $(".playlist ul").scrollTop($(".playlist ul").scrollTop()+30);    
              })
              musicnum(count);
            })
            //收藏列表中单个点击
            $(".mname").click(function(){    
                playlist.push($(this).attr("data-name"));
                $(".playlist ul").append("<li data-index="+(playlist.length-1)+">"+$(this).parent().html()+"</li> ")
                $(".playlist ul").scrollTop($(".playlist ul").scrollTop()+30);
                count=playlist.length-1;
                musicnum(count);
            })
            //点击收藏按钮
             $("i.heart").click(function(e){

                      var tar=$(".playlist li:eq("+count+") a.mname");
                      

                      var songname=tar.attr("title");
                      var filename=tar.attr("data-name");
                      var singername=tar.next().attr("title"); 
                      var user=$("#user").text();

                       console.log(songname);

                        if(user.trim()=="")
                            {
                              alert("请先登录！")
                              return;
                            }

                            if(songname==undefined){
                              alert("当前没有歌曲可以收藏");
                              return ;
                            }

                     $.ajax({
                              type: "post",
                              url: "/addlove",
                              data: {
                              user:user,
                              songname: songname,

                              filename: filename,
                              singername:singername,
                               
                              },
                              dataType: "json",
                              success: function(msg) {
                               
                                relist(msg)

                              },
                              error: function() {
                                  alert("error");
                              }

                      });
                            $(".love").addClass('active').siblings().removeClass('active');
                            var tab=$(".love").attr("data-tab")
                            if(tab){
                            $("div[data-tab]").hide();
                            $("div[data-tab="+tab+"]").show();
                           }

               });
             //点击收藏列表中的删除按钮
             $("#loves ul").click(function(e){
               if($(e.target).hasClass("trash")){
                var tar=$(e.target).prev().prev();
              
                      var songname=tar.attr("title");
                      var filename=tar.attr("data-name");
                      var singername=tar.next().attr("title");  
                      var user=$("#user").text();        
                       $.ajax({
                              type: "post",
                              url: "/dellove",
                              data: {
                              user:user,
                              songname: songname,
                              filename:filename,
                              singername:singername,
                               
                              },
                              dataType: "json",
                              success: function(msg) {
                               relist(msg)

                              },
                              error: function() {
                                  alert("error");
                              }
                      });

               
                 }
             })
                       
             //刷新我的收藏列表
             function relist(loves){
                $("#loves ul").html("");
                loves.forEach(function(item,index){
                    // playlist.push($(this).children().first().attr("data-name"));
                    $("#loves ul").append("<li><a href='javascript:' title='"+item.songname+"' class='ellipsis mname'  data-name='"+item.filename+"'>"+item.songname+"</a><a href='javascript:' title='"+item.singername+"' class='ellipsis msinger'>-"+item.singername+"</a> <i class='trash outline icon'></i></li>");
                       $("#loves ul").scrollTop($("#loves ul").scrollTop()+30);    
                }) 
             }
            //显示歌词

            function showlrc(lrc){

                var result=[];
               var showelem=$("#lrc div")[0];
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
                    $("audio")[0].ontimeupdate=function(e){
                      $(showelem).css("display","block");
                        for(var i= 0,l=result.length;i<l;i++){
                            if (this.currentTime /*当前播放的时间*/ > result[i][0]) {
                              if( $("#lrc p:eq("+i+")").html().trim().length>1){
                             $("#lrc p:eq("+i+")").css({"color":"#009C95","font-weight":"700"});
                             $("#lrc p:eq("+i+")").siblings().css({"color":"#aaa","font-weight":"500"});}
                            
                              $(showelem).scrollTop((i+1)*30);
                              
                            };
                        }
                  }
             }
            //搜索
          $("button.button").click(function(){
            var keyword=$(this).prev().val().trim();
            if(keyword!=""){
              $.ajax({
                type: "post",
                url: "/search",
                data: {
                keyword:keyword                 
                },
                dataType: "json",
                success: function(msg) {
                  
                   $("#main_content iframe").css("display","none"); 
                   $("#main_content div.info").css("display","block");
                   $("#main_content div.info>p").html("");
                     $("#main_content div.info>ul").html("");
                     $("#main_content div.info>p").html("<i class='undo icon' ></i><br/><i class='quote left icon'></i><span>"+keyword+"</span><i class='quote right icon'></i> 的搜索结果")
                    msg.forEach(function(item,index){
                    $("#main_content div.info ul").append("<li><a href='javascript:' title='"+item.songname+"' class='ellipsis mname'  data-name='"+item.filename+"'>"+item.songname+"</a><a href='javascript:' title='"+item.singername+"' class='ellipsis msinger'>-"+item.singername+"</a> </li>");
                  }); 
                },
                error: function() {
                    alert("error");
                }

              })
            }
          });
          $("#input_search").keydown(function(e){
            if (e.keyCode === 13) {
                      var keyword=$(this).val().trim();
                      if(keyword!=""){
                        $.ajax({
                          type: "post",
                          url: "/search",
                          data: {
                          keyword:keyword                 
                          },
                          dataType: "json",
                          success: function(msg) {
                            
                             $("#main_content iframe").css("display","none"); 
                             $("#main_content div.info").css("display","block");
                             $("#main_content div.info>p").html("");
                               $("#main_content div.info>ul").html("");
                               $("#main_content div.info>p").html("<i class='undo icon' ></i><br/><i class='quote left icon'></i><span>"+keyword+"</span><i class='quote right icon'></i> 的搜索结果")
                              msg.forEach(function(item,index){
                              $("#main_content div.info ul").append("<li><a href='javascript:' title='"+item.songname+"' class='ellipsis mname'  data-name='"+item.filename+"'>"+item.songname+"</a><a href='javascript:' title='"+item.singername+"' class='ellipsis msinger'>-"+item.singername+"</a> </li>");
                            }); 
                          },
                          error: function() {
                              alert("error");
                          }

                        })
                      }
                }
              }) 
            
         //点击返回
            $(".info").click(function(e){
              if($(e.target).hasClass("undo")){

                 $("#main_content iframe").css("display","block"); 
                 $("#main_content div.info").css("display","none");
              }else if($(e.target).hasClass("mname")){
                 
                playlist.push($(e.target).attr("data-name"));
            
                $(".playlist ul").append("<li data-index="+(playlist.length-1)+">"+$(e.target).parent().html()+"<i class='trash outline icon'></i></li> ")
                $(".playlist ul").scrollTop($(".playlist ul").scrollTop()+30);
                count=playlist.length-1;
                musicnum(count);}
            })  


         }) 
 