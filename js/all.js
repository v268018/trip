//Dom
const area = document.querySelector('#Area');
const hotSpot = document.querySelector('.hot_Spot');//熱門景點
const pointMenu = document.querySelector('#pointList');
const pageMenu = document.querySelector('.pagination');
//init
let newData =[];
let jsonData;//放入旅遊網API的資料
let resultData =[];//放入篩選好的資料
let nowPage =1;
const xhr = new XMLHttpRequest();
xhr.open('get','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json',true);
xhr.send(null);
xhr.onload=function(){
    let xhrData = (JSON.parse(xhr.responseText));
    jsonData=xhrData.result.records;
    pagination(jsonData,1);
    printSelectTag();
}
//event
hotSpot.addEventListener ('click',checkArea);
area.addEventListener    ('change',changeArea);
pageMenu.addEventListener('click',function(e){
    let el = e.target.classList;
    console.log(el);
    let state = "";
    el.forEach(item=>{
        if(item=="disabled" ){
            state="true";
        };
    })
    if(state=="true"){
        return;
    }
    else if(e.target.nodeName=="UL"){
        return;
    }
    else if(state!=="true"  && e.target.innerText==="prev"){//減一頁碼
        nowPage--;
    }else if(state!=="true" && e.target.innerText==="next"){//前進下一頁碼
        nowPage++;
    }else{
        nowPage=parseInt(e.target.innerText);
    }
    pointList(newData,nowPage);
});
//function
function printSelectTag(){ 
    const arr =[];
    let  str = "<option>--請選擇行政區域--</option>";
    for (let i = 0; i < jsonData.length; i++) {
        if(arr[i]!==jsonData[i].Zone){
            arr.push(jsonData[i].Zone);
        }
    }
    let  result = arr.filter((item,index)=>{ //篩選重複區域
        return arr.indexOf(item) === index;
    })
    result.forEach(item=>{
        str+=`<option value="${item}">${item}</option>`;
    })
    area.innerHTML=str;
}
function checkArea(e){
    const zone = e.target.innerText;
    if(zone.length<=3){ //避免選取到父元素
        filter(zone);
    }else{
        return;
    }
};
function changeArea(e){
    const zone = e.target.value;
    filter(zone);
}
function filter(zone){
    pointData =[];//放入篩選好的資料
    jsonData.forEach((item,i)=>{
        if(item.Zone===zone){
            pointData.push(item);
        }
    });
    console.log(pointData);
    pagination(pointData,1);
}
function pagination(jsonData,nowPage){
    newData = [];//放入每頁的資料
    let str ="";
    const dataLen = jsonData.length;//資料總長度
    const perpage = 6;//每一頁要顯示幾個景點
    const totalPage = parseInt(dataLen/perpage);//計算需要幾頁呈現
    console.log(jsonData);
    jsonData.forEach((item,i)=>{
        if (i % perpage === 0) {
            newData.push([]);
        }
        let page = parseInt(i/perpage);
        newData[page].push(item);
    });
    console.log(newData);
    pointList(newData,nowPage);
}
function pointList(newData,nowPage){
    let str="";
    pageData=[];
    newData.forEach((item,i)=>{
        if(i==nowPage-1){ //-1的原因是要跟索引位置去做匹配
            pageData.push(item);
        }
    });
    for (let i = 0; i < pageData.length; i++) {
        for (let j = 0; j < pageData[i].length; j++) {
            str+=`
            <li class="col-md-6  px-5 mb-7 area_Crad">
                <div class="card">
                    <div class="position-relative ">
                        <img src="${pageData[i][j].Picture1}" class="card-img-top img-fluid area_Img " alt="...">
                        <div class="area_Card-Title d-sm-flex justify-content-between align-items-center w-100  text-white font-weight-bold px-5 position-absolute ">
                            <p class="text_XL mb-0">${pageData[i][j].Name}</p>
                            <p class="mb-0">${pageData[i][j].Zone}</p>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-flex mb-3">
                            <img src="img/icons_clock.png" alt="" class="img-fluid area_Icon mr-2">
                            <p class="mb-0">${pageData[i][j].Opentime}</p>
                        </div>
                        <div class="d-flex mb-3">
                            <img src="img/icons_pin.png" alt="" class="img-fluid area_Icon mr-3">
                            <p class="mb-0">${pageData[i][j].Add}</p>
                        </div>
                        <div class="d-sm-flex justify-content-between">
                            <div class="d-flex mb-3">   
                                <img src="img/icons_phone.png" alt="" class="img-fluid area_Icon mr-4">
                                <p class="mb-0">${pageData[i][j].Tel}</p>
                            </div>
                            <div class="d-flex">
                                <img src="img/icons_tag.png" alt="" class="img-fluid area_Icon mr-3">
                                <p class="mb-0">${pageData[i][j].Ticketinfo}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            `  
            
        }
        
    }
    if(pageData.length==0){
        str="查詢尚無"
        pointMenu.innerHTML=str;
    }else{
        pointMenu.innerHTML=str;
    }
    pageList(newData,nowPage);
}
function pageList(newData,nowPage){ //印頁碼
    let str = "";
    if(nowPage === 1){
        str+=`
        <li class="page-item disabled">
            <a class="page-link" href="#">prev</a>
        </li>
    `;
    }else{
        str+=`
        <li class="page-item ">
            <a class="page-link" href="#">prev</a>
        </li>
    `;
    }
    newData.forEach((item,i)=>{
        let pageNumber = i+1;
        console.log(typeof(nowPage));
        console.log(typeof(pageNumber));
        if(nowPage===pageNumber){ 
            str+=`
            <li class="page-item active">
                <a class="page-link" data-page=${i+1} href="#">${pageNumber}</a>
            </li>
             `
        }else{
            str+=`
            <li class="page-item">
                <a class="page-link" data-page=${i+1} href="#">${pageNumber}</a>
            </li>
            `
        };
       
    });
    if(nowPage===newData.length){ 
        str+=`
        <li class="page-item disabled">
            <a class="page-link" href="#">next</a>
        </li>
     `;
    }else{
        str+=`
        <li class="page-item">
            <a class="page-link" href="#">next</a>
        </li>
     `;
    }
    if(newData.length===0){
        pageMenu.innerHTML="";
    }
    else{
        pageMenu.innerHTML=str;
    }
}




 


