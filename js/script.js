var i =0;
proj = {};
var i = 0
var y= 0
window.name = {}
function createAcc(){
    console.log("script.js")
    var name = $('div input[name=name]').val()
    var password = $('form input[name=password]').val()
    $.ajax({
        url: "http://92.222.69.104:80/todo/create/"+name+"/"+password,
        }).done(function(data) {
            window.open("./login.html","_self");
        }).fail(function(){
            console.log(error)
        });
        

}

function goToMain(){
    console.log("script.js")
    var name1 = $('div input[name=name]').val()
    var pass = $('div input[name=password]').val()
    sessionStorage.setItem("name",name1)
    var name = sessionStorage.getItem("name");
    sessionStorage.setItem("password",pass)
    var password = sessionStorage.getItem("password");
    document.location.href="./index.html"; 
   
}

function collectlistes(){
    var name = sessionStorage.getItem("name");
    var password = sessionStorage.getItem("password");
    $.ajax({
        url: "http://92.222.69.104:80/todo/listes",
        type: "GET",
        headers:
        {    
            "login":name,
            "password":password,
        }
        }).done(function(data) {
            proj.data= data;
            var data = data.todoListes
            data.forEach(function(element) {
                i++
                var article = $('<article id="article'+i+'">');
                var deletex = $('<button onclick="remove(event)" class="article'+i+'" id="button'+i+'">');
                var addTache = $('<button onclick="addTache(event)" class="title'+i+'" id="button'+i+'">');
                var title = $('<div class="title" id="title'+i+'">');
                var text = $('<div class="content" id="title'+i+'" name="title'+i+'">');
                $('#main').append(article);
                article.append(deletex)
                article.append(addTache)
                article.append(title);
                article.append(text);
                addTache.text("add tache");
                deletex.text("X");
                title.text(element.name);
                var data2 = element.elements;
                var ul = $('<ul>');
                data2.forEach(function(element){   
                    y++
                    var li = $('<li class="tache"id="tache'+y+'">').blur(function(event){
                        console.log('toto');
                        modifElement(event);
                    });
                    text.append(ul);
                    ul.append(li);
                    li.text(element)
                })
                $(".tache, .title").attr('contentEditable' , true);
            });
        }).fail(function(error){
            console.log(error)
        });
}
function add(){  
    i++
    y++
    var article = $('<article id="article'+i+'">');
    var deletex = $('<button onclick="remove(event)" class="article'+i+'" id="button'+i+'">');
    var addTache = $('<button onclick="addTache(event)" class="title'+i+'" id="button'+i+'">');
    var title = $('<div class="title" id="title'+i+'">');
    var text = $('<div class="content" id   ="title'+i+'" name="title'+i+'">');
    var ul = $('<ul>');
    var li = $('<li class="tache" id="tache'+y+'">');
    $('#main').append(article);
    article.append(deletex)
    article.append(addTache)
    text.append(ul);
    ul.append(li);
    article.append(title);
    article.append(text);
    title.text('')
    li.text('')
    deletex.text("X");
    addTache.text("add tache");
    const selectTitle = "#title"+i
    const selectTache = "#tache"+y
    $(selectTitle).mouseover(function() {
        $(".title").attr('contentEditable' , true);
    }).blur(function(event){
        console.log(event.currentTarget.id)
        console.log(event.currentTarget.innerText)
        const titlevalue = event.currentTarget.innerText;
            proj.titlevalue = titlevalue
    })
    $(selectTache).mouseover(function() {
        $(".tache").attr('contentEditable' , true);
    }).blur(function(event){
        modifElement(event)
        send();
    })
}

function modifElement(event){
    if(event.target.className === 'title'){ 
        const titlevalue = event.currentTarget.innerHTML;
        proj.titlevalue = titlevalue
    }
    else if(event.target.className === 'tache'){
        var title = event.currentTarget.parentElement.parentElement.attributes.name.nodeValue;
        proj.titlevalue = $('#'+title).text();
        var liste = event.currentTarget.parentElement.children;
        var tache= [];
        for(let el of liste){
            tache.push(el.textContent);
           
        }                      
        proj.taches = tache
    }
    var exist = false;
    for(var i = 0; i < proj.data.todoListes.length; i++){
        if(proj.data.todoListes[i].name === proj.titlevalue){
            exist = true;
            proj.data.todoListes[i].elements = proj.taches;
        }
    }
    
    if(!exist){
        proj.data.todoListes.push({
    
            "name": proj.titlevalue,
            "elements":proj.taches,
            
        })    
        
    }
    send();
}

function addTache(event){

        var classe = event.currentTarget.className;
            console.log(classe)
            $('div #'+classe+' ul').append('<li class="tache" id="tache'+y+'">');
            $("li, .title").mousedown(function() {
                $("li, .title").attr('contentEditable' , true);
        
        
            }).blur(function(event){
                modifElement(event);
                send();
            })  
}
function remove(event){
        var classe = event.currentTarget.className;;
        console.log(classe)
        $('article#'+classe).remove()
        var numberr = classe.substr(-1);
        var numberr = numberr-1
        console.log(numberr)
        proj.data.todoListes.splice(numberr,1);
        console.log(proj.data)
        $.ajax({
            url: "http://92.222.69.104:80/todo/listes",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(proj.data) 
        }).done(function(data) {
            console.log(data)
    })
}
function send(){
            

    $.ajax({
        url: "http://92.222.69.104:80/todo/listes",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(proj.data) 
        }).done(function(data) {
        console.log(data)
    })


}