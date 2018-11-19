const remote = require('electron').remote;
const fs = require('fs');
const $ = require('jquery');

var index = 0;
var hiddenimage = $('#image');
var img = new Image();
var container = $('#container');
var imagecontainer = $('#imagecontainer');
var images = remote.getGlobal('images');
var clippedimg = $('#clippedimage');
var line = $('#line');
var body =  $('body');
var imgpreview;
//clip variables
var x11;
var y11;
var x22;
var y22;
var firstPointCaptured = false,secondPointCaptured = false,isDown;

function loadFile(){
    //loading of the image
    img.src = images[index];
    hiddenimage.append(img);
    img.onload = function(){
        imgpreview = $('<img>');
        imgpreview.attr('src', img.src);
        imgpreview.css('width', img.width*.09 + 'px');
        imgpreview.css('height', img.height*.09 + 'px');
        imgpreview.css('position', 'relative');
        imgpreview.css('left', '30%');
        imgpreview.css('top', '2%');
        imagecontainer.append(imgpreview);
        // imagecontainer.css("backgroundImage", "url('" + img.src + "')");
        // imagecontainer.css("backgroundRepeat", "no-repeat");
        // imagecontainer.css("backgroundSize", img.width*.09 + 'px ' + img.height*.09 + 'px');
        // console.log(img.width*.10 + 'px' + img.height*.10 + 'px');
    }
    clippedimg.attr('src', img.src);
    body.on('mousedown',mousedown);
    body.on('mouseup',mouseup);
    body.on('mouseleave',mouseup);
    body.on('keyup', (e)=>{
        if(secondPointCaptured){
            if(e.keyCode == 27){
                x11 = undefined; y11 = undefined; x22 = undefined; y22 = undefined;
                firstPointCaptured = false;
                secondPointCaptured = false;
                clippedimg.css('clip-path','polygon(0 0, 100% 0, 100% 100%, 0 100%)');
                line.css('clip-path', 'polygon(0 0, 0 0, 0 0, 0 0)');
                updateIndicators();
            }
        }
        if(e.keyCode){

        }
    });
}

function addCanvasEvents(){
    var p1,p2,p3,p4;
    var c1,c2,c3,c4;
        body.on('mousedown',(e)=>{
            if(!firstPointCaptured & !secondPointCaptured){
                isDown = true;
                p1 = e.clientX;
                p2 = e.clientY;
                c1 = (p1+1);
                c2 = (p2+1);
                line.css('clip-path','polygon(' + p1 + 'px '+ p2 + 'px, ' + c1 + 'px '+ c2 + 'px, ' +
                c1 + 'px '+ c2 + 'px, ' + p1 + 'px '+ p2 + 'px' + ')');
                console.log('drawstart');
            }
        });

        body.on('mousemove',(e)=>{
            p3 = e.clientX;
            p4 = e.clientY;
            c3 = (p3+1);
            c4 = (p4+1);
            if(isDown){
                line.css('clip-path','polygon(' + p1 + 'px '+ p2 + 'px, ' + (p1+1) + 'px '+ (p2+1) + 'px, ' +
                c3 + 'px '+ c4 + 'px, ' + p3 + 'px '+ p4 + 'px' + ')');
            }
            updateIndicators();
        });

        body.on('mouseup',(e)=>{
            isDown = false;
            if(firstPointCaptured && secondPointCaptured){
                getClips();
                imgpreview.off();
            };
            console.log('drawend');
        });
}

function getClips(){
    if(y11 < 30 & y22 > 70){
        //conditions for defining which side the first & second point came from
        if(x11 < 10 & x22 > 90){
            x11 = 0; x22 = 100;
            clippedimg.css('clip-path','polygon(0 0, 100% 0,' + x22 + '% ' + y22 + '%, ' + x11 + '% ' + y11 + '%)');
        }else{
            y11 = 0; y22 = 100;
            clippedimg.css('clip-path','polygon(0 0, '+ x11  + '% '+  y11 + '%, '+ x22 + '% ' + y22 + '%, 0 100%)');
        }
    }else if(y11 > 70 & y22 < 30){
        y22 = 0; y11 = 100;
        clippedimg.css('clip-path','polygon(0 0, '+ x22  + '% '+  y22 + '%, '+ x11 + '% ' + y11 + '%, 0 100%)');
    }else if(x11 < 30 & x22 > 70){
        x11 = 0; x22 = 100;
        clippedimg.css('clip-path','polygon(0 0, 100% 0,' + x22 + '% ' + y22 + '%, ' + x11 + '% ' + y11 + '%)');
    }else if(x22 < 30 & x11 > 70){
        x22 = 0; x11 = 100;
        clippedimg.css('clip-path','polygon(0 0, 100% 0,' + x11 + '% ' + y11 + '%, ' + x22 + '% ' + y22 + '%)');
    }
    console.log(clippedimg.css('clip-path'));
}

function mousedown(){
    if(!firstPointCaptured & !secondPointCaptured){
        addCanvasEvents();
        console.log('start');
        imgpreview.on('mouseover',(e)=>{
            if(isDown){
                firstPointCaptured = true;
                let tempx = Math.max((((e.clientX - imgpreview.offset().left)/imgpreview.width())*100), 0);
                x11 = Math.min(tempx, 100);
                let tempy = Math.max((((e.clientY - imgpreview.offset().top)/imgpreview.height())*100), 0);
                y11 = Math.min(tempy,100);
            }
        });

        imgpreview.on('mouseout',(e)=>{
            if(isDown){
                secondPointCaptured = true;
                let tempx = Math.max((((e.clientX - imgpreview.offset().left)/imgpreview.width())*100), 0);
                x22 = Math.min(tempx, 100);
                let tempy = Math.max((((e.clientY - imgpreview.offset().top)/imgpreview.height())*100), 0);
                y22 = Math.min(tempy,100);
                console.log(x11 + ' x1 ' + y11 + ' y1 ' + x22 + ' x2 ' + y22 + ' y2 ');
            }
        });
    }
}

function mouseup(){
    console.log('end');
    imagecontainer.off();
    isDown = false;
}

function updateIndicators(){
    if(firstPointCaptured){
        $('#firstpointindicator').css('background-color','rgb(96, 201, 96)');
    }else{
        $('#firstpointindicator').css('background-color','#f8f9fa');
    }
    if(secondPointCaptured){
        $('#secondpointindicator').css('background-color','rgb(96, 201, 96)');
    }else{
        $('#secondpointindicator').css('background-color','#f8f9fa');
    }
}

$(document).ready(loadFile);


